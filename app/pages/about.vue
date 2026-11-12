<script setup lang="ts">
import { DISCORD_URL, principles, SOURCE_URL } from "~/data/marketing";

usePageSeo({
	title: "Our philosophy — LeiCraftClient",
	description:
		"Why LeiCraftClient exists: free cosmetics for everyone, in every client, made by the community and open source. What we do, what we don't, and where the code lives.",
});

const doNot = [
	{
		icon: "i-lucide-shopping-cart",
		title: "No store",
		description:
			"There is nothing to buy. Free items are free for everyone; exclusives come from codes, events and gifts.",
	},
	{
		icon: "i-lucide-key-round",
		title: "No passwords",
		description:
			"You log in with Discord. We never ask for your Minecraft password, and the game never sends us your access token.",
	},
	{
		icon: "i-lucide-radar",
		title: "No trackers",
		description: "This website runs without ads, analytics or tracking scripts.",
	},
	{
		icon: "i-lucide-lock-open",
		title: "No lock-in",
		description:
			"It's a regular Fabric mod. Keep your launcher, your client and your other mods — remove the jar and it's gone.",
	},
];

const repos = [
	{
		name: "Fabric mod",
		description: "The mod you install: rendering, linking, in-game wardrobe.",
		to: `${SOURCE_URL}/Fabric`,
	},
	{
		name: "API server",
		description: "Accounts, the shop, moderation and the player lookups.",
		to: `${SOURCE_URL}/API-Server`,
	},
	{
		name: "Website",
		description: "This site: shop, wardrobe, Creator Studio and these docs.",
		to: `${SOURCE_URL}/Website`,
	},
	{
		name: "SkinViewerJS",
		description: "The 3D player preview, with capes, elytra and cosmetics.",
		to: `${SOURCE_URL}/SkinViewerJS`,
	},
];

const facts = [
	{ label: "Price", value: "Free — nothing to buy" },
	{ label: "Runs in", value: "Fabric, Quilt and clients that take Fabric mods" },
	{ label: "Your own items", value: "Upload capes and cosmetics, reviewed by moderators" },
	{ label: "Login", value: "Discord — no new password" },
	{ label: "License", value: "AGPL-3.0, all components" },
];
</script>

