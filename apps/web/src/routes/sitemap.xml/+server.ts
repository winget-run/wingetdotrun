import type { RequestHandler } from "./$types";
import { generateSitemap } from "./sitemap";

export const GET: RequestHandler = async () => {
	return new Response(
		generateSitemap([
			{
				url: "https://winget.run",
				priority: 1,
			},
			// TODO: add package pages
		]),
		{ headers: { "content-type": "application/xml" } },
	);
};
