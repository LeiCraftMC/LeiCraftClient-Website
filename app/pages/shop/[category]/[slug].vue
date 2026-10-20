<script setup lang="ts">
import type { GetCatalogPagesByPageIdCollectionsResponses } from "~/api-client";

type PageCollection = GetCatalogPagesByPageIdCollectionsResponses["200"]["data"][number];

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
const pageId = page.value?.id as number;

usePageSeo({
	title: `${page.value?.name} — LeiCraft Client Shop`,
	description: page.value?.description || CATEGORY_INFO[category].description,
	ogImage: page.value?.banner?.url ?? page.value?.icon?.url,
});

const { data: collections } = await useAPIAsyncData<PageCollection[]>(
	`shop-page-${pageId}-collections`,
	async () => {
		const res = await useAPI(
			(api) => api.getCatalogPagesByPageIdCollections({ path: { pageId } }),
			true,
		);
		return res.success ? res.data : [];
	},
);
</script>

<template>
	<div v-if="page">
		<div class="relative h-48 overflow-hidden border-b border-slate-800 md:h-64">
			<img
				v-if="page.banner"
				:src="page.banner.url"
				:alt="page.name"
				class="h-full w-full object-cover"
			/>
			<div
				v-else
				class="h-full w-full bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.2),transparent_70%)]"
			></div>
			<div class="absolute inset-0 bg-linear-to-t from-slate-950 to-transparent"></div>
		</div>

		<UContainer class="-mt-16 relative space-y-10 pb-12">
			<div class="flex flex-wrap items-end gap-5">
				<div
					class="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-slate-950 bg-slate-800"
				>
					<img v-if="page.icon" :src="page.icon.url" :alt="page.name" class="h-full w-full object-cover" />
					<UIcon v-else :name="CATEGORY_INFO[page.category].icon" class="text-5xl text-slate-500" />
				</div>
				<div class="min-w-0 flex-1 space-y-2">
					<UBreadcrumb
						:items="[
							{ label: 'Shop', to: '/shop' },
							{ label: CATEGORY_INFO[page.category].label, to: `/shop/${page.category}` },
							{ label: page.name },
						]"
					/>
					<h1 class="text-3xl font-bold text-white md:text-4xl">{{ page.name }}</h1>
					<div v-if="page.owner" class="flex items-center gap-2 text-sm text-slate-400">
						<UAvatar :src="page.owner.avatar_url" :alt="page.owner.display_name" size="2xs" />
						by {{ page.owner.display_name }}
					</div>
				</div>
				<ReportButton target-type="page" :target-id="page.id" />
			</div>

			<p v-if="page.description" class="max-w-3xl whitespace-pre-line text-slate-300">
				{{ page.description }}
			</p>

			<section v-if="collections?.length" class="space-y-4">
				<h2 class="text-xl font-semibold text-white">Collections</h2>
				<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					<NuxtLink
						v-for="collection in collections"
						:key="collection.id"
						:to="`/shop/collections/${collection.id}`"
						class="group flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/50 p-4 transition hover:border-primary-400/50"
					>
						<div
							class="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-800"
						>
							<img
								v-if="collection.preview"
								:src="collection.preview.url"
								:alt="collection.name"
								class="h-full w-full object-cover"
							/>
							<UIcon v-else name="i-lucide-layers" class="text-2xl text-slate-500" />
						</div>
						<div class="min-w-0 flex-1">
							<h3 class="truncate font-medium text-white group-hover:text-primary-300">
								{{ collection.name }}
							</h3>
							<p class="text-sm text-slate-400">{{ collection.product_count }} items</p>
						</div>
					</NuxtLink>
				</div>
			</section>

			<section class="space-y-4">
				<h2 class="text-xl font-semibold text-white">Items</h2>
				<CatalogProductBrowser :cache-key="`shop-page-${page.id}-products`" :page-id="page.id" />
			</section>
		</UContainer>
	</div>
</template>
