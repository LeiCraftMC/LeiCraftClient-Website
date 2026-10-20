<script setup lang="ts">
/**
 * A user's moderation profile: linked Minecraft accounts, ban state, ban / unban and — for admins —
 * role changes and account deletion. Used by the moderation and the admin user lists.
 */
import { useUserInfoStore } from "~/composables/stores/useUserStore";
import type { ModeratedUserDetail, UserRole } from "~/utils/types";

const props = defineProps<{
	userId: number | null;
}>();

const emit = defineEmits<{ changed: []; close: [] }>();

const toast = useToast();
const { skinURL } = useMinecraftAssets();
const me = await useUserInfoStore().use();
const isAdmin = computed(() => me.value?.role === "admin");

const user = ref<ModeratedUserDetail | null>(null);
const loading = ref(false);

const open = computed({
	get: () => props.userId !== null,
	set: (value) => {
		if (!value) emit("close");
	},
});

async function load() {
	if (props.userId === null) return;
	loading.value = true;
	const res = await useAPI((api) =>
		api.getModerationUsersByUserId({ path: { userId: props.userId as number } }),
	);
	loading.value = false;
	if (!res.success) {
		toast.add({ title: "Failed to load the user", description: res.message, color: "error" });
		emit("close");
		return;
	}
	user.value = res.data;
}

watch(
	() => props.userId,
	(id) => {
		user.value = null;
		if (id !== null) load();
	},
	{ immediate: true },
);

async function afterChange() {
	await load();
	emit("changed");
}

const isSelf = computed(() => user.value?.id === me.value?.id);
/** Admins can't be banned; only admins ban moderators. */
const canBan = computed(
	() =>
		!!user.value &&
		!isSelf.value &&
		user.value.role !== "admin" &&
		(user.value.role === "user" || isAdmin.value),
);
const canUnban = computed(() => !!user.value && (user.value.role === "user" || isAdmin.value));

// Ban
const showBan = ref(false);
const banDuration = ref<number>(0);
const durationItems = [
	{ label: "Permanent", value: 0 },
	{ label: "1 day", value: 1 },
	{ label: "3 days", value: 3 },
	{ label: "7 days", value: 7 },
	{ label: "30 days", value: 30 },
	{ label: "90 days", value: 90 },
	{ label: "1 year", value: 365 },
];

async function ban(reason: string) {
	if (!user.value) return false;
	const res = await useAPI((api) =>
		api.postModerationUsersByUserIdBan({
			path: { userId: user.value?.id as number },
			body: { reason, duration_days: banDuration.value || null },
		}),
	);
	if (!res.success) {
		toast.add({ title: "Ban failed", description: res.message, color: "error" });
		return false;
	}
	toast.add({
		title: `${res.data.display_name} was banned`,
		icon: "i-lucide-gavel",
		color: "success",
	});
	await afterChange();
	return true;
}

const unbanning = ref(false);

async function unban() {
	if (!user.value) return;
	unbanning.value = true;
	const res = await useAPI((api) =>
		api.postModerationUsersByUserIdUnban({ path: { userId: user.value?.id as number } }),
	);
	unbanning.value = false;
	if (!res.success) {
		toast.add({ title: "Unban failed", description: res.message, color: "error" });
		return;
	}
	toast.add({
		title: `${res.data.display_name} was unbanned`,
		icon: "i-lucide-check",
		color: "success",
	});
	await afterChange();
}

// Admin: role
const roleItems: Array<{ label: string; value: UserRole }> = [
	{ label: "User", value: "user" },
	{ label: "Moderator", value: "moderator" },
	{ label: "Admin", value: "admin" },
];
const savingRole = ref(false);

async function changeRole(role: UserRole) {
	if (!user.value || role === user.value.role) return;
	savingRole.value = true;
	const res = await useAPI((api) =>
		api.putAdminUsersByUserId({ path: { userId: user.value?.id as number }, body: { role } }),
	);
	savingRole.value = false;
	if (!res.success) {
		toast.add({ title: "Could not change the role", description: res.message, color: "error" });
		return;
	}
	toast.add({
		title: `${res.data.display_name} is now ${role}`,
		icon: "i-lucide-shield",
		color: "success",
	});
	await afterChange();
}

// Admin: delete
const showDelete = ref(false);

async function deleteUser() {
	if (!user.value) return;
	const res = await useAPI((api) =>
		api.deleteAdminUsersByUserId({ path: { userId: user.value?.id as number } }),
	);
	if (!res.success) {
		toast.add({ title: "Could not delete the user", description: res.message, color: "error" });
		throw new Error(res.message);
	}
	toast.add({ title: "User deleted", icon: "i-lucide-trash-2", color: "success" });
	emit("changed");
	emit("close");
}
</script>

