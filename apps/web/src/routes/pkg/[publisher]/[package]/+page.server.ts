import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
	const { params } = event;

	// const pkg = await trpc.packages.find.ssr({ id: `${params.publisher}.${params.package}` }, event);
	// const stats = await trpc.stats.find.ssr({ id: `${params.publisher}.${params.package}` }, event);

	// return { package: pkg?.data, stats: stats?.data };

	const pack: {
		id: string;
		wingetId: string;
		logo?: string;
		name: string;
		description: string;
		homepage: string;
		license: string;
		licenseUrl: string;
		featured: boolean;
		publisher: string;
		versions: string[];
		banner?: string;
		tags?: string[];
		updatedAt: string;
	} = {
		id: "Microsoft.VisualStudioCode",
		wingetId: "Microsoft.VisualStudioCode",
		name: "Visual Studio Code",
		description:
			"Visual Studio Code is a code editor redefined and optimized for building and debugging modern web and cloud applications. Visual Studio Code is free and available on your favorite platform - Linux, macOS, and Windows.",
		homepage: "https://code.visualstudio.com/",
		license: "MIT",
		licenseUrl: "",
		featured: true,
		publisher: "Microsoft Corporation",
		banner: "https://www.tabnine.com/blog/wp-content/uploads/2021/11/blog_10-1.png",
		updatedAt: "2021-11-10T00:00:00.000Z",
		versions: [
			"1.55.2",
			"1.55.1",
			"1.55.0",
			"1.54.3",
			"1.54.2",
			"1.54.1",
			"1.54.0",
			"1.53.2",
			"1.53.1",
			"1.53.0",
			"1.52.1",
			"1.52.0",
			"1.51.1",
			"1.51.0",
			"1.50.1",
			"1.50.0",
			"1.49.3",
			"1.49.2",
			"1.49.1",
			"1.49.0",
			"1.48.2",
			"1.48.1",
			"1.48.0",
			"1.47.3",
			"1.47.2",
			"1.47.1",
		],
		tags: ["code", "editor", "vscode", "visual studio"],
	};

	const stats = [
		{
			period: "2023-03-13T00:00:00.000Z",
			value: 20,
		},
		{
			period: "2023-03-14T00:00:00.000Z",
			value: 23,
		},
		{
			period: "2023-03-15T00:00:00.000Z",
			value: 14,
		},
		{
			period: "2023-03-16T00:00:00.000Z",
			value: 13,
		},
		{
			period: "2023-03-17T00:00:00.000Z",
			value: 17,
		},
		{
			period: "2023-03-18T00:00:00.000Z",
			value: 19,
		},
		{
			period: "2023-03-19T00:00:00.000Z",
			value: 10,
		},
	];

	return { id: `${params.publisher}.${params.package}`, pack, stats, publisher: params.publisher };
}) satisfies PageServerLoad;
