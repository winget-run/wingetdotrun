import { describe, expect, it } from "vitest";
import { mapDownloadArgs, mapDownloadsToCommands } from "./downloads";

describe.concurrent("mapDownloadArgs", () => {
	it("should return an empty array when no args are passed", () => {
		expect(mapDownloadArgs({})).toEqual([]);
	});

	it("should return only the version when no args are passed", () => {
		expect(mapDownloadArgs({}, "1.0.0")).toEqual(["-v 1.0.0"]);
	});

	it("should return the correct result when args are passed", () => {
		expect(
			mapDownloadArgs({
				scope: "user",
				installation: "interactive",
				acceptPackageAgreements: true,
				acceptSourceAgreements: true,
			}),
		).toEqual(["--scope user", "-i", "--accept-package-agreements", "--accept-source-agreements"]);
	});

	it("should return the correct result when args are passed and version is set", () => {
		expect(
			mapDownloadArgs(
				{
					scope: "machine",
					installation: "silent",
					acceptPackageAgreements: true,
					acceptSourceAgreements: true,
				},
				"1.0.0",
			),
		).toEqual(["-v 1.0.0", "--scope machine", "-h", "--accept-package-agreements", "--accept-source-agreements"]);
	});
});

describe.concurrent("mapDownloadsToCommands", () => {
	it("should return the correct result when no downloads are passed", () => {
		expect(mapDownloadsToCommands([])).toEqual("");
	});

	it("should return the correct result when downloads are passed", () => {
		expect(mapDownloadsToCommands([{ id: "Test.Package" }])).toEqual("winget install -e --id Test.Package");
	});

	it("should return the correct result when downloads are passed and options are set", () => {
		expect(mapDownloadsToCommands([{ id: "Test.Package" }], { scope: "user" })).toEqual(
			"winget install -e --id Test.Package --scope user",
		);
	});

	it("should return the correct result when downloads are passed and options and version is set", () => {
		expect(mapDownloadsToCommands([{ id: "Test.Package", version: "1.0.0" }], { scope: "user" })).toEqual(
			"winget install -e --id Test.Package -v 1.0.0 --scope user",
		);
	});

	it("should return the correct result when multiple downloads are passed", () => {
		expect(mapDownloadsToCommands([{ id: "Test.Package" }, { id: "Test.Package2" }])).toEqual(
			"winget install -e --id Test.Package; winget install -e --id Test.Package2",
		);
	});

	it("should return the correct result when multiple downloads are passed and options are set", () => {
		expect(mapDownloadsToCommands([{ id: "Test.Package" }, { id: "Test.Package2" }], { scope: "user" })).toEqual(
			"winget install -e --id Test.Package --scope user; winget install -e --id Test.Package2 --scope user",
		);
	});

	it("should return the correct result when multiple downloads are passed and options and version is set", () => {
		expect(
			mapDownloadsToCommands(
				[
					{ id: "Test.Package", version: "1.0.0" },
					{ id: "Test.Package2", version: "1.0.0" },
				],
				{ scope: "user" },
			),
		).toEqual(
			"winget install -e --id Test.Package -v 1.0.0 --scope user; winget install -e --id Test.Package2 -v 1.0.0 --scope user",
		);
	});

	it("should return the correct result when multiple downloads are passed and options and version is set and format is set to json", () => {
		expect(
			mapDownloadsToCommands(
				[
					{ id: "Test.Package", version: "1.0.0" },
					{ id: "Test.Package2", version: "1.0.0" },
				],
				{ scope: "user" },
				"json",
			),
		).toEqual(`winget import --import-file wingetdotrun.json`);
	});

	it("should return the correct result when multiple downloads are passed and options and version is set and format is set to bat", () => {
		expect(
			mapDownloadsToCommands(
				[
					{ id: "Test.Package", version: "1.0.0" },
					{ id: "Test.Package2", version: "1.0.0" },
				],
				{ scope: "user" },
				"bat",
			),
		).toEqual(
			`winget install -e --id Test.Package -v 1.0.0 --scope user & winget install -e --id Test.Package2 -v 1.0.0 --scope user`,
		);
	});
});
