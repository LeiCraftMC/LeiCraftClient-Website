<script setup lang="ts">
import type { InventoryItem } from "~/utils/types";

definePageMeta({
	layout: "dashboard",
});

useSeoMeta({
	title: "Inventory | LeiCraft Client",
	description: "Your exclusive items and redeem codes",
});

const toast = useToast();
const route = useRoute();

const inventory = await useAPIAsyncData<InventoryItem[]>("account-inventory", async () => {
	const res = await useAPI((api) => api.getAccountInventory({}));
	if (!res.success) {
		toast.add({ title: "Failed to load your inventory", description: res.message, color: "error" });
		return [];
	}
	return res.data;
});

// `?code=…` pre-fills the form, so giveaway links can point straight here.
const code = ref(route.query.code?.toString() ?? "");
const redeeming = ref(false);

async function redeem() {
	const value = code.value.trim();
	if (!value) return;

	redeeming.value = true;
	const res = await useAPI((api) => api.postAccountInventoryRedeem({ body: { code: value } }));
	redeeming.value = false;

	if (!res.success) {
		toast.add({
			title: "Code not redeemed",
			description: res.message,
			icon: "i-lucide-alert-circle",
			color: "error",
		});
		return;
	}

	const names = res.data.products.map((product) => product.name).join(", ");
	toast.add({
		title: res.data.granted_product_ids.length ? "Code redeemed!" : "Already in your inventory",
		description: names ? `You got: ${names}` : undefined,
		icon: "i-lucide-gift",
		color: "success",
	});
	code.value = "";
	await inventory.refresh();
}
</script>

<template>
	<UDashboardPanel>
		<template #header>
			<DashboardPageHeader title="Inventory" icon="i-lucide-gem" description="Exclusive items you own" />
		</template>

		<template #body>
			<DashboardPageBody>
				<DashboardSectionCard
					title="Redeem a code"
					description="Codes from giveaways, partners and events"
					icon="i-lucide-ticket"
				>
					<form class="flex flex-wrap gap-2" @submit.prevent="redeem">
						<UInput
							v-model="code"
							placeholder="XXXX-XXXX-XXXX"
							icon="i-lucide-ticket"
							size="lg"
							class="w-full font-mono uppercase sm:w-80"
							autocomplete="off"
							:maxlength="40"
						/>
						<UButton type="submit" size="lg" icon="i-lucide-gift" :loading="redeeming" :disabled="!code.trim()">
							Redeem
						</UButton>
					</form>
				</DashboardSectionCard>

				<div v-if="inventory.data.value?.length" class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
					<CatalogProductCard
						v-for="item in inventory.data.value"
						:key="item.product.id"
						:product="item.product"
						:to="item.available ? undefined : null"
					>
						<p class="text-xs text-slate-500">
							{{ item.source === "code" ? "Redeemed" : "Gift" }} · {{ formatDate(item.created_at) }}
						</p>
						<UBadge v-if="!item.available" color="neutral" variant="soft" size="sm">
							Currently unavailable
						</UBadge>
					</CatalogProductCard>
				</div>

				<UEmpty
					v-else-if="!inventory.loading.value"
					icon="i-lucide-gem"
					title="No exclusive items yet"
					description="Free items need no inventory — equip them in the wardrobe. Exclusives come from redeem codes and gifts."
				>
					<template #actions>
						<UButton to="/dashboard/wardrobe" icon="i-lucide-shirt">Open wardrobe</UButton>
					</template>
				</UEmpty>
			</DashboardPageBody>
		</template>
	</UDashboardPanel>
</template>
