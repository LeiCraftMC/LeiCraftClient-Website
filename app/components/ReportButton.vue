<script setup lang="ts">
/**
 * "Report" action for products, pages, collections and users — opens a dialog that files a
 * report for the moderators (`POST /reports`). Needs a login.
 */
import { useUserInfoStore } from "~/composables/stores/useUserStore";

const props = defineProps<{
	targetType: "product" | "page" | "collection" | "user";
	targetId: number;
	label?: string;
}>();

const toast = useToast();
const route = useRoute();
const user = await useUserInfoStore().use();

const open = ref(false);
const loading = ref(false);
const form = reactive({
	reason: "inappropriate" as "inappropriate" | "copyright" | "impersonation" | "spam" | "other",
	details: "",
});

const reasonItems = [
	{ label: "Inappropriate content", value: "inappropriate" },
	{ label: "Copyright / stolen design", value: "copyright" },
	{ label: "Impersonation", value: "impersonation" },
	{ label: "Spam", value: "spam" },
	{ label: "Something else", value: "other" },
];

async function onOpen() {
	if (!user.value) {
		await navigateTo(`/auth/login?url=${encodeURIComponent(route.fullPath)}`);
		return;
	}
	open.value = true;
}

async function submit() {
	loading.value = true;
	const res = await useAPI((api) =>
		api.postReports({
			body: {
				target_type: props.targetType,
				target_id: props.targetId,
				reason: form.reason,
				details: form.details.trim() || undefined,
			},
		}),
	);
	loading.value = false;

	if (!res.success) {
		toast.add({
			title: "Report failed",
			description: res.message,
			icon: "i-lucide-alert-circle",
			color: "error",
		});
		return;
	}

	open.value = false;
	form.details = "";
	toast.add({
		title: "Report sent",
		description: "Thanks — our moderators will take a look.",
		icon: "i-lucide-check",
		color: "success",
	});
}
</script>

<template>
	<UButton
		color="neutral"
		variant="ghost"
		size="sm"
		icon="i-lucide-flag-triangle-right"
		@click="onOpen"
	>
		{{ label ?? "Report" }}
	</UButton>

	<DashboardModal
		v-model:open="open"
		title="Report to the moderators"
		description="Tell us what is wrong. Reports are confidential."
		icon="i-lucide-flag-triangle-right"
		icon-color="amber"
	>
		<div class="space-y-4">
			<UFormField label="Reason">
				<USelect v-model="form.reason" :items="reasonItems" class="w-full" />
			</UFormField>
			<UFormField label="Details" hint="Optional">
				<UTextarea v-model="form.details" :rows="4" :maxlength="2000" class="w-full" />
			</UFormField>
		</div>

		<template #footer>
			<UButton color="neutral" variant="ghost" @click="open = false">Cancel</UButton>
			<UButton color="warning" icon="i-lucide-send" :loading="loading" @click="submit">
				Send report
			</UButton>
		</template>
	</DashboardModal>
</template>
