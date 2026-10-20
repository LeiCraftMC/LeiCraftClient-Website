<script setup lang="ts">
/**
 * Filterable, paged product grid over `GET /catalog/products`. The first page renders on the
 * server (SEO); filters and "load more" fetch on the client.
 */
import { watchDebounced } from "@vueuse/core";
import type { GetCatalogProductsData } from "~/api-client";
import type { CategoryID, Product } from "~/utils/types";

type Query = NonNullable<GetCatalogProductsData["query"]>;

const props = withDefaults(
	defineProps<{
		/** Unique per usage — the SSR cache key. */
		cacheKey: string;
		category?: CategoryID;
		pageId?: number;
		collectionId?: number;
		showCategoryFilter?: boolean;
		pageSize?: number;
	}>(),
	{
		category: undefined,
		pageId: undefined,
		collectionId: undefined,
		showCategoryFilter: false,
		pageSize: 24,
	},
);

const toast = useToast();

const type = ref<"all" | "cape" | "cosmetic">("all");
const categoryFilter = ref<"all" | CategoryID>("all");
const order = ref<NonNullable<Query["order"]>>("featured");
const search = ref("");

const typeItems = [
	{ label: "All items", value: "all", icon: "i-lucide-layout-grid" },
	{ label: "Capes", value: "cape", icon: "i-lucide-flag" },
	{ label: "Cosmetics", value: "cosmetic", icon: "i-lucide-sparkles" },
];
const categoryItems = [
	{ label: "All categories", value: "all" },
	...CATEGORY_IDS.map((id) => ({ label: CATEGORY_INFO[id].label, value: id })),
];
const orderItems = [
	{ label: "Featured", value: "featured" },
	{ label: "Newest", value: "newest" },
	{ label: "Oldest", value: "oldest" },
	{ label: "Name", value: "name" },
];

function buildQuery(offset: number): Query {
	const category =
		props.category ?? (categoryFilter.value === "all" ? undefined : categoryFilter.value);
	return {
		page_id: props.pageId,
		collection_id: props.collectionId,
		category,
		type: type.value === "all" ? undefined : type.value,
		search: search.value.trim() || undefined,
		order: order.value,
		limit: props.pageSize,
		offset,
	};
}

async function fetchPage(offset: number) {
	const res = await useAPI((api) => api.getCatalogProducts({ query: buildQuery(offset) }), true);
	if (!res.success) {
		toast.add({ title: "Failed to load products", description: res.message, color: "error" });
		return null;
	}
	return res.data;
}

const initial = await useAPIAsyncData<Product[]>(
	props.cacheKey,
	async () => (await fetchPage(0)) ?? [],
);

const products = ref<Product[]>([...(initial.data.value ?? [])]);
const hasMore = ref(products.value.length === props.pageSize);
const loading = ref(false);

async function reload() {
	loading.value = true;
	const page = await fetchPage(0);
	loading.value = false;
	if (!page) return;
	products.value = page;
	hasMore.value = page.length === props.pageSize;
}

async function loadMore() {
	loading.value = true;
	const page = await fetchPage(products.value.length);
	loading.value = false;
	if (!page) return;
	products.value.push(...page);
	hasMore.value = page.length === props.pageSize;
}

watch([type, categoryFilter, order], reload);
watchDebounced(search, reload, { debounce: 300 });
</script>

<template>
	<div class="space-y-6">
		<div class="flex flex-wrap items-center gap-3">
			<UTabs
				v-model="type"
				:items="typeItems"
				:content="false"
				color="neutral"
				variant="pill"
				size="sm"
			/>
			<div class="flex flex-1 flex-wrap items-center justify-end gap-2">
				<USelect
					v-if="showCategoryFilter && !category"
					v-model="categoryFilter"
					:items="categoryItems"
					class="w-44"
				/>
				<USelect v-model="order" :items="orderItems" class="w-36" icon="i-lucide-arrow-up-down" />
				<UInput
					v-model="search"
					icon="i-lucide-search"
					placeholder="Search…"
					class="w-full sm:w-56"
				/>
			</div>
		</div>

		<div v-if="products.length" class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
			<CatalogProductCard v-for="product in products" :key="product.id" :product="product" />
		</div>

		<UEmpty
			v-else-if="!loading"
			icon="i-lucide-package-open"
			title="Nothing here yet"
			description="No products match these filters."
			variant="naked"
		/>

		<div v-if="loading && !products.length" class="flex justify-center py-12">
			<UIcon name="i-lucide-loader-2" class="animate-spin text-3xl text-slate-400" />
		</div>

		<div v-if="hasMore" class="flex justify-center">
			<UButton
				color="neutral"
				variant="outline"
				icon="i-lucide-chevrons-down"
				:loading="loading"
				@click="loadMore"
			>
				Load more
			</UButton>
		</div>
	</div>
</template>
