<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import { useUserInfoStore } from "~/composables/stores/useUserStore";

const user = await useUserInfoStore().use();
const isAdmin = computed(() => user.value?.role === "admin");
const isStaff = computed(() => isStaffRole(user.value?.role));

const mainItems: NavigationMenuItem[] = [
	{ label: "Overview", icon: "i-lucide-layout-dashboard", to: "/dashboard", exact: true },
	{ label: "Wardrobe", icon: "i-lucide-shirt", to: "/dashboard/wardrobe" },
	{ label: "Inventory", icon: "i-lucide-gem", to: "/dashboard/inventory" },
	{ label: "Minecraft accounts", icon: "i-lucide-gamepad-2", to: "/dashboard/accounts" },
];

const studioItems: NavigationMenuItem[] = [
	{ label: "Creator Studio", icon: "i-lucide-palette", type: "label" },
	{ label: "My pages", icon: "i-lucide-store", to: "/dashboard/studio" },
];

const settingsItems: NavigationMenuItem[] = [
	{ label: "Settings", icon: "i-lucide-settings", type: "label" },
	{ label: "Account", icon: "i-lucide-user", to: "/dashboard/settings", exact: true },
	{ label: "API Keys", icon: "i-lucide-key", to: "/dashboard/apikeys" },
];

const moderationItems: NavigationMenuItem[] = [
	{ label: "Moderation", icon: "i-lucide-shield-check", type: "label" },
	{ label: "Review queue", icon: "i-lucide-inbox", to: "/dashboard/moderation", exact: true },
	{ label: "Pages", icon: "i-lucide-store", to: "/dashboard/moderation/pages" },
	{ label: "Reports", icon: "i-lucide-flag-triangle-right", to: "/dashboard/moderation/reports" },
	{ label: "Users", icon: "i-lucide-user-x", to: "/dashboard/moderation/users" },
];

const adminItems: NavigationMenuItem[] = [
	{ label: "Admin", icon: "i-lucide-shield", type: "label" },
	{ label: "Users & roles", icon: "i-lucide-users", to: "/dashboard/admin/users" },
	{ label: "Audit log", icon: "i-lucide-scroll-text", to: "/dashboard/admin/audit-log" },
];

const footerItems: NavigationMenuItem[] = [
	{ label: "Shop", icon: "i-lucide-shopping-bag", to: "/shop" },
	{ label: "Back to Home", icon: "i-lucide-house", to: "/" },
];
</script>

<template>
	<NuxtLoadingIndicator color="var(--ui-primary)" position="top" />

	<UDashboardGroup class="main-bg-color text-slate-100">
		<UDashboardSidebar
			collapsible
			resizable
			:ui="{
				header: 'main-bg-color',
				body: 'main-bg-color',
				content: 'main-bg-color',
				footer: 'border-t border-default main-bg-color',
			}"
			:min-size="18"
			:default-size="20"
			:max-size="30"
		>
			<template #header="{ collapsed }">
				<NuxtLink to="/dashboard" :class="`${!collapsed ? 'ms-2.5' : ''} flex items-center gap-1.5`">
					<ImgAppLogo v-if="!collapsed" class="h-7" />
					<ImgAppIcon v-else class="h-8 w-8" />
				</NuxtLink>
			</template>

			<template #default="{ collapsed }">
				<UNavigationMenu :collapsed="collapsed" :items="mainItems" orientation="vertical" />

				<UNavigationMenu :collapsed="collapsed" :items="studioItems" orientation="vertical" />

				<UNavigationMenu :collapsed="collapsed" :items="settingsItems" orientation="vertical" />

				<UNavigationMenu
					v-if="isStaff"
					:collapsed="collapsed"
					:items="moderationItems"
					orientation="vertical"
				/>

				<UNavigationMenu
					v-if="isAdmin"
					:collapsed="collapsed"
					:items="adminItems"
					orientation="vertical"
				/>

				<UNavigationMenu
					:collapsed="collapsed"
					:items="footerItems"
					orientation="vertical"
					class="mt-auto"
				/>
			</template>

			<template #footer="{ collapsed }">
				<DashboardUserMenu :collapsed="collapsed" />
			</template>
		</UDashboardSidebar>

		<slot />
	</UDashboardGroup>
</template>
