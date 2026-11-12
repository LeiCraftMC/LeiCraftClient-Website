---
title: Install with the CurseForge app
description: Create a Fabric 26.3 profile in the CurseForge app and add LeiCraftClient to its mods folder by hand.
---

The CurseForge app only installs mods that are on CurseForge. LeiCraftClient is not on CurseForge, so you create a Fabric profile in the app and copy the LeiCraftClient jar into its `mods` folder yourself. It takes a minute longer than the other launchers, but it works the same.

## What you need

- The **CurseForge app** with Minecraft set up in it.
- The **LeiCraftClient** jar from the [download page](/download).
- **Fabric API** for 26.3 and **Fabric Language Kotlin** 1.14.2 or newer. You can add both through the app, or download them from Modrinth ([Fabric API](https://modrinth.com/mod/fabric-api), [Fabric Language Kotlin](https://modrinth.com/mod/fabric-language-kotlin)).

## Install

::steps{level="3"}
### Create a custom profile

1. In the Minecraft section of the app, click **Create Custom Profile** (in some versions of the app: **+ Create**).
2. Enter a name for the profile.
3. Choose **Fabric** as the modloader. The app also offers Forge, NeoForge and Quilt; pick Fabric.
4. Choose game version **26.3**.
5. Click **Create**.

### Add Fabric API and Fabric Language Kotlin

Open the new profile and click **Add More Content**. Search for **Fabric API** and install it, then do the same for **Fabric Language Kotlin**. Make sure you get versions for 26.3.

If you downloaded them from Modrinth instead, copy them into the `mods` folder in the next step together with LeiCraftClient.

### Download LeiCraftClient

Download the LeiCraftClient jar from the [download page](/download). Don't unzip it.

### Open the profile folder

Open the profile's menu (**⋯**) and choose **Open Folder**. The exact position of this option can change between app versions; look for it in the profile's menu or settings.

The profile folder opens in your file manager. Inside it is a folder called `mods`. If it isn't there, create a folder with exactly that name.

### Copy the jar into mods

Copy the LeiCraftClient jar into the `mods` folder. If you downloaded Fabric API and Fabric Language Kotlin by hand, copy them in too. In the end the folder must contain all three mods.

### Start the game

Start the profile from the CurseForge app. Look for the **LeiCraftClient** button on the title screen, below the Realms button. If you see it, LeiCraftClient is installed.
::

::note
The CurseForge app can't update LeiCraftClient for you, because the mod is not on CurseForge. When a new version comes out, the mod tells you on its options screen. Download the new jar from the [download page](/download) and replace the old one in the `mods` folder.
::

## Next: link your account

You can already see other players' capes and cosmetics. To wear your own, link your Minecraft account: [Link your account](/docs/using/linking).

## Troubleshooting

- **The game stops with an error about missing or incompatible mods.** The error names the missing mod. Most often it is **Fabric Language Kotlin** or **Fabric API**. Add it with **Add More Content**, or copy the jar into the `mods` folder.
- **There is no LeiCraftClient button.** Check that you copied the jar into the `mods` folder of the right profile, and that the profile uses **Fabric** and **26.3**.
- **Two LeiCraftClient jars in the folder.** Keep only the newest one.

More help: [Troubleshooting](/docs/using/troubleshooting).
