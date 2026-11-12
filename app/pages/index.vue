<script setup lang="ts">
import { useUserInfoStore } from "~/composables/stores/useUserStore";
import { features, homeFaq, howItWorks, MINECRAFT_VERSION, principles } from "~/data/marketing";
import type { Category, Product } from "~/utils/types";

usePageSeo({
	title: "LeiCraftClient — Free capes and cosmetics for every Minecraft client",
	description:
		"Free capes and 3D cosmetics for Minecraft Java. A small Fabric mod that runs next to Lunar, NoRisk, Dawn or plain Fabric — everyone with it sees your look, on any server. Upload your own, too.",
	jsonLd: {
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		name: "LeiCraftClient",
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

// Shown while no player wears anything yet: the newest cape.
const newestCape = computed(
	() => latest.value?.find((product) => product.type === "cape" && product.texture)?.texture?.url,
);

const creatorPoints = [
	"Capes as a simple PNG — from 64×32 up to HD",
	"3D cosmetics modelled in Blockbench with the OptiFine Player Models plugin",
	"A version for wide and slim arms, picked automatically",
	"Your own community page with collections",
	"Reviewed by moderators, then free for everyone to wear",
];
</script>

<template>
	<div>
		<!-- Hero -->
		<section class="relative overflow-hidden">
			<div
				class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(56,189,248,0.16),transparent)]"
				aria-hidden="true"
			></div>
			<div
				class="pointer-events-none absolute -left-20 top-40 h-72 w-72 rounded-full bg-primary-500/10 blur-3xl"
				aria-hidden="true"
			></div>
			<div
				class="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-primary-400/5 blur-3xl"
				aria-hidden="true"
			></div>

			<UContainer class="relative grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-24">
				<div class="space-y-6">
					<UBadge color="primary" variant="soft" size="xl" icon="i-lucide-sparkles">
						Free · Open source · Minecraft {{ MINECRAFT_VERSION }}
					</UBadge>
					<h1 class="text-4xl font-bold tracking-tight text-balance text-white sm:text-5xl md:text-6xl">
						Your cape. Your cosmetics.
						<span class="bg-linear-to-tr from-primary-400 to-primary-200 bg-clip-text text-transparent">
							Any client.
						</span>
					</h1>
					<p class="max-w-xl text-lg text-pretty text-slate-400">
						LeiCraftClient is a small Fabric mod that adds capes and 3D cosmetics to Minecraft Java — next to
						Lunar, NoRisk, Dawn or plain Fabric. Everyone who has it sees your look, on any server. Made by
						our team, our partners and players like you.
					</p>
					<div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
						<UButton size="xl" to="/download" icon="i-lucide-download" class="justify-center">
							Download free
						</UButton>
						<UButton
							size="xl"
							to="/shop"
							color="neutral"
							variant="outline"
							icon="i-lucide-shopping-bag"
							class="justify-center"
						>
							Browse the shop
						</UButton>
						<UButton
							v-if="user"
							size="xl"
							to="/dashboard/wardrobe"
							color="neutral"
							variant="ghost"
							icon="i-lucide-shirt"
							class="justify-center"
						>
							Open wardrobe
						</UButton>
						<UButton
							v-else
							size="xl"
							to="/docs/getting-started/quick-start"
							color="neutral"
							variant="ghost"
							icon="i-lucide-book-open"
							class="justify-center"
						>
							How it works
						</UButton>
					</div>
					<p class="text-sm text-slate-500">
						Nothing to buy · No Minecraft password · Works on every server
					</p>
				</div>

				<MarketingHeroShowcase :fallback-cape="newestCape ?? null" />
			</UContainer>
		</section>

		<!-- Works with -->
		<section class="bg-slate-950/50 py-20">
			<UContainer>
				<MarketingSectionHeading
					badge="Compatibility"
					title="Keep the client you love"
					description="LeiCraftClient is not another launcher. It's a regular Fabric mod, so it runs wherever you can add Fabric mods — loaders, launchers and popular clients."
				/>
				<MarketingCompatibilityGrid />
				<div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
					<UButton to="/docs/clients/overview" variant="soft" icon="i-lucide-table">
						Compatibility details
					</UButton>
					<UButton to="/docs/install/fabric" color="neutral" variant="ghost" trailing-icon="i-lucide-arrow-right">
						Step-by-step install guides
					</UButton>
				</div>
			</UContainer>
		</section>

		<!-- Features -->
		<section class="py-20">
			<UContainer>
				<MarketingSectionHeading
					badge="Features"
					title="Everything a cape mod needs. Nothing it doesn't."
					description="Capes and cosmetics that look right, a wardrobe that's yours, and no strings attached."
				/>
				<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<MarketingIconCard
						v-for="feature in features"
						:key="feature.title"
						:icon="feature.icon"
						:title="feature.title"
						:description="feature.description"
						:to="feature.to"
					/>
				</div>
				<div class="mt-8 text-center">
					<UButton to="/features" variant="ghost" trailing-icon="i-lucide-arrow-right">See all features</UButton>
				</div>
			</UContainer>
		</section>

		<!-- Creators -->
		<section class="relative overflow-hidden bg-slate-950/50 py-20">
			<div
				class="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-primary-500/10 blur-3xl"
				aria-hidden="true"
			></div>
			<UContainer class="relative grid items-center gap-10 lg:grid-cols-2">
				<div class="space-y-5">
					<UBadge color="primary" variant="soft" size="xl" icon="i-lucide-palette">For creators</UBadge>
					<h2 class="text-3xl font-bold text-balance text-white sm:text-4xl">
						Made it yourself?
						<span class="bg-linear-to-tr from-primary-400 to-primary-200 bg-clip-text text-transparent">
							Upload it.
						</span>
					</h2>
					<p class="text-lg text-pretty text-slate-400">
						Draw a cape, model a hat or a pair of wings, and publish it on your own community page. Once a
						moderator has checked it, every LeiCraftClient player can wear it — for free.
					</p>
					<div class="flex flex-col gap-3 sm:flex-row">
						<UButton to="/creators" icon="i-lucide-sparkles" class="justify-center">Start creating</UButton>
						<UButton
							to="/docs/creators/blockbench-cosmetics"
							color="neutral"
							variant="outline"
							icon="i-lucide-book-open"
							class="justify-center"
						>
							Blockbench guide
						</UButton>
					</div>
				</div>

				<UCard class="border-slate-800 bg-slate-900/60">
					<ul class="space-y-4">
						<li v-for="point in creatorPoints" :key="point" class="flex items-start gap-3">
							<UIcon name="i-lucide-circle-check" class="mt-0.5 shrink-0 text-xl text-primary-400" />
							<span class="text-slate-300">{{ point }}</span>
						</li>
					</ul>
				</UCard>
			</UContainer>
		</section>

		<!-- Categories -->
		<section class="py-20">
			<UContainer>
				<MarketingSectionHeading
					badge="The shop"
					title="Three places to find your style"
					description="Every item is free to wear unless it is an exclusive."
				/>
				<div class="grid gap-4 md:grid-cols-3">
					<NuxtLink
						v-for="category in categories ?? []"
						:key="category.id"
						:to="`/shop/${category.id}`"
						class="group rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition hover:-translate-y-1 hover:border-primary-400/50"
					>
						<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-500/10">
							<UIcon :name="CATEGORY_INFO[category.id].icon" class="text-2xl text-primary-400" />
						</div>
						<h3 class="text-lg font-semibold text-white group-hover:text-primary-300">
							{{ category.name }}
						</h3>
						<p class="mt-1 text-sm text-slate-400">{{ category.description }}</p>
						<p class="mt-3 text-xs text-slate-500">{{ categoryCount(category) }}</p>
					</NuxtLink>
				</div>
			</UContainer>
		</section>

		<!-- Latest -->
		<section v-if="latest?.length" class="bg-slate-950/50 py-20">
			<UContainer class="space-y-8">
				<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
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
		<section class="relative py-20">
			<div
				class="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-primary-500/5 to-transparent"
				aria-hidden="true"
			></div>
			<UContainer class="relative">
				<MarketingSectionHeading
					badge="How it works"
					title="Set up in a minute"
					description="Four steps from download to the first cape on your back."
				/>
				<ol class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<li v-for="(step, index) in howItWorks" :key="step.title">
						<NuxtLink
							:to="step.to"
							class="group block h-full rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition hover:-translate-y-1 hover:border-primary-400/50"
						>
							<div class="mb-3 flex items-center gap-3">
								<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500/10 text-primary-400">
									<UIcon :name="step.icon" class="text-xl" />
								</div>
								<span class="text-sm text-slate-500">Step {{ index + 1 }}</span>
							</div>
							<h3 class="font-semibold text-white group-hover:text-primary-300">{{ step.title }}</h3>
							<p class="mt-1 text-sm text-slate-400">{{ step.description }}</p>
						</NuxtLink>
					</li>
				</ol>
				<div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
					<UButton size="lg" to="/download" icon="i-lucide-download" class="justify-center">Download</UButton>
					<UButton
						size="lg"
						to="/docs/getting-started/quick-start"
						color="neutral"
						variant="outline"
						icon="i-lucide-book-open"
						class="justify-center"
					>
						Quick start guide
					</UButton>
				</div>
			</UContainer>
		</section>

		<!-- Principles -->
		<section class="bg-slate-950/50 py-20">
			<UContainer>
				<MarketingSectionHeading
					badge="Our philosophy"
					title="Built for players, not for a store"
					description="Cosmetics are a way to show who you are. They shouldn't cost money, lock you into one client or ask for your password."
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
				<div class="mt-8 text-center">
					<UButton to="/about" variant="ghost" trailing-icon="i-lucide-arrow-right">Read our philosophy</UButton>
				</div>
			</UContainer>
		</section>

		<!-- FAQ -->
		<section class="py-20">
			<UContainer class="max-w-3xl">
				<MarketingSectionHeading badge="FAQ" title="Questions? Answers." />
				<UAccordion
					:items="homeFaq"
					:ui="{ trigger: 'text-base font-medium text-white', body: 'text-slate-400 text-base' }"
				/>
				<div class="mt-8 text-center">
					<UButton to="/docs/faq" variant="ghost" trailing-icon="i-lucide-arrow-right">More in the FAQ</UButton>
				</div>
			</UContainer>
		</section>

		<MarketingCtaSection />
	</div>
</template>
