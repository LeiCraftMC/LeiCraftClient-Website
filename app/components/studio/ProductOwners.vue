<script setup lang="ts">
/**
 * Who owns an exclusive product (through a grant or a redeem code), plus granting it directly to
 * a user by LeiCraft id, Discord id or Minecraft account.
 */
import type { PostStudioPagesByPageIdProductsByProductIdOwnersData } from "~/api-client";
import type { ProductOwner } from "~/utils/types";

const props = defineProps<{
	pageId: number;
	productId: number;
}>();

const toast = useToast();

const owners = await useAPILazyAsyncData<ProductOwner[]>(
	`studio-product-${props.productId}-owners`,
	async () => {
		const res = await useAPI((api) =>
			api.getStudioPagesByPageIdProductsByProductIdOwners({
				path: { pageId: props.pageId, productId: props.productId },
			}),
		);
		if (!res.success) {
			toast.add({ title: "Failed to load the owners", description: res.message, color: "error" });
			return [];
		}
		return res.data;
	},
);

type Identifier = "minecraft_name" | "minecraft_uuid" | "discord_id" | "user_id";

const identifierItems: Array<{ label: string; value: Identifier; placeholder: string }> = [
	{ label: "Minecraft name", value: "minecraft_name", placeholder: "Notch" },
	{
		label: "Minecraft UUID",
		value: "minecraft_uuid",
		placeholder: "069a79f4-44e9-4726-a5be-fca90e38aaf5",
	},
	{ label: "Discord user id", value: "discord_id", placeholder: "123456789012345678" },
	{ label: "LeiCraft user id", value: "user_id", placeholder: "42" },
];

const grantForm = reactive({ identifier: "minecraft_name" as Identifier, value: "", note: "" });
const granting = ref(false);

const placeholder = computed(
	() => identifierItems.find((item) => item.value === grantForm.identifier)?.placeholder,
);

async function grant() {
	const value = grantForm.value.trim();
	if (!value) return;

	const body: NonNullable<PostStudioPagesByPageIdProductsByProductIdOwnersData["body"]> = {
		note: grantForm.note.trim() || undefined,
	};
	if (grantForm.identifier === "user_id") {
		body.user_id = Number(value);
		if (!Number.isInteger(body.user_id) || body.user_id <= 0) {
			toast.add({ title: "Enter a numeric user id", color: "warning" });
			return;
		}
	} else {
		body[grantForm.identifier] = value;
	}

	granting.value = true;
	const res = await useAPI((api) =>
		api.postStudioPagesByPageIdProductsByProductIdOwners({
			path: { pageId: props.pageId, productId: props.productId },
			body,
		}),
	);
	granting.value = false;

	if (!res.success) {
		toast.add({ title: "Grant failed", description: res.message, color: "error" });
		return;
	}
	grantForm.value = "";
	grantForm.note = "";
	toast.add({ title: "Item granted", icon: "i-lucide-gift", color: "success" });
	await owners.refresh();
}

// Revoke
const revokeTarget = ref<ProductOwner | null>(null);
const showRevoke = computed({
	get: () => revokeTarget.value !== null,
	set: (value) => {
		if (!value) revokeTarget.value = null;
	},
});
const revoking = ref(false);

async function revoke() {
	const target = revokeTarget.value;
	if (!target) return;
	revoking.value = true;
	const res = await useAPI((api) =>
		api.deleteStudioPagesByPageIdProductsByProductIdOwnersByUserId({
			path: { pageId: props.pageId, productId: props.productId, userId: target.user.id },
		}),
	);
	revoking.value = false;

	if (!res.success) {
		toast.add({ title: "Revoke failed", description: res.message, color: "error" });
		return;
	}
	revokeTarget.value = null;
	await owners.refresh();
}
</script>

<template>
	<div class="space-y-5">
		<form class="grid gap-3 md:grid-cols-[12rem_1fr_1fr_auto] md:items-end" @submit.prevent="grant">
			<UFormField label="Find user by">
				<USelect v-model="grantForm.identifier" :items="identifierItems" class="w-full" />
			</UFormField>
			<UFormField label="User">
				<UInput v-model="grantForm.value" :placeholder="placeholder" class="w-full" autocomplete="off" />
			</UFormField>
			<UFormField label="Note (only visible to your team)">
				<UInput v-model="grantForm.note" :maxlength="200" class="w-full" />
			</UFormField>
			<UButton type="submit" icon="i-lucide-gift" :loading="granting" :disabled="!grantForm.value.trim()">
				Grant
			</UButton>
		</form>
		<p class="text-xs text-slate-500">
			The user needs a LeiCraft Client account. A Minecraft name or UUID only works once that account is linked.
		</p>

		<div v-if="owners.loading.value && !owners.data.value?.length" class="flex justify-center py-6">
			<UIcon name="i-lucide-loader-2" class="animate-spin text-xl text-slate-400" />
		</div>
		<ul v-else-if="owners.data.value?.length" class="divide-y divide-slate-800 rounded-lg border border-slate-800">
			<li v-for="owner in owners.data.value" :key="owner.user.id" class="flex items-center gap-3 px-4 py-3">
				<UAvatar :src="owner.user.avatar_url" :alt="owner.user.display_name" size="sm" />
				<div class="min-w-0 flex-1">
					<p class="truncate text-sm font-medium text-white">
						{{ owner.user.display_name }}
						<span class="font-normal text-slate-500">#{{ owner.user.id }}</span>
					</p>
					<p class="truncate text-xs text-slate-400">
						<template v-if="owner.source === 'code'">Redeemed a code</template>
						<template v-else>Granted{{ owner.granted_by ? ` by ${owner.granted_by.display_name}` : "" }}</template>
						· {{ formatDate(owner.created_at) }}
						<template v-if="owner.note"> · {{ owner.note }}</template>
					</p>
				</div>
				<UBadge :color="owner.source === 'code' ? 'primary' : 'warning'" variant="soft">
					{{ owner.source === "code" ? "Code" : "Grant" }}
				</UBadge>
				<UButton
					size="sm"
					color="error"
					variant="ghost"
					icon="i-lucide-user-minus"
					aria-label="Revoke"
					@click="revokeTarget = owner"
				/>
			</li>
		</ul>
		<p v-else class="text-sm text-slate-400">Nobody owns this item yet.</p>

		<DashboardModal v-model:open="showRevoke" title="Revoke item" icon="i-lucide-user-minus" icon-color="error">
			<p class="text-sm text-slate-300">
				Take this item away from <strong class="text-white">{{ revokeTarget?.user.display_name }}</strong>? It is
				unequipped from all of their Minecraft accounts.
			</p>
			<template #footer>
				<UButton color="neutral" variant="ghost" @click="showRevoke = false">Cancel</UButton>
				<UButton color="error" icon="i-lucide-user-minus" :loading="revoking" @click="revoke">Revoke</UButton>
			</template>
		</DashboardModal>
	</div>
</template>
