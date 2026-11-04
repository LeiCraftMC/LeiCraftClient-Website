<script setup lang="ts">
import type { PublicRelease } from "~/utils/types";

usePageSeo({
	title: "Download — LeiCraft Client",
	description:
		"Download the LeiCraft Client Fabric mod for Minecraft Java, with the changelog of every release.",
});

/** Fallback while no release is published (or the API is unreachable). */
const GITLAB_RELEASES_URL = "https://git.leicraftmc.de/LeiCraftMC/LeiCraftClient/Fabric/-/releases";

const PAGE_SIZE = 20;

const releases = await useAPIAsyncData<PublicRelease[]>("public-releases", async () => {
	const res = await useAPI((api) => api.getReleases({ query: { limit: PAGE_SIZE } }), true);
	return res.success ? res.data : [];
});

const featured = computed(() => pickFeaturedRelease(releases.data.value ?? []));
/** A pre-release newer than the featured stable release, offered next to it. */
const newerPreRelease = computed(() => {
	const newest = releases.data.value?.[0];
	return newest && featured.value && newest.version !== featured.value.version ? newest : null;
});

// Older releases are loaded on demand; the first page already holds the recent ones.
const exhausted = ref((releases.data.value?.length ?? 0) < PAGE_SIZE);
const loadingOlder = ref(false);

async function loadOlder() {
	loadingOlder.value = true;
	const res = await useAPI(
		(api) =>
			api.getReleases({
				query: { limit: PAGE_SIZE, offset: releases.data.value?.length ?? 0 },
			}),
		true,
	);
	loadingOlder.value = false;
	if (!res.success) return;
	releases.data.value = [...(releases.data.value ?? []), ...res.data];
	exhausted.value = res.data.length < PAGE_SIZE;
}

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
					<UButton
						v-if="featured"
						size="xl"
						:to="featured.download_url"
						:download="releaseFileName(featured)"
						icon="i-lucide-download"
					>
						Download v{{ featured.version }}
					</UButton>
					<UButton v-else size="xl" :to="GITLAB_RELEASES_URL" target="_blank" icon="i-lucide-download">
						Download from GitLab
					</UButton>
					<UButton
						v-if="featured?.modrinth_url"
						size="xl"
						:to="featured.modrinth_url"
						target="_blank"
						color="neutral"
						variant="outline"
						icon="i-lucide-external-link"
					>
						Modrinth
					</UButton>
					<UButton
						v-else
						size="xl"
						to="/shop"
						color="neutral"
						variant="outline"
						icon="i-lucide-shopping-bag"
					>
						Browse the shop
					</UButton>
				</div>
				<p v-if="featured" class="text-sm text-slate-500">
					{{ featured.channel === "stable" ? "Stable" : "Pre-release" }} · released
					{{ formatDate(featured.published_at) }} ·
					<NuxtLink :to="`#${releaseAnchor(featured.version)}`" class="text-primary-400 hover:underline">
						changelog
					</NuxtLink>
					<template v-if="newerPreRelease">
						· pre-release
						<NuxtLink
							:to="`#${releaseAnchor(newerPreRelease.version)}`"
							class="text-primary-400 hover:underline"
						>
							v{{ newerPreRelease.version }}
						</NuxtLink>
						available
					</template>
				</p>
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

		<section v-if="releases.data.value?.length" id="releases" class="space-y-4">
			<h2 class="text-2xl font-semibold text-white">Releases</h2>
			<ol class="space-y-4">
				<li
					v-for="(release, index) in releases.data.value"
					:id="releaseAnchor(release.version)"
					:key="release.version"
					class="scroll-mt-24 rounded-xl border border-slate-800 bg-slate-900/50"
				>
					<div class="flex flex-wrap items-center gap-3 border-b border-slate-800 px-5 py-4">
						<UIcon name="i-lucide-tag" class="size-5 text-primary-400" />
						<div class="min-w-0 flex-1">
							<h3 class="font-semibold text-white">{{ release.title }}</h3>
							<p class="text-xs text-slate-500">
								<span class="font-mono">v{{ release.version }}</span>
								· {{ formatDate(release.published_at) }}
							</p>
						</div>
						<UBadge v-if="index === 0" color="primary" variant="soft">Latest</UBadge>
						<UBadge v-if="release.channel === 'pre-release'" color="warning" variant="outline">
							Pre-release
						</UBadge>
						<div class="flex gap-2">
							<UButton
								v-if="release.modrinth_url"
								:to="release.modrinth_url"
								target="_blank"
								size="sm"
								color="neutral"
								variant="ghost"
								icon="i-lucide-external-link"
							>
								Modrinth
							</UButton>
							<UButton
								:to="release.download_url"
								:download="releaseFileName(release)"
								size="sm"
								:variant="index === 0 ? 'solid' : 'outline'"
								:color="index === 0 ? 'primary' : 'neutral'"
								icon="i-lucide-download"
							>
								.jar
							</UButton>
						</div>
					</div>
					<div class="px-5 py-4">
						<ReleaseChangelog :markdown="release.changelog" />
					</div>
				</li>
			</ol>
			<div v-if="!exhausted" class="flex justify-center">
				<UButton
					color="neutral"
					variant="outline"
					icon="i-lucide-history"
					:loading="loadingOlder"
					@click="loadOlder"
				>
					Show older releases
				</UButton>
			</div>
		</section>

		<section class="space-y-4">
			<h2 class="text-2xl font-semibold text-white">Questions</h2>
			<UAccordion :items="faq" />
		</section>
	</UContainer>
</template>
