<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { watchDebounced } from "@vueuse/core";
import type { CategoryID, ModerationPage } from "~/utils/types";

definePageMeta({
	layout: "dashboard",
});

useSeoMeta({
	title: "Pages | Moderation | LeiCraft Client",
	description: "Review and hide shop pages",
});

const route = useRoute();
const toast = useToast();
const { imageAssetURL } = useMinecraftAssets();

const filters = reactive<{
	needsReview: boolean;
	category: CategoryID | "all";
	status: "all" | "active" | "hidden";
	search: string;
}>({
	needsReview: route.query.review === "1",
	category: "all",
	status: "all",
	search: "",
});

const categoryItems = [
	{ label: "All categories", value: "all" as const },
	...CATEGORY_IDS.map((id) => ({ label: CATEGORY_INFO[id].label, value: id })),
];
const statusItems = [
	{ label: "Any status", value: "all" as const },
	{ label: "Active", value: "active" as const },
	{ label: "Hidden", value: "hidden" as const },
];

const pages = await useAPIAsyncData<ModerationPage[]>("moderation-pages", async () => {
	const res = await useAPI((api) =>
		api.getModerationPages({
			query: {
				needs_review: filters.needsReview ? "true" : undefined,
				category: filters.category === "all" ? undefined : filters.category,
				status: filters.status === "all" ? undefined : filters.status,
				search: filters.search.trim() || undefined,
				limit: 100,
			},
		}),
	);
	if (!res.success) {
		toast.add({ title: "Failed to load the pages", description: res.message, color: "error" });
		return [];
	}
	return res.data;
});

watch(
	() => [filters.needsReview, filters.category, filters.status],
	() => pages.refresh(),
);
watchDebounced(
	() => filters.search,
	() => pages.refresh(),
	{ debounce: 300 },
);

const columns: TableColumn<ModerationPage>[] = [
	{ accessorKey: "name", header: "Page" },
	{ accessorKey: "category", header: "Category" },
	{ id: "owners", header: "Owners", enableSorting: false },
	{ id: "state", header: "Status", enableSorting: false },
	{ accessorKey: "updated_at", header: "Updated" },
	{ id: "actions", header: "", enableSorting: false },
];

function needsReview(page: ModerationPage) {
	return page.review_requested_at !== null;
}

// Detail
const selected = ref<ModerationPage | null>(null);
const showDetail = computed({
	get: () => selected.value !== null,
	set: (value) => {
		if (!value) selected.value = null;
	},
});

async function openPage(pageId: number) {
	const res = await useAPI((api) => api.getModerationPagesByPageId({ path: { pageId } }));
	if (!res.success) {
		toast.add({ title: "Failed to load the page", description: res.message, color: "error" });
		return;
	}
	selected.value = res.data;
}

// `?page=<id>` comes from the review queue.
const deepLinked = Number(route.query.page);
if (Number.isInteger(deepLinked) && deepLinked > 0) {
	onMounted(() => openPage(deepLinked));
}

interface ChangeRow {
	field: string;
	current: string;
	proposed: string;
	image?: { current: string | null; proposed: string | null };
}

const changeRows = computed<ChangeRow[]>(() => {
	const page = selected.value;
	const pending = page?.pending_changes;
	if (!page || !pending) return [];

	const rows: ChangeRow[] = [];
	if (pending.name !== undefined)
		rows.push({ field: "Name", current: page.name, proposed: pending.name });
	if (pending.slug !== undefined)
		rows.push({ field: "Slug", current: page.slug, proposed: pending.slug });
	if (pending.description !== undefined) {
		rows.push({ field: "Description", current: page.description, proposed: pending.description });
	}
	if (pending.icon_asset_id !== undefined) {
		rows.push({
			field: "Icon",
			current: "",
			proposed: "",
			image: { current: page.icon?.url ?? null, proposed: imageAssetURL(pending.icon_asset_id) },
		});
	}
	if (pending.banner_asset_id !== undefined) {
		rows.push({
			field: "Banner",
			current: "",
			proposed: "",
			image: { current: page.banner?.url ?? null, proposed: imageAssetURL(pending.banner_asset_id) },
		});
	}
	return rows;
});

