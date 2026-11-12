---
title: Dawn (formerly Feather Client)
description: Add LeiCraft Client to a modded Fabric profile in Dawn, the client that used to be called Feather Client.
---

Feather Client is now called **Dawn**: InPvP bought Feather on 21 May 2026 and renamed it (https://dawn.gg). Like Feather, Dawn lets you add your own Fabric mods. Modded profiles have a **Mods** tab with a Modrinth browser, and LeiCraft Client is on Modrinth — so that's the easiest way in.

::warning
LeiCraft Client needs **Minecraft 26.3** exactly. At the time of writing we couldn't confirm that Dawn offers 26.3. Check the version list when you create the profile. If 26.3 isn't there yet, use another launcher for LeiCraft Client, for example the [Modrinth App](/docs/install/modrinth-app) or [Prism Launcher](/docs/install/prism-launcher).
::

## What you need

- The **Dawn** launcher, signed in with your Microsoft account.
- Three mods for 26.3 — all on Modrinth, so you can add them from Dawn's **Mods** tab:
  - **LeiCraft Client** — [Modrinth](https://modrinth.com/mod/leicraftclient), also on the [download page](/download).
  - **Fabric API** — [Modrinth](https://modrinth.com/mod/fabric-api).
  - **Fabric Language Kotlin** 1.14.2 or newer — [Modrinth](https://modrinth.com/mod/fabric-language-kotlin).

## Install

::steps{level="3"}
### Create a modded profile

Open **Profiles**, click **New profile** and choose **Modded**.

### Choose With Dawn or Without Dawn

Pick **With Dawn** or **Without Dawn**. **With Dawn** keeps Dawn's own features in the profile. If LeiCraft Client gives you trouble later, try a **Without Dawn** profile to see whether Dawn's own mods are in the way.

### Pick 26.3 and Fabric

Choose **26.3** as the version and **Fabric** as the loader — not Forge or NeoForge. Then click **Create Profile**.

### Add the mods

Open the profile's **Mods** tab. Search the Modrinth browser for "LeiCraft" and install **LeiCraft Client**.

Then check that **Fabric API** and **Fabric Language Kotlin** are in the profile too. If they're missing, search for them and install them the same way.

### Launch and check

Start the profile. When the game is running, look for the **LeiCraftClient** button on the title screen or in the pause menu.
::

::tip
Can't find the **LeiCraftClient** button? Some clients replace the title screen with their own. Join a singleplayer world and type `/leicraftclient` in chat — the mod replies with your LeiCraft Client account status, so you know it's running.
::

## Adding a jar file by hand

At the time of writing we couldn't confirm how Dawn handles jar files you downloaded yourself. The Modrinth browser in the **Mods** tab is the dependable way. If your version of Dawn lets you open the profile's folder, the jars go into its `mods` folder, like in any other Fabric setup.

## Dawn cosmetics and LeiCraft capes

If you also wear Dawn cosmetics, keep in mind that the two systems are separate:

- Players with **LeiCraft Client** see your LeiCraft cape and cosmetics.
- Players with **Dawn** see your Dawn cosmetics. Without LeiCraft Client, they don't see your LeiCraft cape.

A player has only one cape slot. LeiCraft Client puts its cape into the player's skin data, the same place a normal Minecraft cape comes from. If Dawn also shows a cape on the same player, whichever is applied last is the one you see. So:

- To show your **LeiCraft cape**, take off your Dawn cape for yourself.
- To see **Dawn capes** instead, turn off **Custom capes** in the LeiCraftClient options. That only changes what you see — others with LeiCraft Client still see your LeiCraft cape.

LeiCraft cosmetics are drawn as an extra layer on the player model, so they can show next to Dawn cosmetics. They can overlap if both sit in the same spot.

More details: [Essential and other cape mods](/docs/clients/other-cape-mods).

## Next: link your account

To wear a cape, [link your Minecraft account](/docs/using/linking) to your LeiCraft Client account.

Something not working? See [Troubleshooting](/docs/using/troubleshooting).
