<script setup lang="ts">
/**
 * Wardrobe: edit the loadout (cape + up to 10 cosmetics) of one linked Minecraft account with a
 * live 3D preview. Changes stay local until "Save" (`PUT /account/minecraft/{uuid}/loadout`).
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
	description: "Equip capes and cosmetics",
});

const route = useRoute();
const router = useRouter();
const toast = useToast();
const { skinURL } = useMinecraftAssets();
const loadoutAPI = useLoadoutAPI();

const accounts = await useMinecraftAccountsStore().use();

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
		toast.add({ title: "Could not load items", description: res.message, color: "error" });
		return;
	}
	for (const item of res.data) products.set(item.product.id, item.product);
	items.value = offset === 0 ? res.data : [...items.value, ...res.data];
	hasMore.value = res.data.length === PAGE_SIZE;
}

watch([tab, ownedOnly], () => fetchItems(0));
watchDebounced(search, () => fetchItems(0), { debounce: 300 });
onMounted(() => fetchItems(0));

// Editing
function toggle(product: Product) {
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
</script>

<template>
	<UDashboardPanel>
		<template #header>
			<DashboardPageHeader title="Wardrobe" icon="i-lucide-shirt" description="What you wear in-game">
				<template #right>
					<USelect
						v-if="accountItems.length > 1"
						v-model="selectedUUID"
						:items="accountItems"
						icon="i-lucide-user"
						class="w-48"
					/>
				</template>
			</DashboardPageHeader>
		</template>

		<template #body>
			<UEmpty
				v-if="!accounts?.length"
				icon="i-lucide-link"
				title="Link a Minecraft account first"
				description="Your loadout belongs to a Minecraft account. Link one from the game: pause menu → LeiCraft Client → Link account."
			>
				<template #actions>
					<UButton to="/dashboard/accounts" icon="i-lucide-info">How to link</UButton>
				</template>
			</UEmpty>

			<div v-else class="grid gap-6 xl:grid-cols-5">
				<!-- Preview + equipped -->
				<div class="space-y-4 xl:col-span-2">
					<div class="xl:sticky xl:top-4 space-y-4">
						<div
							class="relative h-110 overflow-hidden rounded-2xl border border-slate-800 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.12),transparent_70%)]"
						>
							<SkinViewer
								:skin="skinURL(account?.uuid)"
								:slim="account?.skin_model === 'slim'"
								:cape="previewCape"
								:cosmetics="previewCosmetics"
								animation="idle"
							/>
							<div v-if="loadingLoadout" class="absolute inset-0 flex items-center justify-center bg-slate-950/60">
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
										class="w-56"
										@update:model-value="(value) => setVariant(entry.product_id, value as number | 'auto')"
									/>
									<UButton
										size="sm"
										color="neutral"
										variant="ghost"
										icon="i-lucide-x"
										aria-label="Remove"
										@click="product && toggle(product)"
									/>
								</li>
							</ul>
							<p v-else class="px-6 py-4 text-sm text-slate-400">No cosmetics equipped.</p>
						</DashboardSectionCard>
					</div>
				</div>

				<!-- Items -->
				<div class="space-y-4 xl:col-span-3">
					<div class="flex flex-wrap items-center gap-3">
						<UTabs v-model="tab" :items="tabItems" :content="false" variant="pill" size="sm" />
						<USwitch v-model="ownedOnly" label="Exclusives only" />
						<UInput v-model="search" icon="i-lucide-search" placeholder="Search…" class="ml-auto w-56" />
					</div>

					<div v-if="tab === 'cape'" class="flex">
						<UButton
							color="neutral"
							:variant="draft.cape_product_id === null ? 'solid' : 'outline'"
							icon="i-lucide-circle-slash"
							@click="draft = { ...draft, cape_product_id: null }"
						>
							No cape
						</UButton>
					</div>

					<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 2xl:grid-cols-4">
						<button
							v-for="item in items"
							:key="item.product.id"
							type="button"
							class="text-left"
							@click="toggle(item.product)"
						>
							<CatalogProductCard
								:product="item.product"
								:to="null"
								:selected="isEquipped(draft, item.product)"
								:subtitle="item.page.name"
							/>
						</button>
					</div>

					<UEmpty
						v-if="!items.length && !loadingItems"
						icon="i-lucide-package-open"
						title="Nothing found"
						:description="ownedOnly ? 'You own no exclusive items of this type yet.' : 'No items match your search.'"
						variant="naked"
					/>

					<div class="flex justify-center">
						<UIcon v-if="loadingItems && !items.length" name="i-lucide-loader-2" class="animate-spin text-3xl text-slate-400" />
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
		</template>
	</UDashboardPanel>
</template>
