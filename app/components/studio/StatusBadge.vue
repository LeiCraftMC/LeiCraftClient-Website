<script setup lang="ts">
import type { ProductStatus } from "~/utils/types";

defineProps<{
	status: ProductStatus;
}>();

const icons: Record<ProductStatus, string> = {
	draft: "i-lucide-pencil",
	pending_review: "i-lucide-hourglass",
	published: "i-lucide-circle-check",
	rejected: "i-lucide-circle-x",
	disabled: "i-lucide-ban",
};
</script>

<template>
	<UBadge :color="productStatusColor(status)" variant="soft" :icon="icons[status]">
		{{ productStatusLabel(status) }}
	</UBadge>
</template>
