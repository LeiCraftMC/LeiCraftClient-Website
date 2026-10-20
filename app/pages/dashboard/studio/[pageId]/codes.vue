<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type {
	GetStudioPagesByPageIdCodesByCodeIdRedemptionsResponses,
	PutStudioPagesByPageIdCodesByCodeIdData,
} from "~/api-client";
import type { ManagedProduct, RedeemCode, StudioPage } from "~/utils/types";

type Redemption = GetStudioPagesByPageIdCodesByCodeIdRedemptionsResponses["200"]["data"][number];

const route = useRoute();
const toast = useToast();
const studioPage = useSubrouterInjectedData<StudioPage>("studio_page").inject();
const page = studioPage.data;
const pageId = page.value.id;
const { appUrl } = useRuntimeAppConfigs();

const codes = await useAPIAsyncData<RedeemCode[]>(`studio-page-${pageId}-codes`, async () => {
	const res = await useAPI((api) =>
		api.getStudioPagesByPageIdCodes({ path: { pageId }, query: { limit: 500 } }),
	);
	if (!res.success) {
		toast.add({ title: "Failed to load the codes", description: res.message, color: "error" });
		return [];
	}
	return res.data;
});

const exclusiveProducts = await useAPILazyAsyncData<ManagedProduct[]>(
	`studio-page-${pageId}-exclusive-products`,
	async () => {
		const res = await useAPI((api) =>
			api.getStudioPagesByPageIdProducts({ path: { pageId }, query: { limit: 200 } }),
		);
		return res.success ? res.data.filter((product) => product.availability === "exclusive") : [];
	},
);

const productItems = computed(() =>
	(exclusiveProducts.data.value ?? []).map((product) => ({
		label: product.name,
		value: product.id,
		icon: product.type === "cape" ? "i-lucide-flag" : "i-lucide-sparkles",
	})),
);

function codeState(code: RedeemCode): {
	label: string;
	color: "success" | "neutral" | "error" | "warning";
} {
	if (code.disabled) return { label: "Disabled", color: "error" };
	if (code.usable) return { label: "Active", color: "success" };
	if (code.expires_at && code.expires_at < Date.now()) return { label: "Expired", color: "neutral" };
	return { label: "Used up", color: "warning" };
}

function redeemLink(code: string) {
	return `${appUrl.replace(/\/$/, "")}/dashboard/inventory?code=${encodeURIComponent(code)}`;
}

async function copy(text: string, what = "Code") {
	try {
		await navigator.clipboard.writeText(text);
		toast.add({ title: `${what} copied`, icon: "i-lucide-clipboard-check", color: "success" });
	} catch {
		toast.add({
			title: "Copy failed",
			description: "Your browser blocked the clipboard.",
			color: "error",
		});
	}
}

const columns: TableColumn<RedeemCode>[] = [
	{ accessorKey: "code", header: "Code" },
	{ id: "products", header: "Items", enableSorting: false },
	{ accessorKey: "use_count", header: "Uses" },
	{ accessorKey: "expires_at", header: "Expires" },
	{ id: "state", header: "Status", enableSorting: false },
	{ accessorKey: "note", header: "Note" },
	{ id: "actions", header: "", enableSorting: false },
];

// Create
interface CreateForm {
	product_ids: number[];
	mode: "random" | "custom";
	code: string;
	count: number;
	unlimited: boolean;
	max_uses: number;
	expires: string;
	note: string;
}

const showCreate = ref(false);
const creating = ref(false);
const createForm = reactive<CreateForm>({
	product_ids: [],
	mode: "random",
	code: "",
	count: 1,
	unlimited: false,
	max_uses: 1,
	expires: "",
	note: "",
});

function openCreate(productID?: number) {
	Object.assign(createForm, {
		product_ids: productID ? [productID] : [],
		mode: "random",
		code: "",
		count: 1,
		unlimited: false,
		max_uses: 1,
		expires: "",
		note: "",
	} satisfies CreateForm);
	showCreate.value = true;
}

// `?product=<id>` comes from the product editor.
const preselected = Number(route.query.product);
if (Number.isInteger(preselected) && preselected > 0) {
	onMounted(() => openCreate(preselected));
}

const createdCodes = ref<RedeemCode[]>([]);
const showCreated = computed({
	get: () => createdCodes.value.length > 0,
	set: (value) => {
		if (!value) createdCodes.value = [];
	},
});

