export type SitemapEntry = {
	url: string;
	updatedAt?: Date;
	priority?: number;
};

export const generateSitemap = (entries: SitemapEntry[]): string => {
	let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
	sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

	for (const entry of entries) {
		sitemap += `  <url>\n`;
		sitemap += `    <loc>${entry.url}</loc>\n`;
		entry.updatedAt && (sitemap += `    <lastmod>${entry.updatedAt.toISOString()}</lastmod>\n`);
		sitemap += `    <priority>${entry.priority ?? 0.5}</priority>\n`;
		sitemap += `  </url>\n`;
	}

	sitemap += `</urlset>`;
	return sitemap;
};
