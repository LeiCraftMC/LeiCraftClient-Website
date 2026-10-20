<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { z } from "zod";
import { useUserInfoStore } from "~/composables/stores/useUserStore";
import type { CategoryID, StudioPage } from "~/utils/types";

definePageMeta({
	layout: "dashboard",
});

useSeoMeta({
	title: "Creator Studio | LeiCraft Client",
	description: "Your shop pages",
});

const toast = useToast();
const user = await useUserInfoStore().use();
const isAdmin = computed(() => user.value?.role === "admin");

const pages = await useAPIAsyncData<StudioPage[]>("studio-pages", async () => {
	const res = await useAPI((api) => api.getStudioPages({ query: {} }));
	if (!res.success) {
		toast.add({ title: "Failed to load your pages", description: res.message, color: "error" });
		return [];
	}
	return res.data;
});

const ownCommunityPage = computed(() =>
	pages.data.value?.find((page) => page.category === "community" && page.member_role === "owner"),
);

// Create
const showCreate = ref(false);
const creating = ref(false);

const createSchema = z.object({
	category: z.enum(["official", "partner", "community"]),
	name: z.string().trim().min(1, "Required").max(64),
	slug: z
		.string()
		.min(3, "At least 3 characters")
		.max(32)
		.regex(/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/, "Lowercase letters, numbers and hyphens"),
	description: z.string().max(2000).optional(),
	owner_user_id: z.number().int().positive().optional(),
});
type CreateSchema = z.output<typeof createSchema>;

const createForm = reactive<{
	category: CategoryID;
	name: string;
	slug: string;
	description: string;
	owner_user_id?: number;
}>({ category: "community", name: "", slug: "", description: "" });

const categoryItems = computed(() =>
	(isAdmin.value ? CATEGORY_IDS : (["community"] as const)).map((id) => ({
		label: CATEGORY_INFO[id].label,
		value: id,
	})),
);

// Suggest a slug from the name until the user edits it.
let slugTouched = false;
watch(
	() => createForm.name,
	(name) => {
		if (slugTouched) return;
		createForm.slug = name
			.toLowerCase()
			.normalize("NFKD")
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "")
			.slice(0, 32);
	},
);

