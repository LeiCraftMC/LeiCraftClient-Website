<script setup lang="ts">
/**
 * Parent route of one studio page: loads the page once, provides it to the child routes
 * (products, product editor, collections, members, codes, settings) and renders the toolbar.
 */
import type { NuxtError } from "#app";
import type { UseSubrouterPathDynamics } from "~/composables/useSubrouterPathDynamics";
import type { StudioPage } from "~/utils/types";

definePageMeta({
	layout: "dashboard",
});

const route = useRoute();
const pageId = Number(route.params.pageId);

let error: NuxtError | null = null;

const {
	data: result,
	refresh,
	loading,
} = await useAPIAsyncData(
	`studio-page-${pageId}`,
	async () => await useAPI((api) => api.getStudioPagesByPageId({ path: { pageId } })),
);

if (!result.value?.success) {
	error = createError({
		statusCode: result.value?.code || 500,
		statusMessage: result.value?.message || "Failed to load the page",
	});
}

const page = computed(() => (result.value?.success ? result.value.data : null) as StudioPage);

useSubrouterInjectedData<StudioPage>("studio_page").provide({
	data: page,
	refresh,
	loading,
});

const base = `/dashboard/studio/${pageId}`;
const supportsExclusives = computed(() => page.value?.category !== "community");

function getRoutesConfig(): UseSubrouterPathDynamics.RoutesConfig {
	const name = page.value?.name ?? `Page ${pageId}`;
	const section = (label: string) => ({
		seoSettings: { title: `${label} · ${name}`, description: `${label} of ${name}` },
		breadcrumbItems: [{ label: name, to: base }, { label }],
	});

	return {
		[base]: {
			isNavLink: true,
			label: "Items",
			icon: "i-lucide-package",
			exact: true,
			getDynamicValues: () => ({
				seoSettings: { title: name, description: `Items of ${name}` },
				breadcrumbItems: [{ label: name }],
			}),
		},
		[`${base}/products/[productId]`]: {
			isNavLink: false,
			label: "Item",
			getDynamicValues: () => section("Edit item"),
		},
		[`${base}/collections`]: {
			isNavLink: true,
			label: "Collections",
			icon: "i-lucide-layers",
			getDynamicValues: () => section("Collections"),
		},
		...(supportsExclusives.value
			? {
					[`${base}/codes`]: {
						isNavLink: true,
						label: "Redeem codes",
						icon: "i-lucide-ticket",
						getDynamicValues: () => section("Redeem codes"),
					},
					[`${base}/members`]: {
						isNavLink: true,
						label: "Members",
						icon: "i-lucide-users",
						getDynamicValues: () => section("Members"),
					},
				}
			: {}),
		[`${base}/settings`]: {
			isNavLink: true,
			label: "Page settings",
			icon: "i-lucide-settings",
			getDynamicValues: () => section("Page settings"),
		},
	};
}

const subrouterPathDynamics = useSubrouterPathDynamics({
	baseTitle: "Creator Studio | LeiCraft Client",
	basebreadcrumbItems: [{ label: "Creator Studio", to: "/dashboard/studio" }],
	routes: getRoutesConfig(),
});

const routePathDynamicValues = await useAwaitedComputed(() =>
	subrouterPathDynamics.getPathDynamicValues(route.path),
);

// Not inside the getter: after its `await` the component context is gone and the request fails
// with NUXT_E1001. Top-level `<script setup>` awaits restore it.
useSeoMeta({
	title: () => routePathDynamicValues.value.seoSettings.title,
	description: () => routePathDynamicValues.value.seoSettings.description,
});
</script>

<template>
	<UDashboardPanel>
		<template #header>
			<DashboardPageHeader
				icon="i-lucide-palette"
				:breadcrumb-items="routePathDynamicValues.breadcrumbItems"
			>
				<template #right>
					<UButton
						v-if="page && page.status === 'active'"
						:to="shopPagePath(page)"
						target="_blank"
						color="neutral"
						variant="ghost"
						icon="i-lucide-external-link"
					>
						View in shop
					</UButton>
				</template>
			</DashboardPageHeader>

			<UDashboardToolbar v-if="!error">
				<!-- `-mx-1` aligns the menu with the sidebar collapse button. -->
				<UNavigationMenu :items="subrouterPathDynamics.links" highlight class="-mx-1 flex-1" />
			</UDashboardToolbar>
		</template>

		<template #body>
			<div class="flex w-full flex-col gap-6">
				<UError v-if="error" :error="error" />
				<template v-else>
					<UAlert
						v-if="page?.status === 'hidden'"
						color="error"
						variant="soft"
						icon="i-lucide-eye-off"
						title="This page is hidden by the moderators"
						:description="page.status_note ?? 'It is not visible in the shop. Contact the LeiCraft Client team on Discord.'"
					/>
					<UAlert
						v-else-if="page?.category === 'community' && !page.reviewed_at"
						color="warning"
						variant="soft"
						icon="i-lucide-hourglass"
						title="Waiting for the first review"
						description="Your page and its items become public once a moderator approved the page profile and the items."
					/>
					<NuxtPage />
				</template>
			</div>
		</template>
	</UDashboardPanel>
</template>
