/**
 * Copy shared by the marketing pages (home, features, creators, about). Static data in
 * `app/data/`, like the docs navigation. Keep claims factual: the compatibility statuses mirror
 * `content/docs/clients/overview.md` — update both together.
 */

export interface MarketingItem {
	icon: string;
	title: string;
	description: string;
	to?: string;
}

/** Minecraft version the current mod targets (also in the docs and on the download page). */
export const MINECRAFT_VERSION = "26.3";

export const DISCORD_URL = "https://discord.com/invite/3cdazADhtv";
export const SOURCE_URL = "https://git.leicraftmc.de/LeiCraftMC/LeiCraftClient";
export const MODRINTH_URL = "https://modrinth.com/mod/leicraftclient";

export type CompatibilityStatus = "works" | "untested" | "soon";

export interface CompatibilityEntry {
	name: string;
	kind: "Loader" | "Launcher" | "Client";
	icon: string;
	status: CompatibilityStatus;
	to: string;
}

/** Where LeiCraftClient runs — a Fabric mod, so anywhere Fabric mods for 26.3 can be added. */
export const compatibility: CompatibilityEntry[] = [
	{
		name: "Fabric",
		kind: "Loader",
		icon: "i-lucide-layers",
		status: "works",
		to: "/docs/install/fabric",
	},
	{
		name: "Quilt",
		kind: "Loader",
		icon: "i-lucide-layers-2",
		status: "untested",
		to: "/docs/install/quilt",
	},
	{
		name: "Lunar Client",
		kind: "Client",
		icon: "i-lucide-moon",
		status: "untested",
		to: "/docs/clients/lunar-client",
	},
	{
		name: "LabyMod",
		kind: "Client",
		icon: "i-lucide-puzzle",
		status: "soon",
		to: "/docs/clients/labymod",
	},
	{
		name: "Dawn (Feather)",
		kind: "Client",
		icon: "i-lucide-sunrise",
		status: "untested",
		to: "/docs/clients/dawn",
	},
	{
		name: "NoRisk Client",
		kind: "Client",
		icon: "i-lucide-shield",
		status: "untested",
		to: "/docs/clients/norisk-client",
	},
	{
		name: "Modrinth App",
		kind: "Launcher",
		icon: "i-lucide-package",
		status: "works",
		to: "/docs/install/modrinth-app",
	},
	{
		name: "Prism Launcher",
		kind: "Launcher",
		icon: "i-lucide-box",
		status: "works",
		to: "/docs/install/prism-launcher",
	},
	{
		name: "CurseForge",
		kind: "Launcher",
		icon: "i-lucide-flame",
		status: "works",
		to: "/docs/install/curseforge",
	},
	{
		name: "NeoForge",
		kind: "Loader",
		icon: "i-lucide-anvil",
		status: "soon",
		to: "/docs/install/neoforge",
	},
];

export const COMPATIBILITY_STATUS: Record<
	CompatibilityStatus,
	{ label: string; color: "success" | "warning" | "neutral"; hint: string }
> = {
	works: { label: "Works", color: "success", hint: "Add the mod like any Fabric mod." },
	untested: {
		label: "Should work",
		color: "warning",
		hint: `Supports your own Fabric mods; not yet confirmed on Minecraft ${MINECRAFT_VERSION}.`,
	},
	soon: {
		label: "Not yet",
		color: "neutral",
		hint: `Not available for Minecraft ${MINECRAFT_VERSION} yet.`,
	},
};

