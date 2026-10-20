<script setup lang="ts">
import { useUserInfoStore } from "~/composables/stores/useUserStore";
import type { PageMember, StudioPage } from "~/utils/types";

type MemberRole = PageMember["role"];

const toast = useToast();
const studioPage = useSubrouterInjectedData<StudioPage>("studio_page").inject();
const page = studioPage.data;
const pageId = page.value.id;
const user = await useUserInfoStore().use();

/** Owners and admins manage members; managers only see the list. */
const canManage = computed(
	() => page.value.member_role === "owner" || user.value?.role === "admin",
);

const members = await useAPIAsyncData<PageMember[]>(`studio-page-${pageId}-members`, async () => {
	const res = await useAPI((api) => api.getStudioPagesByPageIdMembers({ path: { pageId } }));
	if (!res.success) {
		toast.add({ title: "Failed to load the members", description: res.message, color: "error" });
		return [];
	}
	return res.data;
});

const roleItems: Array<{ label: string; value: MemberRole; description: string }> = [
	{ label: "Manager", value: "manager", description: "Edits items, collections, codes and grants" },
	{ label: "Owner", value: "owner", description: "Also manages the members" },
];

// Add
const showAdd = ref(false);
const adding = ref(false);
const addForm = reactive({
	by: "discord_id" as "discord_id" | "user_id",
	value: "",
	role: "manager" as MemberRole,
});

async function add() {
	const value = addForm.value.trim();
	if (!value) return;
	if (addForm.by === "user_id" && !/^\d+$/.test(value)) {
		toast.add({ title: "Enter a numeric user id", color: "warning" });
		return;
	}

	adding.value = true;
	const res = await useAPI((api) =>
		api.postStudioPagesByPageIdMembers({
			path: { pageId },
			body:
				addForm.by === "user_id"
					? { user_id: Number(value), role: addForm.role }
					: { discord_id: value, role: addForm.role },
		}),
	);
	adding.value = false;

	if (!res.success) {
		toast.add({ title: "Could not add the member", description: res.message, color: "error" });
		return;
	}
	showAdd.value = false;
	addForm.value = "";
	toast.add({
		title: `${res.data.user.display_name} was added`,
		icon: "i-lucide-user-plus",
		color: "success",
	});
	await members.refresh();
}

async function changeRole(member: PageMember, role: MemberRole) {
	if (role === member.role) return;
	const res = await useAPI((api) =>
		api.putStudioPagesByPageIdMembersByUserId({
			path: { pageId, userId: member.user.id },
			body: { role },
		}),
	);
	if (!res.success) {
		toast.add({ title: "Could not change the role", description: res.message, color: "error" });
	}
	await members.refresh();
	if (member.user.id === user.value?.id) await studioPage.refresh();
}

// Remove
const removeTarget = ref<PageMember | null>(null);
const showRemove = computed({
	get: () => removeTarget.value !== null,
	set: (value) => {
		if (!value) removeTarget.value = null;
	},
});
const removing = ref(false);

async function remove() {
	const target = removeTarget.value;
	if (!target) return;
	removing.value = true;
	const res = await useAPI((api) =>
		api.deleteStudioPagesByPageIdMembersByUserId({ path: { pageId, userId: target.user.id } }),
	);
	removing.value = false;

	if (!res.success) {
		toast.add({ title: "Could not remove the member", description: res.message, color: "error" });
		return;
	}
	removeTarget.value = null;
	if (target.user.id === user.value?.id) {
		await navigateTo("/dashboard/studio");
		return;
	}
	await members.refresh();
}
</script>

