import { camel } from "radash";
import z from "zod";

export const transformKeys = z
	.record(z.any())
	.transform((e) => Object.fromEntries(Object.entries(e).map(([k, v]) => [camel(k), v])));

export const agreementSchema = transformKeys.pipe(
	z.object({
		agreementLabel: z.coerce.string().nullish(),
		agreement: z.coerce.string().nullish(),
		agreementUrl: z.coerce.string().url().nullish(),
	}),
);

export const documentationSchema = transformKeys.pipe(
	z.object({
		documentLabel: z.coerce.string().nullish(),
		documentUrl: z.coerce.string().url().nullish(),
	}),
);

export const iconSchema = transformKeys.pipe(
	z.object({
		iconUrl: z.coerce.string().url(),
		iconFileType: z.enum(["png", "jpeg", "ico"]),
		iconResolution: z
			.enum([
				"custom",
				"16x16",
				"20x20",
				"24x24",
				"30x30",
				"32x32",
				"36x36",
				"40x40",
				"48x48",
				"60x60",
				"64x64",
				"72x72",
				"80x80",
				"96x96",
				"256x256",
			])
			.nullish(),
		iconTheme: z.enum(["default", "light", "dark", "highContrast"]).nullish(),
		iconSha256: z.coerce.string().nullish(),
	}),
);

export const architectureSchema = z.enum(["x86", "x64", "arm", "arm64", "neutral"]);

export const platformSchema = z.enum(["Windows.Desktop", "Windows.Universal"]);

export const installerTypeSchema = z.enum([
	"msix",
	"msi",
	"appx",
	"exe",
	"zip",
	"inno",
	"nullsoft",
	"wix",
	"burn",
	"pwa",
	"portable",
]);

export const nestedInstallerTypeSchema = z.enum([
	"msix",
	"msi",
	"appx",
	"exe",
	"inno",
	"nullsoft",
	"wix",
	"burn",
	"portable",
]);

export const nestedInstallerFilesSchema = transformKeys.pipe(
	z.object({
		relativeFilePath: z.coerce.string(),
		portableCommandAlias: z.coerce.string().nullish(),
	}),
);

export const scopeSchema = z.enum(["user", "machine"]);

export const installModesSchema = z.enum(["interactive", "silent", "silentWithProgress"]);

export const installerSwitchesSchema = transformKeys.pipe(
	z.object({
		silent: z.coerce.string().nullish(),
		silentWithProgress: z.coerce.string().nullish(),
		interactive: z.coerce.string().nullish(),
		installLocation: z.coerce.string().nullish(),
		log: z.coerce.string().nullish(),
		upgrade: z.coerce.string().nullish(),
		custom: z.coerce.string().nullish(),
	}),
);

export const expectedReturnCodesSchema = transformKeys.pipe(
	z.object({
		installerReturnCode: z.coerce.number().int(),
		returnResponse: z.enum([
			"packageInUse",
			"packageInUseByApplication",
			"installInProgress",
			"fileInUse",
			"missingDependency",
			"diskFull",
			"insufficientMemory",
			"invalidParameter",
			"noNetwork",
			"contactSupport",
			"rebootRequiredToFinish",
			"rebootRequiredForInstall",
			"rebootInitiated",
			"cancelledByUser",
			"alreadyInstalled",
			"downgrade",
			"blockedByPolicy",
			"systemNotSupported",
			"custom",
		]),
		returnResponseUrl: z.coerce.string().url().nullish(),
	}),
);

export const upgradeBehaviorSchema = z.enum(["install", "uninstallPrevious", "deny"]);

export const dependenciesSchema = transformKeys.pipe(
	z.object({
		windowsFeatures: z.array(z.coerce.string()).nullish(),
		windowsLibraries: z.array(z.coerce.string()).nullish(),
		packageDependencies: z
			.array(
				transformKeys.pipe(
					z.object({
						packageIdentifier: z.coerce.string(),
						minimumVersion: z.coerce.string().nullish(),
					}),
				),
			)
			.nullish(),
		externalDependencies: z.array(z.coerce.string()).nullish(),
	}),
);

export const marketsSchema = transformKeys.pipe(
	z.union([
		z.object({
			allowedMarkets: z.array(z.coerce.string()),
		}),
		z.object({
			excludedMarkets: z.array(z.coerce.string()),
		}),
	]),
);

export const unsupportedOsArchitecturesSchema = z.enum(["x86", "x64", "arm", "arm64"]);

export const unsupportedArgumentsSchema = z.enum(["log", "location"]);