const acting = ref(false);

async function afterAction(pageId: number) {
	await pages.refresh();
	await openPage(pageId);
}

async function approve() {
	const page = selected.value;
	if (!page) return;
	acting.value = true;
	const res = await useAPI((api) =>
		api.postModerationPagesByPageIdApprove({
			path: { pageId: page.id },
			body: { updated_at: page.updated_at },
		}),
	);
	acting.value = false;

	if (!res.success) {
		toast.add({ title: "Approval failed", description: res.message, color: "error" });
		if ((res.code as number) === 409) await afterAction(page.id);
		return;
	}
	toast.add({ title: `${page.name} approved`, icon: "i-lucide-check", color: "success" });
	await afterAction(page.id);
}

async function unhide() {
	const page = selected.value;
	if (!page) return;
	acting.value = true;
	const res = await useAPI((api) =>
		api.postModerationPagesByPageIdUnhide({ path: { pageId: page.id } }),
	);
	acting.value = false;

	if (!res.success) {
		toast.add({ title: "Could not unhide the page", description: res.message, color: "error" });
		return;
	}
	toast.add({ title: `${page.name} is visible again`, icon: "i-lucide-eye", color: "success" });
	await afterAction(page.id);
}

const reasonAction = ref<"reject" | "hide" | null>(null);
const showReason = computed({
	get: () => reasonAction.value !== null,
	set: (value) => {
		if (!value) reasonAction.value = null;
	},
});

async function onReason(reason: string) {
	const page = selected.value;
	const action = reasonAction.value;
	if (!page || !action) return false;

	const res = await useAPI((api) =>
		action === "reject"
			? api.postModerationPagesByPageIdReject({ path: { pageId: page.id }, body: { reason } })
			: api.postModerationPagesByPageIdHide({ path: { pageId: page.id }, body: { reason } }),
	);
	if (!res.success) {
		toast.add({
			title: action === "reject" ? "Reject failed" : "Could not hide the page",
			description: res.message,
			color: "error",
		});
		return false;
	}
	toast.add({
		title: action === "reject" ? "Changes rejected" : `${page.name} hidden`,
		icon: "i-lucide-check",
		color: "success",
	});
	await afterAction(page.id);
	return true;
}
</script>