<template>
	<div>
		<MarketingPageHero
			badge="Our philosophy"
			badge-icon="i-lucide-heart"
			title="Cosmetics for everyone. Not for sale."
			description="Showing who you are in Minecraft shouldn't cost money, tie you to one client or ask for your password. That's the whole idea behind LeiCraftClient."
		>
			<template #title>
				Cosmetics for everyone.
				<span class="bg-linear-to-tr from-primary-400 to-primary-200 bg-clip-text text-transparent">
					Not for sale.
				</span>
			</template>
		</MarketingPageHero>

		<!-- Story -->
		<section class="bg-slate-950/50 py-20">
			<UContainer class="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
				<div class="lg:sticky lg:top-24 lg:self-start">
					<blockquote class="border-l-4 border-primary-400 pl-6 text-2xl font-semibold text-balance text-white sm:text-3xl">
						“Everyone should be able to wear something that's theirs — and see what their friends made.”
					</blockquote>
				</div>
				<div class="space-y-5 text-lg text-pretty text-slate-400">
					<p>
						LeiCraftClient started as a cape service for the LeiCraftMC community. The first version
						piggybacked on OptiFine's cape system through a hosts-file trick and a Windows installer. It
						worked, but it was fragile and only ever worked with OptiFine.
					</p>
					<p>
						Version 2 starts fresh: a real Fabric mod, a new API and this website. It draws capes and 3D
						cosmetics itself, so it doesn't care which client you use — as long as Fabric mods run, so does
						LeiCraftClient.
					</p>
					<p>
						And instead of a fixed catalogue, anyone can now publish their own designs. The LeiCraftClient
						team runs the official page, partners run theirs, and every player can open a community page.
						Moderators keep it friendly; everybody gets to wear it.
					</p>
				</div>
			</UContainer>
		</section>

		<!-- Principles -->
		<section class="py-20">
			<UContainer>
				<MarketingSectionHeading
					badge="What we stand for"
					title="Four promises, built into the code"
					description="Not marketing — these follow from how LeiCraftClient is built."
				/>
				<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<MarketingIconCard
						v-for="principle in principles"
						:key="principle.title"
						:icon="principle.icon"
						:title="principle.title"
						:description="principle.description"
					/>
				</div>
			</UContainer>
		</section>

		<!-- What we don't do -->
		<section class="bg-slate-950/50 py-20">
			<UContainer>
				<MarketingSectionHeading
					badge="What we don't do"
					title="Things LeiCraftClient is built never to need"
				/>
				<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<div
						v-for="item in doNot"
						:key="item.title"
						class="rounded-xl border border-slate-800 bg-slate-900/50 p-6"
					>
						<div class="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10">
							<UIcon :name="item.icon" class="text-xl text-red-400" />
						</div>
						<h3 class="text-lg font-semibold text-white">{{ item.title }}</h3>
						<p class="mt-2 leading-relaxed text-slate-400">{{ item.description }}</p>
					</div>
				</div>
			</UContainer>
		</section>

		<!-- At a glance + open source -->
		<section class="py-20">
			<UContainer class="grid gap-6 lg:grid-cols-2">
				<UCard class="border-slate-800 bg-slate-900/60">
					<template #header>
						<h2 class="text-xl font-bold text-white">At a glance</h2>
					</template>
					<dl class="divide-y divide-slate-800">
						<div v-for="fact in facts" :key="fact.label" class="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between sm:gap-6">
							<dt class="text-slate-400">{{ fact.label }}</dt>
							<dd class="font-medium text-white sm:text-right">{{ fact.value }}</dd>
						</div>
					</dl>
				</UCard>

				<UCard class="border-slate-800 bg-slate-900/60">
					<template #header>
						<div class="flex items-center justify-between gap-3">
							<h2 class="text-xl font-bold text-white">Open source</h2>
							<UBadge color="primary" variant="soft">AGPL-3.0</UBadge>
						</div>
					</template>
					<ul class="divide-y divide-slate-800">
						<li v-for="repo in repos" :key="repo.name">
							<NuxtLink
								:to="repo.to"
								target="_blank"
								class="group flex items-center justify-between gap-4 py-3"
							>
								<span>
									<span class="block font-medium text-white group-hover:text-primary-300">{{ repo.name }}</span>
									<span class="block text-sm text-slate-400">{{ repo.description }}</span>
								</span>
								<UIcon name="i-lucide-external-link" class="shrink-0 text-slate-500 group-hover:text-primary-300" />
							</NuxtLink>
						</li>
					</ul>
				</UCard>
			</UContainer>
		</section>

		<!-- Community -->
		<section class="bg-slate-950/50 py-20">
			<UContainer class="mx-auto max-w-3xl text-center">
				<h2 class="mb-4 text-3xl font-bold text-balance text-white">Made with the community</h2>
				<p class="mb-8 text-lg text-pretty text-slate-400">
					Ideas, bug reports, a design you'd like to see as a partner drop — the LeiCraftMC Discord is where
					it all happens.
				</p>
				<div class="flex flex-col justify-center gap-3 sm:flex-row">
					<UButton :to="DISCORD_URL" target="_blank" size="lg" icon="i-lucide-message-circle" class="justify-center">
						Join the Discord
					</UButton>
					<UButton
						to="/creators"
						size="lg"
						color="neutral"
						variant="outline"
						icon="i-lucide-palette"
						class="justify-center"
					>
						Become a creator
					</UButton>
				</div>
			</UContainer>
		</section>

		<MarketingCtaSection />
	</div>
</template>
