<script setup lang="ts">
import type { FooterColumn } from "@nuxt/ui";
import { DISCORD_URL, SOURCE_URL } from "~/data/marketing";

const socialLinks = [
	{ icon: "i-lucide-github", to: "https://github.com/LeiCraftMC", label: "GitHub" },
	{ icon: "i-lucide-gitlab", to: "https://git.leicraftmc.de/LeiCraftMC", label: "GitLab" },
	{
		icon: "i-lucide-message-circle",
		to: DISCORD_URL,
		label: "Discord",
	},
];

const footerColumns: FooterColumn[] = [
	{
		label: "Product",
		children: [
			{ label: "Features", to: "/features" },
			{ label: "Shop", to: "/shop" },
			{ label: "Players", to: "/players" },
			{ label: "Download", to: "/download" },
			{ label: "Dashboard", to: "/dashboard" },
		],
	},
	{
		label: "Docs",
		children: [
			{ label: "Quick start", to: "/docs/getting-started/quick-start" },
			{ label: "Install guides", to: "/docs/install/fabric" },
			{ label: "Other clients", to: "/docs/clients/overview" },
			{ label: "Create & upload", to: "/docs/creators/overview" },
			{ label: "FAQ", to: "/docs/faq" },
		],
	},
	{
		label: "Community",
		children: [
			{ label: "For creators", to: "/creators" },
			{ label: "Our philosophy", to: "/about" },
			{ label: "Discord", to: DISCORD_URL, target: "_blank" },
			{ label: "Source code", to: SOURCE_URL, target: "_blank" },
		],
	},
	{
		label: "Legal",
		children: [
			{ label: "Impressum", to: "https://legal.leicraftmc.de/impressum/", target: "_blank" },
			{ label: "Datenschutz", to: "https://legal.leicraftmc.de/datenschutz/", target: "_blank" },
		],
	},
];

const currentYear = new Date().getFullYear();
</script>

<template>
	<USeparator />
	<UFooter
		:ui="{
			root: 'py-12',
			container: 'py-0 lg:py-0 lg:gap-x-0 gap-x-0 lg:block',
			bottom: 'p-0 lg:p-0 mt-8',
		}"
	>
		<UFooterColumns
			:columns="footerColumns"
			:ui="{
				root: 'grid gap-10 w-full lg:grid-cols-3',
				center: 'grid grid-flow-row auto-cols-auto grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-2',
				label: 'text-slate-100 font-semibold text-base',
				link: 'text-slate-400 hover:text-primary text-sm sm:text-base inline-block py-1 transition-colors',
				left: 'mb-0',
				// Inline instead of absolute: the default pokes out of the narrow phone columns.
				linkLabelExternalIcon: 'size-3 static ms-1 inline-block align-top text-dimmed',
			}"
		>
			<template #left>
				<div class="space-y-4">
					<span
						class="inline-block bg-linear-to-tr from-primary-400 to-primary-200 bg-clip-text text-2xl font-bold text-transparent"
					>
						LeiCraftClient
					</span>
					<p class="text-base leading-relaxed text-slate-300/80 md:max-w-3xl">
						Free capes and 3D cosmetics for Minecraft Java — a small Fabric mod that runs next to the client
						you already use. Made by the LeiCraftClient team, our partners and the community.
					</p>
					<div class="flex gap-2 pt-2">
						<UButton
							v-for="social in socialLinks"
							:key="social.label"
							:to="social.to"
							target="_blank"
							:icon="social.icon"
							color="neutral"
							variant="ghost"
							size="lg"
							:aria-label="social.label"
							class="transition-transform hover:scale-110 hover:text-primary"
						/>
					</div>
				</div>
			</template>
		</UFooterColumns>

		<template #bottom>
			<UContainer>
				<div
					class="flex flex-col items-center border-t border-slate-800 pt-8 text-center md:flex-row md:justify-between md:text-left"
				>
					<p class="text-xs text-slate-500 sm:text-sm">
						&copy; {{ currentYear }} LeiCraft_MC. Open source under AGPL-3.0.
					</p>
					<p class="text-xs text-slate-500 sm:text-sm">Built with ❤️ for the community</p>
				</div>
			</UContainer>
		</template>
	</UFooter>
</template>
