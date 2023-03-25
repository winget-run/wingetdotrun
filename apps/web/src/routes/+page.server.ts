import { trpc } from "../lib/trpc/client";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
	// await trpc.packages.list.ssr({ name: "bruh" }, event);

	return {
		// TODO: Test data
		packages: [
			{
				id: "Microsoft.VisualStudioCode",
				wingetId: "Microsoft.VisualStudioCode",
				name: "Visual Studio Code",
				description:
					"Visual Studio Code is a code editor redefined and optimized for building and debugging modern web and cloud applications. Visual Studio Code is free and available on your favorite platform - Linux, macOS, and Windows.",
				homepage: "https://code.visualstudio.com/",
				license: "MIT",
				licenseUrl: "",
				featured: true,
				publisherId: "Microsoft",
			},
			{
				id: "Microsoft.PowerToys",
				wingetId: "Microsoft.PowerToys",
				name: "PowerToys",
				description:
					"PowerToys is a set of utilities for power users to tune and streamline their Windows 10 experience for greater productivity.",
				homepage: "https://aka.ms/powertoys",
				license: "MIT",
				licenseUrl: "",
				featured: true,
				publisherId: "Microsoft",
			},
			{
				id: "Microsoft.PowerShell",
				wingetId: "Microsoft.PowerShell",
				name: "PowerShell",
				description:
					"PowerShell is a cross-platform (Windows, Linux, and macOS) automation and configuration tool/framework that works well with your existing tools and is optimized for dealing with structured data (e.g. JSON, CSV, XML, etc.), REST APIs, and object models. It includes a command-line shell, an associated scripting language and a framework for processing cmdlets.",
				homepage: "https://aka.ms/powershell",
				license: "MIT",
				licenseUrl: "",
				featured: false,
				publisherId: "Microsoft",
			},
			{
				id: "Discord.Discord",
				wingetId: "Discord.Discord",
				name: "Discord",
				description:
					"All-in-one voice and text chat for gamers that's free, secure, and works on both your desktop and phone.",
				homepage: "https://discord.com/",
				license: "MIT",
				licenseUrl: "",
				featured: true,
				publisherId: "Discord",
			},
			{
				id: "Docker.Docker",
				wingetId: "Docker.Docker",
				name: "Docker",
				description:
					"Docker Desktop is a tool for MacOS and Windows machines for the building and sharing of containerized applications and microservices.",
				homepage: "https://www.docker.com/products/docker-desktop",
				license: "MIT",
				licenseUrl: "",
				featured: true,
				publisherId: "Docker",
			},
			{
				id: "Musicbee.Musicbee",
				wingetId: "Musicbee.Musicbee",
				name: "MusicBee",
				description:
					"MusicBee makes it easy to organize, find, and play music files on your computer, on portable devices and on the web.",
				homepage: "https://getmusicbee.com/",
				license: "MIT",
				licenseUrl: "",
				featured: true,
				publisherId: "Musicbee",
			},
		],
	};
};
