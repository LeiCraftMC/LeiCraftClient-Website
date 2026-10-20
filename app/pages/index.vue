<script setup lang="ts">
import { useUserInfoStore } from "~/composables/stores/useUserStore";
import type { Category, Product } from "~/utils/types";

usePageSeo({
	title: "LeiCraft Client — Free capes and cosmetics for Minecraft",
	description:
		"Capes and 3D cosmetics for Minecraft Java, visible to everyone who plays with the LeiCraft Client Fabric mod. Made by the LeiCraft Client team, our partners and the community.",
	jsonLd: {
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		name: "LeiCraft Client",
		applicationCategory: "GameApplication",
		operatingSystem: "Windows, macOS, Linux",
		offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
	},
});

const user = await useUserInfoStore().use();

const { data: latest } = await useAPIAsyncData<Product[]>("home-latest-products", async () => {
	const res = await useAPI(
		(api) => api.getCatalogProducts({ query: { order: "newest", limit: 8 } }),
		true,
	);
	return res.success ? res.data : [];
});

const { data: categories } = await useAPIAsyncData<Category[]>("home-categories", async () => {
	const res = await useAPI((api) => api.getCatalogCategories({}), true);
	return res.success ? res.data : [];
});

// The hero wears the newest cape, if there is one.
const heroCape = computed(
	() => latest.value?.find((product) => product.type === "cape" && product.texture)?.texture?.url,
);

const steps = [
	{
		icon: "i-lucide-download",
		title: "Install the mod",
		description: "Add LeiCraft Client to your Fabric installation — no hosts-file tricks any more.",
	},
	{
		icon: "i-lucide-message-circle",
		title: "Log in with Discord",
		description: "Your LeiCraft Client account is your Discord account. No password to remember.",
	},
	{
		icon: "i-lucide-link",
		title: "Link in-game",
		description:
			"Open the LeiCraft Client options in the pause menu and click the link — done in seconds.",
	},
	{
		icon: "i-lucide-shirt",
		title: "Pick your look",
		description: "Equip capes and cosmetics on the website or in the in-game wardrobe.",
	},
];
</script>

<template>
	<div>
		<!-- Hero -->
		<section class="relative overflow-hidden">
			<div
				class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.15),transparent_60%)]"
			></div>
			<div
				class="pointer-events-none absolute -left-20 top-40 h-72 w-72 rounded-full bg-primary-500/10 blur-3xl"
			></div>

			<UContainer class="relative grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
				<div class="space-y-6">
					<UBadge color="primary" variant="soft" size="xl" icon="i-lucide-sparkles">
						Free for everyone
					</UBadge>
					<h1 class="text-4xl font-bold tracking-tight text-white md:text-6xl">
						Capes and cosmetics for
						<span
							class="bg-linear-to-tr from-primary-400 to-primary-200 bg-clip-text text-transparent"
						>
							Minecraft
						</span>
					</h1>
					<p class="max-w-xl text-lg text-slate-400">
						Show off capes and 3D cosmetics from the LeiCraft Client team, our partners and the
						community. Everyone who plays with the LeiCraft Client sees them — on any server.
					</p>
					<div class="flex flex-wrap gap-3">
						<UButton size="xl" to="/shop" icon="i-lucide-shopping-bag">Browse the shop</UButton>
						<UButton
							v-if="user"
							size="xl"
							to="/dashboard/wardrobe"
							color="neutral"
							variant="outline"
							icon="i-lucide-shirt"
						>
							Open wardrobe
						</UButton>
						<UButton
							v-else
							size="xl"
							to="/download"
							color="neutral"
							variant="outline"
							icon="i-lucide-download"
						>
							Get the mod
						</UButton>
					</div>
				</div>

				<div class="mx-auto h-105 w-full max-w-sm">
					<SkinViewer :cape="heroCape ?? null" animation="walk" auto-rotate />
				</div>
			</UContainer>
		</section>

		<!-- Categories -->
		<section class="bg-slate-950/50 py-16">
			<UContainer class="space-y-8">
				<div class="text-center">
					<h2 class="text-3xl font-bold text-white">Three places to find your style</h2>
					<p class="mt-2 text-slate-400">Every item is free to wear unless it is an exclusive.</p>
				</div>
				<div class="grid gap-4 md:grid-cols-3">
					<NuxtLink
						v-for="category in categories ?? []"
						:key="category.id"
						:to="`/shop/${category.id}`"
						class="group rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition hover:-translate-y-1 hover:border-primary-400/50"
					>
						<div
							class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-500/10"
						>
							<UIcon :name="CATEGORY_INFO[category.id].icon" class="text-2xl text-primary-400" />
						</div>
						<h3 class="text-lg font-semibold text-white group-hover:text-primary-300">
							{{ category.name }}
						</h3>
						<p class="mt-1 text-sm text-slate-400">{{ category.description }}</p>
						<p class="mt-3 text-xs text-slate-500">{{ category.page_count }} pages</p>
					</NuxtLink>
				</div>
			</UContainer>
		</section>

		<!-- Latest -->
		<section v-if="latest?.length" class="py-16">
			<UContainer class="space-y-8">
				<div class="flex items-end justify-between gap-4">
					<div>
						<h2 class="text-3xl font-bold text-white">New in the shop</h2>
						<p class="mt-2 text-slate-400">The latest capes and cosmetics.</p>
					</div>
					<UButton to="/shop" variant="ghost" trailing-icon="i-lucide-arrow-right">See all</UButton>
				</div>
				<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
					<CatalogProductCard v-for="product in latest" :key="product.id" :product="product" />
				</div>
			</UContainer>
		</section>

		<!-- How it works -->
		<section class="relative bg-slate-950/50 py-16">
			<div
				class="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-primary-500/5 to-transparent"
			></div>
			<UContainer class="relative space-y-8">
				<div class="text-center">
					<UBadge color="primary" variant="soft">How it works</UBadge>
					<h2 class="mt-3 text-3xl font-bold text-white">Set up in a minute</h2>
				</div>
				<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<UCard
						v-for="(step, index) in steps"
						:key="step.title"
						class="border-slate-800 bg-slate-900/50"
					>
						<div class="mb-3 flex items-center gap-3">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500/10 text-primary-400"
							>
								<UIcon :name="step.icon" class="text-xl" />
							</div>
							<span class="text-sm text-slate-500">Step {{ index + 1 }}</span>
						</div>
						<h3 class="font-semibold text-white">{{ step.title }}</h3>
						<p class="mt-1 text-sm text-slate-400">{{ step.description }}</p>
					</UCard>
				</div>
				<div class="text-center">
					<UButton size="lg" to="/download" icon="i-lucide-download">Download</UButton>
				</div>
			</UContainer>
		</section>
	</div>
</template>
