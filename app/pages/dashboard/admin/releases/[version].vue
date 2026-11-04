<script setup lang="ts">
import { useIntervalFn } from "@vueuse/core";
import type { ManagedRelease } from "~/utils/types";

// Admin-only: `auth.global.ts` redirects non-admins away from /dashboard/admin/*.
definePageMeta({
	layout: "dashboard",
});

const route = useRoute();
const toast = useToast();

const version = computed(() => String(route.params.version));

useSeoMeta({
	title: () => `v${version.value} — Releases | LeiCraft Client`,
	description: "Status, changelog and publishing of a LeiCraft Client release",
});

const release = await useAPIAsyncData<ManagedRelease | null>(
	`admin-release-${version.value}`,
	async () => {
		const res = await useAPI((api) =>
			api.getAdminReleasesByVersion({ path: { version: version.value } }),
		);
		if (!res.success) {
			if ((res.code as number) !== 404) {
				toast.add({ title: "Failed to load the release", description: res.message, color: "error" });
			}
			return null;
		}
		return res.data;
	},
);

// While GitLab builds (or Modrinth uploads), check back every few seconds; the API syncs on
// its own every minute and right after publish/retry.
const unfinished = computed(
	() => release.data.value?.status === "pending" || release.data.value?.modrinth_state === "pending",
);
const poll = useIntervalFn(() => release.refresh(), 5_000, { immediate: false });
watch(unfinished, (value) => (value ? poll.resume() : poll.pause()), { immediate: true });

// ── Edit ──────────────────────────────────────────────────────────────────────────────────────

const form = reactive({ title: "", changelog: "" });

function resetForm() {
	form.title = release.data.value?.title ?? "";
	form.changelog = release.data.value?.changelog ?? "";
}
resetForm();

// Polling refreshes the row; keep the admin's unsaved edits.
const dirty = computed(
	() =>
		!!release.data.value &&
		(form.title !== release.data.value.title || form.changelog !== release.data.value.changelog),
);
watch(
	() => release.data.value?.version,
	() => resetForm(),
);

const saving = ref(false);

async function save() {
	if (!release.data.value) return;
	saving.value = true;
	const res = await useAPI((api) =>
		api.putAdminReleasesByVersion({
			path: { version: version.value },
			body: { title: form.title, changelog: form.changelog },
		}),
	);
	saving.value = false;

	if (!res.success) {
		toast.add({ title: "Could not save the release", description: res.message, color: "error" });
		return;
	}
	release.data.value = res.data;
	resetForm();
	toast.add({
		title: "Release saved",
		description: "The GitLab release notes were updated too.",
		icon: "i-lucide-check",
		color: "success",
	});
}

// ── Retry & delete ────────────────────────────────────────────────────────────────────────────

const canRetry = computed(
	() =>
		release.data.value?.status === "failed" ||
		(release.data.value?.status === "published" && release.data.value.modrinth_state === "failed"),
);
const retrying = ref(false);

async function retry() {
	retrying.value = true;
	const res = await useAPI((api) =>
		api.postAdminReleasesByVersionRetry({ path: { version: version.value } }),
	);
	retrying.value = false;

	if (!res.success) {
		toast.add({ title: "Could not retry", description: res.message, color: "error" });
		return;
	}
	release.data.value = res.data;
	toast.add({ title: "Retry started", icon: "i-lucide-rotate-cw", color: "success" });
}

const deleteOpen = ref(false);

async function deleteRelease() {
	const res = await useAPI((api) =>
		api.deleteAdminReleasesByVersion({ path: { version: version.value } }),
	);
	if (!res.success) {
		toast.add({ title: "Could not delete the release", description: res.message, color: "error" });
		throw new Error(res.message);
	}
	toast.add({ title: `v${version.value} removed from the website`, color: "success" });
	await navigateTo("/dashboard/admin/releases");
}

const breadcrumbItems = computed(() => [
	{ label: "Releases", to: "/dashboard/admin/releases" },
	{ label: `v${version.value}` },
]);
</script>

