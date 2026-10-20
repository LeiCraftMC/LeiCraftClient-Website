<script setup lang="ts">
import { useMinecraftAccountsStore } from "~/composables/stores/useMinecraftAccountsStore";
import type { MinecraftAccount } from "~/utils/types";

definePageMeta({
	layout: "dashboard",
});

useSeoMeta({
	title: "Minecraft accounts | LeiCraft Client",
	description: "Linked Minecraft accounts",
});

const toast = useToast();
const accountsStore = useMinecraftAccountsStore();
const accounts = await accountsStore.use();
const { skinURL } = useMinecraftAssets();

const unlinkTarget = ref<MinecraftAccount | null>(null);
const unlinkOpen = ref(false);

function openUnlink(account: MinecraftAccount) {
	unlinkTarget.value = account;
	unlinkOpen.value = true;
}

async function onUnlink() {
	const account = unlinkTarget.value;
	if (!account) return;

	const res = await useAPI((api) =>
		api.deleteAccountMinecraftByUuid({ path: { uuid: account.uuid } }),
	);
	if (!res.success) {
		toast.add({ title: "Unlink failed", description: res.message, color: "error" });
		throw new Error(res.message);
	}
	toast.add({ title: `${account.name} unlinked`, color: "success", icon: "i-lucide-check" });
	await accountsStore.refresh();
}
</script>

<template>
	<UDashboardPanel>
		<template #header>
			<DashboardPageHeader
				title="Minecraft accounts"
				icon="i-lucide-gamepad-2"
				description="Up to 5 accounts, each with its own loadout"
			/>
		</template>

		<template #body>
			<DashboardPageBody>
				<DashboardSectionCard title="Linked accounts" icon="i-lucide-link" flush>
					<ul v-if="accounts?.length" class="divide-y divide-slate-800">
						<li
							v-for="account in accounts"
							:key="account.uuid"
							class="flex flex-wrap items-center gap-4 px-6 py-4"
						>
							<SkinPlayerHead :skin="skinURL(account.uuid)" :alt="account.name" class="size-12" />
							<div class="min-w-0 flex-1">
								<p class="font-medium text-white">{{ account.name }}</p>
								<p class="font-mono text-xs text-slate-500">{{ account.uuid }}</p>
								<p class="mt-1 text-xs text-slate-400">
									Linked {{ formatDate(account.linked_at) }} ·
									{{ account.skin_model === "slim" ? "Slim arms" : "Wide arms" }}
								</p>
							</div>
							<UBadge v-if="account.uses_client" color="primary" variant="soft" icon="i-lucide-badge-check">
								Uses the client
							</UBadge>
							<div class="flex gap-2">
								<UButton
									size="sm"
									variant="soft"
									icon="i-lucide-shirt"
									:to="`/dashboard/wardrobe?account=${account.uuid}`"
								>
									Wardrobe
								</UButton>
								<UButton
									size="sm"
									color="error"
									variant="ghost"
									icon="i-lucide-unlink"
									@click="openUnlink(account)"
								>
									Unlink
								</UButton>
							</div>
						</li>
					</ul>
					<UEmpty
						v-else
						icon="i-lucide-gamepad-2"
						title="No accounts linked"
						description="Link one from inside the game — see below."
						variant="naked"
						class="py-8"
					/>
				</DashboardSectionCard>

				<DashboardSectionCard
					title="Link a Minecraft account"
					description="Linking happens in the game, so only the owner of the account can do it"
					icon="i-lucide-info"
				>
					<ol class="list-decimal space-y-2 pl-5 text-sm text-slate-300">
						<li>
							Install the LeiCraft Client mod
							(<NuxtLink to="/download" class="text-primary hover:underline">download</NuxtLink>)
							and start Minecraft with your Microsoft account.
						</li>
						<li>Open the pause menu and click <strong>LeiCraft Client</strong>.</li>
						<li>
							Click <strong>Link account</strong> — your browser opens this website. Confirm the
							account there. (Or type <code>/leicraftclient link</code> in the chat and click the
							link.)
						</li>
						<li>Done — the game shows "Linked" after a few seconds.</li>
					</ol>
				</DashboardSectionCard>
			</DashboardPageBody>
		</template>
	</UDashboardPanel>

	<DashboardDeleteModal
		v-model:open="unlinkOpen"
		title="Unlink account"
		:warning-text="`${unlinkTarget?.name} loses its equipped cape and cosmetics. You can link it again from the game at any time.`"
		:on-delete="onUnlink"
	/>
</template>
