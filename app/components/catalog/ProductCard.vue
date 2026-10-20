<script setup lang="ts">
// Imported here: `resolveComponent('NuxtLink')` inside the template is not resolved by Nuxt and
// renders a dead `<nuxtlink>` element.
import { NuxtLink } from "#components";
import type { Product } from "~/utils/types";

const props = withDefaults(
	defineProps<{
		product: Product;
		/** Link target; defaults to the public product page. */
		to?: string | null;
		/** Highlighted (e.g. equipped in the wardrobe). */
		selected?: boolean;
		/** Secondary line under the name (e.g. the page name). */
		subtitle?: string;
	}>(),
	{ to: undefined, selected: false, subtitle: undefined },
);

const target = computed(() =>
	props.to === null ? undefined : (props.to ?? `/shop/products/${props.product.id}`),
);
</script>

<template>
	<component
		:is="target ? NuxtLink : 'div'"
		:to="target"
		:class="[
			'group block overflow-hidden rounded-xl border bg-slate-900/50 transition hover:-translate-y-0.5',
			selected
				? 'border-primary-400 ring-1 ring-primary-400/60'
				: 'border-slate-800 hover:border-primary-400/50',
		]"
	>
		<div
			class="relative flex aspect-square items-center justify-center bg-linear-to-b from-slate-800/60 to-slate-900/60 p-6"
		>
			<img
				v-if="product.preview"
				:src="product.preview.url"
				:alt="product.name"
				class="h-full w-full object-contain"
				loading="lazy"
			/>
			<SkinCapePreview
				v-else-if="product.type === 'cape' && product.texture"
				:texture="product.texture.url"
				:alt="product.name"
				class="h-4/5"
			/>
			<UIcon
				v-else
				:name="product.type === 'cape' ? 'i-lucide-flag' : 'i-lucide-sparkles'"
				class="text-5xl text-slate-600"
			/>

			<div class="absolute left-2 top-2 flex flex-wrap gap-1">
				<UBadge
					v-if="product.availability === 'exclusive'"
					color="warning"
					variant="soft"
					size="sm"
					icon="i-lucide-gem"
				>
					Exclusive
				</UBadge>
				<slot name="badges" />
			</div>

			<div v-if="selected" class="absolute right-2 top-2">
				<UBadge color="primary" variant="solid" size="sm" icon="i-lucide-check">Equipped</UBadge>
			</div>
		</div>

		<div class="space-y-1 p-4">
			<div class="flex items-center gap-2">
				<UIcon
					:name="product.type === 'cape' ? 'i-lucide-flag' : 'i-lucide-sparkles'"
					class="shrink-0 text-slate-400"
				/>
				<h3 class="truncate font-medium text-white group-hover:text-primary-300">
					{{ product.name }}
				</h3>
			</div>
			<p v-if="subtitle" class="truncate text-sm text-slate-400">{{ subtitle }}</p>
			<slot />
		</div>
	</component>
</template>
