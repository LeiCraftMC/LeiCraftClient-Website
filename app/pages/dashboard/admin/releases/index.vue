<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { useIntervalFn } from "@vueuse/core";
import type { ManagedRelease } from "~/utils/types";

// Admin-only: `auth.global.ts` redirects non-admins away from /dashboard/admin/*.
definePageMeta({
	layout: "dashboard",
});

useSeoMeta({
	title: "Releases | LeiCraft Client",
	description: "Publish releases of the LeiCraft Client mod",
});

const toast = useToast();

const releases = await useAPIAsyncData<ManagedRelease[]>("admin-releases", async () => {
	const res = await useAPI((api) => api.getAdminReleases({ query: { limit: 200 } }));
	if (!res.success) {
		toast.add({ title: "Failed to load the releases", description: res.message, color: "error" });
		return [];
	}
	return res.data;
});

// Builds take a few minutes; keep the list fresh while one is running.
const hasUnfinished = computed(() =>
	(releases.data.value ?? []).some(
		(release) => release.status === "pending" || release.modrinth_state === "pending",
	),
);
const poll = useIntervalFn(() => releases.refresh(), 10_000, { immediate: false });
watch(hasUnfinished, (value) => (value ? poll.resume() : poll.pause()), { immediate: true });

const columns: TableColumn<ManagedRelease>[] = [
	{ accessorKey: "version", header: "Version" },
	{ accessorKey: "status", header: "Build" },
	{ accessorKey: "modrinth_state", header: "Modrinth" },
	{ accessorKey: "created_by", header: "Published by" },
	{ accessorKey: "created_at", header: "Created" },
	{ id: "actions", header: "", enableSorting: false, enableHiding: false },
];
</script>

<template>
	<UDashboardPanel>
		<template #header>
			<DashboardPageHeader
				title="Releases"
				icon="i-lucide-package"
				description="Publish the mod: changelog, GitLab build and Modrinth."
			>
				<template #right>
					<UButton to="/dashboard/admin/releases/new" icon="i-lucide-plus">New release</UButton>
				</template>
			</DashboardPageHeader>
		</template>

		<template #body>
			<DashboardDataTable
				:data="releases.data"
				:columns="columns"
				:loading="releases.loading"
				empty-title="No releases yet"
				empty-description="Publish the first one — it shows up on the download page once its build finished."
				empty-icon="i-lucide-package"
				@refresh="releases.refresh()"
			>
				<template #version-cell="{ row }">
					<NuxtLink
						:to="`/dashboard/admin/releases/${row.original.version}`"
						class="group flex flex-col"
					>
						<span class="font-medium text-white group-hover:text-primary-300">
							{{ row.original.title }}
						</span>
						<span class="flex items-center gap-2 text-xs text-slate-500">
							<span class="font-mono">v{{ row.original.version }}</span>
							<UBadge
								v-if="row.original.channel === 'pre-release'"
								color="neutral"
								variant="outline"
								size="sm"
							>
								Pre-release
							</UBadge>
						</span>
					</NuxtLink>
				</template>

				<template #status-cell="{ row }">
					<ReleaseStatusBadge :status="row.original.status" />
				</template>

				<template #modrinth_state-cell="{ row }">
					<ReleaseStatusBadge :modrinth="row.original.modrinth_state" />
				</template>

				<template #created_by-cell="{ row }">
					<div v-if="row.original.created_by" class="flex items-center gap-2">
						<UAvatar
							:src="row.original.created_by.avatar_url"
							:alt="row.original.created_by.display_name"
							size="xs"
						/>
						<span class="text-sm text-slate-300">{{ row.original.created_by.display_name }}</span>
					</div>
					<span v-else class="text-sm text-slate-500">—</span>
				</template>

				<template #created_at-cell="{ row }">
					<span class="text-sm text-slate-400">{{ formatDate(row.original.created_at) }}</span>
				</template>

				<template #actions-cell="{ row }">
					<UButton
						:to="`/dashboard/admin/releases/${row.original.version}`"
						icon="i-lucide-chevron-right"
						variant="ghost"
						color="neutral"
						size="xs"
						aria-label="Open release"
					/>
				</template>
			</DashboardDataTable>
		</template>
	</UDashboardPanel>
</template>
