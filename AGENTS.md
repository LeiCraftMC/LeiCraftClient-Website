# AGENTS.md — operating manual for AI coding agents

You are working on the LeiCraft Client website, a LeiCraftMC Nuxt app (frontend only — the
LeiCraft Client API is a separate service, the "split-repo" shape; see
docs/01-project-structure.md). Follow the LeiCraftMC Style Guides:
https://github.com/LeiCraftMC/Style-Guides.

## Must read

- [docs/00-overview.md](https://github.com/LeiCraftMC/Style-Guides/blob/main/docs/00-overview.md)
- [docs/01-project-structure.md](https://github.com/LeiCraftMC/Style-Guides/blob/main/docs/01-project-structure.md) — split-repo shape
- [docs/06-frontend-nuxt.md](https://github.com/LeiCraftMC/Style-Guides/blob/main/docs/06-frontend-nuxt.md)
- [docs/07-state-and-data.md](https://github.com/LeiCraftMC/Style-Guides/blob/main/docs/07-state-and-data.md)
- [docs/10-auth.md](https://github.com/LeiCraftMC/Style-Guides/blob/main/docs/10-auth.md) — frontend session handling
- The API's `docs/client-integration.md` and its OpenAPI spec (`/docs/v1/openapi`) for what each
  route does.

## Non-negotiable

- Nuxt 4 `app/` srcDir. Tailwind v4 CSS-first; no `tailwind.config.js`. Dark-only (no toggle).
  All texts in English.
- All API access through `useAPI` (wraps the generated SDK); no raw `$fetch`/`useFetch` in the
  app. The only exception is the Nitro route `server/routes/sitemap.xml.ts`.
- Global state via `AbstractStore` over `useState`; component-local form/UI state with
  `reactive()`/`ref()` is fine.
- Session cookie `lcc_session_token` via `useAppCookies()`; `useAPI` redirects on any
  `code === 401`. Login is Discord only (`/auth/login` → API → `/auth/discord/callback`).
- Lucide icons only (`i-lucide-*`); the Discord logo is the inline `ImgDiscordIcon`. Never
  hand-edit `*.gen.ts` under `app/api-client/` — regenerate with `bun run api-client:generate`.
- `openapi-ts.config.ts` `input` points at the API's `/docs/v1/openapi`.
- The guard in `app/middleware/auth.global.ts` is UX only. Never rely on it for permissions; the
  API decides (roles `admin` / `moderator` / `user`, page roles `owner` / `manager`).
- Format with Biome before finishing. Conventional Commits.

## Project notes

- 3D previews use `<SkinViewer>` (client-only, WebGL). Tiles and lists use the 2D canvas
  components (`SkinCapePreview`, `SkinPlayerHead`) — many WebGL contexts on one page crash the
  browser.
- Player skins come through the API's `/skins/<uuid>.png` proxy (`useMinecraftAssets().skinURL`),
  never straight from Mojang (no CORS there).
- Cosmetic variants: pick with `pickVariant()` (`app/utils/catalog.ts`) — the same rule as the
  mod: pinned variant, else the skin model, else `any`, else the first one.
- `official` is one page, not a list: the API allows a single official page and the site shows
  it at `/shop/official` (`isSinglePageCategory`, `shopPagePath`, `shopPageBreadcrumbs` in
  `app/utils/catalog.ts`). Partner and community pages live at `/shop/<category>/<slug>`.
- Community content goes through review: product edits can send items back to `pending_review`,
  page and collection edits wait in `pending_changes`. Show that state, don't hide it.
- Composables (`useSeoMeta`, `useAPI`, `useRoute`, …) must not run after an `await` inside a
  callback (for example the getter of `useAwaitedComputed`): Nuxt loses its context and the SSR
  request fails with `NUXT_E1001`. Top-level `await` in `<script setup>` is fine.
- `bun run typecheck` skips `.vue` files under Bun; run vue-tsc with Node (see README) before
  finishing UI work.