function openCreate() {
	Object.assign(createForm, {
		category: "community",
		name: user.value?.display_name ?? "",
		slug: "",
		description: "",
		owner_user_id: undefined,
	});
	slugTouched = false;
	createForm.slug = (user.value?.discord_username ?? "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 32);
	showCreate.value = true;
}

async function create(event: FormSubmitEvent<CreateSchema>) {
	creating.value = true;
	const res = await useAPI((api) =>
		api.postStudioPages({
			body: {
				category: event.data.category,
				name: event.data.name,
				slug: event.data.slug,
				description: event.data.description || undefined,
				owner_user_id: event.data.owner_user_id,
			},
		}),
	);
	creating.value = false;

	if (!res.success) {
		toast.add({ title: "Could not create the page", description: res.message, color: "error" });
		return;
	}
	showCreate.value = false;
	toast.add({ title: "Page created", icon: "i-lucide-check", color: "success" });
	await navigateTo(`/dashboard/studio/${res.data.id}`);
}
</script>

<template>
	<UDashboardPanel>
		<template #header>
			<DashboardPageHeader
				title="Creator Studio"
				icon="i-lucide-palette"
				description="Pages you manage in the shop"
			>
				<template #right>
					<UButton v-if="isAdmin || !ownCommunityPage" icon="i-lucide-plus" @click="openCreate">
						{{ isAdmin ? "New page" : "Create my page" }}
					</UButton>
				</template>
			</DashboardPageHeader>
		</template>

		<template #body>
			<DashboardPageBody>
				<UAlert
					v-if="!ownCommunityPage && !pages.loading.value"
					color="primary"
					variant="soft"
					icon="i-lucide-sparkles"
					title="Share your own capes and cosmetics"
					description="Create your community page, upload capes (PNG) or Blockbench cosmetics and submit them. A moderator reviews every item before it goes live — then anyone can wear it for free."
				/>

				<div v-if="pages.data.value?.length" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					<NuxtLink
						v-for="page in pages.data.value"
						:key="page.id"
						:to="`/dashboard/studio/${page.id}`"
						class="group space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-primary-400/50"
					>
						<div class="flex items-center gap-3">
							<div
								class="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-800"
							>
								<img v-if="page.icon" :src="page.icon.url" :alt="page.name" class="h-full w-full object-cover" />
								<UIcon v-else :name="CATEGORY_INFO[page.category].icon" class="text-2xl text-slate-500" />
							</div>
							<div class="min-w-0">
								<h3 class="truncate font-medium text-white group-hover:text-primary-300">
									{{ page.name }}
								</h3>
								<p class="text-sm text-slate-400">
									{{ CATEGORY_INFO[page.category].label }} · /{{ page.slug }}
								</p>
							</div>
						</div>
						<div class="flex flex-wrap gap-2">
							<UBadge v-if="page.member_role" color="neutral" variant="soft" class="capitalize">
								{{ page.member_role }}
							</UBadge>
							<UBadge v-if="page.status === 'hidden'" color="error" variant="soft" icon="i-lucide-eye-off">
								Hidden by moderators
							</UBadge>
							<UBadge
								v-if="page.category === 'community' && page.review_requested_at"
								color="warning"
								variant="soft"
								icon="i-lucide-hourglass"
							>
								Profile in review
							</UBadge>
							<UBadge
								v-else-if="page.category === 'community' && !page.reviewed_at"
								color="neutral"
								variant="soft"
							>
								Not public yet
							</UBadge>
						</div>
					</NuxtLink>
				</div>

				<UEmpty
					v-else-if="!pages.loading.value"
					icon="i-lucide-store"
					title="No pages yet"
					description="Create your community page to start uploading."
				>
					<template #actions>
						<UButton icon="i-lucide-plus" @click="openCreate">Create my page</UButton>
					</template>
				</UEmpty>
			</DashboardPageBody>
		</template>
	</UDashboardPanel>

	<DashboardModal
		v-model:open="showCreate"
		:title="isAdmin ? 'New page' : 'Create your community page'"
		description="You can change all of this later."
		icon="i-lucide-store"
	>
		<UForm id="create-page-form" :schema="createSchema" :state="createForm" class="space-y-4" @submit="create">
			<UFormField v-if="isAdmin" label="Category" name="category">
				<USelect v-model="createForm.category" :items="categoryItems" class="w-full" />
			</UFormField>
			<UFormField label="Name" name="name" required>
				<UInput v-model="createForm.name" class="w-full" :maxlength="64" />
			</UFormField>
			<UFormField label="URL slug" name="slug" required :hint="`/shop/${createForm.category}/${createForm.slug || '…'}`">
				<UInput v-model="createForm.slug" class="w-full" :maxlength="32" @input="slugTouched = true" />
			</UFormField>
			<UFormField label="Description" name="description">
				<UTextarea v-model="createForm.description" :rows="3" class="w-full" :maxlength="2000" />
			</UFormField>
			<UFormField
				v-if="isAdmin && createForm.category !== 'community'"
				label="Owner (LeiCraft user id)"
				name="owner_user_id"
				description="Optional — the partner who manages this page. Find ids under Users & roles."
			>
				<UInputNumber v-model="createForm.owner_user_id" :min="1" class="w-full" />
			</UFormField>
		</UForm>

		<template #footer>
			<UButton color="neutral" variant="ghost" @click="showCreate = false">Cancel</UButton>
			<UButton type="submit" form="create-page-form" icon="i-lucide-plus" :loading="creating">
				Create page
			</UButton>
		</template>
	</DashboardModal>
</template>
