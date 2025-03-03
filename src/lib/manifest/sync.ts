import { createDatabaseClient } from "$lib/db/client";
import { PackageDatabaseHelpers } from "$lib/db/helpers";
import type { packageSchema, publisherSchema, versionSchema } from "$lib/db/types";
import { createSearchClient } from "$lib/search/client";
import { PackageSearchHelpers } from "$lib/search/helpers";
import { logger, validate } from "$lib/util";
import fs from "node:fs";
import z from "zod";
import { ClusterMap } from "./cluster";
import { ManifestStore } from "./store";
import { compareVersionString, createMd5Hash } from "./util";

const parsed = validate(
	process.env,
	z.object({
		SEARCH_URL: z.string(),
		SEARCH_TOKEN: z.string(),
		DATABASE_URL: z.string(),
		DATABASE_TOKEN: z.string().optional(),
	}),
	"db.client.env",
);

const databaseClient = createDatabaseClient({ url: parsed.DATABASE_URL, authToken: parsed.DATABASE_TOKEN });
const databaseHelpers = new PackageDatabaseHelpers(databaseClient);

const searchClient = await createSearchClient({ url: parsed.SEARCH_URL, apiKey: parsed.SEARCH_TOKEN });
const searchHelpers = new PackageSearchHelpers(searchClient);

/**
 * Load package hashes.
 */
const loadCache = async (fp: string): Promise<Set<string>> => {
	const parsed = z.array(z.string()).safeParse(
		JSON.parse(
			await fs.promises
				.readFile(fp)
				.catch((error) => {
					logger.warn(`failed to load package cache '${fp}'`);
					logger.error(error);

					return "[]";
				})
				.then((e) => e.toString()),
		),
	);

	if (!parsed.success) {
		logger.error(parsed.error);

		return new Set();
	}

	return new Set(parsed.data);
};

/**
 * Write package hashes.
 */
const writeCache = async (fp: string, hashes: Set<string>) => {
	try {
		await fs.promises.writeFile(fp, JSON.stringify(Array.from(hashes)));
	} catch (error) {
		logger.warn(`failed to write package cache '${fp}'`);
		logger.error(error);
	}
};

/**
 * Update database given local manifest collection.
 */
