<script setup lang="ts">
import type { CategoryID, ModerationProduct, ProductStatus } from "~/utils/types";

definePageMeta({
	layout: "dashboard",
});

useSeoMeta({
	title: "Review queue | LeiCraft Client",
	description: "Items waiting for a moderator",
});

const PAGE_SIZE = 100;
const toast = useToast();

const filters = reactive<{ status: ProductStatus; category: CategoryID | "all" }>({
	status: "pending_review",
	category: "all",
});

const statusItems: Array<{ label: string; value: ProductStatus }> = [
	{ label: "In review", value: "pending_review" },
	{ label: "Published", value: "published" },
	{ label: "Taken down", value: "disabled" },
	{ label: "Rejected", value: "rejected" },
	{ label: "Drafts", value: "draft" },
];

const categoryItems = [
	{ label: "All categories", value: "all" as const },
	...CATEGORY_IDS.map((id) => ({ label: CATEGORY_INFO[id].label, value: id })),
];

const entries = await useAPIAsyncData<ModerationProduct[]>("moderation-products", async () => {
	const res = await useAPI((api) =>
		api.getModerationProducts({
			query: {
				status: filters.status,
				category: filters.category === "all" ? undefined : filters.category,
				limit: PAGE_SIZE,
			},
		}),
	);
	if (!res.success) {
		toast.add({ title: "Failed to load the queue", description: res.message, color: "error" });
		return [];
	}
	return res.data;
});

const pagesInReview = await useAPILazyAsyncData<number>("moderation-pages-in-review", async () => {
	const res = await useAPI((api) =>
		api.getModerationPages({ query: { needs_review: "true", limit: 100 } }),
	);
	return res.success ? res.data.length : 0;
});

const selectedId = ref<number | null>(entries.data.value[0]?.product.id ?? null);
const selected = computed(
	() => entries.data.value.find((entry) => entry.product.id === selectedId.value) ?? null,
);

watch(
	() => entries.data.value,
	(list) => {
		if (!list.some((entry) => entry.product.id === selectedId.value)) {
			selectedId.value = list[0]?.product.id ?? null;
		}
	},
);

watch(filters, () => entries.refresh());

/** After an action, move on to the next item of the list. */
async function refreshAndAdvance() {
	const list = entries.data.value;
	const index = list.findIndex((entry) => entry.product.id === selectedId.value);
	await entries.refresh();
	const next = entries.data.value[Math.min(Math.max(index, 0), entries.data.value.length - 1)];
	selectedId.value = next?.product.id ?? null;
}

// Preview
const previewSlim = ref(false);
const previewElytra = ref(false);
const previewVariantId = ref<number | null>(null);
watch(selectedId, () => {
	previewVariantId.value = null;
	previewElytra.value = false;
});

const previewVariant = computed(() =>
	pickVariant(
		selected.value?.product.variants ?? [],
		previewVariantId.value,
		previewSlim.value ? "slim" : "wide",
	),
);
const variantItems = computed(() => [
	{ label: "Automatic", value: 0 },
	...(selected.value?.product.variants ?? []).map((variant) => ({
		label: `${variant.name} — ${SKIN_MODEL_LABELS[variant.skin_model]}`,
		value: variant.id,
	})),
]);
const variantChoice = computed({
	get: () => previewVariantId.value ?? 0,
	set: (value: number) => {
		previewVariantId.value = value || null;
	},
});
const viewerCosmetics = computed(() =>
	selected.value?.product.type === "cosmetic" && previewVariant.value
		? [{ texture: previewVariant.value.texture.url, model: previewVariant.value.model.url }]
		: [],
);

// Actions
const acting = ref(false);

async function approve() {
	const entry = selected.value;
	if (!entry) return;
	acting.value = true;
	const res = await useAPI((api) =>
		api.postModerationProductsByProductIdApprove({
			path: { productId: entry.product.id },
			body: { updated_at: entry.product.updated_at },
		}),
	);
	acting.value = false;

	if (!res.success) {
		toast.add({ title: "Approval failed", description: res.message, color: "error" });
		if ((res.code as number) === 409) await entries.refresh();
		return;
	}
	toast.add({ title: `${entry.product.name} is live`, icon: "i-lucide-check", color: "success" });
	await refreshAndAdvance();
}

async function restore() {
	const entry = selected.value;
	if (!entry) return;
	acting.value = true;
	const res = await useAPI((api) =>
		api.postModerationProductsByProductIdRestore({ path: { productId: entry.product.id } }),
	);
	acting.value = false;

	if (!res.success) {
		toast.add({ title: "Restore failed", description: res.message, color: "error" });
		return;
	}
	toast.add({
		title: `${entry.product.name} restored`,
		description: `It is ${productStatusLabel(res.data.product.status).toLowerCase()} again.`,
		icon: "i-lucide-check",
		color: "success",
	});
	await refreshAndAdvance();
}

