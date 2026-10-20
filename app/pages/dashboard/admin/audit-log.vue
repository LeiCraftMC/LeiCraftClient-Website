<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { GetAdminAuditLogsData } from "~/api-client";
import type { AuditAction, AuditLogEntry } from "~/utils/types";

// Admin-only: `auth.global.ts` redirects non-admins away from /dashboard/admin/*.
definePageMeta({
	layout: "dashboard",
});

useSeoMeta({
	title: "Audit log | LeiCraft Client",
	description: "Staff and partner actions",
});

type TargetType = NonNullable<NonNullable<GetAdminAuditLogsData["query"]>["target_type"]>;

const PAGE_SIZE = 200;
const toast = useToast();

const ACTIONS: AuditAction[] = [
	"user.role_change",
	"user.ban",
	"user.unban",
	"user.delete",
	"page.create",
	"page.update",
	"page.delete",
	"page.hide",
	"page.unhide",
	"page.member_add",
	"page.member_update",
	"page.member_remove",
	"page.approve_changes",
	"page.reject_changes",
	"collection.create",
	"collection.update",
	"collection.delete",
	"product.create",
	"product.update",
	"product.publish",
	"product.unpublish",
	"product.delete",
	"variant.create",
	"variant.update",
	"variant.delete",
	"product.approve",
	"product.reject",
	"product.disable",
	"product.restore",
	"product.grant",
	"product.revoke",
	"code.create",
	"code.update",
	"code.delete",
	"report.resolve",
];

const TARGET_TYPES: TargetType[] = ["user", "page", "collection", "product", "code", "report"];

const filters = reactive<{
	action: AuditAction | "all";
	target_type: TargetType | "all";
	target_id: string;
	actor: string;
}>({
	action: "all",
	target_type: "all",
	target_id: "",
	actor: "",
});

const actionItems = [
	{ label: "All actions", value: "all" as const },
	...ACTIONS.map((action) => ({ label: action, value: action })),
];
const targetItems = [
	{ label: "All targets", value: "all" as const },
	...TARGET_TYPES.map((type) => ({ label: type, value: type })),
];

function query(offset: number) {
	const actor = Number(filters.actor);
	return {
		action: filters.action === "all" ? undefined : filters.action,
		target_type: filters.target_type === "all" ? undefined : filters.target_type,
		target_id: filters.target_id.trim() || undefined,
		actor_user_id: Number.isInteger(actor) && actor > 0 ? actor : undefined,
		limit: PAGE_SIZE,
		offset,
	};
}

/** Set when "load older" returned a short page; a full first page may have more behind it. */
const exhausted = ref(false);

const entries = await useAPIAsyncData<AuditLogEntry[]>("admin-audit-log", async () => {
	const res = await useAPI((api) => api.getAdminAuditLogs({ query: query(0) }));
	if (!res.success) {
		toast.add({ title: "Failed to load the audit log", description: res.message, color: "error" });
		return [];
	}
	exhausted.value = false;
	return res.data;
});

const hasMore = computed(
	() =>
		!exhausted.value && entries.data.value.length > 0 && entries.data.value.length % PAGE_SIZE === 0,
);
const loadingMore = ref(false);

async function loadMore() {
	loadingMore.value = true;
	const res = await useAPI((api) =>
		api.getAdminAuditLogs({ query: query(entries.data.value.length) }),
	);
	loadingMore.value = false;
	if (!res.success) {
		toast.add({ title: "Failed to load more entries", description: res.message, color: "error" });
		return;
	}
	exhausted.value = res.data.length < PAGE_SIZE;
	entries.data.value = [...entries.data.value, ...res.data];
}

function applyFilters() {
	entries.refresh();
}

watch(() => [filters.action, filters.target_type], applyFilters);

const columns: TableColumn<AuditLogEntry>[] = [
	{ accessorKey: "created_at", header: "Time" },
	{ id: "actor", header: "By", enableSorting: false },
	{ accessorKey: "action", header: "Action" },
	{ id: "target", header: "Target", enableSorting: false },
	{ id: "details", header: "Details", enableSorting: false },
];