(async () => {
	const manifestsPath = "../tmp-winget-shit/tmp/winget-pkgs-master/manifests";
	const cachePath = "../tmp-winget-shit/tmp/cache.json";

	// load manifests
	const store = new ManifestStore();

	logger.info(`loading manifests from '${manifestsPath}'`);

	await store.loadPath(manifestsPath);

	logger.info(`manifest count: ${store.size()}`);

	// get package info
	const pubcluster = new ClusterMap<string>();

	const publishers: Map<string, z.infer<typeof publisherSchema>> = new Map();
	const packages: Map<string, z.infer<typeof packageSchema>> = new Map();
	const versions: Map<string, z.infer<typeof versionSchema>[]> = new Map();

	for (const ident of store.iterIdents()) {
		const view = store.getPackageView(ident);

		const pub = view.getPublisherInfo(compareVersionString);
		const pkg = view.getPackageInfo(compareVersionString);
		const ver = view.getVersionInfo(compareVersionString);
		const map = view.getNamespaceMapping(compareVersionString);

		if (pkg == null || pub == null || ver == null || map == null) {
			logger.warn(`incomplete info for package '${ident}'`);

			continue;
		}

		Object.defineProperty(pub, "aliases", {
			get: () => pubcluster.get(pub.ident),
		});

		pubcluster.add(...map);

		publishers.set(pub.ident, pub);
		packages.set(pkg.ident, pkg);
		versions.set(pkg.ident, ver);
	}

	logger.info(`publisher count: ${publishers.size}`);
	logger.info(`package count: ${packages.size}`);
	logger.info(`version count: ${versions.values().reduce((a, c) => a + c.length, 0)}`);

	// get a list of publishers/packages that are in the db but no longer
	// exist in the manifest store - these will be marked for removal
	const existingPublisherIdents = new Set(await databaseHelpers.getAllPublisherIdents());
	const existingPackageIdents = new Set(await databaseHelpers.getAllPackageIdents());

	const indexedPackageIdents = new Set(await searchHelpers.getAllPackageIndexIdents());

	const removePublisherIdents = existingPublisherIdents.difference(new Set(publishers.keys()));
	const removePackageIdents = existingPackageIdents.difference(new Set(packages.keys()));

	const removeIndexedPackageIdents = indexedPackageIdents.difference(new Set(packages.keys()));

	logger.info(`publishers to remove: ${removePublisherIdents.size}`);
	logger.info(`packages to remove: ${removePackageIdents.size}`);

	// remove all the publishers/packages that have been marked for removal
	// the order of these shouldnt matter if cascade deletes are set up properly
	await databaseHelpers.deletePublishers(removePublisherIdents);
	await databaseHelpers.deletePackages(removePackageIdents);

	for (const ident of removeIndexedPackageIdents) {
		await searchHelpers.deletePackageIndex(ident);
	}

	logger.info(`finished removing publishers/packages`);

	// load package cache and figure out what changed since the last update
	const hashes: Set<string> = new Set();
	const cache = await loadCache(cachePath);

	logger.info(`loaded '${cache.size}' hashes from '${cachePath}'`);

	const updatePublisherIdents: Set<string> = new Set();
	const updatePackageIdents: Set<string> = new Set();

	const createPublisherIdents: Set<string> = new Set();
	const createPackageIdents: Set<string> = new Set();

	// not in cache or db - NEW
	// not in cache but in db - UPDATE
	for (const [ident, pub] of publishers.entries()) {
		const hash = createMd5Hash(JSON.stringify(pub));

		// realistically this is good enough and much simpler than any alternative
		// worst case scenario, a package wont be updated until it changes twice
		// see: https://stackoverflow.com/questions/2444321/how-are-hash-functions-like-md5-unique
		if (!cache.has(hash)) {
			if (existingPublisherIdents.has(ident)) {
				updatePublisherIdents.add(ident);
			} else {
				createPublisherIdents.add(ident);
			}
		}

		hashes.add(hash);
	}

	for (const [ident, pkg] of packages.entries()) {
		const hash = createMd5Hash(JSON.stringify(pkg));

		if (!cache.has(hash)) {
			if (existingPackageIdents.has(ident)) {
				updatePackageIdents.add(ident);
			} else {
				createPackageIdents.add(ident);
			}
		}

		hashes.add(hash);
	}

	// its easier to treat packages and versions as a single unit for updates
	for (const [ident, ver] of versions.entries()) {
		const hash = createMd5Hash(JSON.stringify(ver));

		if (!cache.has(hash)) {
			if (existingPackageIdents.has(ident)) {
				updatePackageIdents.add(ident);
			} else {
				createPackageIdents.add(ident);
			}
		}

		hashes.add(hash);
	}

	logger.info(`publishers to update: ${updatePublisherIdents.size}`);
	logger.info(`packages to update: ${updatePackageIdents.size}`);

	logger.info(`publishers to create: ${createPublisherIdents.size}`);
	logger.info(`packages to create: ${createPackageIdents.size}`);

	// update/create all the publishers/packages/versions that have been marked
	// these need to be added in the correct order: pub > pkg > ver
	// we loop over these rather than the create/update ident lists to avoid
	// a null check since we would have to get the pub/pkg/ver from a map
	for (const [ident, pub] of publishers.entries()) {
		// update
		if (updatePublisherIdents.has(ident)) {
			logger.info(`updating publisher '${ident}'`);

			await databaseHelpers.updatePublisher(ident, pub);
		}

		// create
		if (createPublisherIdents.has(ident)) {
			logger.info(`creating publisher '${ident}'`);

			await databaseHelpers.createPublisher(pub);
		}
	}

	logger.info(`finished updating/creating publishers`);

	for (const [ident, pkg] of packages.entries()) {
		// update
		if (updatePackageIdents.has(ident)) {
			logger.info(`updating package '${ident}'`);

			await databaseHelpers.updatePackage(ident, pkg);
			await searchHelpers.upsertPackageIndex(pkg);
		}

		// create
		if (createPackageIdents.has(ident)) {
			logger.info(`creating package '${ident}'`);

			await databaseHelpers.createPackage(pkg);
			await searchHelpers.upsertPackageIndex(pkg);
		}
	}

	logger.info(`finished updating/creating packages`);

	for (const [ident, ver] of versions.entries()) {
		// update
		if (updatePackageIdents.has(ident)) {
			logger.info(`updating package versions '${ident}'`);

			await databaseHelpers.deletePackageVersions(ident);
			await databaseHelpers.createPackageVersions(ver);
		}

		// create
		if (createPackageIdents.has(ident)) {
			logger.info(`creating package versions '${ident}'`);

			await databaseHelpers.createPackageVersions(ver);
		}
	}

	logger.info(`finished updating/creating package versions`);

	// write new cache for next update
	await writeCache(cachePath, hashes);

	logger.info(`written '${hashes.size}' hashes to '${cachePath}'`);
})();

// TODO: are all slugs the same as idents? - no they are not!
// TODO: did we slugify namespaces before? - does this matter?
// TODO: fix cmp version fn
// TODO: replace fps with env vars
// TODO: move db calls in api to db module
// TODO: if shit is deleted in the db, it wont get readded

// 1. ensure collections exist
// 2. ensure collections are formatted correctly
// 3. sync collections (delete, update, create)

// const searchParameters = {
// 	q: "vscode",
// 	query_by: ["name", "tags", "shortDescription", "embedding"],
// 	exclude_fields: ["embedding"],
// };

// client
// 	.collections("packages")
// 	.documents()
// 	.search(searchParameters)
// 	.then(function (searchResults) {
// 		logger.info(searchResults.hits?.map((e) => e.document.id));
// 	});
