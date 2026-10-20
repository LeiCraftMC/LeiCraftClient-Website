<script setup lang="ts">
import { useMinecraftAccountsStore } from "~/composables/stores/useMinecraftAccountsStore";
import { useUserInfoStore } from "~/composables/stores/useUserStore";

const route = useRoute();
const toast = useToast();
const productId = Number(route.params.id);

if (!Number.isInteger(productId) || productId <= 0) {
	throw createError({ statusCode: 404, statusMessage: "Product not found", fatal: true });
}

const { data: result } = await useAPIAsyncData(
	`shop-product-${productId}`,
	async () =>
		await useAPI((api) => api.getCatalogProductsByProductId({ path: { productId } }), true),
);

if (!result.value?.success) {
	throw createError({
		statusCode: result.value?.code ?? 500,
		statusMessage: result.value?.message ?? "Product not found",
		fatal: true,
	});
}

const product = computed(() => (result.value?.success ? result.value.data : null));

usePageSeo({
	title: `${product.value?.name} — ${product.value?.type === "cape" ? "Cape" : "Cosmetic"} by ${product.value?.page.name} — LeiCraft Client`,
	description:
		product.value?.description ||
		`${product.value?.type === "cape" ? "A cape" : "A cosmetic"} for Minecraft from ${product.value?.page.name}, free to wear with the LeiCraft Client.`,
	ogImage: product.value?.preview?.url ?? product.value?.texture?.url,
});

const { skinURL } = useMinecraftAssets();
const user = await useUserInfoStore().use();
const accountsStore = useMinecraftAccountsStore();
const accounts = await accountsStore.use();

// Preview on the visitor's own skin when they have a linked account.
const selectedUUID = ref<string | undefined>(accounts.value?.[0]?.uuid);
const selectedAccount = computed(() =>
	accounts.value?.find((account) => account.uuid === selectedUUID.value),
);
const accountItems = computed(
	() => accounts.value?.map((account) => ({ label: account.name, value: account.uuid })) ?? [],
);

const previewSlim = ref(selectedAccount.value?.skin_model === "slim");
watch(selectedAccount, (account) => {
	if (account) previewSlim.value = account.skin_model === "slim";
});

// Cosmetic variants: auto-pick by the preview's skin model, or let the visitor choose.
const variantChoice = ref<number | "auto">("auto");
const variantItems = computed(() => [
	{ label: "Automatic", value: "auto" as const },
	...(product.value?.variants ?? []).map((variant) => ({
		label: `${variant.name} — ${SKIN_MODEL_LABELS[variant.skin_model]}`,
		value: variant.id,
	})),
]);

const previewVariant = computed(() => {
	const variants = product.value?.variants ?? [];
	return pickVariant(
		variants,
		variantChoice.value === "auto" ? null : variantChoice.value,
		previewSlim.value ? "slim" : "wide",
	);
});

const viewerCosmetics = computed(() =>
	previewVariant.value
		? [{ texture: previewVariant.value.texture.url, model: previewVariant.value.model.url }]
		: [],
);

const showElytra = ref(false);

// Owned exclusives (only needed to explain why "Equip" is unavailable).
const { data: inventory } = await useAPILazyAsyncData(
	`shop-product-${productId}-inventory`,
	async () => {
		if (!user.value || product.value?.availability !== "exclusive") return [];
		const res = await useAPI((api) => api.getAccountInventory({}), true);
		return res.success ? res.data : [];
	},
);

const ownsProduct = computed(
	() =>
		product.value?.availability === "free" ||
		(inventory.value ?? []).some((item) => item.product.id === productId),
);

const equipping = ref(false);
const loadoutAPI = useLoadoutAPI();

async function equip() {
	const account = selectedAccount.value;
	if (!account || !product.value) return;

	equipping.value = true;
	const current = await loadoutAPI.load(account.uuid);
	if (!current.success) {
		equipping.value = false;
		toast.add({ title: "Could not load your loadout", description: current.message, color: "error" });
		return;
	}

	const body = withProductEquipped(loadoutToBody(current.data), product.value);
	if (body.cosmetics.length > MAX_EQUIPPED_COSMETICS) {
		equipping.value = false;
		toast.add({
			title: "Too many cosmetics",
			description: `You can wear up to ${MAX_EQUIPPED_COSMETICS} cosmetics. Remove one in the wardrobe first.`,
			color: "warning",
		});
		return;
	}

	const saved = await loadoutAPI.save(account.uuid, body);
	equipping.value = false;

	if (!saved.success) {
		toast.add({ title: "Equip failed", description: saved.message, color: "error" });
		return;
	}
	toast.add({
		title: `Equipped on ${account.name}`,
		description: "Other LeiCraft Client players see it within a few minutes.",
		icon: "i-lucide-check",
		color: "success",
	});
}
</script>

