/**
 * A neutral mannequin skin drawn at runtime, shown when a player has no known skin. (Mojang's
 * default skins are not ours to ship.) Browser-only: it draws on a canvas.
 */

// [x, y, width, height] of each body part's whole UV block in the 64×64 skin layout.
const PARTS = {
	head: [0, 0, 32, 16],
	body: [16, 16, 24, 16],
	rightArm: [40, 16, 16, 16],
	rightLeg: [0, 16, 16, 16],
	leftLeg: [16, 48, 16, 16],
	leftArm: [32, 48, 16, 16],
} as const;

const COLORS = {
	skin: "#c9a27e",
	hair: "#3b2f2a",
	shirt: "#0ea5e9",
	sleeve: "#0284c7",
	pants: "#334155",
	shoes: "#1e293b",
	eyeWhite: "#f8fafc",
	eye: "#0f172a",
};

let cached: HTMLCanvasElement | null = null;

export function createDefaultSkin(): HTMLCanvasElement {
	if (cached) return cached;

	const canvas = document.createElement("canvas");
	canvas.width = 64;
	canvas.height = 64;
	const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

	const fill = (color: string, [x, y, w, h]: readonly [number, number, number, number]) => {
		ctx.fillStyle = color;
		ctx.fillRect(x, y, w, h);
	};

	fill(COLORS.skin, PARTS.head);
	// hair: top face and the upper rows of every side
	fill(COLORS.hair, [8, 0, 8, 8]);
	fill(COLORS.hair, [0, 8, 32, 2]);
	// eyes on the front face (8..16, 8..16)
	fill(COLORS.eyeWhite, [9, 12, 2, 1]);
	fill(COLORS.eyeWhite, [13, 12, 2, 1]);
	fill(COLORS.eye, [10, 12, 1, 1]);
	fill(COLORS.eye, [13, 12, 1, 1]);

	fill(COLORS.shirt, PARTS.body);
	fill(COLORS.sleeve, PARTS.rightArm);
	fill(COLORS.sleeve, PARTS.leftArm);
	// hands
	fill(COLORS.skin, [40, 28, 16, 4]);
	fill(COLORS.skin, [32, 60, 16, 4]);

	fill(COLORS.pants, PARTS.rightLeg);
	fill(COLORS.pants, PARTS.leftLeg);
	fill(COLORS.shoes, [0, 29, 16, 3]);
	fill(COLORS.shoes, [16, 61, 16, 3]);

	cached = canvas;
	return canvas;
}
