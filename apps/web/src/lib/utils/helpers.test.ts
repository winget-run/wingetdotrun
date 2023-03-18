import { describe, expect, it } from "vitest";
import { parseTagMatches } from "./helpers";

describe.concurrent("parseTagMatches", () => {
	it("should parse a query", () => {
		expect(parseTagMatches("this is a test")).toEqual(expect.arrayContaining(["query:this is a test"]));
	});
	it("should parse a query and tags", () => {
		expect(parseTagMatches("this is a test name:microsoft")).toEqual(
			expect.arrayContaining(["name:microsoft", "query:this is a test"]),
		);
	});
});
