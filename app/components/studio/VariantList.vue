<script setup lang="ts">
/**
 * Variants of a cosmetic: one Blockbench model + texture per skin model. Each row keeps its own
 * draft and saves on its own; `changed` tells the editor to reload the product.
 */
import type { AssetRef, ManagedProduct } from "~/utils/types";

type VariantSkinModel = ManagedProduct["variants"][number]["skin_model"];

interface VariantDraft {
	id: number | null;
	name: string;
	skin_model: VariantSkinModel;
	model: AssetRef | null;
	texture: AssetRef | null;
	sort_order: number;
}

const MAX_VARIANTS = 8;

const props = defineProps<{
	pageId: number;
	product: ManagedProduct;
	disabled?: boolean;
}>();

const emit = defineEmits<{ changed: [] }>();

/** The variant shown in the 3D preview. */
const previewVariantId = defineModel<number | null>("previewVariantId", { default: null });

const toast = useToast();

const skinModelItems: Array<{ label: string; value: VariantSkinModel }> = [
	{ label: SKIN_MODEL_LABELS.any, value: "any" },
	{ label: SKIN_MODEL_LABELS.wide, value: "wide" },
	{ label: SKIN_MODEL_LABELS.slim, value: "slim" },
];

function toDraft(variant: ManagedProduct["variants"][number]): VariantDraft {
	return {
		id: variant.id,
		name: variant.name,
		skin_model: variant.skin_model,
		model: variant.model,
		texture: variant.texture,
		sort_order: variant.sort_order,
	};
}

function emptyDraft(): VariantDraft {
	const used = new Set(props.product.variants.map((variant) => variant.skin_model));
	const skinModel: VariantSkinModel = used.size === 0 ? "any" : used.has("wide") ? "slim" : "wide";
	return {
		id: null,
		name: props.product.variants.length === 0 ? "Default" : SKIN_MODEL_LABELS[skinModel],
		skin_model: skinModel,
		model: null,
		texture: null,
		sort_order: props.product.variants.length,
	};
}

const drafts = ref<VariantDraft[]>([]);
const newDraft = ref<VariantDraft | null>(null);
const saving = ref<number | "new" | null>(null);

watch(
	() => props.product.variants,
	(variants) => {
		drafts.value = variants.map(toDraft);
		if (previewVariantId.value !== null && !variants.some((v) => v.id === previewVariantId.value)) {
			previewVariantId.value = null;
		}
	},
	{ immediate: true },
);

function isDirty(draft: VariantDraft) {
	const original = props.product.variants.find((variant) => variant.id === draft.id);
	if (!original) return false;
	return (
		draft.name !== original.name ||
		draft.skin_model !== original.skin_model ||
		draft.model?.id !== original.model.id ||
		draft.texture?.id !== original.texture.id ||
		draft.sort_order !== original.sort_order
	);
}

async function save(draft: VariantDraft) {
	const { id: variantId, model, texture } = draft;
	if (variantId === null || !model || !texture) return;
	saving.value = variantId;
	const res = await useAPI((api) =>
		api.putStudioPagesByPageIdProductsByProductIdVariantsByVariantId({
			path: { pageId: props.pageId, productId: props.product.id, variantId },
			body: {
				name: draft.name.trim(),
				skin_model: draft.skin_model,
				model_asset_id: model.id,
				texture_asset_id: texture.id,
				sort_order: draft.sort_order,
			},
		}),
	);
	saving.value = null;

	if (!res.success) {
		toast.add({ title: "Could not save the variant", description: res.message, color: "error" });
		return;
	}
	toast.add({ title: "Variant saved", icon: "i-lucide-check", color: "success" });
	emit("changed");
}

async function create() {
	const draft = newDraft.value;
	const model = draft?.model;
	const texture = draft?.texture;
	if (!draft || !model || !texture || !draft.name.trim()) return;
	saving.value = "new";
	const res = await useAPI((api) =>
		api.postStudioPagesByPageIdProductsByProductIdVariants({
			path: { pageId: props.pageId, productId: props.product.id },
			body: {
				name: draft.name.trim(),
				skin_model: draft.skin_model,
				model_asset_id: model.id,
				texture_asset_id: texture.id,
				sort_order: draft.sort_order,
			},
		}),
	);
	saving.value = null;

	if (!res.success) {
		toast.add({ title: "Could not add the variant", description: res.message, color: "error" });
		return;
	}
	newDraft.value = null;
	toast.add({ title: "Variant added", icon: "i-lucide-check", color: "success" });
	emit("changed");
}

// Delete
const deleteTarget = ref<VariantDraft | null>(null);
const showDelete = computed({
	get: () => deleteTarget.value !== null,
	set: (value) => {
		if (!value) deleteTarget.value = null;
	},
});
const deleting = ref(false);

async function confirmDelete() {
	const target = deleteTarget.value;
	if (!target || target.id === null) return;
	deleting.value = true;
	const res = await useAPI((api) =>
		api.deleteStudioPagesByPageIdProductsByProductIdVariantsByVariantId({
			path: { pageId: props.pageId, productId: props.product.id, variantId: target.id as number },
		}),
	);
	deleting.value = false;

	if (!res.success) {
		toast.add({ title: "Could not delete the variant", description: res.message, color: "error" });
		return;
	}
	deleteTarget.value = null;
	emit("changed");
}
</script>

