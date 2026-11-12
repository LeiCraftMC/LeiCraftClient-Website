---
title: Compatibility with other clients
description: LeiCraft Client is a Fabric mod, so it runs inside any client or launcher that lets you add Fabric mods for Minecraft 26.3.
---

LeiCraft Client is not a launcher and not a replacement for the client you already use. It's a normal **Fabric mod**. If your client lets you add your own Fabric mods for Minecraft 26.3, you can keep using it and add LeiCraft Client on top.

## What every setup needs

Whatever client or launcher you use, the game needs:

- **Minecraft Java Edition 26.3** — exactly this version.
- **Fabric Loader 0.19.5 or newer.** Most clients install the loader for you.
- **Three mods (jar files):**
  - **LeiCraft Client** — from the [download page](/download) or [Modrinth](https://modrinth.com/mod/leicraftclient).
  - **Fabric API** for 26.3 — [Modrinth](https://modrinth.com/mod/fabric-api). Some clients already include it (Lunar Client does).
  - **Fabric Language Kotlin** 1.14.2 or newer — [Modrinth](https://modrinth.com/mod/fabric-language-kotlin).

::warning
Fabric Language Kotlin is the one people forget. It is a separate mod and LeiCraft Client does not include it. Don't count on your client to bring it — check that it's installed. Without it, the game won't start.
::

See [Requirements](/docs/getting-started/requirements) for all versions in one place.

## Compatibility table

| Client or loader | Works? | How | Guide |
| --- | --- | --- | --- |
| Fabric + Minecraft Launcher | Works | Fabric installer, then the `mods` folder | [Fabric installer](/docs/install/fabric) |
| Modrinth App | Works | Fabric 26.3 instance | [Modrinth App](/docs/install/modrinth-app) |
| Prism Launcher | Works | Fabric 26.3 instance | [Prism Launcher](/docs/install/prism-launcher) |
| CurseForge app | Works | Fabric 26.3 profile | [CurseForge](/docs/install/curseforge) |
| ATLauncher and other launchers | Works | Any Fabric 26.3 instance with a `mods` folder | [Other launchers](/docs/install/other-launchers) |
| Quilt | Works, unverified on 26.3 | Quilt Loader 0.30.2-beta.1 or newer, with Fabric API and Fabric Language Kotlin | [Quilt](/docs/install/quilt) |
| NeoForge | Not yet | Needs Sinytra Connector, which has no 26.3 build yet | [NeoForge](/docs/install/neoforge) |
| Forge | No | Nothing runs Fabric mods on Forge for current versions | — |
| Lunar Client | Works, unverified on 26.3 | Fabric profile, add the jars under **Mods** | [Lunar Client](/docs/clients/lunar-client) |
| LabyMod | Not yet | Only once LabyMod offers 26.3 with Fabric (the newest we found was 26.2) | [LabyMod](/docs/clients/labymod) |
| Dawn (formerly Feather Client) | Works, unverified on 26.3 | Modded profile with Fabric, then the **Mods** tab | [Dawn](/docs/clients/dawn) |
| NoRisk Client | Works, unverified on 26.3 | Fabric 26.3 profile, then the **Content** tab | [NoRisk Client](/docs/clients/norisk-client) |
| Badlion Client | No | No way to add your own mods — use a Lunar Fabric profile instead | [Lunar Client](/docs/clients/lunar-client) |

What the status words mean:

- **Works** — a normal Fabric setup. Follow the guide and it runs.
- **Works, unverified on 26.3** — the client supports your own Fabric mods, but we haven't confirmed this exact setup on Minecraft 26.3 yet. Try it; if it works (or doesn't), tell us on [Discord](https://discord.com/invite/3cdazADhtv).
- **Not yet** — not possible today, but could be once the client or loader supports 26.3.
- **No** — not possible.

::note
Clients change quickly. This table reflects what we found at the time of writing (November 2026). If a client's own site says something newer, trust that.
::

## Badlion Client

Badlion has no feature to add your own mods. Lunar Client bought Badlion in March 2025, and Badlion now launches from the Lunar launcher. To use LeiCraft Client, create a Fabric profile there: [Lunar Client](/docs/clients/lunar-client).

## Your client isn't listed?

Ask two questions:

1. Can you create a profile or instance for **Minecraft 26.3 with Fabric**?
2. Can you **add your own mods** — jar files, a `mods` folder, or a Modrinth search?

If both answers are yes, it should work: add the three mods from above. If your client can't do one of them, use one of the launchers in the table for LeiCraft Client. You can still use your usual client for everything else.

## Capes from other clients

Many clients have their own capes and cosmetics. Each system only shows to people who run it: players with LeiCraft Client see LeiCraft capes, players of the other client see that client's capes. If both try to put a cape on the same player, only one can win. [Essential and other cape mods](/docs/clients/other-cape-mods) explains how they share the player, and each client page has a short note.

## Next steps

- Pick your client from the table and follow its guide.
- Then [link your Minecraft account](/docs/using/linking) to pick a cape.
- Something not working? See [Troubleshooting](/docs/using/troubleshooting).
