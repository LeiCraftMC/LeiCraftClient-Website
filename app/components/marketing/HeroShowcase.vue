<script setup lang="ts">
/**
 * The landing page's 3D player: real looks of random LeiCraft Client players (`GET
 * /players/showcase` — skin, cape and cosmetics as they wear them), switching every few seconds.
 * Falls back to the newest cape in the shop while nobody wears anything yet.
 */
import type { ShowcaseProfile } from "~/utils/types";

const { fallbackCape = null } = defineProps<{
	fallbackCape?: string | null;
}>();

const ROTATE_EVERY_MS = 7000;

const { skinURL } = useMinecraftAssets();

const { data: players } = await useAPILazyAsyncData<ShowcaseProfile[]>(
	"home-showcase",
	async () => {
		const res = await useAPI((api) => api.getPlayersShowcase({ query: { limit: 6 } }), true);
		return res.success ? res.data : [];
	},
);

const index = ref(0);
const paused = ref(false);
const count = computed(() => players.value?.length ?? 0);
const current = computed(() =>
	count.value ? players.value?.[index.value % count.value] : undefined,
);

const cosmetics = computed(() =>
	(current.value?.cosmetics ?? []).flatMap((cosmetic) => {
		const variant = pickVariant(cosmetic.variants, cosmetic.variant_id, current.value?.skin_model);
		return variant ? [{ texture: variant.texture.url, model: variant.model.url }] : [];
	}),
);

const wearing = computed(() => {
	const player = current.value;
	if (!player) return "";
	const parts = [
		player.cape ? "a cape" : "",
		player.cosmetics.length === 1
			? "1 cosmetic"
			: player.cosmetics.length
				? `${player.cosmetics.length} cosmetics`
				: "",
	].filter(Boolean);
	return parts.join(" and ");
});

let timer: ReturnType<typeof setInterval> | undefined;
onMounted(() => {
	timer = setInterval(() => {
		if (!paused.value && count.value > 1) index.value = (index.value + 1) % count.value;
	}, ROTATE_EVERY_MS);
});
onBeforeUnmount(() => clearInterval(timer));
</script>

<template>
	<div
		class="relative mx-auto flex h-110 w-full max-w-sm flex-col"
		@mouseenter="paused = true"
		@mouseleave="paused = false"
	>
		<div class="min-h-0 flex-1">
			<SkinViewer
				:skin="current ? skinURL(current.uuid) : null"
				:slim="current?.skin_model === 'slim'"
				:cape="current ? (current.cape?.texture.url ?? null) : fallbackCape"
				:cosmetics="cosmetics"
				animation="walk"
				auto-rotate
			/>
		</div>

		<div class="flex flex-col items-center gap-2">
			<NuxtLink
				v-if="current"
				:to="`/players/${encodeURIComponent(current.name)}`"
				class="flex max-w-full items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 py-1.5 pr-4 pl-1.5 text-sm backdrop-blur transition hover:border-primary-400/50"
			>
				<SkinPlayerHead :skin="skinURL(current.uuid)" :alt="current.name" class="size-6 rounded-full" />
				<span class="truncate text-slate-300">
					<span class="font-semibold text-white">{{ current.name }}</span>
					<span v-if="wearing"> wears {{ wearing }}</span>
				</span>
			</NuxtLink>
			<p v-else class="text-sm text-slate-500">The newest cape in the shop</p>

			<div v-if="count > 1" class="flex gap-1.5" role="group" aria-label="Showcased players">
				<button
					v-for="(player, i) in players"
					:key="player.uuid"
					type="button"
					:aria-pressed="i === index"
					:aria-label="`Show ${player.name}`"
					:class="[
						'h-1.5 rounded-full transition-all',
						i === index ? 'w-6 bg-primary-400' : 'w-1.5 bg-slate-700 hover:bg-slate-500',
					]"
					@click="index = i"
				/>
			</div>
		</div>
	</div>
</template>
