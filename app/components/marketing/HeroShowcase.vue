<script setup lang="ts">
/**
 * The landing page's 3D player: the real look of one random LeiCraftClient player (`GET
 * /players/showcase` — skin, cape and cosmetics as they wear them), picked anew on every page
 * load. Falls back to the newest cape in the shop while nobody wears anything yet.
 */
import type { ShowcaseProfile } from "~/utils/types";

const { fallbackCape = null } = defineProps<{
	fallbackCape?: string | null;
}>();

const { skinURL } = useMinecraftAssets();

const { data: player } = await useAPILazyAsyncData<ShowcaseProfile | null>(
	"home-showcase",
	async () => {
		const res = await useAPI((api) => api.getPlayersShowcase({ query: { limit: 1 } }), true);
		return res.success ? (res.data[0] ?? null) : null;
	},
);

const cosmetics = computed(() =>
	(player.value?.cosmetics ?? []).flatMap((cosmetic) => {
		const variant = pickVariant(cosmetic.variants, cosmetic.variant_id, player.value?.skin_model);
		return variant ? [{ texture: variant.texture.url, model: variant.model.url }] : [];
	}),
);

const wearing = computed(() => {
	if (!player.value) return "";
	const cosmeticCount = player.value.cosmetics.length;
	const parts = [
		player.value.cape ? "a cape" : "",
		cosmeticCount === 1 ? "1 cosmetic" : cosmeticCount ? `${cosmeticCount} cosmetics` : "",
	].filter(Boolean);
	return parts.join(" and ");
});
</script>

<template>
	<div class="relative mx-auto flex h-110 w-full max-w-sm flex-col">
		<div class="min-h-0 flex-1">
			<SkinViewer
				:skin="player ? skinURL(player.uuid) : null"
				:slim="player?.skin_model === 'slim'"
				:cape="player ? (player.cape?.texture.url ?? null) : fallbackCape"
				:cosmetics="cosmetics"
				animation="walk"
				auto-rotate
			/>
		</div>

		<div class="flex justify-center">
			<NuxtLink
				v-if="player"
				:to="`/players/${encodeURIComponent(player.name)}`"
				class="flex max-w-full items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 py-1.5 pr-4 pl-1.5 text-sm backdrop-blur transition hover:border-primary-400/50"
			>
				<SkinPlayerHead :skin="skinURL(player.uuid)" :alt="player.name" class="size-6 rounded-full" />
				<span class="truncate text-slate-300">
					<span class="font-semibold text-white">{{ player.name }}</span>
					<span v-if="wearing"> wears {{ wearing }}</span>
				</span>
			</NuxtLink>
			<p v-else class="text-sm text-slate-500">The newest cape in the shop</p>
		</div>
	</div>
</template>
