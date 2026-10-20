/**
 * Loadout helpers shared by the product page ("Equip") and the wardrobe: converting between the
 * API's loadout view and the `PUT /account/minecraft/{uuid}/loadout` body.
 */
import type { PutAccountMinecraftByUuidLoadoutData } from "~/api-client";
import type { Loadout, Product } from "~/utils/types";

export type LoadoutBody = PutAccountMinecraftByUuidLoadoutData["body"];

export const MAX_EQUIPPED_COSMETICS = 10;

export function loadoutToBody(loadout: Loadout): LoadoutBody {
	return {
		cape_product_id: loadout.cape?.id ?? null,
		cosmetics: loadout.cosmetics.map((entry) => ({
			product_id: entry.product.id,
			variant_id: entry.variant_id,
		})),
	};
}

/** The body with `product` equipped (a cape replaces the current one). */
export function withProductEquipped(body: LoadoutBody, product: Product): LoadoutBody {
	if (product.type === "cape") {
		return { ...body, cape_product_id: product.id };
	}
	if (body.cosmetics.some((entry) => entry.product_id === product.id)) {
		return body;
	}
	return { ...body, cosmetics: [...body.cosmetics, { product_id: product.id, variant_id: null }] };
}

export function withProductRemoved(body: LoadoutBody, product: Pick<Product, "id" | "type">) {
	if (product.type === "cape") {
		return {
			...body,
			cape_product_id: body.cape_product_id === product.id ? null : body.cape_product_id,
		};
	}
	return { ...body, cosmetics: body.cosmetics.filter((entry) => entry.product_id !== product.id) };
}

export function isEquipped(body: LoadoutBody, product: Pick<Product, "id" | "type">) {
	return product.type === "cape"
		? body.cape_product_id === product.id
		: body.cosmetics.some((entry) => entry.product_id === product.id);
}

/** Loads the loadout of one linked account and saves a changed version (both via `useAPI`). */
export function useLoadoutAPI() {
	return {
		async load(uuid: string) {
			return await useAPI((api) => api.getAccountMinecraftByUuidLoadout({ path: { uuid } }));
		},
		async save(uuid: string, body: LoadoutBody) {
			return await useAPI((api) => api.putAccountMinecraftByUuidLoadout({ path: { uuid }, body }));
		},
	};
}