async function create() {
	if (!createForm.product_ids.length) return;
	if (createForm.mode === "custom" && !/^[A-Za-z0-9-]{4,32}$/.test(createForm.code.trim())) {
		toast.add({ title: "A custom code has 4–32 letters, digits or hyphens", color: "warning" });
		return;
	}

	creating.value = true;
	const res = await useAPI((api) =>
		api.postStudioPagesByPageIdCodes({
			path: { pageId },
			body: {
				product_ids: createForm.product_ids,
				...(createForm.mode === "custom"
					? { code: createForm.code.trim() }
					: { count: createForm.count }),
				max_uses: createForm.unlimited ? null : createForm.max_uses,
				expires_at: createForm.expires ? parseDateISO(createForm.expires) : null,
				note: createForm.note.trim() || undefined,
			},
		}),
	);
	creating.value = false;

	if (!res.success) {
		toast.add({ title: "Could not create the codes", description: res.message, color: "error" });
		return;
	}
	showCreate.value = false;
	createdCodes.value = res.data;
	await codes.refresh();
}

function downloadCSV(list: RedeemCode[]) {
	const quote = (value: string) => `"${value.replaceAll('"', '""')}"`;
	const rows = [
		["code", "link", "items", "max_uses", "expires_at", "note"],
		...list.map((code) => [
			code.code,
			redeemLink(code.code),
			code.products.map((product) => product.name).join(" + "),
			code.max_uses === null ? "unlimited" : String(code.max_uses),
			code.expires_at ? new Date(code.expires_at).toISOString() : "",
			code.note,
		]),
	];
	const blob = new Blob([rows.map((row) => row.map(quote).join(",")).join("\n")], {
		type: "text/csv",
	});
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = `${page.value.slug}-codes.csv`;
	link.click();
	URL.revokeObjectURL(url);
}

// Edit
const editTarget = ref<RedeemCode | null>(null);
const showEdit = computed({
	get: () => editTarget.value !== null,
	set: (value) => {
		if (!value) editTarget.value = null;
	},
});
const editForm = reactive({ unlimited: false, max_uses: 1, expires: "", note: "" });
const savingEdit = ref(false);

function openEdit(code: RedeemCode) {
	Object.assign(editForm, {
		unlimited: code.max_uses === null,
		max_uses: code.max_uses ?? Math.max(code.use_count, 1),
		expires: formatDateISO(code.expires_at),
		note: code.note,
	});
	editTarget.value = code;
}

async function updateCode(code: RedeemCode, body: PutStudioPagesByPageIdCodesByCodeIdData["body"]) {
	const res = await useAPI((api) =>
		api.putStudioPagesByPageIdCodesByCodeId({ path: { pageId, codeId: code.id }, body }),
	);
	if (!res.success) {
		toast.add({ title: "Could not update the code", description: res.message, color: "error" });
		return false;
	}
	await codes.refresh();
	return true;
}

async function saveEdit() {
	const target = editTarget.value;
	if (!target) return;
	savingEdit.value = true;
	const ok = await updateCode(target, {
		max_uses: editForm.unlimited ? null : editForm.max_uses,
		expires_at: editForm.expires ? parseDateISO(editForm.expires) : null,
		note: editForm.note.trim(),
	});
	savingEdit.value = false;
	if (ok) editTarget.value = null;
}

// Delete
const deleteTarget = ref<RedeemCode | null>(null);
const showDelete = computed({
	get: () => deleteTarget.value !== null,
	set: (value) => {
		if (!value) deleteTarget.value = null;
	},
});

async function deleteCode() {
	const target = deleteTarget.value;
	if (!target) return;
	const res = await useAPI((api) =>
		api.deleteStudioPagesByPageIdCodesByCodeId({ path: { pageId, codeId: target.id } }),
	);
	if (!res.success) {
		toast.add({ title: "Could not delete the code", description: res.message, color: "error" });
		throw new Error(res.message);
	}
	await codes.refresh();
}

// Redemptions
const redemptionsFor = ref<RedeemCode | null>(null);
const redemptions = ref<Redemption[]>([]);
const loadingRedemptions = ref(false);
const showRedemptions = computed({
	get: () => redemptionsFor.value !== null,
	set: (value) => {
		if (!value) redemptionsFor.value = null;
	},
});

async function openRedemptions(code: RedeemCode) {
	redemptionsFor.value = code;
	redemptions.value = [];
	loadingRedemptions.value = true;
	const res = await useAPI((api) =>
		api.getStudioPagesByPageIdCodesByCodeIdRedemptions({ path: { pageId, codeId: code.id } }),
	);
	loadingRedemptions.value = false;
	if (!res.success) {
		toast.add({ title: "Failed to load the redemptions", description: res.message, color: "error" });
		return;
	}
	redemptions.value = res.data;
}

