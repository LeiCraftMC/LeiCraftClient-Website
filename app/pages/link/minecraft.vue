<script setup lang="ts">
/**
 * Target of the clickable link the mod shows (`/link/minecraft?code=…`). Shows the Minecraft
 * account behind the one-time code and links it to the signed-in user on confirmation. The guard
 * sends signed-out visitors through the Discord login first (and back here, code intact).
 */
import { useMinecraftAccountsStore } from "~/composables/stores/useMinecraftAccountsStore";
import { useUserInfoStore } from "~/composables/stores/useUserStore";

definePageMeta({
	layout: "auth",
});

useSeoMeta({
	title: "Link Minecraft account | LeiCraft Client",
	robots: "noindex",
});

const route = useRoute();
const toast = useToast();
const code = route.query.code?.toString() ?? "";

const user = await useUserInfoStore().use();
const { skinURL } = useMinecraftAssets();

const { data: preview, loading } = await useAPILazyAsyncData(`link-preview-${code}`, async () => {
	if (!code) return null;
	return await useAPI((api) => api.getAccountMinecraftLinkByCode({ path: { code } }));
});

const linking = ref(false);
const linked = ref(false);

async function confirm() {
	linking.value = true;
	const result = await useAPI((api) => api.postAccountMinecraftLink({ body: { code } }));
	linking.value = false;

	if (!result.success) {
		toast.add({
			title: "Linking failed",
			description: result.message,
			icon: "i-lucide-alert-circle",
			color: "error",
		});
		return;
	}

	linked.value = true;
	await useMinecraftAccountsStore().refresh();
}
</script>

<template>
	<div class="space-y-6 py-2 text-center">
		<div v-if="loading" class="py-8">
			<UIcon name="i-lucide-loader-2" class="mx-auto size-8 animate-spin text-primary-400" />
		</div>

		<template v-else-if="!code || !preview?.success">
			<div class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-500/10">
				<UIcon name="i-lucide-link-2-off" class="size-7 text-red-400" />
			</div>
			<div>
				<h1 class="text-xl font-semibold text-white">This link doesn't work</h1>
				<p class="mt-2 text-sm text-slate-400">
					Link codes are valid for 10 minutes and work once. Create a new link in the game: pause
					menu → LeiCraft Client → Link account.
				</p>
			</div>
			<UButton to="/dashboard/accounts" color="neutral" variant="soft">Back to my accounts</UButton>
		</template>

		<template v-else>
			<div class="flex flex-col items-center gap-3">
				<SkinPlayerHead
					:skin="skinURL(preview.data.account.uuid)"
					:alt="preview.data.account.name"
					class="size-20"
				/>
				<div>
					<h1 class="text-2xl font-semibold text-white">{{ preview.data.account.name }}</h1>
					<p class="font-mono text-xs text-slate-500">{{ preview.data.account.uuid }}</p>
				</div>
			</div>

			<template v-if="linked || preview.data.linked_to_you">
				<UAlert
					color="success"
					variant="soft"
					icon="i-lucide-check"
					title="Linked!"
					:description="`${preview.data.account.name} belongs to your account now. Back in the game, the LeiCraft options show it within a few seconds.`"
				/>
				<div class="flex flex-col gap-2">
					<UButton to="/dashboard/wardrobe" icon="i-lucide-shirt" block>Open wardrobe</UButton>
					<UButton to="/shop" color="neutral" variant="ghost" block>Browse the shop</UButton>
				</div>
			</template>

			<template v-else-if="preview.data.linked_to_other_user">
				<UAlert
					color="error"
					variant="soft"
					icon="i-lucide-alert-triangle"
					title="Already linked"
					description="This Minecraft account belongs to another LeiCraft account. Unlink it there first, or use “Unlink” in the game."
				/>
			</template>

			<template v-else>
				<p class="text-sm text-slate-400">
					Link this Minecraft account to <strong class="text-white">{{ user?.display_name }}</strong>?
					Only do this if you started the link yourself in the game.
				</p>
				<div class="flex flex-col gap-2">
					<UButton block size="lg" icon="i-lucide-link" :loading="linking" @click="confirm">
						Link account
					</UButton>
					<UButton block color="neutral" variant="ghost" to="/dashboard">Cancel</UButton>
				</div>
			</template>
		</template>
	</div>
</template>