export const appsAndFeaturesEntriesSchema = transformKeys.pipe(
	z.object({
		displayName: z.coerce.string().nullish(),
		publisher: z.coerce.string().nullish(),
		displayVersion: z.coerce.string().nullish(),
		productCode: z.coerce.string().nullish(),
		upgradeCode: z.coerce.string().nullish(),
		installerType: z
			.enum(["msix", "msi", "appx", "exe", "zip", "inno", "nullsoft", "wix", "burn", "pwa", "portable"])
			.nullish(),
	}),
);

export const elevationRequirementSchema = z.enum(["elevationRequired", "elevationProhibited", "elevatesSelf"]);

export const installationMetadataSchema = transformKeys.pipe(
	z.object({
		defaultInstallLocation: z.coerce.string().nullish(),
		files: z
			.array(
				transformKeys.pipe(
					z.object({
						relativeFilePath: z.coerce.string(),
						fileSha256: z.coerce.string().nullish(),
						fileType: z.enum(["launch", "uninstall", "other"]).nullish(),
					}),
				),
			)
			.nullish(),
		invocationParameter: z.coerce.string().nullish(),
		displayName: z.coerce.string().nullish(),
	}),
);

export const repairBehaviorSchema = z.enum(["modify", "uninstaller", "installer"]);

