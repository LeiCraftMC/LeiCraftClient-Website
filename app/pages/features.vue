<script setup lang="ts">
import { MINECRAFT_VERSION } from "~/data/marketing";

usePageSeo({
	title: "Features — LeiCraft Client",
	description:
		"HD capes, 3D cosmetics, a wardrobe on the web and in-game, Discord login, community uploads and exclusive drops — in a small Fabric mod that runs next to your client.",
});

interface FeatureSection {
	id: string;
	icon: string;
	eyebrow: string;
	title: string;
	text: string;
	points: string[];
	link: { label: string; to: string };
}

const sections: FeatureSection[] = [
	{
		id: "looks",
		icon: "i-lucide-flag",
		eyebrow: "Capes & cosmetics",
		title: "Looks that actually look good",
		text:
			"Capes from classic 64×32 up to 2048×1024 HD, and cosmetics that are real 3D models on your player — hats, horns, wings, whatever creators come up with.",
		points: [
			"Your cape doubles as your elytra",
			"Cosmetics sit on your head, body, arms or legs and move with them",
			"Wear one cape and up to ten cosmetics at once",
			"A fitting version for wide and slim skins is picked automatically",
		],
		link: { label: "Browse the shop", to: "/shop" },
	},
	{
		id: "compatibility",
		icon: "i-lucide-blocks",
		eyebrow: "Compatibility",
		title: "A mod, not another client",
		text: `LeiCraft Client is a regular Fabric mod for Minecraft ${MINECRAFT_VERSION}. Keep the launcher and the client you like — add one jar and its two helpers.`,
		points: [
			"Fabric and Quilt",
			"Modrinth App, Prism Launcher, CurseForge, ATLauncher",
			"Clients that take Fabric mods, like Lunar Client, NoRisk Client and Dawn",
			"Every server and singleplayer — servers install nothing",
		],
		link: { label: "Compatibility overview", to: "/docs/clients/overview" },
	},
	{
		id: "wardrobe",
		icon: "i-lucide-shirt",
		eyebrow: "Wardrobe",
		title: "Your collection, on the web and in-game",
		text:
			"Save what you like from the shop. Your wardrobe keeps it — together with every exclusive you own — so dressing up is quick and tidy.",
		points: [
			"Live 3D preview on the website with your own skin",
			"In-game wardrobe with a preview on your player",
			"One loadout per Minecraft account — link up to five",
			"“Explore the shop” right from the game",
		],
		link: { label: "How the wardrobe works", to: "/docs/using/wardrobe" },
	},
	{
		id: "accounts",
		icon: "i-lucide-key-round",
		eyebrow: "Accounts",
		title: "No passwords. No risky logins.",
		text:
			"Your LeiCraft Client account is your Discord account. The mod proves you own your Minecraft account the same way a server checks you when you join.",
		points: [
			"Log in with Discord — nothing new to remember",
			"Your Minecraft access token never leaves the game",
			"Linking is one clickable link and one confirmation",
			"Unlink any time, from the website or the game",
		],
		link: { label: "Link your account", to: "/docs/using/linking" },
	},
	{
		id: "creators",
		icon: "i-lucide-palette",
		eyebrow: "Creator Studio",
		title: "Publish your own designs",
		text:
			"Open a community page, upload capes and Blockbench cosmetics, group them in collections. Moderators review every item, then everyone can wear it.",
		points: [
			"Capes as PNG, cosmetics from the OptiFine Player Models plugin",
			"Variants for wide and slim skins",
			"Collections and a page with your icon and banner",
			"See each item's review status at a glance",
		],
		link: { label: "For creators", to: "/creators" },
	},
	{
		id: "exclusives",
		icon: "i-lucide-gem",
		eyebrow: "Exclusives",
		title: "Drops for events, servers and partners",
		text:
			"Official and partner pages can make exclusive items and hand them out with redeem codes or as direct gifts. Exclusives stay in your wardrobe for good.",
		points: [
			"Redeem codes on the website or with a link",
			"Direct gifts to players",
			"Partner pages managed by their own team",
			"API keys for bots and automations",
		],
		link: { label: "Exclusives & codes", to: "/docs/using/exclusives" },
	},
	{
		id: "extras",
		icon: "i-lucide-sparkles",
		eyebrow: "Little extras",
		title: "The details that make it feel complete",
		text: "Small things you notice every day.",
		points: [
			"A badge in the tab list for players who use LeiCraft Client",
			"Discord Rich Presence with your server and a link to your profile",
			"Update notices in the mod's options when a new version is out",
			"Public player profiles: see what anyone is wearing",
		],
		link: { label: "In-game features", to: "/docs/using/in-game" },
	},
];
</script>

<template>
	<div>
		<MarketingPageHero
			badge="Features"
			badge-icon="i-lucide-sparkles"
			title="Everything in one small mod"
			description="Capes, 3D cosmetics and a wardrobe that's yours — in the client you already play with, on every server."
		>
			<template #actions>
				<UButton size="xl" to="/download" icon="i-lucide-download" class="justify-center">Download free</UButton>
				<UButton
					size="xl"
					to="/docs/getting-started/quick-start"
					color="neutral"
					variant="outline"
					icon="i-lucide-book-open"
					class="justify-center"
				>
					Quick start
				</UButton>
			</template>
		</MarketingPageHero>

		<!-- Jump links -->
		<UContainer class="pb-6">
			<nav class="flex flex-wrap justify-center gap-2" aria-label="Feature sections">
				<UButton
					v-for="section in sections"
					:key="section.id"
					:to="`#${section.id}`"
					:icon="section.icon"
					color="neutral"
					variant="soft"
					size="sm"
				>
					{{ section.eyebrow }}
				</UButton>
			</nav>
		</UContainer>

		<section
			v-for="(section, index) in sections"
			:id="section.id"
			:key="section.id"
			:class="['scroll-mt-20 py-16 sm:py-20', index % 2 === 0 ? 'bg-slate-950/50' : '']"
		>
			<UContainer class="grid items-center gap-10 lg:grid-cols-2">
				<div :class="['space-y-5', index % 2 === 1 ? 'lg:order-2' : '']">
					<p class="flex items-center gap-2 text-sm font-semibold text-primary-400">
						<UIcon :name="section.icon" />
						{{ section.eyebrow }}
					</p>
					<h2 class="text-3xl font-bold text-balance text-white sm:text-4xl">{{ section.title }}</h2>
					<p class="text-lg text-pretty text-slate-400">{{ section.text }}</p>
					<UButton :to="section.link.to" variant="soft" trailing-icon="i-lucide-arrow-right">
						{{ section.link.label }}
					</UButton>
				</div>

				<UCard class="border-slate-800 bg-slate-900/60">
					<ul class="space-y-4">
						<li v-for="point in section.points" :key="point" class="flex items-start gap-3">
							<UIcon name="i-lucide-circle-check" class="mt-0.5 shrink-0 text-xl text-primary-400" />
							<span class="text-slate-300">{{ point }}</span>
						</li>
					</ul>
				</UCard>
			</UContainer>
		</section>

		<section class="py-16">
			<UContainer>
				<MarketingSectionHeading
					title="Runs where you play"
					description="Pick your setup for a step-by-step guide."
				/>
				<MarketingCompatibilityGrid />
			</UContainer>
		</section>

		<MarketingCtaSection />
	</div>
</template>