<template>
	<UDashboardPanel>
		<template #header>
			<DashboardPageHeader title="Pages" icon="i-lucide-store" description="Community page reviews and hidden pages" />
		</template>

		<template #body>
			<DashboardDataTable
				:data="pages.data"
				:loading="pages.loading"
				:columns="columns"
				empty-title="No pages"
				:empty-description="filters.needsReview ? 'No page profile waits for review.' : 'No page matches the filters.'"
				empty-icon="i-lucide-store"
				@refresh="pages.refresh()"
			>
				<template #header-left>
					<div class="flex flex-wrap items-center gap-2">
						<UInput v-model="filters.search" icon="i-lucide-search" placeholder="Search name or slug…" class="w-56" />
						<USelect v-model="filters.category" :items="categoryItems" class="w-44" />
						<USelect v-model="filters.status" :items="statusItems" class="w-36" />
						<USwitch v-model="filters.needsReview" label="Needs review" />
					</div>
				</template>

				<template #name-cell="{ row }">
					<button type="button" class="flex items-center gap-3 text-left" @click="openPage(row.original.id)">
						<div class="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded bg-slate-800">
							<img v-if="row.original.icon" :src="row.original.icon.url" alt="" class="h-full w-full object-cover" />
							<UIcon v-else :name="CATEGORY_INFO[row.original.category].icon" class="text-slate-500" />
						</div>
						<div class="min-w-0">
							<p class="truncate font-medium text-white hover:text-primary-300">{{ row.original.name }}</p>
							<p class="truncate text-xs text-slate-500">/{{ row.original.slug }} · #{{ row.original.id }}</p>
						</div>
					</button>
				</template>

				<template #category-cell="{ row }">
					<span class="text-sm text-slate-300">{{ CATEGORY_INFO[row.original.category].short }}</span>
				</template>

				<template #owners-cell="{ row }">
					<UAvatarGroup v-if="row.original.owners.length" size="xs" :max="3">
						<UAvatar
							v-for="owner in row.original.owners"
							:key="owner.id"
							:src="owner.avatar_url"
							:alt="owner.display_name"
						/>
					</UAvatarGroup>
					<span v-else class="text-sm text-slate-500">-</span>
				</template>

				<template #state-cell="{ row }">
					<div class="flex flex-wrap gap-1">
						<UBadge v-if="row.original.status === 'hidden'" color="error" variant="soft" icon="i-lucide-eye-off">Hidden</UBadge>
						<UBadge v-if="needsReview(row.original)" color="warning" variant="soft" icon="i-lucide-hourglass">
							Review
						</UBadge>
						<UBadge
							v-else-if="row.original.category === 'community' && !row.original.reviewed_at"
							color="neutral"
							variant="soft"
						>
							Never approved
						</UBadge>
						<UBadge v-if="row.original.status === 'active' && !needsReview(row.original)" color="success" variant="soft">
							Active
						</UBadge>
					</div>
				</template>

				<template #updated_at-cell="{ row }">
					<span class="text-sm text-slate-400">{{ formatDate(row.original.updated_at) }}</span>
				</template>

				<template #actions-cell="{ row }">
					<UButton size="sm" color="neutral" variant="ghost" icon="i-lucide-chevron-right" aria-label="Open" @click="openPage(row.original.id)" />
				</template>
			</DashboardDataTable>
		</template>
	</UDashboardPanel>

	<USlideover v-model:open="showDetail" :title="selected?.name ?? 'Page'" :ui="{ content: 'sm:max-w-2xl' }">
		<template #body>
			<div v-if="selected" class="space-y-6">
				<div class="flex items-start gap-4">
					<div class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-800">
						<img v-if="selected.icon" :src="selected.icon.url" alt="" class="h-full w-full object-cover" />
						<UIcon v-else :name="CATEGORY_INFO[selected.category].icon" class="text-2xl text-slate-500" />
					</div>
					<div class="min-w-0 flex-1 space-y-1">
						<p class="text-sm text-slate-400">{{ CATEGORY_INFO[selected.category].label }} · /{{ selected.slug }} · #{{ selected.id }}</p>
						<p class="text-sm text-slate-400">
							Owners:
							<template v-if="selected.owners.length">
								{{ selected.owners.map((owner) => `${owner.display_name} (#${owner.id})`).join(", ") }}
							</template>
							<template v-else>none</template>
						</p>
						<p class="text-sm text-slate-400">Approved: {{ formatDate(selected.reviewed_at) }}</p>
					</div>
					<UButton
						v-if="selected.status === 'active' && (selected.category !== 'community' || selected.reviewed_at)"
						:to="shopPagePath(selected)"
						target="_blank"
						color="neutral"
						variant="ghost"
						icon="i-lucide-external-link"
						aria-label="Open in shop"
					/>
				</div>

				<UAlert
					v-if="selected.status === 'hidden'"
					color="error"
					variant="soft"
					icon="i-lucide-eye-off"
					title="Hidden"
					:description="selected.status_note ?? undefined"
				/>

				<p class="whitespace-pre-line text-sm text-slate-300">{{ selected.description || "No description" }}</p>

				<!-- Pending profile -->
				<div v-if="needsReview(selected)" class="space-y-4">
					<h3 class="font-medium text-white">Waiting for review</h3>

					<p v-if="!selected.reviewed_at" class="text-sm text-slate-400">
						This page was never approved. Approving makes the page, its collections and its approved items public.
					</p>

					<div v-if="changeRows.length" class="overflow-hidden rounded-lg border border-slate-800">
						<div
							v-for="row in changeRows"
							:key="row.field"
							class="grid gap-3 border-b border-slate-800 p-3 last:border-0 sm:grid-cols-[6rem_1fr_1fr]"
						>
							<span class="text-sm font-medium text-slate-300">{{ row.field }}</span>
							<template v-if="row.image">
								<div>
									<p class="mb-1 text-xs text-slate-500">Current</p>
									<img v-if="row.image.current" :src="row.image.current" alt="" class="max-h-24 rounded" />
									<span v-else class="text-sm text-slate-500">none</span>
								</div>
								<div>
									<p class="mb-1 text-xs text-amber-400">Proposed</p>
									<img v-if="row.image.proposed" :src="row.image.proposed" alt="" class="max-h-24 rounded" />
									<span v-else class="text-sm text-slate-500">removed</span>
								</div>
							</template>
							<template v-else>
								<div>
									<p class="mb-1 text-xs text-slate-500">Current</p>
									<p class="whitespace-pre-line text-sm text-slate-400">{{ row.current || "—" }}</p>
								</div>
								<div>
									<p class="mb-1 text-xs text-amber-400">Proposed</p>
									<p class="whitespace-pre-line text-sm text-white">{{ row.proposed || "—" }}</p>
								</div>
							</template>
						</div>
					</div>

					<div v-for="collection in selected.collections_to_review" :key="collection.id" class="space-y-2 rounded-lg border border-slate-800 p-3">
						<div class="flex items-center gap-2">
							<UIcon name="i-lucide-layers" class="text-slate-400" />
							<span class="text-sm font-medium text-white">
								{{ collection.pending_changes?.name ?? collection.name }}
							</span>
							<UBadge :color="collection.reviewed_at ? 'warning' : 'primary'" variant="soft" size="sm">
								{{ collection.reviewed_at ? "Changed collection" : "New collection" }}
							</UBadge>
						</div>
						<p v-if="collection.reviewed_at && collection.pending_changes?.name !== undefined" class="text-xs text-slate-500">
							Was: {{ collection.name }}
						</p>
						<p class="whitespace-pre-line text-sm text-slate-400">
							{{ collection.pending_changes?.description ?? collection.description }}
						</p>
						<img
							v-if="
								collection.pending_changes?.preview_asset_id !== undefined
									? collection.pending_changes.preview_asset_id
									: collection.preview
							"
							:src="
								collection.pending_changes?.preview_asset_id !== undefined
									? (imageAssetURL(collection.pending_changes.preview_asset_id) ?? undefined)
									: collection.preview?.url
							"
							alt=""
							class="max-h-24 rounded"
						/>
					</div>

					<div class="flex flex-wrap justify-end gap-2">
						<UButton color="error" variant="soft" icon="i-lucide-circle-x" :disabled="acting" @click="reasonAction = 'reject'">
							Reject changes
						</UButton>
						<UButton color="success" icon="i-lucide-circle-check" :loading="acting" @click="approve">Approve</UButton>
					</div>
				</div>

				<UAlert
					v-if="selected.review_note"
					color="neutral"
					variant="soft"
					icon="i-lucide-message-square"
					title="Last rejection reason"
					:description="selected.review_note"
				/>
			</div>
		</template>

		<template #footer>
			<div v-if="selected" class="flex w-full justify-between gap-2">
				<UButton color="neutral" variant="ghost" @click="showDetail = false">Close</UButton>
				<UButton v-if="selected.status === 'hidden'" icon="i-lucide-eye" :loading="acting" @click="unhide">Unhide page</UButton>
				<UButton v-else color="error" variant="soft" icon="i-lucide-eye-off" :disabled="acting" @click="reasonAction = 'hide'">
					Hide page
				</UButton>
			</div>
		</template>
	</USlideover>

	<ModerationReasonModal
		v-model:open="showReason"
		:title="reasonAction === 'reject' ? 'Reject page changes' : 'Hide page'"
		:description="
			reasonAction === 'reject'
				? 'The pending changes are discarded; the approved profile stays public.'
				: 'The page and all of its items disappear from the shop and in-game. Members can still edit it.'
		"
		:confirm-label="reasonAction === 'reject' ? 'Reject' : 'Hide'"
		:icon="reasonAction === 'reject' ? 'i-lucide-circle-x' : 'i-lucide-eye-off'"
		:on-confirm="onReason"
	/>
</template>
