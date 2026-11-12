<script setup lang="ts">
/**
 * "On this page": the page's `##`/`###` headings. Stands in for Nuxt UI's `UContentToc`, which is
 * only registered together with @nuxt/content. Highlights the heading currently in view.
 */
import type { TocLink } from "@nuxtjs/mdc";

const {
	links,
	title = "On this page",
	collapsible = false,
} = defineProps<{
	links: TocLink[];
	title?: string;
	/** Folded into a button (narrow screens). */
	collapsible?: boolean;
}>();

const open = ref(false);
const activeId = ref<string | null>(null);

const ids = computed(() =>
	links.flatMap((link) => [link.id, ...(link.children ?? []).map((child) => child.id)]),
);

let observer: IntersectionObserver | null = null;

function observe() {
	observer?.disconnect();
	if (!import.meta.client) return;

	const visible = new Set<string>();
	observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) visible.add(entry.target.id);
				else visible.delete(entry.target.id);
			}
			// The first heading (in document order) that is in the upper part of the viewport.
			const first = ids.value.find((id) => visible.has(id));
			if (first) activeId.value = first;
		},
		{ rootMargin: "-80px 0px -60% 0px" },
	);

	for (const id of ids.value) {
		const element = document.getElementById(id);
		if (element) observer.observe(element);
	}
}

onMounted(async () => {
	await nextTick();
	observe();
});
watch(ids, async () => {
	await nextTick();
	observe();
});
onBeforeUnmount(() => observer?.disconnect());

function linkClass(id: string) {
	return id === activeId.value
		? "border-primary-400 text-primary-400"
		: "border-transparent text-slate-400 hover:text-slate-200";
}
</script>

<template>
	<nav :aria-label="title">
		<button
			v-if="collapsible"
			type="button"
			class="flex w-full items-center justify-between rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-2.5 text-sm font-medium text-slate-200"
			:aria-expanded="open"
			@click="open = !open"
		>
			{{ title }}
			<UIcon :name="open ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'" class="text-slate-500" />
		</button>
		<p v-else class="mb-3 text-sm font-semibold text-slate-200">{{ title }}</p>

		<ul
			v-show="!collapsible || open"
			:class="['space-y-1 text-sm', collapsible ? 'mt-2 rounded-lg border border-slate-800 bg-slate-900/50 p-3' : '']"
		>
			<li v-for="link in links" :key="link.id">
				<a
					:href="`#${link.id}`"
					:class="['block border-l-2 py-1 pl-3 transition-colors', linkClass(link.id)]"
					@click="open = false"
				>
					{{ link.text }}
				</a>
				<ul v-if="link.children?.length" class="space-y-1">
					<li v-for="child in link.children" :key="child.id">
						<a
							:href="`#${child.id}`"
							:class="['block border-l-2 py-1 pl-6 transition-colors', linkClass(child.id)]"
							@click="open = false"
						>
							{{ child.text }}
						</a>
					</li>
				</ul>
			</li>
		</ul>
	</nav>
</template>
