import type { ModrinthState, PublicRelease, ReleaseStatus } from "~/utils/types";

/**
 * Release helpers shared by the download page and the admin dashboard. A release is pending
 * while its GitLab pipeline builds the jar, published once the jar is attached, failed when the
 * pipeline failed; the Modrinth auto-publish is tracked on its own (see the API's README).
 */

export const RELEASE_STATUS: Record<
	ReleaseStatus,
	{ label: string; color: "warning" | "success" | "error"; icon: string }
> = {
	pending: { label: "Building", color: "warning", icon: "i-lucide-loader-circle" },
	published: { label: "Published", color: "success", icon: "i-lucide-circle-check" },
	failed: { label: "Failed", color: "error", icon: "i-lucide-circle-x" },
};

export const MODRINTH_STATE: Record<
	ModrinthState,
	{ label: string; color: "neutral" | "warning" | "success" | "error"; icon: string }
> = {
	skipped: { label: "Not on Modrinth", color: "neutral", icon: "i-lucide-minus" },
	pending: { label: "Modrinth pending", color: "warning", icon: "i-lucide-hourglass" },
	published: { label: "On Modrinth", color: "success", icon: "i-lucide-circle-check" },
	failed: { label: "Modrinth failed", color: "error", icon: "i-lucide-circle-x" },
};

/** Anchor of a release on the download page (`/download#v2.0.0`), as the API's `page_url`. */
export function releaseAnchor(version: string) {
	return `v${version}`;
}

/** The newest stable release, else the newest one at all (lists come newest first). */
export function pickFeaturedRelease(releases: PublicRelease[]): PublicRelease | null {
	return releases.find((release) => release.channel === "stable") ?? releases[0] ?? null;
}

/** File name of the jar behind a release's download link. */
export function releaseFileName(release: Pick<PublicRelease, "version" | "download_url">) {
	return release.download_url.split("/").at(-1) || `leicraftclient-${release.version}.jar`;
}