const reasonAction = ref<"reject" | "disable" | null>(null);
const showReason = computed({
	get: () => reasonAction.value !== null,
	set: (value) => {
		if (!value) reasonAction.value = null;
	},
});

async function onReason(reason: string) {
	const entry = selected.value;
	const action = reasonAction.value;
	if (!entry || !action) return false;

	const res = await useAPI((api) =>
		action === "reject"
			? api.postModerationProductsByProductIdReject({
					path: { productId: entry.product.id },
					body: { reason },
				})
			: api.postModerationProductsByProductIdDisable({
					path: { productId: entry.product.id },
					body: { reason },
				}),
	);
	if (!res.success) {
		toast.add({
			title: action === "reject" ? "Reject failed" : "Take-down failed",
			description: res.message,
			color: "error",
		});
		return false;
	}
	toast.add({
		title:
			action === "reject" ? `${entry.product.name} rejected` : `${entry.product.name} taken down`,
		icon: "i-lucide-check",
		color: "success",
	});
	await refreshAndAdvance();
	return true;
}

function assetLinks(entry: ModerationProduct) {
	const links: Array<{ label: string; url: string }> = [];
	if (entry.product.texture) links.push({ label: "Cape texture", url: entry.product.texture.url });
	if (entry.product.preview) links.push({ label: "Shop image", url: entry.product.preview.url });
	for (const variant of entry.product.variants) {
		links.push({ label: `${variant.name}: model`, url: variant.model.url });
		links.push({ label: `${variant.name}: texture`, url: variant.texture.url });
	}
	return links;
}
</script>

