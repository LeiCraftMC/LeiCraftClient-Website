<script setup lang="ts">
/**
 * Wardrobe: the user's own collection — exclusives they own (always there) plus the free items
 * they saved in the shop or equipped. Edit the loadout (cape + up to 10 cosmetics) of one linked
 * Minecraft account from it, with a live 3D preview. Loadout changes stay local until "Save"
 * (`PUT /account/minecraft/{uuid}/loadout`); removing an item from the wardrobe applies at once and
 * takes it off every linked account (`DELETE /account/wardrobe/{productId}`).
 */
import { watchDebounced } from "@vueuse/core";
import { useMinecraftAccountsStore } from "~/composables/stores/useMinecraftAccountsStore";
import type { LoadoutBody } from "~/composables/useLoadoutEditor";
import type { Product, WardrobeItem } from "~/utils/types";

definePageMeta({
	layout: "dashboard",
});

useSeoMeta({
	title: "Wardrobe | LeiCraft Client",
	description: "Your capes and cosmetics",
});

const route = useRoute();
const router = useRouter();
const toast = useToast();
const { skinURL } = useMinecraftAssets();
const loadoutAPI = useLoadoutAPI();
const wardrobeAPI = useWardrobeAPI();

const accounts = await useMinecraftAccountsStore().use();
const hasAccounts = computed(() => (accounts.value?.length ?? 0) > 0);

const selectedUUID = ref<string | undefined>(
	accounts.value?.find((account) => account.uuid === route.query.account)?.uuid ??
		accounts.value?.[0]?.uuid,
);
const account = computed(() => accounts.value?.find((a) => a.uuid === selectedUUID.value));
const accountItems = computed(
	() => accounts.value?.map((a) => ({ label: a.name, value: a.uuid })) ?? [],
);

// Products seen so far (loadout + wardrobe pages), to render equipped items by id.
const products = reactive(new Map<number, Product>());

const saved = ref<LoadoutBody>({ cape_product_id: null, cosmetics: [] });
const draft = ref<LoadoutBody>({ cape_product_id: null, cosmetics: [] });
const loadingLoadout = ref(false);
const saving = ref(false);

const dirty = computed(() => JSON.stringify(saved.value) !== JSON.stringify(draft.value));

async function loadLoadout() {
	if (!account.value) return;
	loadingLoadout.value = true;
	const res = await loadoutAPI.load(account.value.uuid);
	loadingLoadout.value = false;

	if (!res.success) {
		toast.add({ title: "Could not load the loadout", description: res.message, color: "error" });
		return;
	}
	if (res.data.cape) products.set(res.data.cape.id, res.data.cape);
	for (const entry of res.data.cosmetics) products.set(entry.product.id, entry.product);

	saved.value = loadoutToBody(res.data);
	draft.value = structuredClone(toRaw(saved.value));
}

watch(selectedUUID, async (uuid) => {
	await router.replace({ query: { ...route.query, account: uuid } });
	await loadLoadout();
});

onMounted(loadLoadout);

// Wardrobe listing
const tab = ref<"cape" | "cosmetic">("cape");
const search = ref("");
const ownedOnly = ref(false);
const items = ref<WardrobeItem[]>([]);
const loadingItems = ref(false);
const hasMore = ref(false);
const PAGE_SIZE = 48;

async function fetchItems(offset: number) {
	loadingItems.value = true;
	const res = await useAPI((api) =>
		api.getAccountWardrobe({
			query: {
				type: tab.value,
				search: search.value.trim() || undefined,
				owned_only: ownedOnly.value ? "true" : undefined,
				limit: PAGE_SIZE,
				offset,
			},
		}),
	);
	loadingItems.value = false;

	if (!res.success) {
		toast.add({ title: "Could not load your wardrobe", description: res.message, color: "error" });
		return;
	}
	for (const item of res.data) products.set(item.product.id, item.product);
	items.value = offset === 0 ? res.data : [...items.value, ...res.data];
	hasMore.value = res.data.length === PAGE_SIZE;
}

watch([tab, ownedOnly], () => fetchItems(0));
watchDebounced(search, () => fetchItems(0), { debounce: 300 });
onMounted(() => fetchItems(0));

