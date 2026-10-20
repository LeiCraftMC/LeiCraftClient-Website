<script setup lang="ts">
/**
 * Discord login (OAuth2). `POST /auth/discord/authorize` returns the Discord URL, a `state` and a
 * `verifier`. The verifier stays in this browser's sessionStorage (never in a URL), so a callback
 * link someone else started can't log you into their account. Discord redirects back to
 * `/auth/discord/callback`, which finishes the login.
 */
definePageMeta({
	layout: "auth",
});

useSeoMeta({
	title: "Login | LeiCraft Client",
	description: "Log in to LeiCraft Client with your Discord account.",
});

const route = useRoute();
const toast = useToast();

// Only follow internal redirects (`/…`, not `//evil.example`); default to the dashboard.
const requestedUrl = route.query.url?.toString() ?? "";
const redirectPath =
	requestedUrl.startsWith("/") && !requestedUrl.startsWith("//") && !requestedUrl.startsWith("/\\")
		? requestedUrl
		: "/dashboard";

const loading = ref(false);

async function login() {
	loading.value = true;

	const result = await useAPI(
		(api) => api.postAuthDiscordAuthorize({ body: { redirect_path: redirectPath } }),
		true,
	);

	if (!result.success) {
		loading.value = false;
		toast.add({
			title: "Login failed",
			description: result.message || "Could not reach the login service. Please try again later.",
			icon: "i-lucide-alert-circle",
			color: "error",
		});
		return;
	}

	try {
		sessionStorage.setItem(`lcc_oauth_${result.data.state}`, result.data.verifier);
	} catch {
		loading.value = false;
		toast.add({
			title: "Login failed",
			description: "Your browser blocks session storage, which the login needs.",
			icon: "i-lucide-alert-circle",
			color: "error",
		});
		return;
	}

	window.location.href = result.data.authorize_url;
}
</script>

<template>
	<div class="space-y-6 py-2 text-center">
		<div class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/15">
			<ImgAppIcon class="size-9" />
		</div>
		<div>
			<h1 class="text-2xl font-semibold text-white">Log in to LeiCraft Client</h1>
			<p class="mt-2 text-sm text-slate-400">
				Your LeiCraft account is your Discord account. When you log in for the first time, you
				also join the LeiCraftMC Discord server.
			</p>
		</div>

		<UButton
			block
			size="xl"
			class="bg-[#5865F2] text-white hover:bg-[#4752c4]"
			:loading="loading"
			@click="login"
		>
			<template #leading>
				<UIcon v-if="loading" name="i-lucide-loader-2" class="size-5 animate-spin" />
				<ImgDiscordIcon v-else class="size-5" />
			</template>
			Continue with Discord
		</UButton>

		<p class="text-xs text-slate-500">
			We only read your Discord username, display name and avatar.
		</p>
	</div>
</template>