// schema: https://github.com/microsoft/winget-cli/tree/master/schemas/JSON/manifests
export const manifestSchema = transformKeys.pipe(
	z.intersection(
		z.object({
			packageIdentifier: z.coerce.string(),
			packageVersion: z.coerce.string(),
			manifestVersion: z.coerce.string(),
		}),
		z.union([
			z.object({
				manifestType: z.literal("version"),

				defaultLocale: z.coerce.string(),
			}),
			z.object({
				manifestType: z.literal("installer"),

				installers: z.array(
					transformKeys.pipe(
						z.object({
							architecture: architectureSchema,
							installerUrl: z.coerce.string().url(),
							installerSha256: z.coerce.string(),

							installerLocale: z.coerce.string().nullish(),
							platform: z.array(platformSchema).nullish(),
							minimumOsVersion: z.coerce.string().nullish(),
							installerType: installerTypeSchema.nullish(),
							nestedInstallerType: nestedInstallerTypeSchema.nullish(),
							nestedInstallerFiles: z.array(nestedInstallerFilesSchema).nullish(),
							scope: scopeSchema.nullish(),
							signatureSha256: z.coerce.string().nullish(),
							installModes: z.array(installModesSchema).nullish(),
							installerSwitches: installerSwitchesSchema.nullish(),
							installerSuccessCodes: z.array(z.coerce.number().int()).nullish(),
							expectedReturnCodes: z.array(expectedReturnCodesSchema).nullish(),
							upgradeBehavior: upgradeBehaviorSchema.nullish(),
							commands: z.array(z.coerce.string()).nullish(),
							protocols: z.array(z.coerce.string()).nullish(),
							fileExtensions: z.array(z.coerce.string()).nullish(),
							dependencies: dependenciesSchema.nullish(),
							packageFamilyName: z.coerce.string().nullish(),
							productCode: z.coerce.string().nullish(),
							capabilities: z.array(z.coerce.string()).nullish(),
							restrictedCapabilities: z.array(z.coerce.string()).nullish(),
							markets: marketsSchema.nullish(),
							installerAbortsTerminal: z.coerce.boolean().nullish(),
							releaseDate: z.coerce.date().nullish(),
							installLocationRequired: z.coerce.boolean().nullish(),
							requireExplicitUpgrade: z.coerce.boolean().nullish(),
							displayInstallWarnings: z.coerce.boolean().nullish(),
							unsupportedOsArchitectures: z.array(unsupportedOsArchitecturesSchema).nullish(),
							unsupportedArguments: z.array(unsupportedArgumentsSchema).nullish(),
							appsAndFeaturesEntries: z.array(appsAndFeaturesEntriesSchema).nullish(),
							elevationRequirement: elevationRequirementSchema.nullish(),
							installationMetadata: installationMetadataSchema.nullish(),
							downloadCommandProhibited: z.coerce.boolean().nullish(),
							repairBehavior: repairBehaviorSchema.nullish(),
							archiveBinariesDependOnPath: z.coerce.boolean().nullish(),
						}),
					),
				),

				channel: z.coerce.string().nullish(),
				installerLocale: z.coerce.string().nullish(),
				platform: z.array(platformSchema).nullish(),
				minimumOsVersion: z.coerce.string().nullish(),
				installerType: installerTypeSchema.nullish(),
				nestedInstallerType: nestedInstallerTypeSchema.nullish(),
				nestedInstallerFiles: z.array(nestedInstallerFilesSchema).nullish(),
				scope: scopeSchema.nullish(),
				installModes: z.array(installModesSchema).nullish(),
				installerSwitches: installerSwitchesSchema.nullish(),
				installerSuccessCodes: z.array(z.coerce.number().int()).nullish(),
				expectedReturnCodes: z.array(expectedReturnCodesSchema).nullish(),
				upgradeBehavior: upgradeBehaviorSchema.nullish(),
				commands: z.array(z.coerce.string()).nullish(),
				protocols: z.array(z.coerce.string()).nullish(),
				fileExtensions: z.array(z.coerce.string()).nullish(),
				dependencies: dependenciesSchema.nullish(),
				packageFamilyName: z.coerce.string().nullish(),
				productCode: z.coerce.string().nullish(),
				capabilities: z.array(z.coerce.string()).nullish(),
				restrictedCapabilities: z.array(z.coerce.string()).nullish(),
				markets: marketsSchema.nullish(),
				installerAbortsTerminal: z.coerce.boolean().nullish(),
				releaseDate: z.coerce.date().nullish(),
				installLocationRequired: z.coerce.boolean().nullish(),
				requireExplicitUpgrade: z.coerce.boolean().nullish(),
				displayInstallWarnings: z.coerce.boolean().nullish(),
				unsupportedOsArchitectures: z.array(unsupportedOsArchitecturesSchema).nullish(),
				unsupportedArguments: z.array(unsupportedArgumentsSchema).nullish(),
				appsAndFeaturesEntries: z.array(appsAndFeaturesEntriesSchema).nullish(),
				elevationRequirement: elevationRequirementSchema.nullish(),
				installationMetadata: installationMetadataSchema.nullish(),
				downloadCommandProhibited: z.coerce.boolean().nullish(),
				repairBehavior: repairBehaviorSchema.nullish(),
				archiveBinariesDependOnPath: z.coerce.boolean().nullish(),
			}),
			z.object({
				manifestType: z.literal("locale"),

				packageLocale: z.coerce.string(),

				publisher: z.coerce.string().nullish(),
				publisherUrl: z.coerce.string().url().nullish(),
				publisherSupportUrl: z.coerce.string().url().nullish(),
				privacyUrl: z.coerce.string().url().nullish(),
				author: z.coerce.string().nullish(),
				packageName: z.coerce.string().nullish(),
				packageUrl: z.coerce.string().url().nullish(),
				license: z.coerce.string().nullish(),
				licenseUrl: z.coerce.string().url().nullish(),
				copyright: z.coerce.string().nullish(),
				copyrightUrl: z.coerce.string().url().nullish(),
				shortDescription: z.coerce.string().nullish(),
				description: z.coerce.string().nullish(),
				tags: z.array(z.coerce.string()).nullish(),
				agreements: z.array(agreementSchema).nullish(),
				releaseNotes: z.coerce.string().nullish(),
				releaseNotesUrl: z.coerce.string().url().nullish(),
				purchaseUrl: z.coerce.string().url().nullish(),
				installationNotes: z.coerce.string().nullish(),
				documentations: z.array(documentationSchema).nullish(),
				icons: z.array(iconSchema).nullish(),
			}),
			z.object({
				manifestType: z.literal("defaultLocale"),

				packageLocale: z.coerce.string(),
				publisher: z.coerce.string(),
				packageName: z.coerce.string(),
				license: z.coerce.string(),
				shortDescription: z.coerce.string(),

				publisherUrl: z.coerce.string().url().nullish(),
				publisherSupportUrl: z.coerce.string().url().nullish(),
				privacyUrl: z.coerce.string().url().nullish(),
				author: z.coerce.string().nullish(),
				packageUrl: z.coerce.string().url().nullish(),
				licenseUrl: z.coerce.string().url().nullish(),
				copyright: z.coerce.string().nullish(),
				copyrightUrl: z.coerce.string().url().nullish(),
				description: z.coerce.string().nullish(),
				moniker: z.coerce.string().nullish(),
				tags: z.array(z.coerce.string()).nullish(),
				agreements: z.array(agreementSchema).nullish(),
				releaseNotes: z.coerce.string().nullish(),
				releaseNotesUrl: z.coerce.string().url().nullish(),
				purchaseUrl: z.coerce.string().url().nullish(),
				installationNotes: z.coerce.string().nullish(),
				documentations: z.array(documentationSchema).nullish(),
				icons: z.array(iconSchema).nullish(),
			}),
		]),
	),
);
