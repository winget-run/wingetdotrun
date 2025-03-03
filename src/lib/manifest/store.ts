import { logger } from "$lib/util";
import yaml from "js-yaml";
import fs from "node:fs";
import z from "zod";
import { PackageView } from "./package";
import { manifestSchema } from "./schema";

/**
 * Collection of winget manifests.
 */
export class ManifestStore {
	private manifests = new Map<string, Map<string, z.infer<typeof manifestSchema>[]>>();

	constructor() {}

	/**
	 * Find and load all manifest files in the given directory.
	 */
	async loadPath(dp: string) {
		// this is actually faster than iterating over the directory and loading one by one
		const dirents = await fs.promises.readdir(dp, { recursive: true, withFileTypes: true });

		for await (const dirent of dirents) {
			// manifests must end in .yaml (not .yml)
			if (!dirent.isFile() || !dirent.name.endsWith(".yaml")) {
				continue;
			}

			// errors in individual manifests will be skipped
			try {
				await this.loadFile(`${dirent.parentPath}/${dirent.name}`);
			} catch (error) {
				logger.error(error);
			}
		}
	}

	/**
	 * Load a manifest file from the given path.
	 */
	async loadFile(fp: string) {
		// manifests must be utf-8 encoded
		const file = await fs.promises.readFile(fp, "utf-8");

		const doc = yaml.load(file.toString());

		// validate manifest, see: https://github.com/microsoft/winget-cli/tree/master/schemas/JSON/manifests
		const parsed = manifestSchema.safeParse(doc);

		if (!parsed.success) {
			throw new Error(`failed to parse manifest '${fp}'`, { cause: parsed.error });
		}

		// add manifest to local store
		const ident = parsed.data.packageIdentifier;
		const version = parsed.data.packageVersion;

		if (!this.manifests.has(ident)) {
			this.manifests.set(ident, new Map());
		}

		const sharedIdentManifests = this.manifests.get(ident)!;

		if (!sharedIdentManifests.has(version)) {
			sharedIdentManifests.set(version, []);
		}

		const sharedVersionManifests = sharedIdentManifests.get(version)!;

		sharedVersionManifests.push(parsed.data);
	}

	/**
	 * Iterate over all unique manifest identifiers.
	 */
	iterIdents(): Iterable<string> {
		return this.manifests.keys();
	}

	/**
	 * Iterate over all unique versions for a given manifest identifier.
	 */
	iterVersions(ident: string): Iterable<string> {
		const sharedIdentManifests = this.manifests.get(ident);

		if (sharedIdentManifests == null) {
			return [];
		}

		return sharedIdentManifests.keys();
	}

	/**
	 * Iterate over all manifests.
	 */
	*iterManifests(): Iterable<z.infer<typeof manifestSchema>> {
		for (const sharedIdentManifests of this.manifests.values()) {
			for (const sharedVersionManifests of sharedIdentManifests.values()) {
				for (const manifest of sharedVersionManifests) {
					yield manifest;
				}
			}
		}
	}

	/**
	 * Iterate over all manifests matching the identifier.
	 */
	*iterIdentManifests(ident: string): Iterable<z.infer<typeof manifestSchema>> {
		const sharedIdentManifests = this.manifests.get(ident);

		if (sharedIdentManifests == null) {
			return;
		}

		for (const sharedVersionManifests of sharedIdentManifests.values()) {
			for (const manifest of sharedVersionManifests) {
				yield manifest;
			}
		}
	}

	/**
	 * Iterate over all manifests matching the identifier and version.
	 */
	*iterVersionManifests(ident: string, version: string): Iterable<z.infer<typeof manifestSchema>> {
		const sharedIdentManifests = this.manifests.get(ident);

		if (sharedIdentManifests == null) {
			return;
		}

		const sharedVersionManifests = sharedIdentManifests.get(version);

		if (sharedVersionManifests == null) {
			return;
		}

		for (const manifest of sharedVersionManifests.values()) {
			yield manifest;
		}
	}

	/**
	 * Get the version manifest.
	 */
	getVersionManifest(
		ident: string,
		version: string,
	): (z.infer<typeof manifestSchema> & { manifestType: "version" }) | null {
		for (const manifest of this.iterVersionManifests(ident, version)) {
			if (manifest.manifestType === "version") {
				return manifest;
			}
		}

		return null;
	}

	/**
	 * Get the installer manifest.
	 */
	getInstallerManifest(
		ident: string,
		version: string,
	): (z.infer<typeof manifestSchema> & { manifestType: "installer" }) | null {
		for (const manifest of this.iterVersionManifests(ident, version)) {
			if (manifest.manifestType === "installer") {
				return manifest;
			}
		}

		return null;
	}

	/**
	 * Get the default locale manifest.
	 */
	getDefaultLocaleManifest(
		ident: string,
		version: string,
	): (z.infer<typeof manifestSchema> & { manifestType: "defaultLocale" }) | null {
		for (const manifest of this.iterVersionManifests(ident, version)) {
			if (manifest.manifestType === "defaultLocale") {
				return manifest;
			}
		}

		return null;
	}

	/**
	 * Get all locale manifests.
	 */
	getLocaleManifests(ident: string, version: string): (z.infer<typeof manifestSchema> & { manifestType: "locale" })[] {
		return Array.from(this.iterVersionManifests(ident, version)).filter((e) => e.manifestType === "locale");
	}

	/**
	 * Remove all manifests matching the identifier.
	 */
	deleteIdent(ident: string): boolean {
		return this.manifests.delete(ident);
	}

	/**
	 * Remove all manifests matching the identifier and version.
	 */
	deleteVersion(ident: string, version: string): boolean {
		const sharedIdentManifests = this.manifests.get(ident);

		if (sharedIdentManifests == null) {
			return false;
		}

		return sharedIdentManifests.delete(version);
	}

	/**
	 * Get the total number of manifests.
	 */
	size(): number {
		let size = 0;

		for (const ident of this.manifests.values()) {
			for (const version of ident.values()) {
				size += version.length;
			}
		}

		return size;
	}

	/**
	 * Create a view of the store with utilities for getting package-level data.
	 */
	getPackageView(ident: string) {
		return new PackageView(this, ident);
	}
}
