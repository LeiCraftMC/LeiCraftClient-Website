<script setup lang="ts">
/**
 * A player's face (with the hat layer) cut from their skin, drawn pixelated on a 2D canvas.
 * Falls back to an icon while loading or when the skin is unknown.
 */
const props = withDefaults(
	defineProps<{
		skin?: string | null;
		alt?: string;
	}>(),
	{ skin: null, alt: "Player head" },
);

const canvas = ref<HTMLCanvasElement | null>(null);
const loaded = ref(false);

function draw() {
	loaded.value = false;
	if (!import.meta.client || !props.skin) return;

	const image = new Image();
	image.crossOrigin = "anonymous";
	image.onload = () => {
		const ctx = canvas.value?.getContext("2d");
		if (!ctx) return;
		// HD skins are a multiple of 64 px wide.
		const s = image.width / 64;
		ctx.imageSmoothingEnabled = false;
		ctx.clearRect(0, 0, 8, 8);
		ctx.drawImage(image, 8 * s, 8 * s, 8 * s, 8 * s, 0, 0, 8, 8);
		ctx.drawImage(image, 40 * s, 8 * s, 8 * s, 8 * s, 0, 0, 8, 8);
		loaded.value = true;
	};
	image.src = props.skin;
}

onMounted(draw);
watch(() => props.skin, draw);
</script>

<template>
	<span
		class="relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-md bg-slate-800"
		role="img"
		:aria-label="alt"
	>
		<canvas
			v-show="loaded"
			ref="canvas"
			width="8"
			height="8"
			class="h-full w-full"
			style="image-rendering: pixelated"
		/>
		<UIcon v-if="!loaded" name="i-lucide-user" class="h-1/2 w-1/2 text-slate-500" />
	</span>
</template>
