<script setup lang="ts">
import type { ModrinthState, ReleaseStatus } from "~/utils/types";

/** The build status of a release, or — with `modrinth` — its Modrinth auto-publish state. */
const props = defineProps<
	{ status: ReleaseStatus; modrinth?: never } | { modrinth: ModrinthState; status?: never }
>();

const display = computed(() =>
	props.modrinth ? MODRINTH_STATE[props.modrinth] : RELEASE_STATUS[props.status as ReleaseStatus],
);
const spinning = computed(() => props.status === "pending");
</script>

<template>
	<UBadge
		:color="display.color"
		variant="soft"
		:icon="display.icon"
		:ui="{ leadingIcon: spinning ? 'animate-spin' : undefined }"
	>
		{{ display.label }}
	</UBadge>
</template>
