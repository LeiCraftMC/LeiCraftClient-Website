/**
 * Docs pages: the markdown files in `content/docs/` (same files, frontmatter and MDC components as
 * the style guide's static-site-with-docs template), parsed with @nuxtjs/mdc.
 *
 * The template reads them through @nuxt/content, which is built for `nuxt generate`. This site is
 * an SSR app (Bun preset): Content would need a writable SQLite file at runtime, download a SQLite
 * WASM build for every client-side docs navigation, and override the MDC heading settings the
 * release changelogs rely on. Instead every page is bundled as its own lazy chunk of raw markdown
 * and parsed during SSR (the result travels in the payload) or on client-side navigation.
 */
import type { TocLink } from "@nuxtjs/mdc";
import { parseMarkdown } from "@nuxtjs/mdc/runtime";

const sources = import.meta.glob<string>("../../content/docs/**/*.md", {
	query: "?raw",
	import: "default",
});

/** `../../content/docs/install/fabric.md` → `/docs/install/fabric`; `…/index.md` → its folder. */
function routeOf(file: string) {
	return file
		.replace(/^.*\/content\/docs/, "/docs")
		.replace(/\.md$/, "")
		.replace(/\/index$/, "");
}

const loaders = new Map(Object.entries(sources).map(([file, load]) => [routeOf(file), load]));

export interface DocsPageContent {
	path: string;
	title: string;
	description: string;
	body: Awaited<ReturnType<typeof parseMarkdown>>["body"];
	data: Record<string, unknown>;
	toc: TocLink[];
}

export async function useDocsPage(path: string) {
	return await useAsyncData(`docs:${path}`, async (): Promise<DocsPageContent | null> => {
		const load = loaders.get(path);
		if (!load) return null;

		const parsed = await parseMarkdown(await load(), { toc: { depth: 3, searchDepth: 3 } });
		return {
			path,
			title: String(parsed.data.title ?? ""),
			description: String(parsed.data.description ?? ""),
			body: parsed.body,
			data: parsed.data,
			toc: parsed.toc?.links ?? [],
		};
	});
}
