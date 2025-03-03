import type { packageSchema, publisherSchema, versionSchema } from "$lib/db/types";
import slugify from "slugify";
import z from "zod";
import type { manifestSchema } from "./schema";
import { ManifestStore } from "./store";

const REQUIRED_MANIFESTS: z.infer<typeof manifestSchema>["manifestType"][] = ["version", "installer", "defaultLocale"];

/**
 * Custom view of ManifestStore with utilities for getting package-level data.
 */
export class PackageView {
	constructor(
		private store: ManifestStore,
		private ident: string,
	) {}

	/**
	 * Get package identifier.
	 */
	getIdent(): string {
		return this.ident;
	}

	/**
	 * Get the latest package version for a given identifier.
	 */
	getLatestVersion(compareFn: (a: string, b: string) => number): string | null {
		return Array.from(this.store.iterVersions(this.ident)).toSorted(compareFn)[0];
	}

	/**
	 * Get the latest package version for a given identifier.
	 * The version must contain one version, installer, and default locale manifest.
	 */
	getLatestValidVersion(compareFn: (a: string, b: string) => number): string | null {
		const versions = Array.from(this.store.iterVersions(this.ident)).toSorted(compareFn);

		for (const version of versions) {
			if (this.versionHasRequiredManifests(version)) {
				return version;
			}
		}

		return null;
	}

	/**
	 * Check if package version has a version, installer, and default locale manifest.
	 */
	versionHasRequiredManifests(version: string): boolean {
		const types = Array.from(this.store.iterVersionManifests(this.ident, version)).map((e) => e.manifestType);

		return REQUIRED_MANIFESTS.every((e) => types.includes(e));
	}

	/**
	 * Check if there is at least one package version with a version, installer, and default locale manifest.
	 */
	hasValidVersion(): boolean {
		// pass dummy sort fn, we only care if there is at least one found
		return this.getLatestValidVersion(() => 0) != null;
	}

	/**
	 * Get package data based on the latest manifest version.
	 */
	getPackageInfo(compareFn: (a: string, b: string) => number): z.infer<typeof packageSchema> | null {
		if (!this.hasValidVersion()) {
			return null;
		}

		// hasValidVersion ensures there is at least one package version with all REQUIRED_MANIFESTS
		// getLatestValidVersion ensures that the returned version is all REQUIRED_MANIFESTS
		const latest = this.getLatestValidVersion(compareFn)!;
		const manifest = this.store.getDefaultLocaleManifest(this.ident, latest)!;

		const namespace = manifest.packageIdentifier.includes(".") ? manifest.packageIdentifier.split(".")[0] : null;

		if (namespace == null) {
			return null;
		}

		return {
			ident: manifest.packageIdentifier,
			slug: slugify(manifest.packageIdentifier),

			name: manifest.packageName,
			license: manifest.license,
			shortDescription: manifest.shortDescription,

			packageUrl: manifest.packageUrl,
			licenseUrl: manifest.licenseUrl,
			description: manifest.description,
			tags: manifest.tags,

			publisherIdent: namespace,
		};
	}

	/**
	 * Get publisher data based on the latest manifest version.
	 */
	getPublisherInfo(compareFn: (a: string, b: string) => number): z.infer<typeof publisherSchema> | null {
		if (!this.hasValidVersion()) {
			return null;
		}

		// hasValidVersion ensures there is at least one package version with all REQUIRED_MANIFESTS
		// getLatestValidVersion ensures that the returned version is all REQUIRED_MANIFESTS
		const latest = this.getLatestValidVersion(compareFn)!;
		const manifest = this.store.getDefaultLocaleManifest(this.ident, latest)!;

		const namespace = manifest.packageIdentifier.includes(".") ? manifest.packageIdentifier.split(".")[0] : null;

		if (namespace == null) {
			return null;
		}

		return {
			slug: slugify(namespace),
			ident: namespace,

			name: manifest.publisher,
			aliases: [],

			publisherUrl: manifest.publisherUrl,
		};
	}

	/**
	 * Get data for all package versions.
	 */
	getVersionInfo(compareFn: (a: string, b: string) => number): z.infer<typeof versionSchema>[] {
		if (!this.hasValidVersion()) {
			return [];
		}

		// hasValidVersion ensures there is at least one package version with all REQUIRED_MANIFESTS
		const latest = this.getLatestValidVersion(compareFn)!;

		// we dont care about correct order here
		const versions: z.infer<typeof versionSchema>[] = [];

		for (const version of this.store.iterVersions(this.ident)) {
			if (!this.versionHasRequiredManifests(version)) {
				continue;
			}

			// versionHasRequiredManifests ensures that this version has all REQUIRED_MANIFESTS
			const manifest = this.store.getVersionManifest(this.ident, version)!;

			versions.push({
				ident: manifest.packageVersion,
				slug: slugify(manifest.packageVersion),

				latest: manifest.packageVersion === latest,

				packageIdent: manifest.packageIdentifier,
			});
		}

		return versions;
	}

	/**
	 * Get publisher to namespace mapping info.
	 */
	getNamespaceMapping(compareFn: (a: string, b: string) => number): [string, string] | null {
		if (!this.hasValidVersion()) {
			return null;
		}

		// hasValidVersion ensures there is at least one package version with all REQUIRED_MANIFESTS
		// getLatestValidVersion ensures that the returned version is all REQUIRED_MANIFESTS
		const latest = this.getLatestValidVersion(compareFn)!;
		const manifest = this.store.getDefaultLocaleManifest(this.ident, latest)!;

		const namespace = manifest.packageIdentifier.includes(".") ? manifest.packageIdentifier.split(".")[0] : null;

		if (namespace == null) {
			return null;
		}

		return [namespace, manifest.publisher];
	}
}
