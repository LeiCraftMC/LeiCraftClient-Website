<script setup lang="ts">
/**
 * The visible back side of a cape, cut from its 2:1 texture and drawn pixelated — a cheap
 * preview for shop tiles (no WebGL).
 */
const props = defineProps<{
	texture: string;
	alt?: string;
}>();

const canvas = ref<HTMLCanvasElement | null>(null);
const loaded = ref(false);

function draw() {
	loaded.value = false;
	if (!import.meta.client) return;

	const image = new Image();
	image.crossOrigin = "anonymous";
	image.onload = () => {
		const ctx = canvas.value?.getContext("2d");
		if (!ctx) return;
		// In the 64×32 cape layout the outer face is the 10×16 block at (1, 1).
		const s = image.width / 64;
		ctx.imageSmoothingEnabled = false;
		ctx.clearRect(0, 0, 10, 16);
		ctx.drawImage(image, 1 * s, 1 * s, 10 * s, 16 * s, 0, 0, 10, 16);
		loaded.value = true;
	};
	image.src = props.texture;
}

onMounted(draw);
watch(() => props.texture, draw);
</script>

<template>
	<span class="relative inline-flex items-center justify-center" role="img" :aria-label="alt">
		<canvas
			v-show="loaded"
			ref="canvas"
			width="10"
			height="16"
			class="h-full w-auto drop-shadow-lg"
			style="image-rendering: pixelated"
		/>
		<UIcon v-if="!loaded" name="i-lucide-loader-2" class="animate-spin text-slate-500" />
	</span>
</template>
