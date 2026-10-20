<script setup lang="ts">
/**
 * Asks for the reason of a moderation action (reject, take down, hide, ban). The reason is shown
 * to the affected user. `onConfirm` returns whether the action succeeded; the modal stays open
 * on failure. Extra fields go in the default slot.
 */
const props = withDefaults(
	defineProps<{
		title: string;
		description?: string;
		confirmLabel: string;
		icon?: string;
		placeholder?: string;
		onConfirm: (reason: string) => Promise<boolean>;
	}>(),
	{
		description: undefined,
		icon: "i-lucide-shield-alert",
		placeholder: "Explain what needs to change…",
	},
);

const open = defineModel<boolean>("open", { required: true });

const formID = useId();
const reason = ref("");
const loading = ref(false);

watch(open, (value) => {
	if (value) reason.value = "";
});

async function confirm() {
	if (!reason.value.trim()) return;
	loading.value = true;
	const ok = await props.onConfirm(reason.value.trim());
	loading.value = false;
	if (ok) open.value = false;
}
</script>

<template>
	<DashboardModal v-model:open="open" :title="title" :description="description" :icon="icon" icon-color="error">
		<form :id="formID" class="space-y-4" @submit.prevent="confirm">
			<UFormField label="Reason" required description="The user sees this message.">
				<UTextarea v-model="reason" :rows="3" :maxlength="500" class="w-full" :placeholder="placeholder" autofocus />
			</UFormField>
			<slot />
		</form>

		<template #footer>
			<UButton color="neutral" variant="ghost" @click="open = false">Cancel</UButton>
			<UButton
				type="submit"
				:form="formID"
				color="error"
				:icon="icon"
				:loading="loading"
				:disabled="!reason.trim()"
			>
				{{ confirmLabel }}
			</UButton>
		</template>
	</DashboardModal>
</template>
