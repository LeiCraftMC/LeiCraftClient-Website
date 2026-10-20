/**
 * /sitemap.xml — the public pages plus every shop page and listed product, read from the public
 * catalog API (no session). Cached for an hour; a failing API yields just the static pages.
 */

const STATIC_PATHS = [
	"/",
	"/shop",
	"/shop/official",
	"/shop/partner",
	"/shop/community",
	"/players",
	"/download",
];

/** The catalog serves at most 100 entries per request. */
const PAGE_SIZE = 100;
const MAX_ENTRIES = 5000;

interface Envelope<T> {
	success: boolean;
	data: T;
}

async function fetchAll<T>(url: string): Promise<T[]> {
	const entries: T[] = [];
	while (entries.length < MAX_ENTRIES) {
		const res = await $fetch<Envelope<T[]>>(url, {
			query: { limit: PAGE_SIZE, offset: entries.length },
		}).catch(() => null);
		if (!res?.success) break;
		entries.push(...res.data);
		if (res.data.length < PAGE_SIZE) break;
	}
	return entries;
}

function escapeXML(value: string) {
	return value.replace(/[<>&'"]/g, (char) => `&#${char.charCodeAt(0)};`);
}

export default defineCachedEventHandler(
	async (event) => {
		const { apiUrl, appUrl } = useRuntimeConfig(event).public as { apiUrl: string; appUrl: string };
		const api = `${apiUrl.replace(/\/$/, "")}/v1`;
		const site = appUrl.replace(/\/$/, "");

		const [pages, products] = await Promise.all([
			fetchAll<{ category: string; slug: string }>(`${api}/catalog/pages`),
			fetchAll<{ id: number; updated_at?: number; published_at?: number | null }>(
				`${api}/catalog/products`,
			),
		]);

		const urls = [
			...STATIC_PATHS.map((path) => ({ loc: `${site}${path}`, lastmod: null as number | null })),
			...pages.map((page) => ({ loc: `${site}/shop/${page.category}/${page.slug}`, lastmod: null })),
			...products.map((product) => ({
				loc: `${site}/shop/products/${product.id}`,
				lastmod: product.published_at ?? null,
			})),
		];

		setHeader(event, "Content-Type", "application/xml; charset=utf-8");
		return [
			'<?xml version="1.0" encoding="UTF-8"?>',
			'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
			...urls.map(
				(url) =>
					`<url><loc>${escapeXML(url.loc)}</loc>${url.lastmod ? `<lastmod>${new Date(url.lastmod).toISOString()}</lastmod>` : ""}</url>`,
			),
			"</urlset>",
		].join("\n");
	},
	{ maxAge: 60 * 60, name: "sitemap" },
);
