<script setup lang="ts">
import type { Category } from "~/utils/types";

usePageSeo({
	title: "Shop — LeiCraft Client",
	description:
		"Browse free capes and cosmetics for Minecraft: official LeiCraft Client items, partner collections and community creations.",
});

const { data: categories } = await useAPIAsyncData<Category[]>("shop-categories", async () => {
	const res = await useAPI((api) => api.getCatalogCategories({}), true);
	return res.success ? res.data : [];
});
</script>

<template>
	<UContainer class="space-y-10 py-10">
		<div>
			<h1 class="text-3xl font-bold text-white md:text-4xl">Shop</h1>
			<p class="mt-2 text-slate-400">
				Everything is free to wear. Exclusives are handed out with redeem codes and giveaways.
			</p>
		</div>

		<div class="grid gap-4 md:grid-cols-3">
			<NuxtLink
				v-for="category in categories ?? []"
				:key="category.id"
				:to="`/shop/${category.id}`"
				class="group flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/50 p-4 transition hover:border-primary-400/50"
			>
				<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-500/10">
					<UIcon :name="CATEGORY_INFO[category.id].icon" class="text-2xl text-primary-400" />
				</div>
				<div class="min-w-0">
					<h2 class="font-semibold text-white group-hover:text-primary-300">{{ category.name }}</h2>
					<p class="text-sm text-slate-400">{{ category.page_count }} pages</p>
				</div>
				<UIcon name="i-lucide-chevron-right" class="ml-auto text-slate-500" />
			</NuxtLink>
		</div>

		<CatalogProductBrowser cache-key="shop-all-products" show-category-filter />
	</UContainer>
</template>
