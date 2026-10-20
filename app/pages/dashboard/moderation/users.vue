<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { watchDebounced } from "@vueuse/core";
import type { ModeratedUser } from "~/utils/types";

definePageMeta({
	layout: "dashboard",
});

useSeoMeta({
	title: "Users | Moderation | LeiCraft Client",
	description: "Find and ban users",
});

const route = useRoute();
const toast = useToast();

const filters = reactive({ search: "", bannedOnly: false });

const users = await useAPIAsyncData<ModeratedUser[]>("moderation-users", async () => {
	const res = await useAPI((api) =>
		api.getModerationUsers({
			query: {
				search: filters.search.trim() || undefined,
				banned: filters.bannedOnly ? "true" : undefined,
				limit: 100,
			},
		}),
	);
	if (!res.success) {
		toast.add({ title: "Failed to load the users", description: res.message, color: "error" });
		return [];
	}
	return res.data;
});

watch(
	() => filters.bannedOnly,
	() => users.refresh(),
);
watchDebounced(
	() => filters.search,
	() => users.refresh(),
	{ debounce: 300 },
);

const columns: TableColumn<ModeratedUser>[] = [
	{ accessorKey: "display_name", header: "User" },
	{ accessorKey: "role", header: "Role" },
	{ accessorKey: "banned", header: "Status" },
	{ accessorKey: "created_at", header: "Joined" },
	{ accessorKey: "last_login_at", header: "Last login" },
	{ id: "actions", header: "", enableSorting: false },
];

// `?user=<id>` comes from reports.
const deepLinked = Number(route.query.user);
const selectedId = ref<number | null>(
	Number.isInteger(deepLinked) && deepLinked > 0 ? deepLinked : null,
);
</script>

<template>
	<UDashboardPanel>
		<template #header>
			<DashboardPageHeader
				title="Users"
				icon="i-lucide-user-x"
				description="Search by name, Discord username or id, or a linked Minecraft name"
			/>
		</template>

		<template #body>
			<DashboardDataTable
				:data="users.data"
				:loading="users.loading"
				:columns="columns"
				empty-title="No users found"
				empty-description="Try another search."
				empty-icon="i-lucide-users"
				@refresh="users.refresh()"
			>
				<template #header-left>
					<div class="flex flex-wrap items-center gap-3">
						<UInput v-model="filters.search" icon="i-lucide-search" placeholder="Search users…" class="w-64" />
						<USwitch v-model="filters.bannedOnly" label="Banned only" />
					</div>
				</template>

				<template #display_name-cell="{ row }">
					<button type="button" class="flex items-center gap-3 text-left" @click="selectedId = row.original.id">
						<UAvatar :src="row.original.avatar_url" :alt="row.original.display_name" size="sm" />
						<div class="min-w-0">
							<p class="truncate font-medium text-white hover:text-primary-300">{{ row.original.display_name }}</p>
							<p class="truncate text-xs text-slate-500">@{{ row.original.discord_username }} · #{{ row.original.id }}</p>
						</div>
					</button>
				</template>

				<template #role-cell="{ row }">
					<UBadge :color="getRoleColor(row.original.role)" variant="soft" class="capitalize">{{ row.original.role }}</UBadge>
				</template>

				<template #banned-cell="{ row }">
					<UBadge v-if="row.original.banned" color="error" variant="soft" icon="i-lucide-gavel">
						{{ row.original.banned_until ? `Until ${formatDate(row.original.banned_until)}` : "Banned" }}
					</UBadge>
					<span v-else class="text-sm text-slate-500">Active</span>
				</template>

				<template #created_at-cell="{ row }">
					<span class="text-sm text-slate-400">{{ formatDate(row.original.created_at) }}</span>
				</template>

				<template #last_login_at-cell="{ row }">
					<span class="text-sm text-slate-400">{{ formatDate(row.original.last_login_at) }}</span>
				</template>

				<template #actions-cell="{ row }">
					<UButton size="sm" color="neutral" variant="ghost" icon="i-lucide-chevron-right" aria-label="Open" @click="selectedId = row.original.id" />
				</template>
			</DashboardDataTable>
		</template>
	</UDashboardPanel>

	<ModerationUserSlideover :user-id="selectedId" @close="selectedId = null" @changed="users.refresh()" />
</template>
