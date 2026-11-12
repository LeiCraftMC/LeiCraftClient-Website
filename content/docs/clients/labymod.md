---
title: LabyMod
description: Add LeiCraft Client to a LabyMod Fabric modpack, once LabyMod offers Minecraft 26.3 with Fabric.
---

LabyMod 4 and the Laby launcher can run Fabric mods through **modpacks**. The launcher comes with LabyMod's Fabric Loader already installed, and its mod manager lists mods from Modrinth — where LeiCraft Client, Fabric API and Fabric Language Kotlin all are.

::warning
LeiCraft Client needs **Minecraft 26.3** exactly. At the time of writing, the newest version we found LabyMod supporting was **26.2** (LabyMod 4.5.9). Before you start, check that the Laby launcher offers **26.3 with Fabric**. Until it does, use another launcher for LeiCraft Client, for example the [Modrinth App](/docs/install/modrinth-app) or [Prism Launcher](/docs/install/prism-launcher).
::

## What you need

- The **Laby launcher** (https://www.labymod.net), signed in with your Microsoft account, with Minecraft **26.3** and **Fabric** available.
- Three mods for 26.3 — you can add all of them from LabyMod's mod manager:
  - **LeiCraft Client** — also on the [download page](/download) and [Modrinth](https://modrinth.com/mod/leicraftclient).
  - **Fabric API** — [Modrinth](https://modrinth.com/mod/fabric-api).
  - **Fabric Language Kotlin** 1.14.2 or newer — [Modrinth](https://modrinth.com/mod/fabric-language-kotlin).

LeiCraft Client also needs **Fabric Loader 0.19.5 or newer**. LabyMod installs its own; if the game says the loader is too old, LabyMod has to update first.

::note
We couldn't check every LabyMod screen ourselves, so a button may be named slightly differently in your version. The steps stay the same.
::

## Install

::steps{level="3"}
### Check that 26.3 is available

In the Laby launcher, check that you can create a modpack (or instance) for Minecraft **26.3** with **Fabric**. If 26.3 isn't offered yet, stop here and use another launcher for now.

### Open the mod manager

Click the puzzle icon in the top right. It opens the mod and addon manager, which lists mods from Modrinth.

### Add LeiCraft Client to a modpack

Search for "LeiCraft" and add **LeiCraft Client** to a modpack for 26.3 with Fabric.

### Add the two dependencies

Check that **Fabric API** and **Fabric Language Kotlin** are in the same modpack. If they're missing, search for them and add them the same way.

### Launch and check

Start the modpack. When the game is running, look for the **LeiCraftClient** button on the title screen or in the pause menu.
::

::tip
Can't find the **LeiCraftClient** button? Some clients replace the title screen with their own. Join a singleplayer world and type `/leicraftclient` in chat — the mod replies with your LeiCraft Client account status, so you know it's running.
::

## Adding jar files by hand

If you downloaded the jars yourself (for example from the [download page](/download)), open the modpack manager and click **Open Fabric Directory**. Copy the three jar files into the folder that opens, then start the modpack again.

## LabyMod cosmetics and LeiCraft capes

If you also wear LabyMod cosmetics, keep in mind that the two systems are separate:

- Players with **LeiCraft Client** see your LeiCraft cape and cosmetics.
- Players with **LabyMod** see your LabyMod cosmetics. Without LeiCraft Client, they don't see your LeiCraft cape.

A player has only one cape slot. LeiCraft Client puts its cape into the player's skin data, the same place a normal Minecraft cape comes from. If LabyMod also shows a cape on the same player, whichever is applied last is the one you see. So:

- To show your **LeiCraft cape**, take off your LabyMod cape for yourself.
- To see **LabyMod capes** instead, turn off **Custom capes** in the LeiCraftClient options. That only changes what you see — others with LeiCraft Client still see your LeiCraft cape.

LeiCraft cosmetics are drawn as an extra layer on the player model, so they can show next to LabyMod cosmetics. They can overlap if both sit in the same spot.

More details: [Essential and other cape mods](/docs/clients/other-cape-mods).

## Next: link your account

To wear a cape, [link your Minecraft account](/docs/using/linking) to your LeiCraft Client account.

Something not working? See [Troubleshooting](/docs/using/troubleshooting).