<template>
	<USlideover v-model:open="open" :title="user?.display_name ?? 'User'" :ui="{ content: 'sm:max-w-xl' }">
		<template #body>
			<div v-if="loading && !user" class="flex justify-center py-10">
				<UIcon name="i-lucide-loader-2" class="animate-spin text-2xl text-slate-400" />
			</div>

			<div v-else-if="user" class="space-y-6">
				<div class="flex items-center gap-4">
					<UAvatar :src="user.avatar_url" :alt="user.display_name" size="3xl" />
					<div class="min-w-0 space-y-1">
						<div class="flex flex-wrap items-center gap-2">
							<h3 class="truncate text-lg font-semibold text-white">{{ user.display_name }}</h3>
							<UBadge :color="getRoleColor(user.role)" variant="soft" class="capitalize">{{ user.role }}</UBadge>
							<UBadge v-if="user.banned" color="error" variant="soft" icon="i-lucide-gavel">Banned</UBadge>
						</div>
						<p class="text-sm text-slate-400">@{{ user.discord_username }} · Discord {{ user.discord_id }}</p>
						<p class="text-sm text-slate-500">
							#{{ user.id }} · joined {{ formatDate(user.created_at) }} · last login {{ formatDate(user.last_login_at) }}
						</p>
					</div>
				</div>

				<UAlert
					v-if="user.banned"
					color="error"
					variant="soft"
					icon="i-lucide-gavel"
					:title="user.banned_until ? `Banned until ${formatDate(user.banned_until)}` : 'Banned permanently'"
					:description="`${user.ban_reason ?? 'No reason'} (since ${formatDate(user.banned_at)})`"
				/>

				<div class="space-y-2">
					<h4 class="text-sm font-medium text-slate-300">Minecraft accounts</h4>
					<ul v-if="user.minecraft_accounts.length" class="divide-y divide-slate-800 rounded-lg border border-slate-800">
						<li v-for="account in user.minecraft_accounts" :key="account.uuid" class="flex items-center gap-3 px-3 py-2">
							<SkinPlayerHead :skin="skinURL(account.uuid)" :alt="account.name" class="size-8" />
							<div class="min-w-0 flex-1">
								<NuxtLink :to="`/players/${account.name}`" target="_blank" class="text-sm font-medium text-white hover:text-primary-300">
									{{ account.name }}
								</NuxtLink>
								<p class="truncate font-mono text-xs text-slate-500">{{ account.uuid }}</p>
							</div>
							<UBadge v-if="account.uses_client" color="primary" variant="soft" size="sm">Uses client</UBadge>
						</li>
					</ul>
					<p v-else class="text-sm text-slate-500">No linked accounts.</p>
				</div>

				<div v-if="isAdmin" class="space-y-2">
					<h4 class="text-sm font-medium text-slate-300">Role</h4>
					<USelect
						:model-value="user.role"
						:items="roleItems"
						:disabled="isSelf || savingRole"
						:loading="savingRole"
						class="w-48"
						@update:model-value="changeRole($event as UserRole)"
					/>
					<p class="text-xs text-slate-500">
						{{ isSelf ? "You can't change your own role." : "Moderators review content and ban users; admins manage everything." }}
					</p>
				</div>
			</div>
		</template>

		<template #footer>
			<div v-if="user" class="flex w-full flex-wrap justify-between gap-2">
				<UButton
					v-if="isAdmin && !isSelf"
					color="error"
					variant="ghost"
					icon="i-lucide-trash-2"
					@click="showDelete = true"
				>
					Delete account
				</UButton>
				<span v-else />
				<UButton v-if="user.banned && canUnban" icon="i-lucide-undo-2" :loading="unbanning" @click="unban">Unban</UButton>
				<UButton v-else-if="!user.banned && canBan" color="error" icon="i-lucide-gavel" @click="showBan = true">Ban</UButton>
			</div>
		</template>
	</USlideover>

	<ModerationReasonModal
		v-model:open="showBan"
		:title="`Ban ${user?.display_name ?? 'user'}`"
		description="Their sessions and API keys are revoked and their cape and cosmetics stop showing in-game."
		confirm-label="Ban"
		icon="i-lucide-gavel"
		placeholder="Shown when they try to log in"
		:on-confirm="ban"
	>
		<UFormField label="Duration">
			<USelect v-model="banDuration" :items="durationItems" class="w-full" />
		</UFormField>
	</ModerationReasonModal>

	<DashboardDeleteModal
		v-model:open="showDelete"
		title="Delete account"
		:warning-text="`This deletes ${user?.display_name ?? 'the user'}'s account with everything that belongs only to them. Prefer a ban for rule breaks — a deleted user can sign up again.`"
		:on-delete="deleteUser"
		prevent-auto-close
	/>
</template>
