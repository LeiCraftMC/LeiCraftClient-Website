<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { zPostAdminReleasesBody } from "~/api-client/zod.gen";
import type { NewRelease, ReleaseImportCandidate } from "~/utils/types";

// Admin-only: `auth.global.ts` redirects non-admins away from /dashboard/admin/*.
definePageMeta({
	layout: "dashboard",
});

useSeoMeta({
	title: "New release | LeiCraft Client",
	description: "Publish a release of the LeiCraft Client mod",
});

const toast = useToast();
const onFormError = await useDefaultOnFormError();

type Mode = NewRelease["mode"];

const modeItems: Array<{ label: string; description: string; value: Mode }> = [
	{
		label: "Trigger a new GitLab release",
		description:
			"Creates the release and its tag on GitLab. The tag pipeline builds the jar; the release goes live once the jar is attached.",
		value: "gitlab_new",
	},
	{
		label: "Use an existing GitLab release",
		description:
			"Imports a release that already exists on GitLab, e.g. one made by hand — its notes become the changelog.",
		value: "gitlab_existing",
	},
];

const form = reactive({
	mode: "gitlab_new" as Mode,
	version: "",
	tag: undefined as string | undefined,
	title: "",
	changelog: "",
	auto_modrinth: true,
});

// The generated body is a union of both modes; validate against the selected one so errors land
// on the right fields. Referenced here (not only in the template) so Biome keeps a value import.
const [newReleaseSchema, existingReleaseSchema] = zPostAdminReleasesBody.options;
const schema = computed(() =>
	form.mode === "gitlab_new" ? newReleaseSchema : existingReleaseSchema,
);

/** What is sent: only the fields of the selected mode, without empty optional ones. */
const body = computed<NewRelease>(() => {
	const title = form.title.trim() || undefined;
	if (form.mode === "gitlab_new") {
		return {
			mode: "gitlab_new",
			version: form.version.trim().replace(/^v/, ""),
			title,
			changelog: form.changelog,
			auto_modrinth: form.auto_modrinth,
		};
	}
	return {
		mode: "gitlab_existing",
		tag: form.tag ?? "",
		title,
		changelog: form.changelog.trim() || undefined,
		auto_modrinth: form.auto_modrinth,
	};
});

// ── Existing GitLab releases (import mode) ────────────────────────────────────────────────────

// Loaded on first switch to the import mode — it asks GitLab, so not on every page view.
const candidates = ref<ReleaseImportCandidate[] | null>(null);
const loadingCandidates = ref(false);

async function loadCandidates() {
	loadingCandidates.value = true;
	const res = await useAPI((api) => api.getAdminReleasesImportCandidates({}));
	loadingCandidates.value = false;
	if (!res.success) {
		toast.add({
			title: "Could not load the GitLab releases",
			description: res.message,
			color: "error",
		});
		return;
	}
	candidates.value = res.data;
}

watch(
	() => form.mode,
	(mode) => {
		if (mode === "gitlab_existing" && !candidates.value && !loadingCandidates.value) {
			loadCandidates();
		}
	},
);

const candidateItems = computed(() =>
	(candidates.value ?? []).map((candidate) => ({
		label: candidate.name || candidate.tag,
		value: candidate.tag,
		description: candidate.imported
			? `${candidate.tag} · already on the website`
			: `${candidate.tag} · ${candidate.has_jar ? "jar attached" : "build still running"}`,
		disabled: candidate.imported,
	})),
);

const selectedCandidate = computed(
	() => candidates.value?.find((candidate) => candidate.tag === form.tag) ?? null,
);

// Picking a release fills in its notes as the changelog (still editable) unless one was written.
const changelogFromCandidate = ref<string | null>(null);
watch(selectedCandidate, (candidate) => {
	if (!candidate) return;
	if (!form.changelog.trim() || form.changelog === changelogFromCandidate.value) {
		form.changelog = candidate.description;
		changelogFromCandidate.value = candidate.description;
	}
});

const titlePlaceholder = computed(() => {
	if (form.mode === "gitlab_existing") {
		return selectedCandidate.value?.name || "Name of the GitLab release";
	}
	const version = form.version.trim().replace(/^v/, "");
	return `LeiCraftClient v${version || "<version>"}`;
});

const versionTag = computed(() => `v${form.version.trim().replace(/^v/, "") || "<version>"}`);

// ── Submit ────────────────────────────────────────────────────────────────────────────────────

const submitting = ref(false);

