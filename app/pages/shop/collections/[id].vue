<script setup lang="ts">
const route = useRoute();
const collectionId = Number(route.params.id);

if (!Number.isInteger(collectionId) || collectionId <= 0) {
	throw createError({ statusCode: 404, statusMessage: "Collection not found", fatal: true });
}

const { data: result } = await useAPIAsyncData(
	`shop-collection-${collectionId}`,
	async () =>
		await useAPI((api) => api.getCatalogCollectionsByCollectionId({ path: { collectionId } }), true),
);

if (!result.value?.success) {
	throw createError({
		statusCode: result.value?.code ?? 500,
		statusMessage: result.value?.message ?? "Collection not found",
		fatal: true,
	});
}

const data = computed(() => (result.value?.success ? result.value.data : null));

usePageSeo({
	title: `${data.value?.collection.name} — ${data.value?.page.name} — LeiCraft Client Shop`,
	description: data.value?.collection.description || `A collection by ${data.value?.page.name}.`,
	ogImage: data.value?.collection.preview?.url,
});
</script>

<template>
	<UContainer v-if="data" class="space-y-8 py-10">
		<div class="space-y-3">
			<UBreadcrumb
				:items="[
					{ label: 'Shop', to: '/shop' },
					{ label: CATEGORY_INFO[data.page.category].label, to: `/shop/${data.page.category}` },
					{ label: data.page.name, to: shopPagePath(data.page) },
					{ label: data.collection.name },
				]"
			/>
			<div class="flex flex-wrap items-center justify-between gap-4">
				<div>
					<h1 class="text-3xl font-bold text-white">{{ data.collection.name }}</h1>
					<p v-if="data.collection.description" class="mt-2 max-w-3xl text-slate-400">
						{{ data.collection.description }}
					</p>
				</div>
				<ReportButton target-type="collection" :target-id="data.collection.id" />
			</div>
		</div>

		<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
			<CatalogProductCard v-for="product in data.products" :key="product.id" :product="product" />
		</div>
	</UContainer>
</template>
