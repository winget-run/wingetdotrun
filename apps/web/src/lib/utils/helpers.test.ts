import { describe, expect, it } from "vitest";
import { parseTags } from "./helpers";

describe.concurrent("parseTags", () => {
	it("should parse an empty query", () => {
		expect(parseTags("")).toEqual({});
	});
	it("should parse a query", () => {
		expect(parseTags("this is a test")).toEqual({ query: "this is a test" });
	});
	it("should parse tags", () => {
		expect(parseTags("name:vscode publisher:microsoft")).toEqual({ name: "vscode", publisher: "microsoft" });
	});
	it("should parse a query and tags", () => {
		expect(parseTags("this is a test name:vscode")).toEqual({ query: "this is a test", name: "vscode" });
	});
	it("should parse multiple queries and tags", () => {
		expect(parseTags("this is a test name:vscode some publisher:microsoft more query")).toEqual({
			query: "this is a test some more query",
			name: "vscode",
			publisher: "microsoft",
		});
	});
	it("should dedupe tags", () => {
		expect(parseTags("this is a test name:vscode name:discord publisher:discord")).toEqual({
			query: "this is a test",
			name: "discord",
			publisher: "discord",
		});
	});
});
