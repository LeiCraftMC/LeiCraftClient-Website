<script setup lang="ts">
import { useUserInfoStore } from "~/composables/stores/useUserStore";
import type { AssetRef, StudioPage } from "~/utils/types";

const toast = useToast();
const studioPage = useSubrouterInjectedData<StudioPage>("studio_page").inject();
const page = studioPage.data;
const pageId = page.value.id;
const user = await useUserInfoStore().use();
const { imageAssetURL } = useMinecraftAssets();

const isAdmin = computed(() => user.value?.role === "admin");
const isCommunity = computed(() => page.value.category === "community");
const canDelete = computed(
	() => isAdmin.value || (isCommunity.value && page.value.member_role === "owner"),
);
/** Reviewed community pages keep the approved profile public until a moderator accepts changes. */
const changesNeedReview = computed(() => isCommunity.value && page.value.reviewed_at !== null);

interface SettingsForm {
	name: string;
	slug: string;
	description: string;
	icon: AssetRef | null;
	banner: AssetRef | null;
	sort_order: number;
}

const form = reactive<SettingsForm>({
	name: "",
	slug: "",
	description: "",
	icon: null,
	banner: null,
	sort_order: 0,
});

function asset(pendingID: string | null | undefined, current: AssetRef | null): AssetRef | null {
	if (pendingID === undefined) return current;
	return pendingID ? { id: pendingID, url: imageAssetURL(pendingID) as string } : null;
}

/** The form starts from the values waiting for review, so a second edit doesn't lose the first. */
function effectiveValues(): SettingsForm {
	const current = page.value;
	const pending = current.pending_changes ?? {};
	return {
		name: pending.name ?? current.name,
		slug: pending.slug ?? current.slug,
		description: pending.description ?? current.description,
		icon: asset(pending.icon_asset_id, current.icon),
		banner: asset(pending.banner_asset_id, current.banner),
		sort_order: current.sort_order,
	};
}

function resetForm() {
	Object.assign(form, effectiveValues());
}

watch(page, resetForm, { immediate: true });

const dirty = computed(() => {
	const original = effectiveValues();
	return (
		form.name !== original.name ||
		form.slug !== original.slug ||
		form.description !== original.description ||
		form.icon?.id !== original.icon?.id ||
		form.banner?.id !== original.banner?.id ||
		form.sort_order !== original.sort_order
	);
});

const slugValid = computed(
	() => /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(form.slug) && form.slug.length >= 3,
);
const saving = ref(false);

async function save() {
	if (!form.name.trim() || !slugValid.value) return;
	saving.value = true;
	const res = await useAPI((api) =>
		api.putStudioPagesByPageId({
			path: { pageId },
			body: {
				name: form.name.trim(),
				slug: form.slug,
				description: form.description,
				icon_asset_id: form.icon?.id ?? null,
				banner_asset_id: form.banner?.id ?? null,
				...(isAdmin.value ? { sort_order: form.sort_order } : {}),
			},
		}),
	);
	saving.value = false;

	if (!res.success) {
		toast.add({ title: "Could not save the page", description: res.message, color: "error" });
		return;
	}
	toast.add({
		title: "Saved",
		description: res.data.pending_changes
			? "The changes are public once a moderator approved them."
			: undefined,
		icon: "i-lucide-check",
		color: "success",
	});
	await studioPage.refresh();
}

// Delete
const showDelete = ref(false);

async function deletePage() {
	const res = await useAPI((api) => api.deleteStudioPagesByPageId({ path: { pageId } }));
	if (!res.success) {
		toast.add({ title: "Could not delete the page", description: res.message, color: "error" });
		throw new Error(res.message);
	}
	toast.add({ title: "Page deleted", icon: "i-lucide-trash-2", color: "success" });
	await navigateTo("/dashboard/studio");
}
</script>

<template>
	<DashboardPageBody>
		<UAlert
			v-if="page.pending_changes"
			color="warning"
			variant="soft"
			icon="i-lucide-hourglass"
			title="Changes in review"
			description="The shop shows the approved profile until a moderator accepts your changes. You can keep editing them below."
		/>
		<UAlert
			v-else-if="page.review_note"
			color="error"
			variant="soft"
			icon="i-lucide-circle-x"
			title="Your last changes were rejected"
			:description="page.review_note"
		/>

		<DashboardSectionCard title="Profile" icon="i-lucide-store" description="How the page looks in the shop">
			<template #actions>
				<UButton v-if="dirty" size="sm" color="neutral" variant="ghost" @click="resetForm">Discard</UButton>
				<UButton
					size="sm"
					icon="i-lucide-save"
					:loading="saving"
					:disabled="!dirty || !form.name.trim() || !slugValid"
					@click="save"
				>
					{{ changesNeedReview ? "Submit changes" : "Save" }}
				</UButton>
			</template>

			<div class="space-y-5">
				<div class="grid gap-5 md:grid-cols-2">
					<UFormField label="Name" required>
						<UInput v-model="form.name" class="w-full" :maxlength="64" />
					</UFormField>
					<UFormField
						v-if="!isSinglePageCategory(page.category)"
						label="URL slug"
						required
						:hint="`/shop/${page.category}/${form.slug || '…'}`"
						:error="form.slug && !slugValid ? 'At least 3 lowercase letters, numbers or hyphens' : undefined"
					>
						<UInput v-model="form.slug" class="w-full" :maxlength="32" />
					</UFormField>
				</div>
				<UFormField label="Description">
					<UTextarea v-model="form.description" :rows="4" class="w-full" :maxlength="2000" />
				</UFormField>
				<div class="grid gap-5 md:grid-cols-2">
					<UFormField label="Icon" description="Square image">
						<StudioAssetUpload
							kind="image"
							:url="form.icon?.url"
							clearable
							@uploaded="form.icon = $event"
							@cleared="form.icon = null"
						/>
					</UFormField>
					<UFormField label="Banner" description="Wide image, about 4:1">
						<StudioAssetUpload
							kind="image"
							:url="form.banner?.url"
							clearable
							@uploaded="form.banner = $event"
							@cleared="form.banner = null"
						/>
					</UFormField>
				</div>
				<UFormField v-if="isAdmin" label="Catalog position" description="Admins only — lower numbers come first.">
					<UInputNumber v-model="form.sort_order" class="w-full md:w-48" />
				</UFormField>
			</div>
		</DashboardSectionCard>

		<DashboardSectionCard
			v-if="canDelete"
			title="Danger zone"
			icon="i-lucide-alert-triangle"
			tone="danger"
		>
			<div class="flex flex-wrap items-center justify-between gap-4">
				<p class="text-sm text-slate-400">
					Deleting the page deletes all of its items, collections and redeem codes. Players lose them from their
					wardrobes.
				</p>
				<UButton color="error" variant="soft" icon="i-lucide-trash-2" @click="showDelete = true">Delete page</UButton>
			</div>
		</DashboardSectionCard>
	</DashboardPageBody>

	<DashboardDeleteModal
		v-model:open="showDelete"
		title="Delete page"
		:warning-text="`This deletes ${page.name} with all of its items for everyone.`"
		:on-delete="deletePage"
		prevent-auto-close
	/>
</template>
