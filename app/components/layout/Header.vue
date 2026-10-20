<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import { useUserInfoStore } from "~/composables/stores/useUserStore";

const route = useRoute();
const user = await useUserInfoStore().use();

const links = computed<NavigationMenuItem[]>(() => [
	{ label: "Shop", to: "/shop", icon: "i-lucide-shopping-bag" },
	{ label: "Players", to: "/players", icon: "i-lucide-users" },
	{ label: "Download", to: "/download", icon: "i-lucide-download" },
]);

const loginRoute = computed(() =>
	route.path.startsWith("/auth")
		? "/auth/login"
		: `/auth/login?url=${encodeURIComponent(route.fullPath)}`,
);
</script>

<template>
	<UHeader class="backdrop-blur-xl" title="LeiCraft Client">
		<template #title>
			<ImgAppLogo class="h-8" />
		</template>

		<UNavigationMenu :items="links" />

		<template #body>
			<UNavigationMenu :items="links" orientation="vertical" class="w-full" />
		</template>

		<template #right>
			<div class="flex items-center gap-2">
				<template v-if="user">
					<div class="hidden items-center gap-2 text-white sm:flex">
						<UAvatar :src="user.avatar_url" :alt="user.display_name" size="xs" />
						<span class="text-sm">{{ user.display_name }}</span>
					</div>
					<UButton
						icon="i-lucide-layout-dashboard"
						to="/dashboard"
						color="primary"
						variant="soft"
						class="hidden sm:flex"
					>
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