async function onSubmit(_event: FormSubmitEvent<unknown>) {
	submitting.value = true;
	const payload = body.value;
	const res = await useAPI((api) => api.postAdminReleases({ body: payload }));
	submitting.value = false;

	if (!res.success) {
		toast.add({ title: "Could not publish the release", description: res.message, color: "error" });
		return;
	}

	toast.add({
		title: res.data.status === "published" ? "Release published" : "Release created",
		description:
			res.data.status === "published"
				? `v${res.data.version} is on the download page.`
				: `v${res.data.version} goes live once its GitLab pipeline attached the jar.`,
		icon: "i-lucide-package-check",
		color: "success",
	});
	await navigateTo(`/dashboard/admin/releases/${res.data.version}`);
}

const breadcrumbItems = [
	{ label: "Releases", to: "/dashboard/admin/releases" },
	{ label: "New release" },
];
</script>

<template>
	<UDashboardPanel>
		<template #header>
			<DashboardPageHeader icon="i-lucide-package-plus" :breadcrumb-items="breadcrumbItems" />
		</template>

		<template #body>
			<UForm
				:schema="schema"
				:state="body"
				class="mx-auto w-full max-w-5xl"
				@submit="onSubmit"
				@error="onFormError"
			>
				<DashboardPageBody>
					<DashboardSectionCard
						title="How to publish"
						description="Both ways end with the jar on the download page."
						icon="i-lucide-git-branch"
					>
						<URadioGroup v-model="form.mode" :items="modeItems" variant="card" />
					</DashboardSectionCard>

					<DashboardSectionCard
						title="Release"
						:description="
							form.mode === 'gitlab_new'
								? 'Version and display name of the new release.'
								: 'The GitLab release to publish on the website.'
						"
						icon="i-lucide-tag"
					>
						<div class="grid gap-4 md:grid-cols-2">
							<UFormField
								v-if="form.mode === 'gitlab_new'"
								label="Version"
								name="version"
								required
								help="Like 2.0.0 or 2.0.0-pre.5 — pre-release suffixes are only offered to pre-release users."
							>
								<UInput v-model="form.version" placeholder="2.1.0" class="w-full font-mono">
									<template #leading>
										<span class="text-sm text-slate-500">v</span>
									</template>
								</UInput>
							</UFormField>

							<UFormField
								v-else
								label="GitLab release"
								name="tag"
								required
								help="The newest 20 releases of the Fabric project."
							>
								<USelectMenu
									v-model="form.tag"
									:items="candidateItems"
									value-key="value"
									:loading="loadingCandidates"
									placeholder="Pick a release…"
									class="w-full"
								/>
							</UFormField>

							<UFormField label="Title" name="title" help="Shown on the download page and on Modrinth.">
								<UInput v-model="form.title" :placeholder="titlePlaceholder" class="w-full" />
							</UFormField>
						</div>

						<UAlert
							v-if="form.mode === 'gitlab_new'"
							class="mt-4"
							color="info"
							variant="subtle"
							icon="i-lucide-info"
							title="What happens on publish"
							:description="`GitLab creates the tag ${versionTag} on the default branch, which starts the release pipeline: it builds the jar and attaches it to the release. The release appears on the download page once the jar is there — usually a few minutes.`"
						/>
						<UAlert
							v-else-if="selectedCandidate && !selectedCandidate.has_jar"
							class="mt-4"
							color="warning"
							variant="subtle"
							icon="i-lucide-hourglass"
							title="No jar yet"
							description="This release has no jar attached — its pipeline is still running or failed. It goes live once the jar appears."
						/>
					</DashboardSectionCard>

					<DashboardSectionCard
						title="Changelog"
						:description="
							form.mode === 'gitlab_new'
								? 'Markdown. Also written to the GitLab release notes.'
								: 'Markdown. Defaults to the GitLab release notes; edits are written back to GitLab.'
						"
						icon="i-lucide-scroll-text"
					>
						<UFormField name="changelog" :required="form.mode === 'gitlab_new'">
							<ReleaseChangelogEditor v-model="form.changelog" />
						</UFormField>
					</DashboardSectionCard>

					<DashboardSectionCard title="Publishing" icon="i-lucide-send">
						<UCheckbox
							v-model="form.auto_modrinth"
							label="Auto-publish to Modrinth"
							description="Uploads the jar as a new Modrinth version (pre-releases as beta) once it is built, with this changelog."
						/>
					</DashboardSectionCard>

					<div class="flex justify-end gap-3">
						<UButton to="/dashboard/admin/releases" color="neutral" variant="ghost">Cancel</UButton>
						<UButton type="submit" icon="i-lucide-rocket" :loading="submitting">Publish release</UButton>
					</div>
				</DashboardPageBody>
			</UForm>
		</template>
	</UDashboardPanel>
</template>