<template>
	<UDashboardPanel>
		<template #header>
			<DashboardPageHeader
				title="Review queue"
				icon="i-lucide-inbox"
				description="Approve community items and take down content that breaks the rules"
			>
				<template #right>
					<USelect v-model="filters.category" :items="categoryItems" class="w-44" />
					<USelect v-model="filters.status" :items="statusItems" class="w-36" />
				</template>
			</DashboardPageHeader>
		</template>

		<template #body>
			<DashboardPageBody>
				<UAlert
					v-if="pagesInReview.data.value"
					color="warning"
					variant="soft"
					icon="i-lucide-store"
					:title="`${pagesInReview.data.value} page ${pagesInReview.data.value === 1 ? 'profile waits' : 'profiles wait'} for review`"
					description="Names, descriptions, images and collections of community pages."
					:actions="[{ label: 'Review pages', to: '/dashboard/moderation/pages?review=1', color: 'warning', variant: 'soft' }]"
				/>

				<UEmpty
					v-if="!entries.data.value.length && !entries.loading.value"
					icon="i-lucide-inbox"
					:title="filters.status === 'pending_review' ? 'Nothing to review' : 'No items'"
					:description="filters.status === 'pending_review' ? 'New community items show up here.' : 'No items with this status.'"
				/>

				<div v-else class="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
					<!-- List -->
					<div class="space-y-2">
						<button
							v-for="entry in entries.data.value"
							:key="entry.product.id"
							type="button"
							:class="[
								'flex w-full items-center gap-3 rounded-lg border p-3 text-left transition',
								entry.product.id === selectedId
									? 'border-primary-400/60 bg-primary-500/10'
									: 'border-slate-800 bg-slate-900/60 hover:border-slate-700',
							]"
							@click="selectedId = entry.product.id"
						>
							<div class="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded bg-slate-950">
								<img v-if="entry.product.preview" :src="entry.product.preview.url" alt="" class="h-full w-full object-contain" />
								<SkinCapePreview v-else-if="entry.product.texture" :texture="entry.product.texture.url" class="h-10" />
								<UIcon v-else :name="entry.product.type === 'cape' ? 'i-lucide-flag' : 'i-lucide-sparkles'" class="text-slate-600" />
							</div>
							<div class="min-w-0 flex-1">
								<p class="truncate text-sm font-medium text-white">{{ entry.product.name }}</p>
								<p class="truncate text-xs text-slate-400">{{ entry.page.name }} · {{ CATEGORY_INFO[entry.page.category].short }}</p>
								<p class="text-xs text-slate-500">{{ formatDate(entry.product.updated_at) }}</p>
							</div>
						</button>
						<p v-if="entries.data.value.length >= PAGE_SIZE" class="px-1 text-xs text-slate-500">
							Showing the first {{ PAGE_SIZE }} items.
						</p>
					</div>

					<!-- Detail -->
					<div v-if="selected" class="min-w-0 space-y-6">
						<div class="flex flex-wrap items-start justify-between gap-4">
							<div class="space-y-1">
								<div class="flex flex-wrap items-center gap-2">
									<h2 class="text-xl font-semibold text-white">{{ selected.product.name }}</h2>
									<StudioStatusBadge :status="selected.product.status" />
									<UBadge v-if="selected.product.availability === 'exclusive'" color="warning" variant="soft">Exclusive</UBadge>
								</div>
								<p class="text-sm text-slate-400">
									<span class="capitalize">{{ selected.product.type }}</span> #{{ selected.product.id }} on
									<NuxtLink :to="`/dashboard/moderation/pages?page=${selected.page.id}`" class="text-primary-300 hover:underline">
										{{ selected.page.name }}
									</NuxtLink>
									<template v-if="selected.product.creator"> · by {{ selected.product.creator.display_name }} (#{{ selected.product.creator.id }})</template>
								</p>
							</div>
							<div class="flex flex-wrap gap-2">
								<template v-if="selected.product.status === 'pending_review'">
									<UButton color="error" variant="soft" icon="i-lucide-circle-x" :disabled="acting" @click="reasonAction = 'reject'">
										Reject
									</UButton>
									<UButton color="success" icon="i-lucide-circle-check" :loading="acting" @click="approve">Approve</UButton>
								</template>
								<UButton
									v-else-if="selected.product.status === 'disabled'"
									icon="i-lucide-rotate-ccw"
									:loading="acting"
									@click="restore"
								>
									Restore
								</UButton>
								<UButton
									v-if="selected.product.status !== 'disabled'"
									color="error"
									variant="ghost"
									icon="i-lucide-ban"
									:disabled="acting"
									@click="reasonAction = 'disable'"
								>
									Take down
								</UButton>
							</div>
						</div>

						<UAlert
							v-if="selected.product.review_note"
							color="neutral"
							variant="soft"
							icon="i-lucide-message-square"
							title="Last moderator note"
							:description="selected.product.review_note"
						/>

						<div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
							<div class="space-y-3">
								<div class="h-105 overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
									<SkinViewer
										:slim="previewSlim"
										:cape="selected.product.type === 'cape' ? (selected.product.texture?.url ?? null) : null"
										:elytra="previewElytra"
										:back="selected.product.type === 'cape'"
										:cosmetics="viewerCosmetics"
										animation="idle"
									/>
								</div>
								<div class="flex flex-wrap items-center gap-2">
									<UButton
										size="sm"
										color="neutral"
										:variant="previewSlim ? 'soft' : 'ghost'"
										icon="i-lucide-person-standing"
										@click="previewSlim = !previewSlim"
									>
										{{ previewSlim ? "Slim arms" : "Wide arms" }}
									</UButton>
									<UButton
										v-if="selected.product.type === 'cape'"
										size="sm"
										color="neutral"
										:variant="previewElytra ? 'soft' : 'ghost'"
										icon="i-lucide-feather"
										@click="previewElytra = !previewElytra"
									>
										Elytra
									</UButton>
									<USelect
										v-if="selected.product.variants.length > 1"
										v-model="variantChoice"
										:items="variantItems"
										size="sm"
										class="w-56"
									/>
								</div>
							</div>

							<div class="space-y-4">
								<div>
									<h3 class="mb-1 text-sm font-medium text-slate-300">Description</h3>
									<p class="whitespace-pre-line text-sm text-slate-400">{{ selected.product.description || "No description" }}</p>
								</div>
								<div v-if="selected.product.preview">
									<h3 class="mb-1 text-sm font-medium text-slate-300">Shop image</h3>
									<img :src="selected.product.preview.url" alt="" class="max-h-40 rounded-lg border border-slate-800" />
								</div>
								<div>
									<h3 class="mb-1 text-sm font-medium text-slate-300">Files</h3>
									<ul class="space-y-1">
										<li v-for="link in assetLinks(selected)" :key="link.url">
											<a :href="link.url" target="_blank" rel="noopener" class="text-sm text-primary-300 hover:underline">
												{{ link.label }}
											</a>
										</li>
									</ul>
								</div>
								<dl class="grid grid-cols-2 gap-2 text-sm">
									<dt class="text-slate-500">Created</dt>
									<dd class="text-slate-300">{{ formatDate(selected.product.created_at) }}</dd>
									<dt class="text-slate-500">Last change</dt>
									<dd class="text-slate-300">{{ formatDate(selected.product.updated_at) }}</dd>
									<dt class="text-slate-500">Last review</dt>
									<dd class="text-slate-300">{{ formatDate(selected.product.reviewed_at) }}</dd>
									<dt class="text-slate-500">Listed</dt>
									<dd class="text-slate-300">{{ selected.product.listed ? "Yes" : "No" }}</dd>
								</dl>
							</div>
						</div>
					</div>
				</div>
			</DashboardPageBody>
		</template>
	</UDashboardPanel>

	<ModerationReasonModal
		v-model:open="showReason"
		:title="reasonAction === 'reject' ? 'Reject item' : 'Take down item'"
		:description="
			reasonAction === 'reject'
				? 'The creator can fix the item and submit it again.'
				: 'The item disappears from the shop and in-game until a moderator restores it.'
		"
		:confirm-label="reasonAction === 'reject' ? 'Reject' : 'Take down'"
		:icon="reasonAction === 'reject' ? 'i-lucide-circle-x' : 'i-lucide-ban'"
		:on-confirm="onReason"
	/>
</template>
