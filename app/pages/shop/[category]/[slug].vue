<script setup lang="ts">
definePageMeta({
	// The official page lives at `/shop/official` itself.
	middleware: (to) => {
		const category = to.params.category;
		if (isCategoryID(category) && isSinglePageCategory(category)) {
			return navigateTo(`/shop/${category}`, { redirectCode: 301 });
		}
	},
});

const route = useRoute();
const category = route.params.category;
const slug = route.params.slug as string;

if (!isCategoryID(category)) {
	throw createError({ statusCode: 404, statusMessage: "Category not found", fatal: true });
}

const { data: result } = await useAPIAsyncData(
	`shop-page-${category}-${slug}`,
	async () =>
		await useAPI(
			(api) => api.getCatalogPagesBySlugByCategoryBySlug({ path: { category, slug } }),
			true,
		),
);

if (!result.value?.success) {
	throw createError({
		statusCode:
			(result.value?.code as number | undefined) === 404 ? 404 : (result.value?.code ?? 500),
		statusMessage: result.value?.message ?? "Page not found",
		fatal: true,
	});
}

const page = computed(() => (result.value?.success ? result.value.data : null));

usePageSeo({
	title: `${page.value?.name} — LeiCraft Client Shop`,
	description: page.value?.description || CATEGORY_INFO[category].description,
	ogImage: page.value?.banner?.url ?? page.value?.icon?.url,
});
</script>

<template>
	<CatalogPageView v-if="page" :page="page" />
</template>
