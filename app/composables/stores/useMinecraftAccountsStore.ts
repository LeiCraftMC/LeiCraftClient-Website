/**
 * useMinecraftAccountsStore — the Minecraft accounts linked to the signed-in user
 * (`GET /account/minecraft`), cached in `useState`. Refresh it after linking or unlinking.
 */
import { BasicAbstractStore } from "~/utils/abstractStore";
import type { MinecraftAccount } from "~/utils/types";

class MinecraftAccountsStore extends BasicAbstractStore<MinecraftAccount[]> {
	constructor() {
		super("minecraftAccounts", {
			enableAutoFetchIfEmpty: true,
		});
	}

	protected override async fetchData() {
		if (!useAppCookies().sessionToken.get().value) {
			return null;
		}

		const response = await useAPI((api) => api.getAccountMinecraft({}), true);
		if (!response.success) {
			return null;
		}

		return response.data satisfies MinecraftAccount[];
	}
}

export function useMinecraftAccountsStore() {
	return new MinecraftAccountsStore();
}
