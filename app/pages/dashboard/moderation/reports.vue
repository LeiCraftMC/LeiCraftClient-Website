<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { Report, ReportStatus } from "~/utils/types";

definePageMeta({
	layout: "dashboard",
});

useSeoMeta({
	title: "Reports | Moderation | LeiCraft Client",
	description: "Reports from players",
});

const toast = useToast();

type TargetType = Report["target_type"];

const filters = reactive<{ status: ReportStatus; target_type: TargetType | "all" }>({
	status: "open",
	target_type: "all",
});

const statusItems: Array<{ label: string; value: ReportStatus }> = [
	{ label: "Open", value: "open" },
	{ label: "Resolved", value: "resolved" },
	{ label: "Dismissed", value: "dismissed" },
];

const TARGET_INFO: Record<TargetType, { label: string; icon: string }> = {
	product: { label: "Item", icon: "i-lucide-package" },
	page: { label: "Page", icon: "i-lucide-store" },
	collection: { label: "Collection", icon: "i-lucide-layers" },
	user: { label: "User", icon: "i-lucide-user" },
};

const targetItems = [
	{ label: "All targets", value: "all" as const },
	...(Object.keys(TARGET_INFO) as TargetType[]).map((type) => ({
		label: TARGET_INFO[type].label,
		value: type,
	})),
];

const REASON_LABELS: Record<Report["reason"], string> = {
	inappropriate: "Inappropriate",
	copyright: "Copyright",
	impersonation: "Impersonation",
	spam: "Spam",
	other: "Other",
};

const reports = await useAPIAsyncData<Report[]>("moderation-reports", async () => {
	const res = await useAPI((api) =>
		api.getModerationReports({
			query: {
				status: filters.status,
				target_type: filters.target_type === "all" ? undefined : filters.target_type,
				limit: 100,
			},
		}),
	);
	if (!res.success) {
		toast.add({ title: "Failed to load the reports", description: res.message, color: "error" });
		return [];
	}
	return res.data;
});

watch(filters, () => reports.refresh());

const columns: TableColumn<Report>[] = [
	{ id: "target", header: "Reported", enableSorting: false },
	{ accessorKey: "reason", header: "Reason" },
	{ accessorKey: "details", header: "Details", enableSorting: false },
	{ id: "reporter", header: "By", enableSorting: false },
	{ accessorKey: "created_at", header: "Reported at" },
	{ id: "actions", header: "", enableSorting: false },
];

function targetLink(report: Report) {
	switch (report.target_type) {
		case "product":
			return `/shop/products/${report.target_id}`;
		case "page":
			return `/dashboard/moderation/pages?page=${report.target_id}`;
		case "collection":
			return `/shop/collections/${report.target_id}`;
		case "user":
			return `/dashboard/moderation/users?user=${report.target_id}`;
	}
}

// Resolve
const resolving = ref<Report | null>(null);
const showResolve = computed({
	get: () => resolving.value !== null,
	set: (value) => {
		if (!value) resolving.value = null;
	},
});
const resolveForm = reactive({
	status: "resolved" as "resolved" | "dismissed",
	note: "",
	takeAction: false,
});
const submitting = ref(false);

function openResolve(report: Report) {
	Object.assign(resolveForm, { status: "resolved", note: "", takeAction: false });
	resolving.value = report;
}

const actionLabel = computed(() => {
	switch (resolving.value?.target_type) {
		case "product":
			return "Also take the item down (the note is shown to its creator)";
		case "page":
			return "Also hide the page (the note is shown to its owners)";
		default:
			return null;
	}
});

async function takeAction(report: Report, reason: string) {
	const res = await useAPI((api) =>
		report.target_type === "product"
			? api.postModerationProductsByProductIdDisable({
					path: { productId: report.target_id },
					body: { reason },
				})
			: api.postModerationPagesByPageIdHide({ path: { pageId: report.target_id }, body: { reason } }),
	);
	if (!res.success) {
		toast.add({ title: "The action failed", description: res.message, color: "error" });
		return false;
	}
	return true;
}

async function resolve() {
	const report = resolving.value;
	if (!report) return;
	const note = resolveForm.note.trim();
	const withAction =
		resolveForm.status === "resolved" && resolveForm.takeAction && actionLabel.value !== null;
	if (withAction && !note) {
		toast.add({ title: "Write a note — it is the reason shown to the user", color: "warning" });
		return;
	}

	submitting.value = true;
	if (withAction && !(await takeAction(report, note))) {
		submitting.value = false;
		return;
	}
	const res = await useAPI((api) =>
		api.postModerationReportsByReportIdResolve({
			path: { reportId: report.id },
			body: { status: resolveForm.status, note: note || undefined },
		}),
	);
	submitting.value = false;

	if (!res.success) {
		toast.add({ title: "Could not close the report", description: res.message, color: "error" });
		return;
	}
	resolving.value = null;
	toast.add({
		title: resolveForm.status === "resolved" ? "Report resolved" : "Report dismissed",
		icon: "i-lucide-check",
		color: "success",
	});
	await reports.refresh();
}
</script>

