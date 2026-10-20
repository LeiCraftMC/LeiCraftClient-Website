<script setup lang="ts">
import type { AssetRef, StudioCollection, StudioPage } from "~/utils/types";

const toast = useToast();
const studioPage = useSubrouterInjectedData<StudioPage>("studio_page").inject();
const page = studioPage.data;
const pageId = page.value.id;
const isCommunity = computed(() => page.value.category === "community");
const { imageAssetURL } = useMinecraftAssets();

const collections = await useAPIAsyncData<StudioCollection[]>(
	`studio-page-${pageId}-collections`,
	async () => {
		const res = await useAPI((api) => api.getStudioPagesByPageIdCollections({ path: { pageId } }));
		if (!res.success) {
			toast.add({ title: "Failed to load the collections", description: res.message, color: "error" });
			return [];
		}
		return res.data;
	},
);

// Create / edit
interface CollectionForm {
	name: string;
	description: string;
	preview: AssetRef | null;
	sort_order: number;
}

const editing = ref<StudioCollection | null>(null);
const showEditor = ref(false);
const saving = ref(false);
const form = reactive<CollectionForm>({ name: "", description: "", preview: null, sort_order: 0 });

function openCreate() {
	editing.value = null;
	Object.assign(form, {
		name: "",
		description: "",
		preview: null,
		sort_order: collections.data.value?.length ?? 0,
	} satisfies CollectionForm);
	showEditor.value = true;
}

/** Edits start from the values waiting for review, so a second edit doesn't lose the first. */
function openEdit(collection: StudioCollection) {
	editing.value = collection;
	const pending = collection.pending_changes ?? {};
	const previewID =
		pending.preview_asset_id !== undefined ? pending.preview_asset_id : collection.preview?.id;
	Object.assign(form, {
		name: pending.name ?? collection.name,
		description: pending.description ?? collection.description,
		preview: previewID ? { id: previewID, url: imageAssetURL(previewID) as string } : null,
		sort_order: collection.sort_order,
	} satisfies CollectionForm);
	showEditor.value = true;
}

async function save() {
	if (!form.name.trim()) return;
	saving.value = true;
	const body = {
		name: form.name.trim(),
		description: form.description,
		preview_asset_id: form.preview?.id ?? null,
		sort_order: form.sort_order,
	};
	const target = editing.value;
	const res = await useAPI((api) =>
		target
			? api.putStudioPagesByPageIdCollectionsByCollectionId({
					path: { pageId, collectionId: target.id },
					body,
				})
			: api.postStudioPagesByPageIdCollections({ path: { pageId }, body }),
	);
	saving.value = false;

	if (!res.success) {
		toast.add({ title: "Could not save the collection", description: res.message, color: "error" });
		return;
	}
	showEditor.value = false;
	toast.add({
		title: target ? "Collection saved" : "Collection created",
		description: res.data.pending_changes
			? "The changes are public once a moderator approved them."
			: undefined,
		icon: "i-lucide-check",
		color: "success",
	});
	await collections.refresh();
}

// Delete
const deleteTarget = ref<StudioCollection | null>(null);
const showDelete = computed({
	get: () => deleteTarget.value !== null,
	set: (value) => {
		if (!value) deleteTarget.value = null;
	},
});

async function deleteCollection() {
	const target = deleteTarget.value;
	if (!target) return;
	const res = await useAPI((api) =>
		api.deleteStudioPagesByPageIdCollectionsByCollectionId({
			path: { pageId, collectionId: target.id },
		}),
	);
	if (!res.success) {
		toast.add({ title: "Could not delete the collection", description: res.message, color: "error" });
		throw new Error(res.message);
	}
	await collections.refresh();
}
</script>

<template>
	<DashboardPageBody>
		<div class="flex flex-wrap items-center justify-between gap-3">
			<p class="text-sm text-slate-400">
				Group items into sets like "Summer 2026". Assign an item to a collection in its editor.
			</p>
			<UButton icon="i-lucide-plus" @click="openCreate">New collection</UButton>
		</div>

		<div v-if="collections.data.value?.length" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
			<div
				v-for="collection in collections.data.value"
				:key="collection.id"
				class="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60"
			>
				<div class="flex h-28 items-center justify-center bg-slate-950">
					<img
						v-if="collection.preview"
						:src="collection.preview.url"
						:alt="collection.name"
						class="h-full w-full object-cover"
					/>
					<UIcon v-else name="i-lucide-layers" class="text-3xl text-slate-700" />
				</div>
				<div class="space-y-3 p-4">
					<div>
						<h3 class="truncate font-medium text-white">{{ collection.name }}</h3>
						<p class="line-clamp-2 text-sm text-slate-400">
							{{ collection.description || "No description" }}
						</p>
					</div>
					<div class="flex flex-wrap gap-2">
						<UBadge color="neutral" variant="soft">
							{{ collection.product_count }} {{ collection.product_count === 1 ? "item" : "items" }}
						</UBadge>
						<UBadge v-if="collection.pending_changes" color="warning" variant="soft" icon="i-lucide-hourglass">
							Changes in review
						</UBadge>
						<UBadge v-else-if="isCommunity && !collection.reviewed_at" color="neutral" variant="soft">
							Not public yet
						</UBadge>
					</div>
					<div class="flex justify-end gap-2">
						<UButton
							size="sm"
							color="error"
							variant="ghost"
							icon="i-lucide-trash-2"
							aria-label="Delete"
							@click="deleteTarget = collection"
						/>
						<UButton size="sm" variant="soft" icon="i-lucide-pencil" @click="openEdit(collection)">Edit</UButton>
					</div>
				</div>
			</div>
		</div>

		<UEmpty
			v-else-if="!collections.loading.value"
			icon="i-lucide-layers"
			title="No collections"
			description="Collections are optional — use them to group items that belong together."
		/>
	</DashboardPageBody>

	<DashboardModal
		v-model:open="showEditor"
		:title="editing ? 'Edit collection' : 'New collection'"
		:description="isCommunity && editing?.reviewed_at ? 'Changes are public once a moderator approved them.' : undefined"
		icon="i-lucide-layers"
	>
		<form id="collection-form" class="space-y-4" @submit.prevent="save">
			<UFormField label="Name" required>
				<UInput v-model="form.name" class="w-full" :maxlength="64" />
			</UFormField>
			<UFormField label="Description">
				<UTextarea v-model="form.description" :rows="3" class="w-full" :maxlength="2000" />
			</UFormField>
			<UFormField label="Cover image">
				<StudioAssetUpload
					kind="image"
					:url="form.preview?.url"
					clearable
					@uploaded="form.preview = $event"
					@cleared="form.preview = null"
				/>
			</UFormField>
			<UFormField label="Sort order" description="Lower numbers come first.">
				<UInputNumber v-model="form.sort_order" class="w-full" />
			</UFormField>
		</form>

		<template #footer>
			<UButton color="neutral" variant="ghost" @click="showEditor = false">Cancel</UButton>
			<UButton type="submit" form="collection-form" icon="i-lucide-save" :loading="saving" :disabled="!form.name.trim()">
				{{ editing ? "Save" : "Create" }}
			</UButton>
		</template>
	</DashboardModal>

	<DashboardDeleteModal
		v-model:open="showDelete"
		title="Delete collection"
		:warning-text="`The items of ${deleteTarget?.name ?? 'this collection'} are kept and no longer belong to a collection.`"
		:on-delete="deleteCollection"
	/>
</template>