<template>
	<UDashboardPanel>
		<template #header>
			<DashboardPageHeader icon="i-lucide-package" :breadcrumb-items="breadcrumbItems">
				<template #right>
					<UButton
						v-if="release.data.value?.status === 'published'"
						:to="`/download#${releaseAnchor(version)}`"
						target="_blank"
						icon="i-lucide-external-link"
						color="neutral"
						variant="outline"
					>
						Download page
					</UButton>
				</template>
			</DashboardPageHeader>
		</template>

		<template #body>
			<UEmpty
				v-if="!release.data.value"
				icon="i-lucide-package-x"
				title="Release not found"
				description="It may have been deleted."
				:actions="[{ label: 'Back to releases', to: '/dashboard/admin/releases', icon: 'i-lucide-arrow-left' }]"
			/>

			<div v-else class="mx-auto grid w-full max-w-6xl gap-6 xl:grid-cols-[1fr_22rem]">
				<DashboardPageBody>
					<DashboardSectionCard
						title="Release notes"
						description="Shown on the download page, in the GitLab release and on Modrinth (new uploads)."
						icon="i-lucide-scroll-text"
					>
						<div class="space-y-4">
							<UFormField label="Title" name="title">
								<UInput v-model="form.title" class="w-full" />
							</UFormField>

							<UFormField label="Changelog" name="changelog">
								<ReleaseChangelogEditor v-model="form.changelog" />
							</UFormField>

							<div class="flex justify-end gap-2">
								<UButton v-if="dirty" color="neutral" variant="ghost" @click="resetForm">Discard</UButton>
								<UButton icon="i-lucide-save" :loading="saving" :disabled="!dirty" @click="save">
									Save
								</UButton>
							</div>
						</div>
					</DashboardSectionCard>
				</DashboardPageBody>

				<DashboardPageBody>
					<DashboardSectionCard title="Status" icon="i-lucide-activity" flush>
						<dl class="divide-y divide-slate-800 text-sm">
							<div class="flex items-center justify-between gap-3 px-6 py-3">
								<dt class="text-slate-400">Build</dt>
								<dd><ReleaseStatusBadge :status="release.data.value.status" /></dd>
							</div>

							<div
								v-if="release.data.value.status === 'pending'"
								class="px-6 py-3 text-slate-400"
							>
								Waiting for the GitLab pipeline to attach the jar. This page updates on its own.
							</div>

							<div v-if="release.data.value.error_message" class="px-6 py-3">
								<UAlert
									color="error"
									variant="subtle"
									icon="i-lucide-circle-alert"
									:description="release.data.value.error_message"
								/>
							</div>

							<div class="flex items-center justify-between gap-3 px-6 py-3">
								<dt class="text-slate-400">Modrinth</dt>
								<dd><ReleaseStatusBadge :modrinth="release.data.value.modrinth_state" /></dd>
							</div>

							<div v-if="release.data.value.modrinth_error" class="px-6 py-3">
								<UAlert
									color="error"
									variant="subtle"
									icon="i-lucide-circle-alert"
									:description="release.data.value.modrinth_error"
								/>
							</div>

							<div class="flex items-center justify-between gap-3 px-6 py-3">
								<dt class="text-slate-400">Channel</dt>
								<dd class="text-white">
									{{ release.data.value.channel === "stable" ? "Stable" : "Pre-release" }}
								</dd>
							</div>

							<div class="flex items-center justify-between gap-3 px-6 py-3">
								<dt class="text-slate-400">Published</dt>
								<dd class="text-white">{{ formatDate(release.data.value.published_at) }}</dd>
							</div>

							<div class="flex items-center justify-between gap-3 px-6 py-3">
								<dt class="text-slate-400">Created</dt>
								<dd class="text-right text-white">
									{{ formatDate(release.data.value.created_at) }}
									<span v-if="release.data.value.created_by" class="block text-xs text-slate-500">
										by {{ release.data.value.created_by.display_name }}
									</span>
								</dd>
							</div>
						</dl>

						<div class="flex flex-col gap-2 border-t border-slate-800 px-6 py-4">
							<UButton
								v-if="release.data.value.download_url"
								:to="release.data.value.download_url"
								icon="i-lucide-download"
								color="neutral"
								variant="outline"
								block
							>
								Download jar
							</UButton>
							<UButton
								v-if="release.data.value.pipeline_url"
								:to="release.data.value.pipeline_url"
								target="_blank"
								icon="i-lucide-git-branch"
								color="neutral"
								variant="outline"
								block
							>
								GitLab pipeline
							</UButton>
							<UButton
								v-if="release.data.value.modrinth_url"
								:to="release.data.value.modrinth_url"
								target="_blank"
								icon="i-lucide-external-link"
								color="neutral"
								variant="outline"
								block
							>
								Modrinth version
							</UButton>
							<UButton
								v-if="canRetry"
								icon="i-lucide-rotate-cw"
								:loading="retrying"
								block
								@click="retry"
							>
								{{ release.data.value.status === "failed" ? "Check the build again" : "Retry Modrinth" }}
							</UButton>
						</div>
					</DashboardSectionCard>

					<DashboardSectionCard
						title="Danger zone"
						description="Removes the release from the website. The GitLab release, its tag and the jar stay."
						icon="i-lucide-triangle-alert"
						tone="danger"
					>
						<UButton color="error" variant="soft" icon="i-lucide-trash-2" @click="deleteOpen = true">
							Delete release
						</UButton>
					</DashboardSectionCard>
				</DashboardPageBody>
			</div>
		</template>
	</UDashboardPanel>

	<DashboardDeleteModal
		v-model:open="deleteOpen"
		:title="`Delete v${version}`"
		warning-text="The release disappears from the download page and the mod's update check. GitLab and Modrinth keep it."
		:on-delete="deleteRelease"
	/>
</template>
