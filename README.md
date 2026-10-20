# LeiCraft Client Website

The website of the LeiCraft Client (https://client.leicraftmc.de): the shop for capes and
cosmetics, player profiles, the wardrobe, the Creator Studio for official, partner and community
pages, and the moderation and admin area. It talks to the
[LeiCraft Client API](https://git.leicraftmc.de/LeiCraftMC/LeiCraftClient/API-Server) (https://api.client.leicraftmc.de).

Built on the LeiCraftMC Nuxt app template.

## Stack

- Nuxt 4 (`app/` srcDir), NuxtUI v4 + Tailwind v4 (CSS-first), dark only
- [`@leicraftmc/skinviewerjs`](https://git.leicraftmc.de/LeiCraftMC/LeiCraftClient/SkinViewerJS) for the 3D previews (skin, cape, elytra, cosmetics)
- Bun runtime, Biome formatter/linter
- AGPL-3.0

## Setup

`@leicraftmc/skinviewerjs` comes from the LeiCraftMC GitLab npm registry; `.npmrc` points the
`@leicraftmc` scope there (public, no token needed).

```bash
bun install
cp example.env .env
bun run dev          # http://localhost:12332
```

The API must be running (default `http://localhost:12331`, see its README). Discord login
redirects to `<LCC_APP_URL>/auth/discord/callback`, so register that URL in the Discord
application of your API instance.

| Variable | Default | What it is |
| --- | --- | --- |
| `LCC_API_URL` | `http://localhost:12331` | Public URL of the API (used by the browser and the server) |
| `LCC_APP_URL` | `http://localhost:12332` | Public URL of this website (redeem and share links, sitemap) |

## API client

The typed client in `app/api-client/` is generated from the API's OpenAPI spec. Never edit it by
hand; regenerate it after API route changes (the API must run on port 12331 with docs enabled):

```bash
bun run api-client:generate
```

## Routes

| Route | Who | What it is |
| --- | --- | --- |
| `/` | everyone | Landing page with a 3D preview of the newest cape |
| `/shop`, `/shop/<category>`, `/shop/<category>/<slug>` | everyone | Catalog: official, partner and community pages |
| `/shop/products/<id>`, `/shop/collections/<id>` | everyone | Item and collection pages with 3D preview and "Equip" |
| `/players`, `/players/<name>` | everyone | Player search and profiles (what a player wears) |
| `/download` | everyone | Mod download and install guide |
| `/auth/login`, `/auth/discord/callback` | signed out | Discord login (PKCE) |
| `/link/minecraft?code=…` | signed in | Target of the clickable link in the mod: links a Minecraft account |
| `/welcome` | signed in | One-time onboarding (install, link, find a cape) |
| `/dashboard` | signed in | Overview |
| `/dashboard/wardrobe` | signed in | Equip capes and cosmetics per Minecraft account, pick variants |
| `/dashboard/inventory` | signed in | Redeem codes (`?code=` prefills) and owned exclusives |
| `/dashboard/accounts` | signed in | Linked Minecraft accounts |
| `/dashboard/settings`, `/dashboard/apikeys` | signed in | Account (Discord profile, delete account) and API keys |
| `/dashboard/studio`, `/dashboard/studio/<pageId>/…` | page members, admins | Creator Studio: items, variants, collections, redeem codes, grants, members, page profile |
| `/dashboard/moderation`, `…/pages`, `…/reports`, `…/users` | moderators, admins | Review queue, page profile reviews, reports, bans |
| `/dashboard/admin/users`, `/dashboard/admin/audit-log` | admins | Roles, account deletion, audit log |
| `/sitemap.xml` | everyone | Static pages, shop pages and listed items (cached for an hour) |

The access rules are the constants at the top of `app/middleware/auth.global.ts`. The guard is
UX only: the API checks every role and page permission on its own.

## Scripts

- `bun run dev` — dev server on port 12332
- `bun run build` — production build (`.output/`, Bun preset; see `docker/` for the image and compose file)
- `bun run start` — run the built server
- `bun run check` / `bun run format` — Biome check / format
- `bun run typecheck` — TypeScript check
- `bun test` — run tests

`bun run typecheck` does not check `.vue` files under Bun. For a full check of the templates, run
vue-tsc with Node after `bunx nuxt prepare`:

```bash
node node_modules/vue-tsc/bin/vue-tsc.js --noEmit -p .nuxt/tsconfig.app.json
```

## Structure

See the LeiCraftMC style guide:

- [docs/06-frontend-nuxt.md](https://github.com/LeiCraftMC/Style-Guides/blob/main/docs/06-frontend-nuxt.md)
- [docs/07-state-and-data.md](https://github.com/LeiCraftMC/Style-Guides/blob/main/docs/07-state-and-data.md)

## License

AGPL-3.0
