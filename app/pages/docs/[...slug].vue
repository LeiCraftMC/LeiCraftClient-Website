<script setup lang="ts">
// Imported (not auto-resolved): MDC looks custom components up by tag, see `components` below.
import { ContentIconCardGrid } from "#components";
import { docsSourcePath } from "~/data/docs";

const route = useRoute();

// `/docs/install/fabric/` and `/docs/install/fabric` are the same page.
const path = route.path.replace(/\/$/, "") || "/docs";

const { data: page } = await useDocsPage(path);

if (!page.value) {
	throw createError({
		statusCode: 404,
		statusMessage: "Page not found",
		fatal: true,
	});
}

usePageSeo({
	title: path === "/docs" ? "Docs — LeiCraft Client" : `${page.value.title} — LeiCraft Client Docs`,
	description: page.value.description,
	canonical: path,
});

/** Docs-only MDC components (Nuxt UI's prose components — `::note`, `::steps`, … — are global). */
const components = { "icon-card-grid": ContentIconCardGrid };
</script>

<template>
	<DocsPage
		v-if="page"
		:title="page.title"
		:description="page.description"
		:toc="page.toc"
		:source-path="docsSourcePath(path)"
	>
		<MDCRenderer :body="page.body" :data="page.data" :components="components" />
	</DocsPage>
</template>
