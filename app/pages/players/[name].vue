<script setup lang="ts">
import type { ProductDetail } from "~/utils/types";

const route = useRoute();
const name = route.params.name as string;

const { data: result } = await useAPIAsyncData(
	`player-${name.toLowerCase()}`,
	async () => await useAPI((api) => api.getPlayersByNameByName({ path: { name } })),
);

if (!result.value?.success) {
	throw createError({
		statusCode:
			(result.value?.code as number | undefined) === 404 ? 404 : (result.value?.code ?? 500),
		statusMessage:
			(result.value?.code as number | undefined) === 404
				? "This player hasn't used the LeiCraft Client yet"
				: result.value?.message,
		fatal: true,
	});
}

const profile = computed(() => (result.value?.success ? result.value.data : null));

usePageSeo({
	title: `${profile.value?.name} — LeiCraft Client`,
	description: `The capes and cosmetics ${profile.value?.name} wears with the LeiCraft Client.`,
});

const { skinURL } = useMinecraftAssets();

// The same variant choice the mod makes, by the skin model of the player's last handshake.
const viewerCosmetics = computed(() =>
	(profile.value?.cosmetics ?? []).flatMap((cosmetic) => {
		const variant = pickVariant(cosmetic.variants, cosmetic.variant_id, profile.value?.skin_model);
		return variant ? [{ texture: variant.texture.url, model: variant.model.url }] : [];
	}),
);

const productIDs = computed(() => [
	...(profile.value?.cape ? [profile.value.cape.product_id] : []),
	...(profile.value?.cosmetics ?? []).map((cosmetic) => cosmetic.product_id),
]);

// Names and pages of what they wear (the render-ready profile only has ids).
const { data: products } = await useAPILazyAsyncData<ProductDetail[]>(
	`player-${name.toLowerCase()}-products`,
	async () => {
		const details = await Promise.all(
			productIDs.value.map((productId) =>
				useAPI((api) => api.getCatalogProductsByProductId({ path: { productId } }), true),
			),
		);
		return details.flatMap((res) => (res.success ? [res.data] : []));
	},
);
</script>

<template>
	<UContainer v-if="profile" class="grid gap-8 py-10 lg:grid-cols-5">
		<div class="lg:col-span-3">
			<div
				class="h-[min(70vh,560px)] overflow-hidden rounded-2xl border border-slate-800 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.12),transparent_70%)]"
			>
				<SkinViewer
					:skin="skinURL(profile.uuid)"
					:slim="profile.skin_model === 'slim'"
					:cape="profile.cape?.texture.url ?? null"
					:cosmetics="viewerCosmetics"
					animation="walk"
				/>
			</div>
		</div>

		<div class="space-y-6 lg:col-span-2">
			<div class="flex items-center gap-4">
				<SkinPlayerHead :skin="skinURL(profile.uuid)" :alt="profile.name" class="h-16 w-16" />
				<div>
					<h1 class="text-3xl font-bold text-white">{{ profile.name }}</h1>
					<UBadge
						v-if="profile.uses_client"
						color="primary"
						variant="soft"
						icon="i-lucide-badge-check"
					>
						LeiCraft Client player
					</UBadge>
				</div>
			</div>

			<div class="space-y-3">
				<h2 class="font-semibold text-white">Wearing</h2>
				<UEmpty
					v-if="!productIDs.length"
					icon="i-lucide-shirt"
					title="Nothing equipped"
					variant="naked"
				/>
				<div v-else class="grid grid-cols-2 gap-3">
					<CatalogProductCard
						v-for="product in products ?? []"
						:key="product.id"
						:product="product"
						:subtitle="product.page.name"
					/>
				</div>
			</div>
		</div>
	</UContainer>
</template>
