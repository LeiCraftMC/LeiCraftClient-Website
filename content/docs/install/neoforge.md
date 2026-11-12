---
title: NeoForge
description: Why LeiCraftClient can't run on NeoForge for Minecraft 26.3 yet, and what you can do instead.
---

LeiCraftClient is a Fabric mod. NeoForge can only load Fabric mods with the help of extra compatibility mods, and those don't exist for Minecraft 26.3 yet. This page explains how it works and what you can do today.

::warning
**At the moment, LeiCraftClient can't run on NeoForge.** LeiCraftClient needs Minecraft 26.3, and the compatibility mods are not available for 26.3 yet. Use [Fabric](/docs/install/fabric) or [Quilt](/docs/install/quilt) instead. We will update this page when this changes.
::

## Why it doesn't work yet

NeoForge can't load Fabric mods on its own. Two mods by the Sinytra project make it possible:

- **[Sinytra Connector](https://github.com/Sinytra/Connector)** loads Fabric mods on NeoForge.
- **[Forgified Fabric API](https://github.com/Sinytra/ForgifiedFabricAPI)** is a version of Fabric API that runs on NeoForge. It replaces Fabric API.

Both have to exist for the Minecraft version you play. At the end of October 2026, the newest Connector builds were for Minecraft 26.2 (a beta), 26.1.2 and 1.21.1. **There is no Connector and no Forgified Fabric API for 26.3.** LeiCraftClient needs exactly 26.3, so there is no NeoForge setup that can run it right now.

If you put the LeiCraftClient jar into a NeoForge `mods` folder today, it won't load.

## What you can do instead

Keep your NeoForge modpack, and add a separate Fabric instance for LeiCraftClient next to it. Launchers like [Prism Launcher](/docs/install/prism-launcher) and the [Modrinth App](/docs/install/modrinth-app) make it easy to have several instances side by side.

::steps{level="3"}
### Create a Fabric 26.3 instance

Follow the guide for your launcher: [Prism Launcher](/docs/install/prism-launcher), [Modrinth App](/docs/install/modrinth-app), [CurseForge](/docs/install/curseforge) or the [Fabric installer](/docs/install/fabric). Your NeoForge instance stays as it is.

### Add the three mods

Add **LeiCraftClient**, **Fabric API** and **Fabric Language Kotlin** 1.14.2 or newer to the new instance. Links and versions are in [Requirements](/docs/getting-started/requirements).

### Start the game

Start the Fabric instance. Look for the **LeiCraftClient** button on the title screen, below the Realms button. If you see it, LeiCraftClient is installed.
::

::tip
Your cape belongs to your Minecraft account, not to the instance. Once you have linked your account from the Fabric instance and picked a cape, other LeiCraftClient players see it even when you play your NeoForge modpack without the mod. You just won't see capes and cosmetics yourself there.
::

## Later: when Connector supports 26.3

::note
This section describes a **future** setup. None of it works today. We will replace it with real steps once it does.
::

When Sinytra Connector and Forgified Fabric API are released for Minecraft 26.3, the setup will most likely be:

1. A NeoForge instance for Minecraft 26.3.
2. **Sinytra Connector**, plus any other mod that Connector's own install guide asks for at that time.
3. **Forgified Fabric API** instead of Fabric API. Don't install both.
4. **Fabric Language Kotlin** 1.14.2 or newer.
5. The **LeiCraftClient** jar.

Some things are not known yet:

- **Fabric Language Kotlin under Connector is untested.** We don't know yet whether it loads correctly there.
- **NeoForge changes parts of Minecraft's own code**, and LeiCraftClient makes a few small changes to it too. The two may clash even when everything loads.

So even then, Fabric will be the more reliable choice. If you try it, tell us on [Discord](https://discord.com/invite/3cdazADhtv) how it went.

## What about Forge?

Forge (not NeoForge) can't run LeiCraftClient at all. Nothing loads Fabric mods on current Forge versions.

## Next: link your account

Once LeiCraftClient runs in your Fabric instance, link your Minecraft account to wear your own cape: [Link your account](/docs/using/linking).

## Troubleshooting

- **I added LeiCraftClient to my NeoForge modpack and it doesn't work.** That is expected: NeoForge can't load Fabric mods by itself. Remove the jar from the NeoForge `mods` folder and use a Fabric instance.
- **The Fabric instance stops with an error about missing mods.** The error names the missing mod. Most often it is **Fabric Language Kotlin** or **Fabric API**. Add the version for 26.3.

More help: [Troubleshooting](/docs/using/troubleshooting).