<template>
	<UContainer v-if="product" class="space-y-8 py-10">
		<UBreadcrumb
			:items="[
				...shopPageBreadcrumbs(product.page),
				{ label: product.name },
			]"
		/>

		<div class="grid gap-8 lg:grid-cols-5">
			<!-- Preview -->
			<div class="lg:col-span-3">
				<div
					class="relative h-[min(70vh,560px)] overflow-hidden rounded-2xl border border-slate-800 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.12),transparent_70%)]"
				>
					<SkinViewer
						:skin="skinURL(selectedAccount?.uuid)"
						:slim="previewSlim"
						:cape="product.type === 'cape' ? (product.texture?.url ?? null) : null"
						:elytra="showElytra"
						:back="product.type === 'cape'"
						:cosmetics="viewerCosmetics"
						animation="idle"
					/>
					<div class="absolute bottom-3 left-3 right-3 flex flex-wrap items-center gap-2">
						<USelect
							v-if="accountItems.length > 1"
							v-model="selectedUUID"
							:items="accountItems"
							icon="i-lucide-user"
							size="sm"
							class="w-44"
						/>
						<UButton
							v-if="!selectedAccount"
							size="sm"
							color="neutral"
							variant="soft"
							@click="previewSlim = !previewSlim"
						>
							{{ previewSlim ? "Slim arms" : "Wide arms" }}
						</UButton>
						<UButton
							v-if="product.type === 'cape'"
							size="sm"
							color="neutral"
							variant="soft"
							:icon="showElytra ? 'i-lucide-flag' : 'i-lucide-feather'"
							@click="showElytra = !showElytra"
						>
							{{ showElytra ? "Show as cape" : "Show as elytra" }}
						</UButton>
						<USelect
							v-if="product.type === 'cosmetic' && product.variants.length > 1"
							v-model="variantChoice"
							:items="variantItems"
							size="sm"
							class="w-64"
						/>
					</div>
				</div>
				<p class="mt-2 text-center text-xs text-slate-500">Drag to rotate · scroll to zoom</p>
			</div>

			<!-- Details -->
			<div class="space-y-6 lg:col-span-2">
				<div class="space-y-3">
					<div class="flex flex-wrap gap-2">
						<UBadge
							color="neutral"
							variant="soft"
							:icon="product.type === 'cape' ? 'i-lucide-flag' : 'i-lucide-sparkles'"
						>
							{{ product.type === "cape" ? "Cape" : "Cosmetic" }}
						</UBadge>
						<UBadge
							v-if="product.availability === 'exclusive'"
							color="warning"
							variant="soft"
							icon="i-lucide-gem"
						>
							Exclusive
						</UBadge>
						<UBadge v-else color="success" variant="soft" icon="i-lucide-gift">Free</UBadge>
					</div>
					<h1 class="text-3xl font-bold text-white">{{ product.name }}</h1>
					<NuxtLink
						:to="shopPagePath(product.page)"
						class="inline-flex items-center gap-2 text-slate-300 hover:text-primary-300"
					>
						<UIcon :name="CATEGORY_INFO[product.page.category].icon" />
						{{ product.page.name }}
					</NuxtLink>
					<p v-if="product.description" class="whitespace-pre-line text-slate-300">
						{{ product.description }}
					</p>
				</div>

				<UCard class="border-slate-800 bg-slate-900/60">
					<div class="space-y-4">
						<template v-if="!user">
							<p class="text-sm text-slate-400">Log in to wear this in-game.</p>
							<UButton
								block
								icon="i-lucide-log-in"
								:to="`/auth/login?url=${encodeURIComponent(route.fullPath)}`"
							>
								Log in with Discord
							</UButton>
						</template>
						<template v-else-if="!accounts?.length">
							<p class="text-sm text-slate-400">
								Link a Minecraft account first: open the LeiCraft Client options in the game's pause menu
								and click <strong>Link account</strong>.
							</p>
							<UButton block variant="soft" to="/dashboard/accounts" icon="i-lucide-link">
								How to link
							</UButton>
						</template>
						<template v-else-if="!ownsProduct">
							<p class="text-sm text-slate-400">
								This is an exclusive item. You get it with a redeem code or as a gift from
								{{ product.page.name }}.
							</p>
							<UButton block variant="soft" to="/dashboard/inventory" icon="i-lucide-ticket">
								Redeem a code
							</UButton>
						</template>
						<template v-else>
							<UFormField v-if="accountItems.length > 1" label="Minecraft account">
								<USelect v-model="selectedUUID" :items="accountItems" class="w-full" />
							</UFormField>
							<UButton block icon="i-lucide-shirt" :loading="equipping" @click="equip">
								Equip on {{ selectedAccount?.name }}
							</UButton>
							<UButton block color="neutral" variant="ghost" to="/dashboard/wardrobe">
								Open wardrobe
							</UButton>
						</template>
					</div>
				</UCard>

				<div class="grid grid-cols-2 gap-3 text-sm">
					<div class="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
						<p class="text-slate-500">Worn by</p>
						<p class="text-lg font-semibold text-white">{{ product.equip_count }}</p>
					</div>
					<div class="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
						<p class="text-slate-500">Published</p>
						<p class="font-semibold text-white">{{ formatDate(product.published_at) }}</p>
					</div>
					<div
						v-if="product.creator"
						class="col-span-2 flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/40 p-3"
					>
						<UAvatar :src="product.creator.avatar_url" :alt="product.creator.display_name" size="sm" />
						<div>
							<p class="text-slate-500">Created by</p>
							<p class="font-semibold text-white">{{ product.creator.display_name }}</p>
						</div>
					</div>
					<div
						v-if="product.type === 'cosmetic' && product.variants.length"
						class="col-span-2 rounded-lg border border-slate-800 bg-slate-900/40 p-3"
					>
						<p class="mb-2 text-slate-500">Fits</p>
						<div class="flex flex-wrap gap-2">
							<UBadge
								v-for="variant in product.variants"
								:key="variant.id"
								color="neutral"
								variant="soft"
							>
								{{ variant.name }} · {{ SKIN_MODEL_LABELS[variant.skin_model] }}
							</UBadge>
						</div>
					</div>
				</div>

				<div class="flex justify-end">
					<ReportButton target-type="product" :target-id="product.id" />
				</div>
			</div>
		</div>
	</UContainer>
</template>
