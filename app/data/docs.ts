/**
 * Static docs navigation — consumed by the docs sidebar, prev/next links and the sitemap.
 * Every entry needs a markdown file at `content/docs/<path after /docs>.md` (`/docs` itself is
 * `content/docs/index.md`); `tests/docs.test.ts` checks both directions.
 * Follows the style-guide "static data in app/data/" idiom (static-site-with-docs template).
 */

export interface DocsPage {
	/** Absolute page path, also the route. */
	to: string;
	title: string;
	description: string;
	icon: string;
}

export interface DocsSection {
	label: string;
	pages: DocsPage[];
}

export const docsSections: DocsSection[] = [
	{
		label: "Getting started",
		pages: [
			{
				to: "/docs",
				title: "Overview",
				description: "What the docs cover and where to start.",
				icon: "i-lucide-book-open",
			},
			{
				to: "/docs/getting-started/introduction",
				title: "What is LeiCraftClient?",
				description: "The mod, the website and how everyone sees your cape.",
				icon: "i-lucide-info",
			},
			{
				to: "/docs/getting-started/quick-start",
				title: "Quick start",
				description: "From zero to wearing your first cape in five steps.",
				icon: "i-lucide-rocket",
			},
			{
				to: "/docs/getting-started/requirements",
				title: "Requirements",
				description: "Minecraft version, Fabric Loader and the two mods you need.",
				icon: "i-lucide-list-checks",
			},
		],
	},
	{
		label: "Install",
		pages: [
			{
				to: "/docs/install/fabric",
				title: "Fabric installer",
				description: "The official way, with the Minecraft Launcher.",
				icon: "i-lucide-download",
			},
			{
				to: "/docs/install/modrinth-app",
				title: "Modrinth App",
				description: "Create a Fabric instance and add the mod in a few clicks.",
				icon: "i-lucide-package",
			},
			{
				to: "/docs/install/prism-launcher",
				title: "Prism Launcher",
				description: "Instances with Fabric or Quilt and the mod from Modrinth.",
				icon: "i-lucide-box",
			},
			{
				to: "/docs/install/curseforge",
				title: "CurseForge app",
				description: "A Fabric profile with the mod added from its folder.",
				icon: "i-lucide-flame",
			},
			{
				to: "/docs/install/other-launchers",
				title: "Other launchers",
				description: "ATLauncher and any launcher with a mods folder.",
				icon: "i-lucide-rocket",
			},
			{
				to: "/docs/install/quilt",
				title: "Quilt",
				description: "Run the mod on Quilt Loader.",
				icon: "i-lucide-layers",
			},
			{
				to: "/docs/install/neoforge",
				title: "NeoForge",
				description: "Fabric mods on NeoForge through Sinytra Connector — and its current status.",
				icon: "i-lucide-anvil",
			},
		],
	},
	{
		label: "Other clients",
		pages: [
			{
				to: "/docs/clients/overview",
				title: "Compatibility",
				description: "Which clients and loaders run LeiCraftClient.",
				icon: "i-lucide-blocks",
			},
			{
				to: "/docs/clients/lunar-client",
				title: "Lunar Client",
				description: "Add the mod to a Lunar Fabric profile.",
				icon: "i-lucide-moon",
			},
			{
				to: "/docs/clients/labymod",
				title: "LabyMod",
				description: "Add the mod to a LabyMod Fabric modpack.",
				icon: "i-lucide-puzzle",
			},
			{
				to: "/docs/clients/dawn",
				title: "Dawn (Feather)",
				description: "Add the mod to a modded Dawn profile.",
				icon: "i-lucide-sunrise",
			},
			{
				to: "/docs/clients/norisk-client",
				title: "NoRisk Client",
				description: "Add the mod to a NoRisk profile.",
				icon: "i-lucide-shield",
			},
			{
				to: "/docs/clients/other-cape-mods",
				title: "Other cape mods",
				description: "Essential and other cape or cosmetic mods side by side.",
				icon: "i-lucide-layers-2",
			},
		],
	},
	{
		label: "Using the client",
		pages: [
			{
				to: "/docs/using/linking",
				title: "Link your account",
				description: "Connect your Minecraft account to your LeiCraftClient account.",
				icon: "i-lucide-link",
			},
			{
				to: "/docs/using/wardrobe",
				title: "Wardrobe",
				description: "Save, equip and remove capes and cosmetics.",
				icon: "i-lucide-shirt",
			},
			{
				to: "/docs/using/in-game",
				title: "In-game features",
				description: "Options screen, commands, tab badge and Discord status.",
				icon: "i-lucide-gamepad-2",
			},
			{
				to: "/docs/using/exclusives",
				title: "Exclusives & codes",
				description: "Exclusive items, redeem codes and your inventory.",
				icon: "i-lucide-gem",
			},
			{
				to: "/docs/using/troubleshooting",
				title: "Troubleshooting",
				description: "Fixes for the most common problems.",
				icon: "i-lucide-life-buoy",
			},
			{
				to: "/docs/faq",
				title: "FAQ",
				description: "Short answers to common questions.",
				icon: "i-lucide-circle-help",
			},
		],
	},
	{
		label: "Create & upload",
		pages: [
			{
				to: "/docs/creators/overview",
				title: "Creator overview",
				description: "Community pages, the review process and partner pages.",
				icon: "i-lucide-palette",
			},
			{
				to: "/docs/creators/capes",
				title: "Make a cape",
				description: "The cape texture format, sizes and layout.",
				icon: "i-lucide-flag",
			},
			{
				to: "/docs/creators/blockbench-cosmetics",
				title: "Cosmetics with Blockbench",
				description: "Model 3D cosmetics with the OptiFine Player Models plugin.",
				icon: "i-lucide-shapes",
			},
			{
				to: "/docs/creators/variants",
				title: "Skin variants",
				description: "One cosmetic, a fitting version for wide and slim skins.",
				icon: "i-lucide-split",
			},
			{
				to: "/docs/creators/uploading",
				title: "Upload & publish",
				description: "Creator Studio: your page, items, collections and review.",
				icon: "i-lucide-upload",
			},
			{
				to: "/docs/creators/partners",
				title: "Partners & exclusives",
				description: "Exclusive items, redeem codes, gifts and API keys.",
				icon: "i-lucide-handshake",
			},
		],
	},
];

/**
 * Base URL for "Edit this page" links, ending in the content folder. `null` hides the link.
 */
export const docsEditBaseUrl: string | null =
	"https://git.leicraftmc.de/LeiCraftMC/LeiCraftClient/Website/-/edit/main/content";

/** Flat list of pages in reading order, for prev/next navigation. */
export const docsPagesFlat: DocsPage[] = docsSections.flatMap((section) => section.pages);

export function getDocsPageByPath(path: string): DocsPage | undefined {
	return docsPagesFlat.find((page) => page.to === path);
}

/** The markdown file of a docs route, relative to `content/` (`/docs` → `docs/index`). */
export function docsSourcePath(path: string) {
	return path === "/docs" ? "docs/index" : path.slice(1);
}