// Editing the loadout
function toggle(product: Product) {
	if (!account.value) return;
	if (isEquipped(draft.value, product)) {
		draft.value = withProductRemoved(draft.value, product);
		return;
	}
	if (product.type === "cosmetic" && draft.value.cosmetics.length >= MAX_EQUIPPED_COSMETICS) {
		toast.add({
			title: "Too many cosmetics",
			description: `You can wear up to ${MAX_EQUIPPED_COSMETICS} cosmetics at once.`,
			color: "warning",
		});
		return;
	}
	draft.value = withProductEquipped(draft.value, product);
}

function setVariant(productID: number, variantID: number | "auto") {
	draft.value = {
		...draft.value,
		cosmetics: draft.value.cosmetics.map((entry) =>
			entry.product_id === productID
				? { ...entry, variant_id: variantID === "auto" ? null : variantID }
				: entry,
		),
	};
}

function variantItems(product: Product | undefined) {
	return [
		{ label: "Automatic", value: "auto" as const },
		...(product?.variants ?? []).map((variant) => ({
			label: `${variant.name} — ${SKIN_MODEL_LABELS[variant.skin_model]}`,
			value: variant.id,
		})),
	];
}

function reset() {
	draft.value = structuredClone(toRaw(saved.value));
}

async function save() {
	if (!account.value) return;
	saving.value = true;
	const res = await loadoutAPI.save(account.value.uuid, draft.value);
	saving.value = false;

	if (!res.success) {
		toast.add({ title: "Saving failed", description: res.message, color: "error" });
		return;
	}
	saved.value = loadoutToBody(res.data);
	draft.value = structuredClone(toRaw(saved.value));
	toast.add({
		title: "Saved",
		description: "Players with the LeiCraft Client see your new look within a few minutes.",
		icon: "i-lucide-check",
		color: "success",
	});
}

// Removing from the wardrobe (applies right away, on every linked account)
const removing = ref<number | null>(null);

async function removeFromWardrobe(item: WardrobeItem) {
	removing.value = item.product.id;
	const res = await wardrobeAPI.remove(item.product.id);
	removing.value = null;

	if (!res.success) {
		toast.add({ title: "Could not remove it", description: res.message, color: "error" });
		return;
	}

	const wasWorn = isEquipped(saved.value, item.product) || isEquipped(draft.value, item.product);
	items.value = items.value.filter((entry) => entry.product.id !== item.product.id);
	saved.value = withProductRemoved(saved.value, item.product);
	draft.value = withProductRemoved(draft.value, item.product);

	toast.add({
		title: `${item.product.name} removed`,
		description: wasWorn
			? "It is no longer in your wardrobe and was taken off your Minecraft accounts."
			: "You can save it again from the shop any time.",
		icon: "i-lucide-trash-2",
		color: "neutral",
	});
}

// Preview
const previewCape = computed(() => {
	const id = draft.value.cape_product_id;
	return id ? (products.get(id)?.texture?.url ?? null) : null;
});

const previewCosmetics = computed(() =>
	draft.value.cosmetics.flatMap((entry) => {
		const product = products.get(entry.product_id);
		const variant = product
			? pickVariant(product.variants, entry.variant_id, account.value?.skin_model)
			: undefined;
		return variant ? [{ texture: variant.texture.url, model: variant.model.url }] : [];
	}),
);

const equippedCosmetics = computed(() =>
	draft.value.cosmetics.map((entry) => ({ entry, product: products.get(entry.product_id) })),
);

const tabItems = [
	{ label: "Capes", value: "cape", icon: "i-lucide-flag" },
	{ label: "Cosmetics", value: "cosmetic", icon: "i-lucide-sparkles" },
];

const shopLink = "/shop";

const emptyState = computed(() => {
	if (search.value.trim()) {
		return {
			title: "Nothing matches",
			description: "No item in your wardrobe matches your search.",
		};
	}
	if (ownedOnly.value) {
		return {
			title: "No exclusives yet",
			description:
				"Exclusive items come from redeem codes, giveaways and partners — they stay in your wardrobe for good.",
		};
	}
	return {
		title:
			tab.value === "cape" ? "No capes in your wardrobe yet" : "No cosmetics in your wardrobe yet",
		description:
			"Save items in the shop — or equip one — and they show up here and in the in-game wardrobe.",
	};
});
</script>

