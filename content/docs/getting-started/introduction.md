---
title: Introduction
description: What LeiCraft Client is, how it shows capes and 3D cosmetics on players, and what it costs (nothing).
---

LeiCraft Client is a free Minecraft Java Edition mod that shows capes and 3D cosmetics on players. You pick your look on the website, and everyone who plays with the mod sees it, on any server.

## What you get

- **Capes**: a custom cape on your player, which works with the normal cape and elytra behaviour of the game.
- **3D cosmetics**: 3D models on your head, body, arms or legs, up to 10 at a time.
- **A wardrobe**: choose your cape and cosmetics on the website at [/dashboard/wardrobe](/dashboard/wardrobe) or right in the game, with a live 3D preview.
- **A tab-list badge**: players who used LeiCraft Client in the last 30 days get the LeiCraft mark before their name in the tab list.
- **Discord Rich Presence**: the Discord desktop app shows what you are playing, with buttons to your profile and to the download.

## How it works

LeiCraft Client has three parts that work together:

| Part | What it does |
| --- | --- |
| **The mod** | A client-side Fabric mod (in-game name **LeiCraftClient**). It asks the API which cape and cosmetics each player around you wears, and draws them. |
| **The website** | [client.leicraftmc.de](https://client.leicraftmc.de). You log in with Discord, browse the [shop](/shop), fill your wardrobe and link your Minecraft accounts. Creators publish their own capes and cosmetics here. |
| **The API** | Connects the two. It stores who wears what and sends it to every player with the mod. |

What this means for you:

- **Everyone with the mod sees everyone's items.** If you and your friend both use LeiCraft Client, you see each other's capes and cosmetics.
- **It works on any server** and in singleplayer. The mod draws everything on your side.
- **Servers install nothing.** No plugin, no server mod, no resource pack.
- **Players without the mod see vanilla.** They see your normal skin and no LeiCraft cape. Your items still show up for everyone who has the mod.

::note
Used the old LeiCraft Client? You no longer need OptiFine or a hosts-file change. The new mod talks to the LeiCraft Client API directly.
::

## What is free

Everything you need is free:

- The mod and the website.
- Your account. A LeiCraft Client account is your Discord account, so there is no password to create.
- Every item in the [shop](/shop), unless it is marked **Exclusive**. Exclusive items are not sold either: you get them with a redeem code or as a direct gift from the page that made them. See [Exclusive items](/docs/using/exclusives).
- Your own community page in the Creator Studio, if you want to make capes and cosmetics for others. See [For creators](/docs/creators/overview).

There is nothing to buy. The website has no payments anywhere.

## Works next to other mods and clients

LeiCraft Client is a mod, not a launcher. It runs in a normal Fabric setup next to your other mods.

Many players use a client like Lunar Client, LabyMod or Dawn. Whether LeiCraft Client works inside one of them depends on whether that client can load Fabric mods. The [client compatibility overview](/docs/clients/overview) lists what works where. If you also use another cape or cosmetic mod, see [Other cape mods](/docs/clients/other-cape-mods).

## Open source

LeiCraft Client is open source under the AGPL-3.0 licence. The Fabric mod, the API server, the website and the 3D skin viewer are all public:

- Source: https://git.leicraftmc.de/LeiCraftMC/LeiCraftClient
- Mirror: https://github.com/LeiCraftMC

Questions, ideas or bugs? Join the [LeiCraftMC Discord](https://discord.com/invite/3cdazADhtv).

## Next steps

::card-group
:::card{title="Quick start" icon="i-lucide-rocket" to="/docs/getting-started/quick-start"}
From zero to wearing your first cape in five steps.
:::

:::card{title="Requirements" icon="i-lucide-list-checks" to="/docs/getting-started/requirements"}
The Minecraft version and the mods you need.
:::
::
