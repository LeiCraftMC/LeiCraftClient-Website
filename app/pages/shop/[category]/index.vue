<script setup lang="ts">
import type { CatalogPage } from "~/utils/types";

const route = useRoute();
const category = route.params.category;

if (!isCategoryID(category)) {
	throw createError({ statusCode: 404, statusMessage: "Category not found", fatal: true });
}

const info = CATEGORY_INFO[category];

usePageSeo({
	title: `${info.label} — LeiCraft Client Shop`,
	description: info.description,
});

const { data: pages } = await useAPIAsyncData<CatalogPage[]>(
	`shop-category-${category}-pages`,
	async () => {
		const res = await useAPI((api) => api.getCatalogPages({ query: { category, limit: 100 } }), true);
		return res.success ? res.data : [];
	},
);
</script>

<template>
	<UContainer class="space-y-10 py-10">
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

		<section v-if="pages?.length" class="space-y-4">
			<h2 class="text-xl font-semibold text-white">
				{{ category === "community" ? "Creators" : "Pages" }}
			</h2>
			<div class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
				<CatalogPageCard v-for="page in pages" :key="page.id" :page="page" />
			</div>
		</section>

		<section class="space-y-4">
			<h2 class="text-xl font-semibold text-white">All items</h2>
			<CatalogProductBrowser :cache-key="`shop-category-${category}-products`" :category="category" />
		</section>
	</UContainer>
</template>
