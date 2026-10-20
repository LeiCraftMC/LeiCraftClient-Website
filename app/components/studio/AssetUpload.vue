<script setup lang="ts">
/**
 * File picker that uploads to `POST /studio/assets` and emits the new asset id. The API checks
 * the file per kind (cape texture 2:1, cosmetic model JSON, …) and may return warnings, which are
 * shown as a toast.
 */
import type { PostStudioAssetsData } from "~/api-client";

type Kind = PostStudioAssetsData["body"]["kind"];

const props = withDefaults(
	defineProps<{
		kind: Kind;
		/** Current asset URL (for the preview). */
		url?: string | null;
		label?: string;
		disabled?: boolean;
		/** Show a "Remove" button (emits `cleared`). */
		clearable?: boolean;
	}>(),
	{ url: null, label: undefined, disabled: false, clearable: false },
);

const emit = defineEmits<{
	uploaded: [asset: { id: string; url: string }];
	cleared: [];
}>();

const toast = useToast();
const input = ref<HTMLInputElement | null>(null);
const uploading = ref(false);

const accept = computed(() =>
	props.kind === "cosmetic_model" ? ".cfg,.json,application/json" : "image/png",
);

const hint = computed(
	() =>
		({
			cape_texture: "PNG, 2:1 (64×32 up to 2048×1024)",
			cosmetic_texture: "PNG, up to 1024×1024",
			cosmetic_model: "Blockbench OptiFine model export (.cfg / .json)",
			image: "PNG, up to 2048×2048",
		})[props.kind],
);

async function onFile(event: Event) {
	const file = (event.target as HTMLInputElement).files?.[0];
	if (input.value) input.value.value = "";
	if (!file) return;

	uploading.value = true;
	const res = await useAPI((api) => api.postStudioAssets({ body: { file, kind: props.kind } }));
	uploading.value = false;

	if (!res.success) {
		toast.add({
			title: "Upload failed",
			description: res.message,
			icon: "i-lucide-alert-circle",
			color: "error",
		});
		return;
	}

	for (const warning of res.data.warnings) {
		toast.add({ title: "Note", description: warning, icon: "i-lucide-info", color: "warning" });
	}
	emit("uploaded", { id: res.data.asset.id, url: res.data.asset.url });
}
</script>

<template>
	<div class="flex items-center gap-3">
		<div
			v-if="kind !== 'cosmetic_model'"
			class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-800 bg-slate-900"
		>
			<SkinCapePreview v-if="url && kind === 'cape_texture'" :texture="url" class="h-12" />
			<img
				v-else-if="url"
				:src="url"
				alt=""
				class="h-full w-full object-contain"
				style="image-rendering: pixelated"
			/>
			<UIcon v-else name="i-lucide-image" class="text-xl text-slate-600" />
		</div>
		<div
			v-else
			class="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-slate-800 bg-slate-900"
		>
			<UIcon
				:name="url ? 'i-lucide-file-check-2' : 'i-lucide-file-code-2'"
				:class="['text-2xl', url ? 'text-emerald-400' : 'text-slate-600']"
			/>
		</div>

		<div class="min-w-0 space-y-1">
			<div class="flex flex-wrap gap-2">
				<UButton
					size="sm"
					variant="soft"
					icon="i-lucide-upload"
					:loading="uploading"
					:disabled="disabled"
					@click="input?.click()"
				>
					{{ label ?? (url ? "Replace" : "Upload") }}
				</UButton>
				<UButton
					v-if="url && clearable"
					size="sm"
					color="neutral"
					variant="ghost"
					icon="i-lucide-x"
					:disabled="disabled"
					@click="emit('cleared')"
				>
					Remove
				</UButton>
			</div>
			<p class="text-xs text-slate-500">{{ hint }}</p>
		</div>

		<input ref="input" type="file" class="hidden" :accept="accept" @change="onFile" />
	</div>
</template>
