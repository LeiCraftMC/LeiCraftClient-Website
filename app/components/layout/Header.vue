<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import { useUserInfoStore } from "~/composables/stores/useUserStore";

const route = useRoute();
const user = await useUserInfoStore().use();

const links = computed<NavigationMenuItem[]>(() => [
	{ label: "Features", to: "/features", icon: "i-lucide-sparkles" },
	{ label: "Shop", to: "/shop", icon: "i-lucide-shopping-bag" },
	{ label: "Players", to: "/players", icon: "i-lucide-users" },
	{ label: "Creators", to: "/creators", icon: "i-lucide-palette" },
	{
		label: "Docs",
		to: "/docs",
		icon: "i-lucide-book-open",
		active: route.path === "/docs" || route.path.startsWith("/docs/"),
	},
]);

const loginRoute = computed(() =>
	route.path.startsWith("/auth")
		? "/auth/login"
		: `/auth/login?url=${encodeURIComponent(route.fullPath)}`,
);
</script>

<template>
	<UHeader class="backdrop-blur-xl" title="LeiCraftClient">
		<template #title>
			<ImgAppLogo class="h-8" />
		</template>

		<UNavigationMenu :items="links" />

		<template #body>
			<div class="space-y-6">
				<UNavigationMenu :items="links" orientation="vertical" class="w-full" />
				<div class="flex flex-col gap-2">
					<UButton to="/download" icon="i-lucide-download" block>Download</UButton>
					<UButton
						v-if="user"
						to="/dashboard"
						icon="i-lucide-layout-dashboard"
						color="neutral"
						variant="outline"
						block
					>
						Dashboard
					</UButton>
				</div>
			</div>
		</template>

		<template #right>
			<div class="flex items-center gap-2">
				<UButton
					to="/download"
					icon="i-lucide-download"
					color="neutral"
					variant="ghost"
					class="hidden lg:flex"
				>
					Download
				</UButton>

				<template v-if="user">
					<UButton
						to="/dashboard"
						color="primary"
						variant="soft"
						class="hidden sm:flex"
						:aria-label="`Dashboard — ${user.display_name}`"
					>
						<UAvatar :src="user.avatar_url" :alt="user.display_name" size="2xs" />
						Dashboard
					</UButton>
				</template>

				<UButton v-else icon="i-lucide-log-in" :to="loginRoute" color="primary" variant="solid">
					Login
				</UButton>
			</div>
		</template>
	</UHeader>
</template>
