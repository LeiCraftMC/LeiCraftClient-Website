<script setup lang="ts">
import { useMinecraftAccountsStore } from "~/composables/stores/useMinecraftAccountsStore";
import { useUserInfoStore } from "~/composables/stores/useUserStore";

const toast = useToast();
const userInfoStore = useUserInfoStore();
const userInfo = await userInfoStore.use();

const deleteConfirmOpen = ref(false);

async function onDeleteAccount() {
	const res = await useAPI((api) => api.deleteAccount({}));
	if (!res.success) {
		toast.add({ title: "Deleting failed", description: res.message, color: "error" });
		throw new Error(res.message);
	}

	await userInfoStore.clear();
	await useMinecraftAccountsStore().clear();
	useAppCookies().sessionToken.set(null);
	toast.add({ title: "Account deleted", description: "Goodbye!", color: "success" });
	await navigateTo("/");
}
</script>

<template>
	<template v-if="userInfo">
		<div>
			<h2 class="text-xl font-semibold text-white">Account</h2>
			<p class="mt-1 text-sm text-slate-400">
				Your profile comes from Discord and is refreshed every time you log in.
			</p>
		</div>

		<DashboardSectionCard title="Discord profile" icon="i-lucide-user">
			<div class="flex flex-wrap items-center gap-5">
				<UAvatar :src="userInfo.avatar_url" :alt="userInfo.display_name" size="3xl" />
				<dl class="grid flex-1 gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
					<div>
						<dt class="text-slate-500">Display name</dt>
						<dd class="font-medium text-white">{{ userInfo.display_name }}</dd>
					</div>
					<div>
						<dt class="text-slate-500">Discord username</dt>
						<dd class="font-medium text-white">@{{ userInfo.discord_username }}</dd>
					</div>
					<div>
						<dt class="text-slate-500">Role</dt>
						<dd>
							<UBadge :color="getRoleColor(userInfo.role)" variant="soft" class="capitalize">
								{{ userInfo.role }}
							</UBadge>
						</dd>
					</div>
					<div>
						<dt class="text-slate-500">Member since</dt>
						<dd class="font-medium text-white">{{ formatDate(userInfo.created_at) }}</dd>
					</div>
				</dl>
			</div>
		</DashboardSectionCard>

		<DashboardSectionCard
			title="Danger Zone"
			description="Irreversible and destructive actions"
			icon="i-lucide-alert-triangle"
			tone="danger"
		>
			<div class="flex flex-col gap-4 md:flex-row md:items-center">
				<div class="flex-1">
					<h4 class="font-medium text-white">Delete account</h4>
					<p class="mt-1 text-sm text-slate-400">
						Deletes your LeiCraft Client account, your community page with its uploads, your exclusive
						items and API keys, and unlinks your Minecraft accounts.
					</p>
				</div>
				<UButton
					label="Delete account"
					color="error"
					variant="soft"
					icon="i-lucide-trash-2"
					@click="deleteConfirmOpen = true"
				/>
			</div>
		</DashboardSectionCard>

		<DashboardDeleteModal
			v-model:open="deleteConfirmOpen"
			title="Delete account"
			warning-text="All your data is deleted for good — including exclusive items you can't get back."
			:on-delete="onDeleteAccount"
		/>
	</template>
</template>
