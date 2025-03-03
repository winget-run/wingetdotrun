CREATE TABLE `packages` (
	`ident` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`license` text NOT NULL,
	`shortDescription` text NOT NULL,
	`packageUrl` text,
	`licenseUrl` text,
	`description` text,
	`tags` text,
	`publisherIdent` text NOT NULL,
	FOREIGN KEY (`publisherIdent`) REFERENCES `publishers`(`ident`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `packages_slug_unique` ON `packages` (`slug`);--> statement-breakpoint
CREATE TABLE `publishers` (
	`ident` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`aliases` text NOT NULL,
	`publisherUrl` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `publishers_slug_unique` ON `publishers` (`slug`);--> statement-breakpoint
CREATE TABLE `versions` (
	`ident` text NOT NULL,
	`slug` text NOT NULL,
	`latest` integer NOT NULL,
	`packageIdent` text NOT NULL,
	PRIMARY KEY(`packageIdent`, `ident`),
	FOREIGN KEY (`packageIdent`) REFERENCES `packages`(`ident`) ON UPDATE cascade ON DELETE cascade
);
