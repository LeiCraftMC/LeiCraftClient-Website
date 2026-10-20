<script setup lang="ts">
usePageSeo({
	title: "Download — LeiCraft Client",
	description:
		"Download the LeiCraft Client Fabric mod for Minecraft Java and see capes and cosmetics in the game.",
});

const RELEASES_URL = "https://git.leicraftmc.de/LeiCraftMC/LeiCraftClient/Fabric/-/releases";

const requirements = [
	{ name: "Minecraft Java Edition", version: "26.3", icon: "i-lucide-box" },
	{ name: "Fabric Loader", version: "0.19.5 or newer", icon: "i-lucide-layers" },
	{ name: "Fabric API", version: "for 26.3", icon: "i-lucide-puzzle" },
	{ name: "Fabric Language Kotlin", version: "1.14.2 or newer", icon: "i-lucide-code" },
];

const faq = [
	{
		label: "Do other players need the mod to see my cape?",
		content:
			"Yes — capes and cosmetics are drawn by the mod, so players see them when they play with the LeiCraft Client too. Players with the mod get a small badge in the tab list.",
	},
	{
		label: "Does it work on every server?",
		content:
			"Yes. The mod draws capes and cosmetics on your side only and needs nothing from the server, so it works in singleplayer and on any server.",
	},
	{
		label: "Do I still need OptiFine or a hosts-file change?",
		content:
			"No. The old LeiCraft Client redirected OptiFine's cape server; the new mod talks to the LeiCraft Client API directly.",
	},
	{
		label: "How do I link my Minecraft account?",
		content:
			"Open the pause menu, click LeiCraft Client, then Link account. A link opens in your browser — log in with Discord and confirm. Cracked/offline accounts can't be linked.",
	},
];
</script>

<template>
	<UContainer class="space-y-12 py-12">
		<div class="grid items-center gap-8 lg:grid-cols-2">
			<div class="space-y-5">
				<UBadge color="primary" variant="soft" icon="i-lucide-download">Fabric mod</UBadge>
				<h1 class="text-4xl font-bold text-white">Get the LeiCraft Client</h1>
				<p class="text-lg text-slate-400">
					A lightweight Fabric mod: shows LeiCraft Client capes and 3D cosmetics in the game, links your
					Minecraft account and comes with an in-game wardrobe.
				</p>
				<div class="flex flex-wrap gap-3">
					<UButton size="xl" :to="RELEASES_URL" target="_blank" icon="i-lucide-download">
						Download from GitLab
					</UButton>
					<UButton size="xl" to="/shop" color="neutral" variant="outline" icon="i-lucide-shopping-bag">
						Browse the shop
					</UButton>
				</div>
			</div>

			<DashboardSectionCard title="Requirements" icon="i-lucide-list-checks" flush>
				<ul class="divide-y divide-slate-800">
					<li
						v-for="requirement in requirements"
						:key="requirement.name"
						class="flex items-center gap-4 px-6 py-4"
					>
						<UIcon :name="requirement.icon" class="size-5 text-primary-400" />
						<span class="flex-1 text-white">{{ requirement.name }}</span>
						<span class="text-sm text-slate-400">{{ requirement.version }}</span>
					</li>
				</ul>
			</DashboardSectionCard>
		</div>

		<section class="space-y-4">
			<h2 class="text-2xl font-semibold text-white">Install</h2>
			<ol class="grid gap-4 md:grid-cols-3">
				<li class="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
					<p class="text-sm text-primary-400">1</p>
					<p class="mt-1 font-medium text-white">Install Fabric</p>
					<p class="mt-1 text-sm text-slate-400">
						Use the Fabric installer or a launcher like Prism or Modrinth App for Minecraft 26.3.
					</p>
				</li>
				<li class="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
					<p class="text-sm text-primary-400">2</p>
					<p class="mt-1 font-medium text-white">Add the mods</p>
					<p class="mt-1 text-sm text-slate-400">
						Put the LeiCraft Client jar, Fabric API and Fabric Language Kotlin into your
						<code>mods</code> folder.
					</p>
				</li>
				<li class="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
					<p class="text-sm text-primary-400">3</p>
					<p class="mt-1 font-medium text-white">Link your account</p>
					<p class="mt-1 text-sm text-slate-400">
						Start the game, open the pause menu → LeiCraft Client → Link account.
					</p>
				</li>
			</ol>
		</section>

		<section class="space-y-4">
			<h2 class="text-2xl font-semibold text-white">Questions</h2>
			<UAccordion :items="faq" />
		</section>
	</UContainer>
</template>
