---
title: Install with Prism Launcher
description: Create a Fabric 26.3 instance in Prism Launcher and add LeiCraftClient with its dependencies.
---

Prism Launcher keeps every setup in its own instance, so your LeiCraftClient setup doesn't touch your other modpacks. Its built-in mod browser can download LeiCraftClient from Modrinth and pick up its dependencies.

## What you need

- **Prism Launcher** from https://prismlauncher.org, with your Microsoft account added.
- Nothing else to download if you install from Modrinth. If you prefer the jar from our website, get it from the [download page](/download).

## Install

::steps{level="3"}
### Create the instance

1. Click **Add Instance**.
2. On the left, choose **Custom**.
3. Pick Minecraft **26.3** from the version list.
4. Under **Mod Loader**, choose **Fabric**. The newest loader version is fine (0.19.5 or newer).
5. Give the instance a name and click **OK**.

### Open the mod list

Select the new instance and click **Edit**. In the window that opens, choose **Mods** on the left.

### Add LeiCraftClient

:::tabs
::::tabs-item{label="From Modrinth" icon="i-lucide-search"}
1. Click **Download Mods**.
2. Choose the **Modrinth** tab and search for `LeiCraftClient`.
3. Click LeiCraftClient, then **Select mod for download**.
4. Click **OK**. Prism also finds the mods that LeiCraftClient needs and adds them to the list.
5. Check that **Fabric API** and **Fabric Language Kotlin** are in the list, then confirm the download.
::::

::::tabs-item{label="Jar from our website" icon="i-lucide-globe"}
1. Download the LeiCraftClient jar from the [download page](/download).
2. Click **Add File** and choose the jar. You can also click **View Folder** and copy the jar into the folder that opens.
3. Click **Download Mods**, search on the **Modrinth** tab and add **Fabric API** and **Fabric Language Kotlin** the same way.
::::
:::

### Check the mod list

The **Mods** list should now show three mods: LeiCraftClient, Fabric API and Fabric Language Kotlin. Make sure all three are enabled (checked).

### Start the game

Close the edit window and launch the instance (double-click it). Look for the **LeiCraftClient** button on the title screen, below the Realms button. If you see it, LeiCraftClient is installed.
::

::tip
Using Quilt? Choose **Quilt** under **Mod Loader** when you create the instance, then follow the [Quilt guide](/docs/install/quilt).
::

## Next: link your account

You can already see other players' capes and cosmetics. To wear your own, link your Minecraft account: [Link your account](/docs/using/linking).

## Troubleshooting

- **The game stops with an error about missing or incompatible mods.** The error names the missing mod. Most often it is **Fabric Language Kotlin** or **Fabric API**. Add it with **Download Mods**.
- **LeiCraftClient isn't in the search.** Check that the instance is on **26.3** with **Fabric** (or Quilt) as the mod loader.
- **You already have a 26.3 instance with other mods.** You can add LeiCraftClient there too, as long as it runs Fabric.

More help: [Troubleshooting](/docs/using/troubleshooting).
