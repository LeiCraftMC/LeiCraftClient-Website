/**
 * auth.global.ts — session-aware route guard.
 *
 * - `/auth/*` is for signed-out users; a valid session is sent on to `HOME_ROUTE`
 *   (the Discord callback page is the exception: it finishes a login).
 * - `PROTECTED_PREFIXES` need a valid session, otherwise → `/auth/login?url=…`.
 * - `STAFF_PREFIXES` additionally need `moderator` or `admin`, `ADMIN_PREFIXES` need `admin`.
 * - `ONBOARDING_ROUTE` needs a session; with `REQUIRE_ONBOARDING`, signed-in users who haven't
 *   completed it are sent there first — except on `ONBOARDING_EXEMPT_PREFIXES` (the Minecraft
 *   link page must keep its one-time code).
 * - Everything else (landing page, shop, players) is public.
 *
 * The backend enforces every role on its own; this guard is UX only. See docs/10-auth.md.
 */
import { useOnboardingStore } from "~/composables/stores/useOnboardingStore";
import { useUserInfoStore } from "~/composables/stores/useUserStore";

const HOME_ROUTE = "/dashboard";
const PROTECTED_PREFIXES = ["/dashboard", "/link"];
const STAFF_PREFIXES = ["/dashboard/moderation"];
const ADMIN_PREFIXES = ["/dashboard/admin"];
const PUBLIC_ROUTES: string[] = [];
const ONBOARDING_ROUTE = "/welcome";
const ONBOARDING_EXEMPT_PREFIXES = ["/link"];
const REQUIRE_ONBOARDING = true;

// Auth pages a signed-in user may still open.
const AUTH_ROUTES_FOR_EVERYONE = ["/auth/discord/callback"];

function hasPrefix(path: string, prefixes: string[]) {
	return prefixes.some(
		(prefix) => prefix === "/" || path === prefix || path.startsWith(`${prefix}/`),
	);
}

export default defineNuxtRouteMiddleware(async (to) => {
	const sessionToken = useAppCookies().sessionToken;
	const token = sessionToken.get().value;
	const store = useUserInfoStore();

	if (hasPrefix(to.path, ["/auth"])) {
		if (!token || hasPrefix(to.path, AUTH_ROUTES_FOR_EVERYONE)) return;
		if (store.isValid(await store.use())) return navigateTo(HOME_ROUTE);

		// Token exists but is invalid or expired: clear it and stay on the auth page.
		sessionToken.set(null);
		return;
	}

	if (!hasPrefix(to.path, [...PROTECTED_PREFIXES, ONBOARDING_ROUTE])) return;
	if (SimpleRouteMatcher.match(to.path, PUBLIC_ROUTES)) return;

	const loginRoute = `/auth/login?url=${encodeURIComponent(to.fullPath)}`;
	if (!token) return navigateTo(loginRoute);

	const user = await store.use();
	if (!store.isValid(user)) {
		sessionToken.set(null);
		return navigateTo(loginRoute);
	}

	// First-login gate. `/welcome` itself is excluded so it never redirect-loops; the welcome
	// page marks onboarding complete when the user finishes or skips it.
	if (
		REQUIRE_ONBOARDING &&
		to.path !== ONBOARDING_ROUTE &&
		!hasPrefix(to.path, ONBOARDING_EXEMPT_PREFIXES)
	) {
		const onboardingStore = useOnboardingStore();
		await onboardingStore.refreshIfNeeded();
		if (!onboardingStore.completed.value) {
			return navigateTo(ONBOARDING_ROUTE);
		}
	}

	if (hasPrefix(to.path, STAFF_PREFIXES) && !isStaffRole(user.value.role)) {
		return navigateTo(HOME_ROUTE);
	}

	if (hasPrefix(to.path, ADMIN_PREFIXES) && user.value.role !== "admin") {
		return navigateTo(HOME_ROUTE);
	}
});