<template>
	<div class="space-y-4">
		<p v-if="!drafts.length && !newDraft" class="text-sm text-slate-400">
			A cosmetic needs at least one variant. Add one model per skin type if it must fit wide (Steve) and slim (Alex)
			arms differently — the client picks the matching one automatically.
		</p>

		<div
			v-for="draft in drafts"
			:key="draft.id ?? 'new'"
			:class="[
				'space-y-4 rounded-lg border p-4',
				previewVariantId === draft.id ? 'border-primary-400/60 bg-primary-500/5' : 'border-slate-800',
			]"
		>
			<div class="grid gap-4 sm:grid-cols-[1fr_12rem_6rem]">
				<UFormField label="Name">
					<UInput v-model="draft.name" class="w-full" :maxlength="32" :disabled="disabled" />
				</UFormField>
				<UFormField label="Fits">
					<USelect v-model="draft.skin_model" :items="skinModelItems" class="w-full" :disabled="disabled" />
				</UFormField>
				<UFormField label="Order">
					<UInputNumber v-model="draft.sort_order" class="w-full" :disabled="disabled" />
				</UFormField>
			</div>
			<div class="grid gap-4 sm:grid-cols-2">
				<UFormField label="Model">
					<StudioAssetUpload
						kind="cosmetic_model"
						:url="draft.model?.url"
						:disabled="disabled"
						@uploaded="draft.model = $event"
					/>
				</UFormField>
				<UFormField label="Texture">
					<StudioAssetUpload
						kind="cosmetic_texture"
						:url="draft.texture?.url"
						:disabled="disabled"
						@uploaded="draft.texture = $event"
					/>
				</UFormField>
			</div>
			<div class="flex flex-wrap justify-end gap-2">
				<UButton
					size="sm"
					color="neutral"
					:variant="previewVariantId === draft.id ? 'soft' : 'ghost'"
					icon="i-lucide-eye"
					@click="previewVariantId = previewVariantId === draft.id ? null : draft.id"
				>
					{{ previewVariantId === draft.id ? "Previewing" : "Preview" }}
				</UButton>
				<UButton
					size="sm"
					color="error"
					variant="ghost"
					icon="i-lucide-trash-2"
					:disabled="disabled"
					@click="deleteTarget = draft"
				>
					Delete
				</UButton>
				<UButton
					size="sm"
					icon="i-lucide-save"
					:loading="saving === draft.id"
					:disabled="disabled || !isDirty(draft) || !draft.name.trim()"
					@click="save(draft)"
				>
					Save variant
				</UButton>
			</div>
		</div>

		<div v-if="newDraft" class="space-y-4 rounded-lg border border-dashed border-primary-400/50 p-4">
			<div class="grid gap-4 sm:grid-cols-[1fr_12rem_6rem]">
				<UFormField label="Name" required>
					<UInput v-model="newDraft.name" class="w-full" :maxlength="32" />
				</UFormField>
				<UFormField label="Fits">
					<USelect v-model="newDraft.skin_model" :items="skinModelItems" class="w-full" />
				</UFormField>
				<UFormField label="Order">
					<UInputNumber v-model="newDraft.sort_order" class="w-full" />
				</UFormField>
			</div>
			<div class="grid gap-4 sm:grid-cols-2">
				<UFormField label="Model" required>
					<StudioAssetUpload kind="cosmetic_model" :url="newDraft.model?.url" @uploaded="newDraft.model = $event" />
				</UFormField>
				<UFormField label="Texture" required>
					<StudioAssetUpload
						kind="cosmetic_texture"
						:url="newDraft.texture?.url"
						@uploaded="newDraft.texture = $event"
					/>
				</UFormField>
			</div>
			<div class="flex justify-end gap-2">
				<UButton size="sm" color="neutral" variant="ghost" @click="newDraft = null">Cancel</UButton>
				<UButton
					size="sm"
					icon="i-lucide-plus"
					:loading="saving === 'new'"
					:disabled="!newDraft.name.trim() || !newDraft.model || !newDraft.texture"
					@click="create"
				>
					Add variant
				</UButton>
			</div>
		</div>

		<UButton
			v-else-if="drafts.length < MAX_VARIANTS"
			variant="soft"
			icon="i-lucide-plus"
			:disabled="disabled"
			@click="newDraft = emptyDraft()"
		>
			Add variant
		</UButton>
		<p v-else class="text-xs text-slate-500">A cosmetic can have up to {{ MAX_VARIANTS }} variants.</p>

		<DashboardModal v-model:open="showDelete" title="Delete variant" icon="i-lucide-trash-2" icon-color="error">
			<p class="text-sm text-slate-300">
				Delete the variant <strong class="text-white">{{ deleteTarget?.name }}</strong>? Players who pinned it fall
				back to the automatic pick.
			</p>
			<template #footer>
				<UButton color="neutral" variant="ghost" @click="showDelete = false">Cancel</UButton>
				<UButton color="error" icon="i-lucide-trash-2" :loading="deleting" @click="confirmDelete">Delete</UButton>
			</template>
		</DashboardModal>
	</div>
</template>
