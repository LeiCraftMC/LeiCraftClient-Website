<script setup lang="ts">
/**
 * Discord redirects here with `?code&state` (or `?error` when the user cancelled). The page
 * sends code, state and this browser's verifier to `POST /auth/discord/callback`, stores the
 * session token and continues to the page the login started from. Client-side only: the
 * verifier lives in sessionStorage.
 */

import { useMinecraftAccountsStore } from "~/composables/stores/useMinecraftAccountsStore";
import { useOnboardingStore } from "~/composables/stores/useOnboardingStore";
import { useUserInfoStore } from "~/composables/stores/useUserStore";

definePageMeta({
	layout: "auth",
});

useSeoMeta({
	title: "Logging in | LeiCraft Client",
	robots: "noindex",
});

const route = useRoute();
const error = ref<string | null>(null);

// The server session lasts 7 days; keep the cookie as long.
const SESSION_COOKIE_MAX_AGE = 7 * 24 * 60 * 60;

onMounted(async () => {
	const code = route.query.code?.toString();
	const state = route.query.state?.toString();

	if (route.query.error) {
		error.value =
			route.query.error === "access_denied"
				? "You cancelled the Discord login."
				: `Discord reported an error: ${route.query.error_description ?? route.query.error}`;
		return;
	}

	if (!code || !state) {
		error.value = "The login link is incomplete.";
		return;
	}

	let verifier: string | null = null;
	try {
		verifier = sessionStorage.getItem(`lcc_oauth_${state}`);
		sessionStorage.removeItem(`lcc_oauth_${state}`);
	} catch {
		verifier = null;
	}

	if (!verifier) {
		error.value =
			"This login was not started in this browser (or it expired). Please start the login again.";
		return;
	}

	const result = await useAPI(
		(api) => api.postAuthDiscordCallback({ body: { code, state, verifier } }),
		true,
	);

	if (!result.success) {
		error.value = result.message || "The login failed. Please try again.";
		return;
	}

	updateAPIClient(result.data.token);
	useAppCookies().sessionToken.set(result.data.token, { maxAge: SESSION_COOKIE_MAX_AGE });

	// Fresh per-user state for the new session.
	await useUserInfoStore().refresh();
	await useMinecraftAccountsStore().clear();
	await useOnboardingStore().clear();

	const target = result.data.redirect_path ?? "/dashboard";
	await navigateTo(target, { replace: true });
});
</script>

<template>
	<div class="space-y-6 py-4 text-center">
		<template v-if="error">
			<div class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-500/10">
				<UIcon name="i-lucide-alert-triangle" class="size-7 text-red-400" />
			</div>
			<div>
				<h1 class="text-xl font-semibold text-white">Login failed</h1>
				<p class="mt-2 text-sm text-slate-400">{{ error }}</p>
			</div>
			<UButton to="/auth/login" icon="i-lucide-rotate-ccw">Try again</UButton>
		</template>

		<template v-else>
			<UIcon name="i-lucide-loader-2" class="mx-auto size-8 animate-spin text-primary-400" />
			<p class="text-sm text-slate-400">Logging you in…</p>
		</template>
	</div>
</template>
