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
		const el = canvas.value;
		const ctx = el?.getContext("2d");
		if (!el || !ctx) return;
		// In the 64×32 cape layout the outer face is the 10×16 block at (1, 1). HD capes scale that
		// by `s`; copy it 1:1 so their detail survives (a 10×16 canvas would drop 63 of 64 pixels
		// of a 512×256 cape). Resizing also clears the canvas and resets the context.
		const s = image.width / 64;
		el.width = 10 * s;
		el.height = 16 * s;
		ctx.imageSmoothingEnabled = false;
		ctx.drawImage(image, s, s, 10 * s, 16 * s, 0, 0, 10 * s, 16 * s);
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
