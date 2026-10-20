<script setup lang="ts">
import { useMinecraftAccountsStore } from "~/composables/stores/useMinecraftAccountsStore";
import { useUserInfoStore } from "~/composables/stores/useUserStore";
import type { InventoryItem, StudioPage } from "~/utils/types";

definePageMeta({
	layout: "dashboard",
});

useSeoMeta({
	title: "Dashboard | LeiCraft Client",
	description: "Your LeiCraft Client account",
});

const user = await useUserInfoStore().use();
const accountsStore = useMinecraftAccountsStore();
const accounts = await accountsStore.use();
const { skinURL } = useMinecraftAssets();

const { data: inventory, loading: loadingInventory } = await useAPILazyAsyncData<InventoryItem[]>(
	"dashboard-inventory",
	async () => {
		const res = await useAPI((api) => api.getAccountInventory({}));
		return res.success ? res.data : [];
	},
);

const { data: pages, loading: loadingPages } = await useAPILazyAsyncData<StudioPage[]>(
	"dashboard-studio-pages",
	async () => {
		const res = await useAPI((api) => api.getStudioPages({ query: {} }));
		return res.success ? res.data : [];
	},
);

const quickActions = [
	{ label: "Open wardrobe", icon: "i-lucide-shirt", to: "/dashboard/wardrobe" },
	{ label: "Browse the shop", icon: "i-lucide-shopping-bag", to: "/shop" },
	{ label: "Redeem a code", icon: "i-lucide-ticket", to: "/dashboard/inventory" },
	{ label: "Upload your own", icon: "i-lucide-upload", to: "/dashboard/studio" },
];
</script>

<template>
	<UDashboardPanel>
		<template #header>
			<DashboardPageHeader
				:title="`Hi, ${user?.display_name ?? 'there'}`"
				icon="i-lucide-layout-dashboard"
				description="Your LeiCraft Client account"
			/>
		</template>

		<template #body>
			<DashboardPageBody>
				<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<DashboardStatCard
						label="Linked Minecraft accounts"
						:value="accounts?.length ?? 0"
						icon="i-lucide-gamepad-2"
					/>
					<DashboardStatCard
						label="Exclusive items"
						:value="inventory?.length ?? 0"
						:loading="loadingInventory"
						icon="i-lucide-gem"
						icon-color="amber"
					/>
					<DashboardStatCard
						label="Studio pages"
						:value="pages?.length ?? 0"
						:loading="loadingPages"
						icon="i-lucide-palette"
						icon-color="emerald"
					/>
				</div>

				<DashboardSectionCard
					title="Minecraft accounts"
					description="Each account has its own cape and cosmetics"
					icon="i-lucide-gamepad-2"
				>
					<template #actions>
						<UButton size="sm" variant="soft" to="/dashboard/accounts" icon="i-lucide-settings-2">
							Manage
						</UButton>
					</template>

					<div v-if="accounts?.length" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						<NuxtLink
							v-for="account in accounts"
							:key="account.uuid"
							:to="`/dashboard/wardrobe?account=${account.uuid}`"
							class="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/60 p-3 transition hover:border-primary-400/50"
						>
							<SkinPlayerHead :skin="skinURL(account.uuid)" :alt="account.name" class="size-10" />
							<div class="min-w-0 flex-1">
								<p class="truncate font-medium text-white">{{ account.name }}</p>
								<p class="text-xs text-slate-400">
									{{ account.uses_client ? "Plays with LeiCraft Client" : "Not seen recently" }}
								</p>
							</div>
							<UIcon name="i-lucide-shirt" class="text-slate-500" />
						</NuxtLink>
					</div>

					<UEmpty
						v-else
						icon="i-lucide-link"
						title="No Minecraft account linked yet"
						description="Start the game with the LeiCraft Client mod, open the pause menu → LeiCraft Client → Link account."
						variant="naked"
					>
						<template #actions>
							<UButton to="/download" icon="i-lucide-download">Get the mod</UButton>
						</template>
					</UEmpty>
				</DashboardSectionCard>

				<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
					<UButton
						v-for="action in quickActions"
						:key="action.label"
						:to="action.to"
						:icon="action.icon"
						color="neutral"
						variant="outline"
						size="lg"
						block
						class="justify-start"
					>
						{{ action.label }}
					</UButton>
				</div>
			</DashboardPageBody>
		</template>
	</UDashboardPanel>
</template>
