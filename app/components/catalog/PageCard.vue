<script setup lang="ts">
import type { CatalogPage } from "~/utils/types";

defineProps<{
	page: CatalogPage;
}>();
</script>

<template>
	<NuxtLink
		:to="shopPagePath(page)"
		class="group flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/50 p-4 transition hover:-translate-y-0.5 hover:border-primary-400/50"
	>
		<div
			class="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-800"
		>
			<img
				v-if="page.icon"
				:src="page.icon.url"
				:alt="page.name"
				class="h-full w-full object-cover"
				loading="lazy"
			/>
			<UIcon v-else :name="CATEGORY_INFO[page.category].icon" class="text-2xl text-slate-500" />
		</div>
		<div class="min-w-0 flex-1">
			<h3 class="truncate font-medium text-white group-hover:text-primary-300">{{ page.name }}</h3>
			<p class="line-clamp-2 text-sm text-slate-400">
				{{ page.description || CATEGORY_INFO[page.category].description }}
			</p>
		</div>
		<UBadge color="neutral" variant="soft">{{ page.product_count }} items</UBadge>
	</NuxtLink>
</template>
