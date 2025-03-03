import { relations } from "drizzle-orm";
import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

// package
export const packages = sqliteTable("packages", {
	// raw package identifier
	ident: text().notNull().primaryKey(),
	// slugified package identifier
	slug: text().notNull().unique(),

	name: text().notNull(),
	license: text().notNull(),
	shortDescription: text().notNull(),

	packageUrl: text(),
	licenseUrl: text(),
	description: text(),
	tags: text({ mode: "json" }).$type<string[]>(),

	publisherIdent: text()
		.notNull()
		.references(() => publishers.ident, { onUpdate: "cascade", onDelete: "cascade" }),
});

export const packagesRelations = relations(packages, ({ one, many }) => ({
	publisher: one(publishers, {
		fields: [packages.publisherIdent],
		references: [publishers.ident],
	}),
	versions: many(versions),
}));

// publisher
export const publishers = sqliteTable("publishers", {
	// raw package namespace
	ident: text().notNull().primaryKey(),
	// slugified package namespace
	slug: text().notNull().unique(),

	// defaultLocale.publisher
	name: text().notNull(),
	// alternative publisher identifying names
	aliases: text({ mode: "json" }).$type<string[]>().notNull(),

	publisherUrl: text(),
});

export const publishersRelations = relations(publishers, ({ many }) => ({
	packages: many(packages),
}));

// version
export const versions = sqliteTable(
	"versions",
	{
		// raw package version
		ident: text().notNull(),
		// slugified package version
		slug: text().notNull(),

		latest: integer({ mode: "boolean" }).notNull(),

		packageIdent: text()
			.notNull()
			.references(() => packages.ident, { onUpdate: "cascade", onDelete: "cascade" }),
	},
	(t) => [primaryKey({ columns: [t.packageIdent, t.ident] })],
);

export const versionsRelations = relations(versions, ({ one }) => ({
	package: one(packages, {
		fields: [versions.ident],
		references: [packages.ident],
	}),
}));
