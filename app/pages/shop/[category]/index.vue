<script setup lang="ts">
import type { CatalogPage, CatalogPageDetail } from "~/utils/types";

const route = useRoute();
const category = route.params.category;

if (!isCategoryID(category)) {
	throw createError({ statusCode: 404, statusMessage: "Category not found", fatal: true });
}

const info = CATEGORY_INFO[category];
// `official` is one page (the API allows only one): show it here instead of a list of pages.
const singlePage = isSinglePageCategory(category);

// Two separate fetches on purpose: a second `useAPI` after an `await` inside one handler runs
// without the Nuxt context on the server (NUXT_E1001).
const { data: singlePageEntry } = await useAPIAsyncData<CatalogPage | null>(
	`shop-category-${category}-page-entry`,
	async () => {
		if (!singlePage) return null;
		const res = await useAPI((api) => api.getCatalogPages({ query: { category, limit: 1 } }), true);
		return res.success ? (res.data[0] ?? null) : null;
	},
);

const singlePageId = singlePageEntry.value?.id;

const { data: page } = await useAPIAsyncData<CatalogPageDetail | null>(
	`shop-category-${category}-page`,
	async () => {
		if (!singlePageId) return null;
		const res = await useAPI(
			(api) => api.getCatalogPagesByPageId({ path: { pageId: singlePageId } }),
			true,
		);
		return res.success ? res.data : null;
	},
);

const { data: pages } = await useAPIAsyncData<CatalogPage[]>(
	`shop-category-${category}-pages`,
	async () => {
		if (singlePage) return [];
		const res = await useAPI((api) => api.getCatalogPages({ query: { category, limit: 100 } }), true);
		return res.success ? res.data : [];
	},
);

usePageSeo({
	title: `${page.value?.name ?? info.label} — LeiCraft Client Shop`,
	description: page.value?.description || info.description,
	ogImage: page.value?.banner?.url ?? page.value?.icon?.url,
});
</script>

<template>
	<CatalogPageView v-if="page" :page="page" />

	<UContainer v-else class="space-y-10 py-10">
		<div class="space-y-3">
			<UBreadcrumb :items="[{ label: 'Shop', to: '/shop' }, { label: info.label }]" />
			<div class="flex items-center gap-4">
				<div class="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-500/10">
					<UIcon :name="info.icon" class="text-3xl text-primary-400" />
				</div>
				<div>
					<h1 class="text-3xl font-bold text-white md:text-4xl">{{ info.label }}</h1>
					<p class="mt-1 text-slate-400">{{ info.description }}</p>
				</div>
			</div>
		</div>

		<UEmpty
			v-if="singlePage"
			icon="i-lucide-hourglass"
			title="Coming soon"
			description="The official LeiCraft Client capes and cosmetics are on their way."
		/>

		<template v-else>
			<section v-if="pages?.length" class="space-y-4">
				<h2 class="text-xl font-semibold text-white">
					{{ category === "community" ? "Creators" : "Pages" }}
				</h2>
				<div class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
					<CatalogPageCard v-for="entry in pages" :key="entry.id" :page="entry" />
				</div>
			</section>

			<section class="space-y-4">
				<h2 class="text-xl font-semibold text-white">All items</h2>
				<CatalogProductBrowser :cache-key="`shop-category-${category}-products`" :category="category" />
			</section>
		</template>
	</UContainer>
</template>
