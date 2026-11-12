<script setup lang="ts">
import type { TocLink } from "@nuxtjs/mdc";
import { type DocsPage, docsEditBaseUrl, docsPagesFlat, docsSections } from "~/data/docs";

const {
	title,
	description,
	toc = [],
	sourcePath,
} = defineProps<{
	title: string;
	description?: string;
	/** The page's headings. */
	toc?: TocLink[];
	/** The page's content path without extension (`docs/install/fabric`), for the edit link. */
	sourcePath?: string;
}>();

const route = useRoute();

// Trailing slashes still reach the app from external links.
const currentPath = computed(() => route.path.replace(/\/$/, "") || "/");

const currentSection = computed(() =>
	docsSections.find((section) => section.pages.some((page) => page.to === currentPath.value)),
);

const currentIndex = computed(() =>
	docsPagesFlat.findIndex((page) => page.to === currentPath.value),
);

const prevPage = computed<DocsPage | null>(() =>
	currentIndex.value > 0 ? (docsPagesFlat[currentIndex.value - 1] ?? null) : null,
);

const nextPage = computed<DocsPage | null>(() =>
	currentIndex.value >= 0 && currentIndex.value < docsPagesFlat.length - 1
		? (docsPagesFlat[currentIndex.value + 1] ?? null)
		: null,
);

const editUrl = computed(() =>
	docsEditBaseUrl && sourcePath ? `${docsEditBaseUrl}/${sourcePath}.md` : null,
);

const mobileNavOpen = ref(false);

watch(currentPath, () => {
	mobileNavOpen.value = false;
});
</script>

<template>
	<div class="mx-auto flex w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
		<!-- Sidebar -->
		<aside
			class="sticky top-[calc(var(--ui-header-height)+1rem)] hidden h-fit max-h-[calc(100vh-var(--ui-header-height)-2rem)] w-60 shrink-0 overflow-y-auto pb-8 lg:block"
		>
			<DocsNavigation :current-path="currentPath" />
		</aside>

		<!-- Content -->
		<div class="min-w-0 flex-1">
			<!-- Mobile navigation -->
			<div class="mb-6 flex items-center gap-3 lg:hidden">
				<USlideover v-model:open="mobileNavOpen" side="left" title="Documentation">
					<UButton color="neutral" variant="outline" icon="i-lucide-menu" size="sm">Docs menu</UButton>
					<template #body>
						<DocsNavigation :current-path="currentPath" />
					</template>
				</USlideover>
				<span v-if="currentSection" class="truncate text-sm text-slate-500">
					{{ currentSection.label }}
				</span>
			</div>

			<header class="mb-8 border-b border-slate-800 pb-6">
				<p v-if="currentSection" class="mb-2 hidden text-sm font-semibold text-primary-400 lg:block">
					{{ currentSection.label }}
				</p>
				<h1 class="text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl">{{ title }}</h1>
				<p v-if="description" class="mt-3 text-lg text-pretty text-slate-400">{{ description }}</p>
			</header>

			<DocsToc v-if="toc.length" :links="toc" collapsible class="mb-8 xl:hidden" />

			<article>
				<slot />
			</article>

			<div v-if="editUrl" class="mt-12 flex justify-end">
				<UButton
					:to="editUrl"
					target="_blank"
					color="neutral"
					variant="link"
					icon="i-lucide-square-pen"
					size="sm"
				>
					Edit this page
				</UButton>
			</div>

			<!-- Prev / Next -->
			<div class="mt-12 flex flex-col gap-4 border-t border-slate-800 pt-8 sm:flex-row sm:justify-between">
				<NuxtLink
					v-if="prevPage"
					:to="prevPage.to"
					class="group flex flex-1 flex-col gap-1 rounded-lg border border-slate-800 bg-slate-900/50 p-4 transition hover:border-primary-400/50 sm:max-w-xs"
				>
					<span class="flex items-center gap-1 text-xs text-slate-500">
						<UIcon name="i-lucide-arrow-left" class="text-sm" />
						Previous
					</span>
					<span class="font-medium text-slate-200 group-hover:text-primary-400">{{ prevPage.title }}</span>
				</NuxtLink>
				<span v-else class="hidden sm:block sm:max-w-xs sm:flex-1" aria-hidden="true" />
				<NuxtLink
					v-if="nextPage"
					:to="nextPage.to"
					class="group flex flex-1 flex-col gap-1 rounded-lg border border-slate-800 bg-slate-900/50 p-4 text-right transition hover:border-primary-400/50 sm:max-w-xs"
				>
					<span class="flex items-center justify-end gap-1 text-xs text-slate-500">
						Next
						<UIcon name="i-lucide-arrow-right" class="text-sm" />
					</span>
					<span class="font-medium text-slate-200 group-hover:text-primary-400">{{ nextPage.title }}</span>
				</NuxtLink>
			</div>
		</div>

		<!-- On this page -->
		<aside v-if="toc.length" class="hidden w-56 shrink-0 xl:block">
			<DocsToc
				:links="toc"
				class="sticky top-[calc(var(--ui-header-height)+1rem)] max-h-[calc(100vh-var(--ui-header-height)-2rem)] overflow-y-auto"
			/>
		</aside>
	</div>
</template>
