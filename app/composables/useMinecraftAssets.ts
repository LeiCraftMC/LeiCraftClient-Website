/**
 * URLs of assets served by the API: player skins (`/skins/<uuid>.png`, proxied from Mojang with
 * CORS) for the 3D viewer and the head avatars, and uploaded studio images (`/assets/<id>.png`)
 * that are only known by id, like those in `pending_changes`.
 */
export function useMinecraftAssets() {
	const apiUrl = useRuntimeAppConfigs().apiUrl.replace(/\/$/, "");

	return {
		skinURL(uuid: string | null | undefined) {
			return uuid ? `${apiUrl}/skins/${uuid}.png` : null;
		},
		imageAssetURL(assetID: string | null | undefined) {
			return assetID ? `${apiUrl}/assets/${assetID}.png` : null;
		},
	};
}
