---
title: NoRisk Client
description: Add LeiCraftClient to a NoRisk Client profile for Minecraft 26.3 with Fabric, and choose which cape you show.
---

NoRisk Client is an open-source launcher and client (https://norisk.gg). It supports Minecraft 26.3 on Fabric, and its profiles can take mods from Modrinth and CurseForge or jar files you add yourself. That's all LeiCraftClient needs.

## What you need

- The **NoRisk Client** launcher, signed in with your Microsoft account.
- Three mods for 26.3 — you can add all of them from the launcher's mod search:
  - **LeiCraftClient** — [Modrinth](https://modrinth.com/mod/leicraftclient), also on the [download page](/download).
  - **Fabric API** — [Modrinth](https://modrinth.com/mod/fabric-api).
  - **Fabric Language Kotlin** 1.14.2 or newer — [Modrinth](https://modrinth.com/mod/fabric-language-kotlin).

## Install

::steps{level="3"}
### Create a profile

Click **Create New Profile**. Choose Minecraft **26.3** and **Fabric** as the loader (not NeoForge or Forge), then create it.

### Open the Content tab

Open your new profile and go to its **Content** tab.

### Add the mods

Click **Add Mods**, search for "LeiCraft" and add **LeiCraftClient**.

Then check that **Fabric API** and **Fabric Language Kotlin** are in the profile too. If they're missing, search for them and add them the same way.

### Launch and check

Start the profile. When the game is running, look for the **LeiCraftClient** button on the title screen or in the pause menu.
::

::tip
Can't find the **LeiCraftClient** button? Some clients replace the title screen with their own. Join a singleplayer world and type `/leicraftclient` in chat — the mod replies with your LeiCraftClient account status, so you know it's running.
::

## Adding jar files by hand

If you downloaded the jars yourself (for example from the [download page](/download)), drag them onto the profile's content area. The launcher shows **Drop to add to this profile** — let go there.

You can also click **Open Folder** and copy the jars into the profile's `mods` folder.

## NoRisk capes and LeiCraft capes

NoRisk Client has its own capes: you can pick one or upload your own (NoRisk reviews uploaded capes), and everyone with NoRisk Client sees them. LeiCraft capes work the same way for LeiCraftClient players. The two systems are separate:

- Players with **LeiCraftClient** see your LeiCraft cape and cosmetics.
- Players with **NoRisk Client** see your NoRisk cape. Without LeiCraftClient, they don't see your LeiCraft cape.

A player has only one cape slot. LeiCraftClient puts its cape into the player's skin data, the same place a normal Minecraft cape comes from. Both capes can only show at the same time if the two mods don't fight over that slot — and we haven't checked how NoRisk handles a cape from another mod. **You may need to pick one cape source:**

- To show your **LeiCraft cape**, take off your NoRisk cape.
- To see **NoRisk capes** instead, turn off **Custom capes** in the LeiCraftClient options. That only changes what you see — others with LeiCraftClient still see your LeiCraft cape.

LeiCraft cosmetics are drawn as an extra layer on the player model, so they can show next to NoRisk cosmetics. They can overlap if both sit in the same spot.

More details: [Essential and other cape mods](/docs/clients/other-cape-mods).

## Next: link your account

To wear a cape, [link your Minecraft account](/docs/using/linking) to your LeiCraftClient account.

Something not working? See [Troubleshooting](/docs/using/troubleshooting).