function rowActions(code: RedeemCode) {
	return [
		[
			{ label: "Copy code", icon: "i-lucide-copy", onSelect: () => copy(code.code) },
			{
				label: "Copy redeem link",
				icon: "i-lucide-link",
				onSelect: () => copy(redeemLink(code.code), "Link"),
			},
		],
		[
			{ label: "Redemptions", icon: "i-lucide-users", onSelect: () => openRedemptions(code) },
			{ label: "Edit", icon: "i-lucide-pencil", onSelect: () => openEdit(code) },
			{
				label: code.disabled ? "Enable" : "Disable",
				icon: code.disabled ? "i-lucide-circle-play" : "i-lucide-circle-pause",
				onSelect: () => updateCode(code, { disabled: !code.disabled }),
			},
		],
		[
			{
				label: "Delete",
				icon: "i-lucide-trash-2",
				color: "error" as const,
				onSelect: () => (deleteTarget.value = code),
			},
		],
	];
}
</script>

<template>
	<UAlert
		v-if="!exclusiveProducts.loading.value && !productItems.length"
		color="neutral"
		variant="soft"
		icon="i-lucide-info"
		title="No exclusive items yet"
		description="Redeem codes grant exclusive items. Set an item's availability to Exclusive in its editor first."
	/>

	<DashboardDataTable
		:data="codes.data"
		:loading="codes.loading"
		:columns="columns"
		:filters="[{ column: 'code', type: 'text', placeholder: 'Search codes…' }]"
		empty-title="No redeem codes"
		empty-description="Create codes to give exclusive items to a few people."
		empty-icon="i-lucide-ticket"
		@refresh="codes.refresh()"
	>
		<template #header-right>
			<UButton
				v-if="codes.data.value.length"
				color="neutral"
				variant="ghost"
				icon="i-lucide-download"
				@click="downloadCSV(codes.data.value)"
			>
				CSV
			</UButton>
			<UButton icon="i-lucide-plus" :disabled="!productItems.length" @click="openCreate()">New codes</UButton>
		</template>

		<template #code-cell="{ row }">
			<button
				type="button"
				class="font-mono text-sm text-white hover:text-primary-300"
				title="Copy"
				@click="copy(row.original.code)"
			>
				{{ row.original.code }}
			</button>
		</template>

		<template #products-cell="{ row }">
			<div class="flex max-w-xs flex-wrap gap-1">
				<UBadge v-for="product in row.original.products" :key="product.id" color="neutral" variant="soft" size="sm">
					{{ product.name }}
				</UBadge>
			</div>
		</template>

		<template #use_count-cell="{ row }">
			<span class="text-sm text-slate-300">
				{{ row.original.use_count }} / {{ row.original.max_uses ?? "∞" }}
			</span>
		</template>

		<template #expires_at-cell="{ row }">
			<span class="text-sm text-slate-400">{{ row.original.expires_at ? formatDate(row.original.expires_at) : "Never" }}</span>
		</template>

		<template #state-cell="{ row }">
			<UBadge :color="codeState(row.original).color" variant="soft">{{ codeState(row.original).label }}</UBadge>
		</template>

		<template #note-cell="{ row }">
			<span class="line-clamp-1 max-w-48 text-sm text-slate-400">{{ row.original.note || "-" }}</span>
		</template>

		<template #actions-cell="{ row }">
			<UDropdownMenu :items="rowActions(row.original)">
				<UButton size="sm" color="neutral" variant="ghost" icon="i-lucide-ellipsis-vertical" aria-label="Actions" />
			</UDropdownMenu>
		</template>
	</DashboardDataTable>

	<!-- Create -->
	<DashboardModal v-model:open="showCreate" title="New redeem codes" icon="i-lucide-ticket">
		<form id="create-codes-form" class="space-y-4" @submit.prevent="create">
			<UFormField label="Items" required description="Everything the code grants at once (up to 20).">
				<USelectMenu
					v-model="createForm.product_ids"
					:items="productItems"
					value-key="value"
					multiple
					placeholder="Select exclusive items"
					class="w-full"
				/>
			</UFormField>

			<UFormField label="Code">
				<URadioGroup
					v-model="createForm.mode"
					orientation="horizontal"
					:items="[
						{ label: 'Random codes', value: 'random' },
						{ label: 'Custom code', value: 'custom' },
					]"
				/>
			</UFormField>
			<UFormField v-if="createForm.mode === 'custom'" label="Custom code" description="Case-insensitive, e.g. SUMMER2026">
				<UInput v-model="createForm.code" class="w-full font-mono" :maxlength="32" autocomplete="off" />
			</UFormField>
			<UFormField v-else label="How many codes" description="Each code gets its own uses.">
				<UInputNumber v-model="createForm.count" :min="1" :max="500" class="w-full" />
			</UFormField>

			<div class="grid gap-4 sm:grid-cols-2">
				<UFormField label="Uses per code">
					<div class="space-y-2">
						<UInputNumber v-model="createForm.max_uses" :min="1" :disabled="createForm.unlimited" class="w-full" />
						<UCheckbox v-model="createForm.unlimited" label="Unlimited" />
					</div>
				</UFormField>
				<UFormField label="Expires" description="Leave empty for never.">
					<UInput v-model="createForm.expires" type="datetime-local" class="w-full" />
				</UFormField>
			</div>

			<UFormField label="Note" description="Only visible to your team, e.g. who you gave the codes to.">
				<UInput v-model="createForm.note" :maxlength="200" class="w-full" />
			</UFormField>
		</form>

		<template #footer>
			<UButton color="neutral" variant="ghost" @click="showCreate = false">Cancel</UButton>
			<UButton
				type="submit"
				form="create-codes-form"
				icon="i-lucide-plus"
				:loading="creating"
				:disabled="!createForm.product_ids.length"
			>
				Create
			</UButton>
		</template>
	</DashboardModal>

	<!-- Created -->
	<DashboardModal
		v-model:open="showCreated"
		:title="createdCodes.length === 1 ? 'Code created' : `${createdCodes.length} codes created`"
		description="Players redeem them in their inventory on this website."
		icon="i-lucide-circle-check"
		icon-color="emerald"
	>
		<div class="max-h-80 space-y-2 overflow-y-auto">
			<div
				v-for="code in createdCodes"
				:key="code.id"
				class="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2"
			>
				<span class="font-mono text-sm text-white">{{ code.code }}</span>
				<div class="flex gap-1">
					<UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-copy" aria-label="Copy code" @click="copy(code.code)" />
					<UButton
						size="xs"
						color="neutral"
						variant="ghost"
						icon="i-lucide-link"
						aria-label="Copy redeem link"
						@click="copy(redeemLink(code.code), 'Link')"
					/>
				</div>
			</div>
		</div>
		<template #footer>
			<UButton
				color="neutral"
				variant="ghost"
				icon="i-lucide-copy"
				@click="copy(createdCodes.map((code) => code.code).join('\n'), 'Codes')"
			>
				Copy all
			</UButton>
			<UButton color="neutral" variant="ghost" icon="i-lucide-download" @click="downloadCSV(createdCodes)">CSV</UButton>
			<UButton @click="showCreated = false">Done</UButton>
		</template>
	</DashboardModal>

	<!-- Edit -->
	<DashboardModal v-model:open="showEdit" :title="`Edit ${editTarget?.code ?? 'code'}`" icon="i-lucide-pencil">
		<form id="edit-code-form" class="space-y-4" @submit.prevent="saveEdit">
			<div class="grid gap-4 sm:grid-cols-2">
				<UFormField label="Uses" :description="`Used ${editTarget?.use_count ?? 0} times so far.`">
					<div class="space-y-2">
						<UInputNumber v-model="editForm.max_uses" :min="1" :disabled="editForm.unlimited" class="w-full" />
						<UCheckbox v-model="editForm.unlimited" label="Unlimited" />
					</div>
				</UFormField>
				<UFormField label="Expires" description="Leave empty for never.">
					<UInput v-model="editForm.expires" type="datetime-local" class="w-full" />
				</UFormField>
			</div>
			<UFormField label="Note">
				<UInput v-model="editForm.note" :maxlength="200" class="w-full" />
			</UFormField>
		</form>
		<template #footer>
			<UButton color="neutral" variant="ghost" @click="showEdit = false">Cancel</UButton>
			<UButton type="submit" form="edit-code-form" icon="i-lucide-save" :loading="savingEdit">Save</UButton>
		</template>
	</DashboardModal>

	<!-- Redemptions -->
	<DashboardModal
		v-model:open="showRedemptions"
		:title="`Redemptions of ${redemptionsFor?.code ?? ''}`"
		icon="i-lucide-users"
		:loading="loadingRedemptions"
	>
		<ul v-if="redemptions.length" class="max-h-80 divide-y divide-slate-800 overflow-y-auto">
			<li v-for="redemption in redemptions" :key="redemption.user.id" class="flex items-center gap-3 py-2">
				<UAvatar :src="redemption.user.avatar_url" :alt="redemption.user.display_name" size="sm" />
				<span class="flex-1 truncate text-sm text-white">{{ redemption.user.display_name }}</span>
				<span class="text-xs text-slate-500">{{ formatDate(redemption.created_at) }}</span>
			</li>
		</ul>
		<p v-else class="text-sm text-slate-400">Nobody redeemed this code yet.</p>
	</DashboardModal>

	<DashboardDeleteModal
		v-model:open="showDelete"
		title="Delete code"
		:warning-text="`The code ${deleteTarget?.code ?? ''} stops working. Players who already redeemed it keep their items.`"
		:on-delete="deleteCode"
	/>
</template>
