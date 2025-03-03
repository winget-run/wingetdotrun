import { eq, inArray } from "drizzle-orm";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "./schema";
import { packages, publishers, versions } from "./schema";
import { type Package, type Publisher, type Version } from "./types";

type Client = LibSQLDatabase<typeof schema>;

export class PackageDatabaseHelpers {
	#client: Client;

	constructor(client: Client) {
		this.#client = client;
	}

	async getAllPublisherIdents() {
		return (
			await this.#client.query.publishers.findMany({
				columns: {
					ident: true,
				},
			})
		).map((e) => e.ident);
	}

	async getAllPackageIdents() {
		return (
			await this.#client.query.packages.findMany({
				columns: {
					ident: true,
				},
			})
		).map((e) => e.ident);
	}

	async createPublisher<T extends Publisher>(pub: T) {
		return this.#client.insert(publishers).values(pub);
	}

	async createPackage<T extends Package>(pkg: T) {
		return this.#client.insert(packages).values(pkg);
	}

	async createPackageVersions<T extends Version>(ver: T[]) {
		return this.#client.insert(versions).values(ver);
	}

	async updatePublisher<T extends Publisher>(ident: T["ident"], pub: T) {
		return this.#client.update(publishers).set(pub).where(eq(publishers.ident, ident));
	}

	async updatePackage<T extends Package>(ident: T["ident"], pkg: T) {
		return this.#client.update(packages).set(pkg).where(eq(packages.ident, ident));
	}

	async deletePublishers<T extends Publisher>(idents: Iterable<T["ident"]>) {
		return this.#client.delete(publishers).where(inArray(publishers.ident, Array.from(idents)));
	}

	async deletePackages<T extends Package>(idents: Iterable<T["ident"]>) {
		return this.#client.delete(packages).where(inArray(packages.ident, Array.from(idents)));
	}

	async deletePackageVersions<T extends Package>(ident: T["ident"]) {
		return this.#client.delete(versions).where(eq(versions.packageIdent, ident));
	}
}