export const features: MarketingItem[] = [
	{
		icon: "i-lucide-flag",
		title: "Capes and 3D cosmetics",
		description:
			"HD capes that work as elytra too, plus hats, horns, wings and more — real 3D models on your player.",
		to: "/shop",
	},
	{
		icon: "i-lucide-blocks",
		title: "Runs inside your client",
		description:
			"A small Fabric mod, not a separate client. Keep Lunar, NoRisk, Dawn or plain Fabric — any client that takes Fabric mods.",
		to: "/docs/clients/overview",
	},
	{
		icon: "i-lucide-server",
		title: "Visible on every server",
		description:
			"Everyone who plays with LeiCraftClient sees your look — on any server, in singleplayer, nothing to install server-side.",
		to: "/docs/getting-started/introduction",
	},
	{
		icon: "i-lucide-shirt",
		title: "Wardrobe on web and in-game",
		description:
			"Save items from the shop, then dress up with a live 3D preview on the website or right in the game.",
		to: "/docs/using/wardrobe",
	},
	{
		icon: "i-lucide-upload",
		title: "Upload your own",
		description:
			"Draw a cape, model a cosmetic in Blockbench, publish it on your community page. Everyone can wear it.",
		to: "/creators",
	},
	{
		icon: "i-lucide-split",
		title: "Fits every skin",
		description:
			"Cosmetics can ship a version for wide and slim arms; the right one is picked for each player.",
		to: "/docs/creators/variants",
	},
	{
		icon: "i-lucide-gem",
		title: "Exclusive drops",
		description:
			"Partners and events hand out exclusive items through redeem codes and gifts — not through a store.",
		to: "/docs/using/exclusives",
	},
	{
		icon: "i-lucide-key-round",
		title: "No passwords, no risk",
		description:
			"Log in with Discord. Your Minecraft account is verified like a server does it — your token never leaves the game.",
		to: "/docs/using/linking",
	},
	{
		icon: "i-lucide-sparkles",
		title: "Little extras",
		description:
			"A badge in the tab list for fellow LeiCraft players, Discord Rich Presence and in-game update notices.",
		to: "/docs/using/in-game",
	},
];

export const principles: MarketingItem[] = [
	{
		icon: "i-lucide-gift",
		title: "Free means free",
		description:
			"Every item is free to wear. Exclusives come from codes and gifts. There is nothing to buy.",
	},
	{
		icon: "i-lucide-code-xml",
		title: "Open source",
		description: "The mod, the API and this website are AGPL-3.0. Read the code, build it yourself.",
	},
	{
		icon: "i-lucide-users",
		title: "Made by the community",
		description:
			"Anyone can publish capes and cosmetics. Moderators review every item before it goes live.",
	},
	{
		icon: "i-lucide-lock",
		title: "Your account stays yours",
		description:
			"No Minecraft password, no access token, no trackers on this site. Discord login only.",
	},
];

export const howItWorks: MarketingItem[] = [
	{
		icon: "i-lucide-download",
		title: "Install the mod",
		description: "Add LeiCraftClient to Fabric, Quilt or the client you already use.",
		to: "/docs/getting-started/quick-start",
	},
	{
		icon: "i-lucide-message-circle",
		title: "Log in with Discord",
		description: "Your LeiCraftClient account is your Discord account. No password to remember.",
		to: "/auth/login",
	},
	{
		icon: "i-lucide-link",
		title: "Link in-game",
		description: "Click the link in the mod's options, confirm on the website — done in seconds.",
		to: "/docs/using/linking",
	},
	{
		icon: "i-lucide-shirt",
		title: "Pick your look",
		description: "Save capes and cosmetics to your wardrobe and equip them on the web or in-game.",
		to: "/docs/using/wardrobe",
	},
];

export const homeFaq = [
	{
		label: "Is it really free?",
		content:
			"Yes. Every item is free to wear; exclusive items come from redeem codes and gifts by partners and the LeiCraftClient team. There is no store and nothing to buy.",
	},
	{
		label: "Do I have to switch clients?",
		content:
			"No. LeiCraftClient is a Fabric mod, so it runs wherever you can add Fabric mods for the current Minecraft version: plain Fabric or Quilt, launchers like Modrinth App and Prism, and clients like Lunar Client, NoRisk Client and Dawn (Feather). LabyMod follows as soon as it supports the current version.",
	},
	{
		label: "Who can see my cape?",
		content:
			"Everyone who plays with the LeiCraftClient mod, on any server and in singleplayer. Players without the mod see your normal skin.",
	},
	{
		label: "Is it safe for my Minecraft account?",
		content:
			"The mod verifies your account through Mojang's session server, the same check a server does when you join. Your access token never leaves the game, and you never enter a Minecraft password on the website.",
	},
	{
		label: "Can I make my own capes and cosmetics?",
		content:
			"Yes. Create your community page in the Creator Studio, upload a cape texture or a Blockbench model made with the OptiFine Player Models plugin, and publish it. A moderator reviews it, then everyone can wear it.",
	},
	{
		label: "Which Minecraft versions are supported?",
		content: `Minecraft Java Edition ${MINECRAFT_VERSION} with Fabric Loader 0.19.5 or newer. Bedrock Edition is not supported.`,
	},
];
