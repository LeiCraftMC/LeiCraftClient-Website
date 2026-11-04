<script setup lang="ts">
/**
 * Markdown input for a release changelog with a live preview rendered exactly like the download
 * page (ReleaseChangelog). Side by side on wide screens, tabs on narrow ones.
 */
withDefaults(
	defineProps<{
		placeholder?: string;
		rows?: number;
		disabled?: boolean;
	}>(),
	{
		placeholder: "## New\n\n- …\n\n## Fixes\n\n- …",
		rows: 14,
		disabled: false,
	},
);

const model = defineModel<string>({ required: true });

const tab = ref<"write" | "preview">("write");
const tabItems = [
	{ label: "Write", value: "write", icon: "i-lucide-pencil" },
	{ label: "Preview", value: "preview", icon: "i-lucide-eye" },
];
</script>

<template>
	<div class="space-y-2">
		<div class="flex items-center gap-3 lg:hidden">
			<UTabs v-model="tab" :items="tabItems" :content="false" variant="pill" size="xs" />
		</div>

		<div class="grid gap-3 lg:grid-cols-2">
			<div :class="tab === 'write' ? 'block' : 'hidden lg:block'">
				<UTextarea
					v-model="model"
					:placeholder="placeholder"
					:rows="rows"
					:disabled="disabled"
					autoresize
					:maxrows="40"
					class="w-full font-mono"
				/>
				<p class="mt-1 flex items-center gap-1 text-xs text-slate-500">
					<UIcon name="i-lucide-file-text" class="size-3.5" />
					Markdown — headings, lists, links, code and tables.
				</p>
			</div>

			<div
				:class="[
					tab === 'preview' ? 'block' : 'hidden lg:block',
					'min-h-32 rounded-lg border border-slate-800 bg-slate-950/60 p-4',
				]"
			>
				<p class="mb-3 text-xs font-medium tracking-wide text-slate-500 uppercase">Preview</p>
				<ReleaseChangelog :markdown="model" />
			</div>
		</div>
	</div>
</template>
