<script setup lang="ts">
/**
 * A release changelog: markdown rendered by @nuxtjs/mdc (the renderer behind Nuxt Content) with
 * Nuxt UI's prose components — the same look as the Nuxt UI docs. MDC drops scripts, event
 * handlers and `javascript:` links, so notes imported from GitLab render safely.
 */
const props = defineProps<{
	markdown: string;
}>();

const isEmpty = computed(() => !props.markdown.trim());
</script>

<template>
	<p v-if="isEmpty" class="text-sm text-slate-500">No changelog provided.</p>
	<!-- Prose blocks bring their own vertical rhythm; trim it at the edges of the card. -->
	<MDC v-else :value="markdown" tag="article" class="text-sm *:first:mt-0 *:last:mb-0" />
</template>