function actionColor(action: string): "error" | "warning" | "success" | "primary" | "neutral" {
	if (/\.(delete|ban|disable|hide|reject|revoke|member_remove)/.test(action)) return "error";
	if (/\.(role_change|update|member_update|unpublish|reject_changes)/.test(action)) return "warning";
	if (/\.(approve|restore|unban|unhide|publish|approve_changes|grant)/.test(action))
		return "success";
	if (/\.create|member_add/.test(action)) return "primary";
	return "neutral";
}

function detailsText(details: AuditLogEntry["details"]) {
	const keys = Object.keys(details);
	if (!keys.length) return "";
	return JSON.stringify(details);
}

function filterByTarget(entry: AuditLogEntry) {
	if (!entry.target_id || !TARGET_TYPES.includes(entry.target_type as TargetType)) return;
	filters.target_type = entry.target_type as TargetType;
	filters.target_id = entry.target_id;
	applyFilters();
}

function filterByActor(entry: AuditLogEntry) {
	if (!entry.actor) return;
	filters.actor = String(entry.actor.id);
	applyFilters();
}

function clearFilters() {
	Object.assign(filters, { action: "all", target_type: "all", target_id: "", actor: "" });
}
</script>

<template>
	<UDashboardPanel>
		<template #header>
			<DashboardPageHeader
				title="Audit log"
				icon="i-lucide-scroll-text"
				description="Staff actions, plus every change on official and partner pages"
			/>
		</template>

		<template #body>
			<DashboardPageBody>
				<DashboardDataTable
					:data="entries.data"
					:loading="entries.loading"
					:columns="columns"
					:default-page-size="50"
					empty-title="No entries"
					empty-description="No action matches the filters."
					empty-icon="i-lucide-scroll-text"
					@refresh="entries.refresh()"
				>
					<template #header-left>
						<form class="flex flex-wrap items-center gap-2" @submit.prevent="applyFilters">
							<USelectMenu v-model="filters.action" :items="actionItems" value-key="value" class="w-52" />
							<USelect v-model="filters.target_type" :items="targetItems" class="w-36" />
							<UInput v-model="filters.target_id" placeholder="Target id" class="w-28" @blur="applyFilters" />
							<UInput v-model="filters.actor" placeholder="Actor user id" class="w-32" @blur="applyFilters" />
							<UButton
								v-if="filters.action !== 'all' || filters.target_type !== 'all' || filters.target_id || filters.actor"
								color="neutral"
								variant="ghost"
								icon="i-lucide-x"
								@click="clearFilters"
							>
								Clear
							</UButton>
						</form>
					</template>

					<template #created_at-cell="{ row }">
						<span class="whitespace-nowrap text-sm text-slate-400">{{ formatDate(row.original.created_at) }}</span>
					</template>

					<template #actor-cell="{ row }">
						<button
							v-if="row.original.actor"
							type="button"
							class="flex items-center gap-2 text-left hover:text-primary-300"
							title="Only this user"
							@click="filterByActor(row.original)"
						>
							<UAvatar :src="row.original.actor.avatar_url" :alt="row.original.actor.display_name" size="xs" />
							<span class="truncate text-sm">{{ row.original.actor.display_name }}</span>
						</button>
						<span v-else class="text-sm text-slate-500">System</span>
					</template>

					<template #action-cell="{ row }">
						<UBadge :color="actionColor(row.original.action)" variant="soft" class="font-mono">{{ row.original.action }}</UBadge>
					</template>

					<template #target-cell="{ row }">
						<button
							v-if="row.original.target_id"
							type="button"
							class="font-mono text-sm text-slate-300 hover:text-primary-300"
							title="Everything about this target"
							@click="filterByTarget(row.original)"
						>
							{{ row.original.target_type }} #{{ row.original.target_id }}
						</button>
						<span v-else class="font-mono text-sm text-slate-500">{{ row.original.target_type }}</span>
					</template>

					<template #details-cell="{ row }">
						<code class="line-clamp-2 block max-w-md whitespace-normal break-all text-xs text-slate-400">
							{{ detailsText(row.original.details) || "-" }}
						</code>
					</template>
				</DashboardDataTable>

				<div v-if="hasMore" class="flex justify-center">
					<UButton color="neutral" variant="soft" icon="i-lucide-chevrons-down" :loading="loadingMore" @click="loadMore">
						Load older entries
					</UButton>
				</div>
			</DashboardPageBody>
		</template>
	</UDashboardPanel>
</template>
