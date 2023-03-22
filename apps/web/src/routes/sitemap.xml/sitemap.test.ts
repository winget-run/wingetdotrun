import { describe, expect, it } from "vitest";
import { generateSitemap } from "./sitemap";

describe("generateSitemap", () => {
	it("should generate a sitemap", () => {
		const entries = [
			{
				url: "https://example.com",
				updatedAt: new Date("2023-01-01"),
				priority: 1,
			},
		];
		const sitemap = generateSitemap(entries);
		expect(sitemap).toMatchSnapshot();
	});

	it("should generate a sitemap with multiple entries", () => {
		const entries = [
			{
				url: "https://example.com",
				updatedAt: new Date("2023-01-01"),
				priority: 1,
			},
			{
				url: "https://example.com/about",
				updatedAt: new Date("2023-01-02"),
			},
			{
				url: "https://example.com/careers",
				priority: 0.25,
			},
		];
		const sitemap = generateSitemap(entries);
		expect(sitemap).toMatchSnapshot();
	});
});
