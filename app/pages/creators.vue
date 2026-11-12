<script setup lang="ts">
import { DISCORD_URL } from "~/data/marketing";

usePageSeo({
	title: "For creators — LeiCraft Client",
	description:
		"Make capes and 3D cosmetics for Minecraft and publish them on your own community page. Blockbench with the OptiFine Player Models plugin, any image editor, a moderator review — then everyone wears them for free.",
});

const steps = [
	{
		icon: "i-lucide-pencil-ruler",
		title: "Design",
		description:
			"Paint a cape in any image editor, or model a cosmetic in Blockbench with the OptiFine Player Models plugin.",
		to: "/docs/creators/capes",
	},
	{
		icon: "i-lucide-upload",
		title: "Upload",
		description:
			"Create your community page in the Creator Studio, add the item and upload the texture and model.",
		to: "/docs/creators/uploading",
	},
	{
		icon: "i-lucide-shield-check",
		title: "Review",
		description:
			"Submit it. A moderator looks at every community item before it goes public — you see the status in the studio.",
		to: "/docs/creators/overview",
	},
	{
		icon: "i-lucide-party-popper",
		title: "Everyone wears it",
		description:
			"Once approved it's in the shop. Players save it to their wardrobe and wear it — for free, on every server.",
		to: "/shop/community",
	},
];

const makeables = [
	{
		icon: "i-lucide-flag",
		title: "Capes",
		description:
			"A 2:1 PNG — classic 64×32 or HD up to 2048×1024. The same texture shows on the elytra.",
		to: "/docs/creators/capes",
	},
	{
		icon: "i-lucide-shapes",
		title: "3D cosmetics",
		description:
			"Hats, horns, wings, backpacks: models attached to the head, body, arms or legs, with your own texture.",
		to: "/docs/creators/blockbench-cosmetics",
	},
	{
		icon: "i-lucide-split",
		title: "Skin variants",
		description:
			"Ship a version for wide and one for slim arms; each player automatically gets the one that fits.",
		to: "/docs/creators/variants",
	},
	{
		icon: "i-lucide-library",
		title: "Collections",
		description: "Group your items into sets on your page, with a name, description and preview.",
		to: "/docs/creators/uploading",
	},
];

const tools = [
	{
		icon: "i-lucide-box",
		title: "Blockbench",
		description:
			"The free 3D editor for Minecraft models. Install the “OptiFine Player Models” plugin (by Ewan Howell) from File → Plugins… and start from the player template.",
		to: "/docs/creators/blockbench-cosmetics",
	},
	{
		icon: "i-lucide-paintbrush",
		title: "Any image editor",
		description:
			"Capes and cosmetic textures are plain PNG files — use Blockbench's paint tools, Aseprite, GIMP, Krita or whatever you like.",
		to: "/docs/creators/capes",
	},
	{
		icon: "i-lucide-eye",
		title: "3D preview",
		description:
			"Every item gets a live preview in the studio and the shop, on a wide or slim skin — and capes as elytra too.",
		to: "/docs/creators/uploading",
	},
];
</script>

<template>
	<div>
		<MarketingPageHero
			badge="For creators"
			badge-icon="i-lucide-palette"
			title="Your designs, worn on every server"
			description="Make capes and 3D cosmetics, publish them on your own community page, and see players wear them — no cost for you, no cost for them."
		>
			<template #title>
				Your designs, worn on
				<span class="bg-linear-to-tr from-primary-400 to-primary-200 bg-clip-text text-transparent">
					every server
				</span>
			</template>
			<template #actions>
				<UButton size="xl" to="/dashboard/studio" icon="i-lucide-palette" class="justify-center">
					Open the Creator Studio
				</UButton>
				<UButton
					size="xl"
					to="/docs/creators/overview"
					color="neutral"
					variant="outline"
					icon="i-lucide-book-open"
					class="justify-center"
				>
					Creator docs
				</UButton>
			</template>
		</MarketingPageHero>

		<!-- Steps -->
		<section class="bg-slate-950/50 py-20">
			<UContainer>
				<MarketingSectionHeading
					badge="How it works"
					title="From idea to everyone's back in four steps"
				/>
				<ol class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<li v-for="(step, index) in steps" :key="step.title">
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
			</UContainer>
		</section>

		<!-- What you can make -->
		<section class="py-20">
			<UContainer>
				<MarketingSectionHeading
					badge="What you can make"
					title="Capes, cosmetics and whole collections"
					description="The same formats the Minecraft community already knows — so your existing skills and files carry over."
				/>
				<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<MarketingIconCard
						v-for="item in makeables"
						:key="item.title"
						:icon="item.icon"
						:title="item.title"
						:description="item.description"
						:to="item.to"
					/>
				</div>
			</UContainer>
		</section>

		<!-- Tools -->
		<section class="bg-slate-950/50 py-20">
			<UContainer>
				<MarketingSectionHeading
					badge="Tools"
					title="Free tools you probably already use"
					description="No special software, no account anywhere else."
				/>
				<div class="grid gap-4 md:grid-cols-3">
					<MarketingIconCard
						v-for="tool in tools"
						:key="tool.title"
						:icon="tool.icon"
						:title="tool.title"
						:description="tool.description"
						:to="tool.to"
					/>
				</div>
			</UContainer>
		</section>

		<!-- Review + partners -->
		<section class="py-20">
			<UContainer class="grid gap-6 lg:grid-cols-2">
				<UCard class="border-slate-800 bg-slate-900/60">
					<div class="space-y-4 p-2">
						<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-500/10">
							<UIcon name="i-lucide-shield-check" class="text-xl text-primary-400" />
						</div>
						<h2 class="text-2xl font-bold text-white">A fair, human review</h2>
						<p class="text-slate-400">
							Every community item, and your page's name, description and images, is checked by a moderator
							before it's public. If something needs a change, you get a note. When you edit a live item, it
							goes back to review — the shop keeps showing the approved version until then.
						</p>
						<UButton to="/docs/creators/overview" variant="soft" trailing-icon="i-lucide-arrow-right">
							How review works
						</UButton>
					</div>
				</UCard>

				<UCard class="border-slate-800 bg-slate-900/60">
					<div class="space-y-4 p-2">
						<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
							<UIcon name="i-lucide-gem" class="text-xl text-amber-400" />
						</div>
						<h2 class="text-2xl font-bold text-white">Server, creator or event?</h2>
						<p class="text-slate-400">
							Partner pages can publish exclusive items and hand them out with redeem codes or as direct gifts —
							great for giveaways, events and supporters. Your team manages the page itself, and API keys let
							your bot grant items automatically.
						</p>
						<div class="flex flex-col gap-3 sm:flex-row">
							<UButton :to="DISCORD_URL" target="_blank" icon="i-lucide-message-circle" class="justify-center">
								Ask us on Discord
							</UButton>
							<UButton
								to="/docs/creators/partners"
								color="neutral"
								variant="ghost"
								trailing-icon="i-lucide-arrow-right"
								class="justify-center"
							>
								Partner docs
							</UButton>
						</div>
					</div>
				</UCard>
			</UContainer>
		</section>

		<MarketingCtaSection />
	</div>
</template>