<template>
	<UDashboardPanel>
		<template #header>
			<DashboardPageHeader title="Reports" icon="i-lucide-flag-triangle-right" description="Content and users reported by players" />
		</template>

		<template #body>
			<DashboardDataTable
				:data="reports.data"
				:loading="reports.loading"
				:columns="columns"
				:empty-title="filters.status === 'open' ? 'No open reports' : 'No reports'"
				empty-description="Reports from the shop and player profiles show up here."
				empty-icon="i-lucide-flag"
				@refresh="reports.refresh()"
			>
				<template #header-left>
					<div class="flex flex-wrap gap-2">
						<USelect v-model="filters.status" :items="statusItems" class="w-36" />
						<USelect v-model="filters.target_type" :items="targetItems" class="w-40" />
					</div>
				</template>

				<template #target-cell="{ row }">
					<NuxtLink
						:to="targetLink(row.original)"
						:target="row.original.target_type === 'product' || row.original.target_type === 'collection' ? '_blank' : undefined"
						class="flex items-center gap-2 text-sm text-white hover:text-primary-300"
					>
						<UIcon :name="TARGET_INFO[row.original.target_type].icon" class="text-slate-400" />
						{{ TARGET_INFO[row.original.target_type].label }} #{{ row.original.target_id }}
					</NuxtLink>
				</template>

				<template #reason-cell="{ row }">
					<UBadge color="neutral" variant="soft">{{ REASON_LABELS[row.original.reason] }}</UBadge>
				</template>

				<template #details-cell="{ row }">
					<p class="line-clamp-2 max-w-sm whitespace-normal text-sm text-slate-300">{{ row.original.details || "-" }}</p>
					<p v-if="row.original.resolution_note" class="mt-1 line-clamp-2 max-w-sm whitespace-normal text-xs text-slate-500">
						{{ row.original.resolved_by?.display_name ?? "Moderator" }}: {{ row.original.resolution_note }}
					</p>
				</template>

				<template #reporter-cell="{ row }">
					<div v-if="row.original.reporter" class="flex items-center gap-2">
						<UAvatar :src="row.original.reporter.avatar_url" :alt="row.original.reporter.display_name" size="xs" />
						<span class="truncate text-sm text-slate-300">{{ row.original.reporter.display_name }}</span>
					</div>
					<span v-else class="text-sm text-slate-500">Deleted user</span>
				</template>

				<template #created_at-cell="{ row }">
					<span class="text-sm text-slate-400">{{ formatDate(row.original.created_at) }}</span>
				</template>

				<template #actions-cell="{ row }">
					<UButton v-if="row.original.status === 'open'" size="sm" variant="soft" icon="i-lucide-check" @click="openResolve(row.original)">
						Close
					</UButton>
					<UBadge v-else :color="row.original.status === 'resolved' ? 'success' : 'neutral'" variant="soft" class="capitalize">
						{{ row.original.status }}
					</UBadge>
				</template>
			</DashboardDataTable>
		</template>
	</UDashboardPanel>

	<DashboardModal v-model:open="showResolve" title="Close report" icon="i-lucide-flag-triangle-right">
		<form id="resolve-report-form" class="space-y-4" @submit.prevent="resolve">
			<div v-if="resolving" class="rounded-lg border border-slate-800 bg-slate-950 p-3 text-sm">
				<p class="text-slate-400">
					{{ TARGET_INFO[resolving.target_type].label }} #{{ resolving.target_id }} · {{ REASON_LABELS[resolving.reason] }}
				</p>
				<p class="mt-1 whitespace-pre-line text-slate-200">{{ resolving.details || "No details given." }}</p>
			</div>

			<URadioGroup
				v-model="resolveForm.status"
				:items="[
					{ label: 'Resolved', value: 'resolved', description: 'The report was valid and you acted on it' },
					{ label: 'Dismissed', value: 'dismissed', description: 'Nothing breaks the rules' },
				]"
			/>

			<UCheckbox v-if="resolveForm.status === 'resolved' && actionLabel" v-model="resolveForm.takeAction" :label="actionLabel" />
			<p v-if="resolving?.target_type === 'user'" class="text-sm text-slate-400">
				To ban the user, open
				<NuxtLink :to="targetLink(resolving)" class="text-primary-300 hover:underline">their moderation profile</NuxtLink>.
			</p>

			<UFormField
				label="Note"
				:required="resolveForm.takeAction"
				:description="
					resolveForm.takeAction
						? 'Shown to the user as the reason and kept on the report.'
						: 'Internal note for the moderators.'
				"
			>
				<UTextarea v-model="resolveForm.note" :rows="3" :maxlength="500" class="w-full" />
			</UFormField>
		</form>

		<template #footer>
			<UButton color="neutral" variant="ghost" @click="showResolve = false">Cancel</UButton>
			<UButton type="submit" form="resolve-report-form" icon="i-lucide-check" :loading="submitting">Close report</UButton>
		</template>
	</DashboardModal>
</template>
