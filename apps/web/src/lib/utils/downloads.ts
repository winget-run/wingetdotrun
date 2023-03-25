import type { Download, DownloadOptions } from "$lib/stores/downloads";

export const DOWNLOAD_FORMATS = ["ps1", "bat", "json"] as const;
export type DownloadFormat = (typeof DOWNLOAD_FORMATS)[number];

export const mapDownloadArgs = (args: DownloadOptions, version = "latest") => {
	let output: string[] = [];

	if (version && version !== "latest") output.push(`-v ${version}`);
	if (args?.scope) output.push(`--scope ${args.scope}`);
	if (args?.installation) output.push(args.installation === "interactive" ? "-i" : "-h");
	if (args?.acceptPackageAgreements) output.push("--accept-package-agreements");
	if (args?.acceptSourceAgreements) output.push("--accept-source-agreements");

	return output;
};

export const mapDownloadsToCommands = (
	downloads: { id: string; version?: string }[],
	options: DownloadOptions = {},
	format: DownloadFormat = "ps1",
) => {
	switch (format) {
		case "json":
			return `winget import --import-file wingetdotrun.json`;
		case "ps1":
		case "bat":
			return downloads
				.map((x) => `winget install -e --id ${x.id} ${mapDownloadArgs(options, x.version).join(" ")}`.trim())
				.join(format === "ps1" ? "; " : " & ")
				.trim();
	}
};
