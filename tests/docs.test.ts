/// <reference types="bun-types/test.d.ts" />
/**
 * Docs consistency (like the LeiOS/Iventworks sites): every sidebar entry in `app/data/docs.ts`
 * has a markdown file and every file is in the sidebar, pages have frontmatter, internal links
 * point at pages (and `#headings`) that exist, MDC blocks are closed and every icon exists in Lucide.
 */
import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
// The slugger @nuxtjs/mdc uses for heading ids (a dependency of it, see `parser/compiler.js`).
import Slugger from "github-slugger";
import { docsPagesFlat, docsSourcePath } from "../app/data/docs";

const ROOT = join(import.meta.dir, "..");
const CONTENT = join(ROOT, "content");
const DOCS = join(CONTENT, "docs");
const PAGES = join(ROOT, "app", "pages");

function walk(dir: string): string[] {
	return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
		entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)],
	);
}

const markdownFiles = walk(DOCS).filter((file) => file.endsWith(".md"));

function routeOf(file: string) {
	const path = relative(CONTENT, file).replaceAll("\\", "/").replace(/\.md$/, "");
	return `/${path}`.replace(/\/index$/, "");
}

function frontmatter(source: string) {
	const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	const data: Record<string, string> = {};
	for (const line of match?.[1]?.split(/\r?\n/) ?? []) {
		const field = line.match(/^(\w+):\s*(.+)$/);
		if (field?.[1] && field[2]) data[field[1]] = field[2].replace(/^["']|["']$/g, "");
	}
	return data;
}

/** Heading ids of a markdown page, built like @nuxtjs/mdc does (github-slugger, then tidied). */
function headingIds(source: string) {
	const slugger = new Slugger();
	const withoutCode = source.replace(/```[\s\S]*?```/g, "");
	return new Set(
		[...withoutCode.matchAll(/^#{2,6}\s+(.+?)\s*$/gm)].map((match) => {
			const text = (match[1] as string)
				.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links → their text
				.replace(/[*_`]/g, ""); // emphasis and code marks
			return slugger.slug(text).replace(/-+/g, "-").replace(/^-|-$/g, "").replace(/^(\d)/, "_$1");
		}),
	);
}

const headingsByRoute = new Map(
	markdownFiles.map((file) => [routeOf(file), headingIds(readFileSync(file, "utf8"))]),
);

/** Whether a site path (no query/hash) is served by a page in `app/pages/`. */
function pageExists(path: string) {
	if (path.startsWith("/docs")) return docsPagesFlat.some((page) => page.to === path);
	const segments = path.split("/").filter(Boolean);

	function match(dir: string, rest: string[]): boolean {
		if (rest.length === 0) return existsSync(join(dir, "index.vue")) || existsSync(`${dir}.vue`);
		const [head, ...tail] = rest as [string, ...string[]];
		if (tail.length === 0 && existsSync(join(dir, `${head}.vue`))) return true;
		if (existsSync(join(dir, head)) && match(join(dir, head), tail)) return true;
		// Dynamic segments: `[id].vue` / `[id]/`
		const entries = existsSync(dir) ? readdirSync(dir) : [];
		return entries.some((entry) => {
			if (!entry.startsWith("[")) return false;
			if (entry.endsWith(".vue")) return tail.length === 0 || entry.startsWith("[...");
			return match(join(dir, entry), tail);
		});
	}
	return match(PAGES, segments);
}

const lucide = (await import("@iconify-json/lucide/icons.json")).default as {
	icons: Record<string, unknown>;
	aliases?: Record<string, unknown>;
};
const iconNames = new Set([...Object.keys(lucide.icons), ...Object.keys(lucide.aliases ?? {})]);

describe("docs", () => {
	test("every sidebar entry has a markdown file", () => {
		const missing = docsPagesFlat
			.map((page) => page.to)
			.filter((to) => !existsSync(join(CONTENT, `${docsSourcePath(to)}.md`)));
		expect(missing).toEqual([]);
	});

	test("every markdown file is in the sidebar", () => {
		const registered = new Set(docsPagesFlat.map((page) => page.to));
		expect(markdownFiles.map(routeOf).filter((route) => !registered.has(route))).toEqual([]);
	});

	test("sidebar routes are unique", () => {
		const routes = docsPagesFlat.map((page) => page.to);
		expect(new Set(routes).size).toBe(routes.length);
	});

	for (const file of markdownFiles) {
		const route = routeOf(file);
		const source = readFileSync(file, "utf8");

		describe(route, () => {
			test("has a title and a description", () => {
				const data = frontmatter(source);
				expect(data.title?.length ?? 0).toBeGreaterThan(0);
				expect(data.description?.length ?? 0).toBeGreaterThan(0);
			});

			test("internal links point at existing pages", () => {
				const links = [
					...source.matchAll(/\]\((\/[^)\s]*)\)/g),
					...source.matchAll(/\bto:\s*(\/\S+)/g),
					...source.matchAll(/\bto="(\/[^"]+)"/g),
				].map((match) => match[1] as string);
				const broken = links.filter((link) => !pageExists(link.replace(/[#?].*$/, "") || "/"));
				expect(broken).toEqual([]);
			});

			test("heading anchors exist", () => {
				const anchors = [
					...source.matchAll(/\]\(((?:\/docs[^)\s#]*)?)#([^)\s]+)\)/g),
					...source.matchAll(/\bto:\s*(\/docs\S*?)#(\S+)/g),
				].map((match) => ({ page: (match[1] as string) || route, id: match[2] as string }));
				const missing = anchors.filter(({ page, id }) => !headingsByRoute.get(page)?.has(id));
				expect(missing).toEqual([]);
			});

			test("MDC blocks are closed", () => {
				const lines = source.replace(/```[\s\S]*?```/g, "").split(/\r?\n/);
				for (const depth of [2, 3, 4]) {
					const colons = ":".repeat(depth);
					const opened = lines.filter((line) => new RegExp(`^\\s*${colons}[a-z]`).test(line)).length;
					const closed = lines.filter((line) => new RegExp(`^\\s*${colons}\\s*$`).test(line)).length;
					expect({ depth, opened, closed }).toEqual({ depth, opened, closed: opened });
				}
			});

			test("icons exist", () => {
				const icons = [...source.matchAll(/i-lucide-([a-z0-9-]+)/g)].map((match) => match[1]);
				expect(icons.filter((name) => !iconNames.has(name as string))).toEqual([]);
			});
		});
	}

	test("sidebar icons exist", () => {
		const missing = docsPagesFlat
			.map((page) => page.icon.replace(/^i-lucide-/, ""))
			.filter((name) => !iconNames.has(name));
		expect(missing).toEqual([]);
	});
});