<template>
	<UDashboardPanel>
		<template #header>
			<DashboardPageHeader title="Wardrobe" icon="i-lucide-shirt" description="Your capes and cosmetics" />
		</template>

		<template #body>
			<DashboardPageBody>
				<div class="flex flex-col gap-3 sm:flex-row sm:items-center">
					<USelect
						v-if="accountItems.length > 1"
						v-model="selectedUUID"
						:items="accountItems"
						icon="i-lucide-user"
						class="w-full sm:w-56"
					/>
					<p v-else-if="account" class="flex items-center gap-2 text-sm text-slate-400">
						<SkinPlayerHead :skin="skinURL(account.uuid)" :alt="account.name" class="size-5" />
						Wearing on <span class="font-medium text-white">{{ account.name }}</span>
					</p>
					<UButton
						:to="shopLink"
						icon="i-lucide-shopping-bag"
						color="neutral"
						variant="outline"
						class="justify-center sm:ml-auto"
					>
						Explore the shop
					</UButton>
				</div>

				<UAlert
					v-if="!hasAccounts"
					color="primary"
					variant="soft"
					icon="i-lucide-link"
					title="Link a Minecraft account to wear these"
					description="Your wardrobe belongs to your LeiCraft Client account; what you wear belongs to a Minecraft account. Link one from the game: pause menu → LeiCraftClient → Link account."
					:actions="[{ label: 'How to link', to: '/dashboard/accounts', color: 'primary', variant: 'soft' }]"
				/>

				<div :class="['grid gap-6', hasAccounts ? 'xl:grid-cols-5' : '']">
					<!-- Preview + equipped -->
					<div v-if="hasAccounts" class="space-y-4 xl:col-span-2">
						<div class="space-y-4 xl:sticky xl:top-4">
							<div
								class="relative h-96 overflow-hidden rounded-2xl border border-slate-800 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.12),transparent_70%)] sm:h-110"
							>
								<SkinViewer
									:skin="skinURL(account?.uuid)"
									:slim="account?.skin_model === 'slim'"
									:cape="previewCape"
									:cosmetics="previewCosmetics"
									animation="idle"
								/>
								<div
									v-if="loadingLoadout"
									class="absolute inset-0 flex items-center justify-center bg-slate-950/60"
								>
									<UIcon name="i-lucide-loader-2" class="animate-spin text-3xl text-slate-400" />
								</div>
							</div>

							<div class="flex items-center gap-2">
								<UButton
									color="neutral"
									variant="ghost"
									icon="i-lucide-undo-2"
									:disabled="!dirty || saving"
									@click="reset"
								>
									Reset
								</UButton>
								<UBadge v-if="dirty" color="warning" variant="soft">Unsaved changes</UBadge>
								<UButton
									class="ml-auto"
									icon="i-lucide-save"
									:loading="saving"
									:disabled="!dirty"
									@click="save"
								>
									Save
								</UButton>
							</div>

							<DashboardSectionCard
								:title="`Cosmetics (${draft.cosmetics.length}/${MAX_EQUIPPED_COSMETICS})`"
								icon="i-lucide-sparkles"
								flush
							>
								<ul v-if="equippedCosmetics.length" class="divide-y divide-slate-800">
									<li
										v-for="{ entry, product } in equippedCosmetics"
										:key="entry.product_id"
										class="flex flex-wrap items-center gap-3 px-6 py-3"
									>
										<span class="min-w-0 flex-1 truncate text-white">
											{{ product?.name ?? `Product ${entry.product_id}` }}
										</span>
										<USelect
											v-if="(product?.variants.length ?? 0) > 1"
											:model-value="entry.variant_id ?? 'auto'"
											:items="variantItems(product)"
											size="sm"
											class="w-full sm:w-56"
											@update:model-value="(value) => setVariant(entry.product_id, value as number | 'auto')"
										/>
										<UButton
											size="sm"
											color="neutral"
											variant="ghost"
											icon="i-lucide-x"
											aria-label="Take off"
											@click="product && toggle(product)"
										/>
									</li>
								</ul>
								<p v-else class="px-6 py-4 text-sm text-slate-400">No cosmetics equipped.</p>
							</DashboardSectionCard>
						</div>
					</div>

					<!-- Wardrobe items -->
					<div :class="['space-y-4', hasAccounts ? 'xl:col-span-3' : '']">
						<div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
							<UTabs v-model="tab" :items="tabItems" :content="false" variant="pill" size="sm" />
							<USwitch v-model="ownedOnly" label="Exclusives only" />
							<UInput
								v-model="search"
								icon="i-lucide-search"
								placeholder="Search your wardrobe…"
								class="w-full sm:ml-auto sm:w-56"
							/>
						</div>

						<div v-if="tab === 'cape' && hasAccounts" class="flex">
							<UButton
								color="neutral"
								:variant="draft.cape_product_id === null ? 'solid' : 'outline'"
								icon="i-lucide-circle-slash"
								@click="draft = { ...draft, cape_product_id: null }"
							>
								No cape
							</UButton>
						</div>

						<div v-if="items.length" class="grid grid-cols-2 gap-3 sm:grid-cols-3 2xl:grid-cols-4">
							<div
								v-for="item in items"
								:key="item.product.id"
								:role="hasAccounts ? 'button' : undefined"
								:tabindex="hasAccounts ? 0 : undefined"
								:aria-pressed="hasAccounts ? isEquipped(draft, item.product) : undefined"
								:class="['text-left', hasAccounts ? 'cursor-pointer' : '']"
								@click="toggle(item.product)"
								@keydown.enter.prevent="toggle(item.product)"
								@keydown.space.prevent="toggle(item.product)"
							>
								<CatalogProductCard
									:product="item.product"
									:to="null"
									:selected="isEquipped(draft, item.product)"
									:subtitle="item.page.name"
								>
									<div class="flex items-center justify-between gap-2 pt-1">
										<span v-if="!item.removable" class="flex items-center gap-1 text-xs text-amber-300/80">
											<UIcon name="i-lucide-lock" />
											Always yours
										</span>
										<NuxtLink
											v-else
											:to="`/shop/products/${item.product.id}`"
											class="text-xs text-slate-500 hover:text-primary-300"
											@click.stop
										>
											View in shop
										</NuxtLink>
										<UButton
											v-if="item.removable"
											size="xs"
											color="neutral"
											variant="ghost"
											icon="i-lucide-trash-2"
											:loading="removing === item.product.id"
											:aria-label="`Remove ${item.product.name} from your wardrobe`"
											@click.stop="removeFromWardrobe(item)"
										/>
									</div>
								</CatalogProductCard>
							</div>

							<NuxtLink
								:to="shopLink"
								class="group flex min-h-48 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-700 p-6 text-center transition hover:-translate-y-0.5 hover:border-primary-400/60"
							>
								<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-500/10">
									<UIcon name="i-lucide-plus" class="text-2xl text-primary-400" />
								</div>
								<span class="font-medium text-white group-hover:text-primary-300">Explore more</span>
								<span class="text-xs text-slate-400">Find new capes and cosmetics in the shop</span>
							</NuxtLink>
						</div>

						<UEmpty
							v-else-if="!loadingItems"
							icon="i-lucide-shirt"
							:title="emptyState.title"
							:description="emptyState.description"
							variant="naked"
							:actions="[
								ownedOnly
									? { label: 'Redeem a code', to: '/dashboard/inventory', icon: 'i-lucide-ticket' }
									: { label: 'Explore the shop', to: shopLink, icon: 'i-lucide-shopping-bag' },
							]"
						/>

						<div class="flex justify-center">
							<UIcon
								v-if="loadingItems && !items.length"
								name="i-lucide-loader-2"
								class="animate-spin text-3xl text-slate-400"
							/>
							<UButton
								v-else-if="hasMore"
								color="neutral"
								variant="outline"
								icon="i-lucide-chevrons-down"
								:loading="loadingItems"
								@click="fetchItems(items.length)"
							>
								Load more
							</UButton>
						</div>
					</div>
				</div>
			</DashboardPageBody>
		</template>
	</UDashboardPanel>
</template>
