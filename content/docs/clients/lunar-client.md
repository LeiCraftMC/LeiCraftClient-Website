---
title: Lunar Client
description: Run LeiCraftClient inside Lunar Client by adding it to a Fabric profile for Minecraft 26.3.
---

Lunar Client can load your own Fabric mods on **Fabric profiles** (Minecraft 1.16.5 and newer), and it has supported Minecraft 26.3 since the day it came out. So you can keep Lunar and add LeiCraftClient to a Fabric profile.

::tip
Coming from **Badlion Client**? Badlion now launches from the Lunar launcher and has no way to add your own mods. Follow this page.
::

## What you need

- The **Lunar Client** launcher (https://www.lunarclient.com), signed in with your Microsoft account.
- **LeiCraftClient** for 26.3 — from the [download page](/download) or [Modrinth](https://modrinth.com/mod/leicraftclient).
- **Fabric Language Kotlin** 1.14.2 or newer, for 26.3 — [Modrinth](https://modrinth.com/mod/fabric-language-kotlin). Lunar doesn't say it includes this one, so add it yourself.
- **Fabric API** — Lunar's Fabric add-on already includes it. Only add it yourself ([Modrinth](https://modrinth.com/mod/fabric-api)) if Lunar reports that it's missing.

::note
LeiCraftClient needs **Fabric Loader 0.19.5 or newer**. Lunar installs its own loader, and at the time of writing we haven't confirmed which version Lunar uses on 26.3. If the game tells you the loader is too old, that's on Lunar's side — use another launcher such as the [Modrinth App](/docs/install/modrinth-app) until Lunar updates.
::

## Install

::steps{level="3"}
### Download the jars

Download **LeiCraftClient** and **Fabric Language Kotlin** for Minecraft 26.3 (Fabric). Keep the `.jar` files somewhere easy to find, like your Downloads folder.

### Create a Fabric profile

In the Lunar launcher, click **Create Profile** and choose **Wizard**. Give the profile a name, for example "LeiCraft".

Under **Select Game Version**, pick **26.3**, then choose **Fabric (Recommended)**. There's also a **Lunar Client** / **Vanilla** toggle — pick **Lunar Client** if you want Lunar's own features in this profile.

Click **Create Profile**.

### Open the profile's mods

Open the version selector, select your new profile, click the button in the bottom-right corner, and choose **Mods**.

### Add the jars

Drag the LeiCraftClient and Fabric Language Kotlin jars into the **Mods** screen. You can also use the folder button there to open the profile's mods folder and copy the jars in.

Make sure **Enabled** is ticked for both mods.

### Launch and check

Start the profile. When the game is running, look for the **LeiCraftClient** button on the title screen or in the pause menu.

If the game doesn't start, Fabric usually names the missing mod or version. Lunar also has a **Show Conflicts** helper that points out mods that clash.
::

::tip
Can't find the **LeiCraftClient** button? Some clients replace the title screen with their own. Join a singleplayer world and type `/leicraftclient` in chat — the mod replies with your LeiCraftClient account status, so you know it's running.
::

::warning
Lunar warns that not all Fabric mods work in Lunar, and we haven't tested LeiCraftClient with every Lunar version. If you run into trouble, try a profile with the **Vanilla** toggle to see whether a Lunar feature is in the way, and tell us on [Discord](https://discord.com/invite/3cdazADhtv).
::

## Turn it off or remove it

In the profile's **Mods** screen, untick **Enabled** to turn LeiCraftClient off for a while. To remove it, click **…** next to the mod and choose **Uninstall Mod**.

## Lunar capes and LeiCraft capes

Lunar has its own cosmetics. The two systems are separate:

- Players with **LeiCraftClient** see your LeiCraft cape and cosmetics.
- Players with **Lunar** see your Lunar cosmetics. Without LeiCraftClient, they don't see your LeiCraft cape.

A player has only one cape slot. LeiCraftClient puts its cape into the player's skin data, the same place a normal Minecraft cape comes from. If Lunar also shows a cape on the same player, whichever is applied last is the one you see. So:

- To show your **LeiCraft cape**, take off your Lunar cape in Lunar's cosmetics menu.
- To see **Lunar capes** instead, turn off **Custom capes** in the LeiCraftClient options. That only changes what you see — others with LeiCraftClient still see your LeiCraft cape.

LeiCraft cosmetics are drawn as an extra layer on the player model. They don't replace Lunar cosmetics, so both can show at once — they can overlap if both sit in the same spot, like two hats.

More details: [Essential and other cape mods](/docs/clients/other-cape-mods).

## Next: link your account

To wear a cape, [link your Minecraft account](/docs/using/linking) to your LeiCraftClient account.

Something not working? See [Troubleshooting](/docs/using/troubleshooting).
