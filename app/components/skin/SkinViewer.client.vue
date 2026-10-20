<script setup lang="ts">
/**
 * 3D player preview (SkinViewerJS): skin, cape and LeiCraft Client cosmetics. Client-only — it needs
 * WebGL. Every prop is reactive; cosmetics reload as a whole when the list changes.
 */
import {
	IdleAnimation,
	type PlayerAnimation,
	SkinViewer,
	WalkingAnimation,
} from "@leicraftmc/skinviewerjs";
import { createDefaultSkin } from "~/utils/defaultSkin";

const props = withDefaults(
	defineProps<{
		/** Skin image URL; null shows a neutral mannequin. */
		skin?: string | null;
		slim?: boolean;
		cape?: string | null;
		/** Show the cape texture as elytra instead of a cape. */
		elytra?: boolean;
		cosmetics?: Array<{ texture: string; model: string }>;
		animation?: "idle" | "walk" | "none";
		autoRotate?: boolean;
		/** Start turned away from the camera (a three-quarter back view), e.g. to show off a cape. */
		back?: boolean;
		zoom?: number;
	}>(),
	{
		skin: null,
		slim: false,
		cape: null,
		elytra: false,
		cosmetics: () => [],
		animation: "idle",
		autoRotate: false,
		back: false,
		zoom: 0.9,
	},
);

const emit = defineEmits<{ error: [message: string] }>();

const container = ref<HTMLDivElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);

let viewer: SkinViewer | null = null;
let resizeObserver: ResizeObserver | null = null;
// Bumped on every cosmetics reload; an older, still-running reload stops when it sees a newer one.
let cosmeticsGeneration = 0;

async function applySkin() {
	if (!viewer) return;
	const model = props.slim ? "slim" : "default";
	if (!props.skin) {
		viewer.loadSkin(createDefaultSkin(), { model });
		return;
	}
	try {
		await viewer.loadSkin(props.skin, { model });
	} catch {
		viewer.loadSkin(createDefaultSkin(), { model });
	}
}

async function applyCape() {
	if (!viewer) return;
	if (!props.cape) {
		viewer.loadCape(null);
		return;
	}
	try {
		await viewer.loadCape(props.cape, { backEquipment: props.elytra ? "elytra" : "cape" });
	} catch {
		viewer.loadCape(null);
		emit("error", "The cape texture could not be loaded.");
	}
}

async function applyCosmetics() {
	if (!viewer) return;
	const generation = ++cosmeticsGeneration;
	viewer.resetCosmetics();

	for (const cosmetic of props.cosmetics) {
		try {
			await viewer.loadCosmetics(cosmetic.texture, cosmetic.model);
		} catch {
			emit("error", "A cosmetic could not be loaded.");
		}
		if (generation !== cosmeticsGeneration) return;
	}
}

function applyAnimation() {
	if (!viewer) return;
	const animations: Record<typeof props.animation, () => PlayerAnimation | null> = {
		idle: () => new IdleAnimation(),
		walk: () => new WalkingAnimation(),
		none: () => null,
	};
	viewer.animation = animations[props.animation]();
	viewer.autoRotate = props.autoRotate;
}

function applyFacing() {
	if (!viewer) return;
	viewer.playerWrapper.rotation.y = props.back ? Math.PI * 0.8 : 0;
}

function resize() {
	if (!viewer || !container.value) return;
	const { clientWidth, clientHeight } = container.value;
	if (clientWidth > 0 && clientHeight > 0) {
		viewer.setSize(clientWidth, clientHeight);
	}
}

onMounted(async () => {
	// A `.client` component renders its template only after it is mounted: without this tick the
	// refs are still null on a hydrated page and the viewer never starts.
	await nextTick();
	if (!canvas.value || !container.value) return;

	viewer = new SkinViewer({
		canvas: canvas.value,
		width: container.value.clientWidth || 300,
		height: container.value.clientHeight || 400,
		zoom: props.zoom,
		pixelRatio: "match-device",
	});

	resizeObserver = new ResizeObserver(resize);
	resizeObserver.observe(container.value);

	applyAnimation();
	applyFacing();
	await Promise.all([applySkin(), applyCape()]);
	await applyCosmetics();
});

onBeforeUnmount(() => {
	cosmeticsGeneration++;
	resizeObserver?.disconnect();
	viewer?.dispose();
	viewer = null;
});

watch(() => [props.skin, props.slim], applySkin);
watch(() => [props.cape, props.elytra], applyCape);
watch(() => JSON.stringify(props.cosmetics), applyCosmetics);
watch(() => [props.animation, props.autoRotate], applyAnimation);
watch(() => props.back, applyFacing);
</script>

<template>
	<div ref="container" class="relative h-full w-full touch-none select-none">
		<canvas ref="canvas" class="block cursor-grab active:cursor-grabbing" />
	</div>
</template>
