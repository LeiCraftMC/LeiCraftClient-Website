<script setup lang="ts">
// Imported here: `resolveComponent('NuxtLink')` in the template renders a dead `<nuxtlink>`.
import { NuxtLink } from "#components";

const { icon, title, description, to } = defineProps<{
	icon: string;
	title: string;
	description: string;
	/** Makes the whole card a link. */
	to?: string;
}>();
</script>

<template>
	<component
		:is="to ? NuxtLink : 'div'"
		:to="to"
		class="group block h-full rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition duration-300"
		:class="to ? 'hover:-translate-y-1 hover:border-primary-400/50' : ''"
	>
		<div class="space-y-3">
			<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-500/10">
				<UIcon :name="icon" class="text-xl text-primary-400" />
			</div>
			<h3 class="text-lg font-semibold text-white" :class="to ? 'group-hover:text-primary-300' : ''">
				{{ title }}
			</h3>
			<p class="leading-relaxed text-slate-400">{{ description }}</p>
			<slot />
		</div>
	</component>
</template>
