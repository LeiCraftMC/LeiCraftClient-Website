<script setup lang="ts">
import type { DropdownMenuItem, TableColumn } from "@nuxt/ui";
import { watchDebounced } from "@vueuse/core";
import { useUserInfoStore } from "~/composables/stores/useUserStore";
import type { AdminUser, UserRole } from "~/utils/types";

// Admin-only: `auth.global.ts` redirects non-admins away from /dashboard/admin/*.
definePageMeta({
	layout: "dashboard",
});

useSeoMeta({
	title: "Users & roles | LeiCraft Client",
	description: "Manage users and staff roles",
});

const toast = useToast();
const me = await useUserInfoStore().use();

const filters = reactive<{ search: string; role: UserRole | "all" }>({ search: "", role: "all" });

const roleItems: Array<{ label: string; value: UserRole }> = [
	{ label: "User", value: "user" },
	{ label: "Moderator", value: "moderator" },
	{ label: "Admin", value: "admin" },
];
const roleFilterItems = [{ label: "All roles", value: "all" as const }, ...roleItems];

const users = await useAPIAsyncData<AdminUser[]>("admin-users", async () => {
	const res = await useAPI((api) =>
		api.getAdminUsers({
			query: {
				search: filters.search.trim() || undefined,
				role: filters.role === "all" ? undefined : filters.role,
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
	() => filters.role,
	() => users.refresh(),
);
watchDebounced(
	() => filters.search,
	() => users.refresh(),
	{ debounce: 300 },
);

const columns: TableColumn<AdminUser>[] = [
	{ accessorKey: "id", header: "ID" },
	{ accessorKey: "display_name", header: "User" },
	{ accessorKey: "discord_id", header: "Discord id" },
	{ accessorKey: "role", header: "Role" },
	{ accessorKey: "last_login_at", header: "Last login" },
	{ id: "actions", header: "", enableSorting: false, enableHiding: false },
];

const selectedId = ref<number | null>(null);

async function setRole(user: AdminUser, role: UserRole) {
	const res = await useAPI((api) =>
		api.putAdminUsersByUserId({ path: { userId: user.id }, body: { role } }),
	);
	if (!res.success) {
		toast.add({ title: "Could not change the role", description: res.message, color: "error" });
		return;
	}
	toast.add({
		title: `${user.display_name} is now ${role}`,
		icon: "i-lucide-shield",
		color: "success",
	});
	await users.refresh();
}

function getRowActions(user: AdminUser): DropdownMenuItem[][] {
	const isSelf = user.id === me.value?.id;
	return [
		[{ label: "Open profile", icon: "i-lucide-user", onSelect: () => (selectedId.value = user.id) }],
		isSelf
			? []
			: roleItems
					.filter((item) => item.value !== user.role)
					.map((item) => ({
						label: `Make ${item.label.toLowerCase()}`,
						icon: item.value === "user" ? "i-lucide-shield-off" : "i-lucide-shield",
						onSelect: () => setRole(user, item.value),
					})),
	];
}
</script>

<template>
	<UDashboardPanel>
		<template #header>
			<DashboardPageHeader
				title="Users & roles"
				icon="i-lucide-users"
				description="Promote moderators and admins. Users sign up with Discord."
			/>
		</template>

		<template #body>
			<DashboardDataTable
				:data="users.data"
				:columns="columns"
				:loading="users.loading"
				empty-title="No users"
				empty-description="Try another search."
				empty-icon="i-lucide-users"
				@refresh="users.refresh()"
			>
				<template #header-left>
					<div class="flex flex-wrap items-center gap-2">
						<UInput v-model="filters.search" icon="i-lucide-search" placeholder="Search users…" class="w-64" />
						<USelect v-model="filters.role" :items="roleFilterItems" class="w-36" />
					</div>
				</template>

				<template #id-cell="{ row }">
					<span class="font-mono text-sm">#{{ row.original.id }}</span>
				</template>

				<template #display_name-cell="{ row }">
					<button type="button" class="flex items-center gap-3 text-left" @click="selectedId = row.original.id">
						<UAvatar :src="row.original.avatar_url" :alt="row.original.display_name" size="sm" />
						<div class="min-w-0">
							<p class="truncate font-medium text-white hover:text-primary-300">
								{{ row.original.display_name }}
								<span v-if="row.original.id === me?.id" class="text-sm font-normal text-slate-500">(you)</span>
							</p>
							<p class="truncate text-xs text-slate-500">@{{ row.original.discord_username }}</p>
						</div>
					</button>
				</template>

				<template #discord_id-cell="{ row }">
					<span class="font-mono text-sm text-slate-400">{{ row.original.discord_id }}</span>
				</template>

				<template #role-cell="{ row }">
					<div class="flex flex-wrap gap-1">
						<UBadge :color="getRoleColor(row.original.role)" variant="soft" class="capitalize">{{ row.original.role }}</UBadge>
						<UBadge v-if="row.original.banned" color="error" variant="soft" icon="i-lucide-gavel">Banned</UBadge>
					</div>
				</template>

				<template #last_login_at-cell="{ row }">
					<span class="text-sm text-slate-400">{{ formatDate(row.original.last_login_at) }}</span>
				</template>

				<template #actions-cell="{ row }">
					<UDropdownMenu :items="getRowActions(row.original)">
						<UButton icon="i-lucide-more-horizontal" variant="ghost" color="neutral" size="xs" aria-label="User actions" />
					</UDropdownMenu>
				</template>
			</DashboardDataTable>
		</template>
	</UDashboardPanel>

	<ModerationUserSlideover :user-id="selectedId" @close="selectedId = null" @changed="users.refresh()" />
</template>
