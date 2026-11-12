<script setup lang="ts">
/** Where the mod runs: loaders, launchers and clients with their status, each linking to its guide. */
import { COMPATIBILITY_STATUS, compatibility } from "~/data/marketing";
</script>

<template>
	<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
		<NuxtLink
			v-for="entry in compatibility"
			:key="entry.name"
			:to="entry.to"
			class="group flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/50 p-4 transition hover:-translate-y-0.5 hover:border-primary-400/50"
		>
			<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-500/10">
				<UIcon :name="entry.icon" class="text-lg text-primary-400" />
			</div>
			<div class="min-w-0">
				<p class="truncate font-medium text-white group-hover:text-primary-300">{{ entry.name }}</p>
				<p class="flex items-center gap-2 text-xs text-slate-500">
					{{ entry.kind }}
					<UBadge
						:color="COMPATIBILITY_STATUS[entry.status].color"
						variant="soft"
						size="sm"
						:title="COMPATIBILITY_STATUS[entry.status].hint"
					>
						{{ COMPATIBILITY_STATUS[entry.status].label }}
					</UBadge>
				</p>
			</div>
		</NuxtLink>
	</div>
</template>
