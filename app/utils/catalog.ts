import type { CategoryID, ProductStatus, SkinModel, Variant } from "~/utils/types";

/** Display data of the three fixed shop categories. */
export const CATEGORY_INFO: Record<
	CategoryID,
	{ label: string; short: string; icon: string; description: string }
> = {
	official: {
		label: "LeiCraft Client",
		short: "Official",
		icon: "i-lucide-badge-check",
		description: "Official capes and cosmetics made by the LeiCraft Client team.",
	},
	partner: {
		label: "Partners",
		short: "Partners",
		icon: "i-lucide-handshake",
		description: "Capes and cosmetics from official LeiCraft Client partners.",
	},
	community: {
		label: "Community",
		short: "Community",
		icon: "i-lucide-users",
		description: "Capes and cosmetics created and uploaded by the community.",
	},
};

export const CATEGORY_IDS = ["official", "partner", "community"] as const satisfies CategoryID[];

export function isCategoryID(value: unknown): value is CategoryID {
	return typeof value === "string" && (CATEGORY_IDS as readonly string[]).includes(value);
}

/**
 * Categories that are a single page instead of a list of pages: `official` is the LeiCraft Client
 * team's own shop page (the API allows only one), shown directly at `/shop/official`.
 */
export const SINGLE_PAGE_CATEGORIES: readonly CategoryID[] = ["official"];

export function isSinglePageCategory(category: CategoryID) {
	return SINGLE_PAGE_CATEGORIES.includes(category);
}

export function shopPagePath(page: { category: CategoryID; slug: string }) {
	return isSinglePageCategory(page.category)
		? `/shop/${page.category}`
		: `/shop/${page.category}/${page.slug}`;
}

/** "12 items" for the single official page, "4 pages" for the other categories. */
export function categoryCount(category: {
	id: CategoryID;
	page_count: number;
	product_count: number;
}) {
	if (isSinglePageCategory(category.id)) {
		return `${category.product_count} ${category.product_count === 1 ? "item" : "items"}`;
	}
	return `${category.page_count} ${category.page_count === 1 ? "page" : "pages"}`;
}

/** Breadcrumbs from the shop down to a page (the category and the page are one for `official`). */
export function shopPageBreadcrumbs(page: { category: CategoryID; slug: string; name: string }) {
	const category = { label: CATEGORY_INFO[page.category].label, to: `/shop/${page.category}` };
	return [
		{ label: "Shop", to: "/shop" },
		category,
		...(isSinglePageCategory(page.category) ? [] : [{ label: page.name, to: shopPagePath(page) }]),
	];
}

/**
 * The variant to show for a wearer — the same rule as the mod: a pinned variant, else the first
 * one made for the wearer's skin model, else the first `any` one, else the first.
 */
export function pickVariant(
	variants: Variant[],
	pinnedVariantID: number | null | undefined,
	skinModel: SkinModel | null | undefined,
): Variant | undefined {
	if (pinnedVariantID) {
		const pinned = variants.find((variant) => variant.id === pinnedVariantID);
		if (pinned) return pinned;
	}
	return (
		variants.find((variant) => skinModel && variant.skin_model === skinModel) ??
		variants.find((variant) => variant.skin_model === "any") ??
		variants[0]
	);
}

export function productStatusColor(
	status: ProductStatus,
): "neutral" | "warning" | "success" | "error" {
	switch (status) {
		case "published":
			return "success";
		case "pending_review":
			return "warning";
		case "rejected":
		case "disabled":
			return "error";
		default:
			return "neutral";
	}
}

export function productStatusLabel(status: ProductStatus) {
	return {
		draft: "Draft",
		pending_review: "In review",
		published: "Published",
		rejected: "Rejected",
		disabled: "Taken down",
	}[status];
}

export const SKIN_MODEL_LABELS: Record<Variant["skin_model"], string> = {
	any: "Any skin",
	wide: "Wide arms (Steve)",
	slim: "Slim arms (Alex)",
};