<template>
	<DashboardPageBody>
		<DashboardSectionCard
			title="Members"
			description="People who manage this page with you"
			icon="i-lucide-users"
			flush
		>
			<template v-if="canManage" #actions>
				<UButton size="sm" icon="i-lucide-user-plus" @click="showAdd = true">Add member</UButton>
			</template>

			<ul v-if="members.data.value?.length" class="divide-y divide-slate-800">
				<li v-for="member in members.data.value" :key="member.user.id" class="flex items-center gap-3 px-6 py-4">
					<UAvatar :src="member.user.avatar_url" :alt="member.user.display_name" />
					<div class="min-w-0 flex-1">
						<p class="truncate font-medium text-white">
							{{ member.user.display_name }}
							<span v-if="member.user.id === user?.id" class="text-sm font-normal text-slate-500">(you)</span>
						</p>
						<p class="truncate text-sm text-slate-400">
							@{{ member.discord_username }} · #{{ member.user.id }} · since {{ formatDate(member.created_at) }}
						</p>
					</div>
					<USelect
						v-if="canManage"
						:model-value="member.role"
						:items="roleItems"
						class="w-36"
						@update:model-value="changeRole(member, $event as MemberRole)"
					/>
					<UBadge v-else color="neutral" variant="soft" class="capitalize">{{ member.role }}</UBadge>
					<UButton
						v-if="canManage"
						color="error"
						variant="ghost"
						icon="i-lucide-user-minus"
						:aria-label="member.user.id === user?.id ? 'Leave page' : 'Remove member'"
						@click="removeTarget = member"
					/>
				</li>
			</ul>
			<div v-else-if="!members.loading.value" class="p-6 text-sm text-slate-400">
				No members. Only admins can manage this page.
			</div>
		</DashboardSectionCard>
	</DashboardPageBody>

	<DashboardModal
		v-model:open="showAdd"
		title="Add member"
		description="They need to have logged in to the LeiCraft Client website once."
		icon="i-lucide-user-plus"
	>
		<form id="add-member-form" class="space-y-4" @submit.prevent="add">
			<UFormField label="Find user by">
				<URadioGroup
					v-model="addForm.by"
					orientation="horizontal"
					:items="[
						{ label: 'Discord user id', value: 'discord_id' },
						{ label: 'LeiCraft Client user id', value: 'user_id' },
					]"
				/>
			</UFormField>
			<UFormField :label="addForm.by === 'discord_id' ? 'Discord user id' : 'LeiCraft Client user id'" required>
				<UInput
					v-model="addForm.value"
					class="w-full"
					autocomplete="off"
					:placeholder="addForm.by === 'discord_id' ? '123456789012345678' : '42'"
				/>
			</UFormField>
			<UFormField label="Role">
				<URadioGroup v-model="addForm.role" :items="roleItems" />
			</UFormField>
		</form>

		<template #footer>
			<UButton color="neutral" variant="ghost" @click="showAdd = false">Cancel</UButton>
			<UButton
				type="submit"
				form="add-member-form"
				icon="i-lucide-user-plus"
				:loading="adding"
				:disabled="!addForm.value.trim()"
			>
				Add
			</UButton>
		</template>
	</DashboardModal>

	<DashboardModal
		v-model:open="showRemove"
		:title="removeTarget?.user.id === user?.id ? 'Leave page' : 'Remove member'"
		icon="i-lucide-user-minus"
		icon-color="error"
	>
		<p class="text-sm text-slate-300">
			<template v-if="removeTarget?.user.id === user?.id">
				You lose access to <strong class="text-white">{{ page.name }}</strong> in the Creator Studio.
			</template>
			<template v-else>
				Remove <strong class="text-white">{{ removeTarget?.user.display_name }}</strong> from
				<strong class="text-white">{{ page.name }}</strong>?
			</template>
		</p>
		<template #footer>
			<UButton color="neutral" variant="ghost" @click="showRemove = false">Cancel</UButton>
			<UButton color="error" icon="i-lucide-user-minus" :loading="removing" @click="remove">
				{{ removeTarget?.user.id === user?.id ? "Leave" : "Remove" }}
			</UButton>
		</template>
	</DashboardModal>
</template>
