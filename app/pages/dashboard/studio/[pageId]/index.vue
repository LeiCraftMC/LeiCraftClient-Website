<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { ManagedProduct, StudioPage } from "~/utils/types";

const toast = useToast();
const studioPage = useSubrouterInjectedData<StudioPage>("studio_page").inject();
const page = studioPage.data;
const pageId = page.value.id;

const products = await useAPIAsyncData<ManagedProduct[]>(
	`studio-page-${pageId}-products`,
	async () => {
		const res = await useAPI((api) =>
			api.getStudioPagesByPageIdProducts({ path: { pageId }, query: { limit: 200 } }),
		);
		if (!res.success) {
			toast.add({ title: "Failed to load items", description: res.message, color: "error" });
			return [];
		}
		return res.data;
	},
);

const columns: TableColumn<ManagedProduct>[] = [
	{ accessorKey: "name", header: "Item" },
	{ accessorKey: "type", header: "Type" },
	{ accessorKey: "status", header: "Status" },
	{ accessorKey: "availability", header: "Availability" },
	{ accessorKey: "updated_at", header: "Updated" },
	{ id: "actions", header: "", enableSorting: false },
];

const statusOptions = [
	{ label: "Draft", value: "draft" },
	{ label: "In review", value: "pending_review" },
	{ label: "Published", value: "published" },
	{ label: "Rejected", value: "rejected" },
	{ label: "Taken down", value: "disabled" },
];

// Create
const showCreate = ref(false);
const creating = ref(false);
const createForm = reactive({ type: "cape" as "cape" | "cosmetic", name: "" });

async function create() {
	if (!createForm.name.trim()) return;
	creating.value = true;
	const res = await useAPI((api) =>
		api.postStudioPagesByPageIdProducts({
			path: { pageId },
			body: { type: createForm.type, name: createForm.name.trim() },
		}),
	);
	creating.value = false;

	if (!res.success) {
		toast.add({ title: "Could not create the item", description: res.message, color: "error" });
		return;
	}
	showCreate.value = false;
	createForm.name = "";
	await navigateTo(`/dashboard/studio/${pageId}/products/${res.data.id}`);
}
</script>

<template>
	<DashboardDataTable
		:data="products.data"
		:loading="products.loading"
		:columns="columns"
		:filters="[
			{ column: 'name', type: 'text', placeholder: 'Search items…' },
			{ column: 'status', type: 'select', placeholder: 'All statuses', options: statusOptions },
		]"
		empty-title="No items yet"
		empty-description="Create a cape or cosmetic to get started."
		empty-icon="i-lucide-package"
		@refresh="products.refresh()"
	>
		<template #header-right>
			<UButton icon="i-lucide-plus" @click="showCreate = true">New item</UButton>
		</template>

		<template #name-cell="{ row }">
			<NuxtLink
				:to="`/dashboard/studio/${pageId}/products/${row.original.id}`"
				class="flex items-center gap-3 hover:text-primary-300"
			>
				<div class="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded bg-slate-800">
					<img v-if="row.original.preview" :src="row.original.preview.url" alt="" class="h-full w-full object-contain" />
					<SkinCapePreview
						v-else-if="row.original.texture"
						:texture="row.original.texture.url"
						class="h-8"
					/>
					<UIcon v-else :name="row.original.type === 'cape' ? 'i-lucide-flag' : 'i-lucide-sparkles'" class="text-slate-500" />
				</div>
				<span class="font-medium text-white">{{ row.original.name }}</span>
			</NuxtLink>
		</template>

		<template #type-cell="{ row }">
			<span class="capitalize text-slate-300">{{ row.original.type }}</span>
		</template>

		<template #status-cell="{ row }">
			<StudioStatusBadge :status="row.original.status" />
		</template>

		<template #availability-cell="{ row }">
			<UBadge
				:color="row.original.availability === 'exclusive' ? 'warning' : 'neutral'"
				variant="soft"
				class="capitalize"
			>
				{{ row.original.availability }}
			</UBadge>
		</template>

		<template #updated_at-cell="{ row }">
			<span class="text-sm text-slate-400">{{ formatDate(row.original.updated_at) }}</span>
		</template>

		<template #actions-cell="{ row }">
			<UButton
				size="sm"
				color="neutral"
				variant="ghost"
				icon="i-lucide-pencil"
				:to="`/dashboard/studio/${pageId}/products/${row.original.id}`"
				aria-label="Edit"
			/>
		</template>
	</DashboardDataTable>

	<DashboardModal v-model:open="showCreate" title="New item" icon="i-lucide-plus">
		<form id="create-product-form" class="space-y-4" @submit.prevent="create">
			<UFormField label="Type">
				<URadioGroup
					v-model="createForm.type"
					orientation="horizontal"
					:items="[
						{ label: 'Cape', value: 'cape', description: 'A 2:1 PNG texture' },
						{ label: 'Cosmetic', value: 'cosmetic', description: 'A Blockbench model + texture' },
					]"
				/>
			</UFormField>
			<UFormField label="Name" required>
				<UInput v-model="createForm.name" class="w-full" :maxlength="64" autofocus />
			</UFormField>
		</form>

		<template #footer>
			<UButton color="neutral" variant="ghost" @click="showCreate = false">Cancel</UButton>
			<UButton
				type="submit"
				form="create-product-form"
				icon="i-lucide-plus"
				:loading="creating"
				:disabled="!createForm.name.trim()"
			>
				Create
			</UButton>
		</template>
	</DashboardModal>
</template>
