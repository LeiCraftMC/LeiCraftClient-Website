---
title: Install with the Modrinth App
description: Create a Fabric 26.3 instance in the Modrinth App and add LeiCraft Client together with its dependencies.
---

The Modrinth App manages instances and mods for you. LeiCraft Client is on Modrinth, so the app can install it and offer its dependencies in one go.

## What you need

- The **Modrinth App** from https://modrinth.com/app, signed in with your Minecraft account.
- Nothing else to download: the app gets **LeiCraft Client**, **Fabric API** and **Fabric Language Kotlin** from Modrinth for you.

## Install

::steps{level="3"}
### Create a new instance

1. Click **Create new instance** in the sidebar. On the **Library** page you can also click **New instance**.
2. A **Create instance** window opens. Choose **Custom setup**.

### Set up Fabric for 26.3

Fill in the fields:

- **Name**: anything you like, for example `LeiCraft 26.3`.
- **Loader**: **Fabric**.
- Game version: **26.3**.
- **Loader version**: **Stable**.

Then click **Create instance**. The app downloads Minecraft and Fabric in the background.

### Add LeiCraft Client

Open your new instance and go to the **Content** tab. You can add LeiCraft Client in two ways:

:::tabs
::::tabs-item{label="From Modrinth" icon="i-lucide-search"}
1. Click **Browse content**.
2. Search for `LeiCraft Client`.
3. Click **Install** next to LeiCraft Client.
4. The app offers the mods that LeiCraft Client needs. Install them too, so you get **Fabric API** and **Fabric Language Kotlin**.

This is the easiest way, and the app can also update the mods later.
::::

::::tabs-item{label="Jar from our website" icon="i-lucide-globe"}
1. Download the LeiCraft Client jar from the [download page](/download).
2. On the **Content** tab, click **Upload files** and choose the jar. You can also drag the jar onto the window.
3. The app shows an **Unknown file warning** because the file doesn't come from Modrinth. That is expected for the jar from our website. Click **Install anyway** to confirm.
4. Click **Browse content** and install **Fabric API** and **Fabric Language Kotlin** as well.
::::
:::

### Check the content list

The **Content** tab should now list three mods: LeiCraft Client, Fabric API and Fabric Language Kotlin. If one of them is missing, add it with **Browse content**.

### Start the game

Start the instance. Look for the **LeiCraftClient** button on the title screen, below the Realms button. If you see it, LeiCraft Client is installed.
::

::tip
Using Quilt? Choose **Quilt** as the **Loader** when you create the instance, then follow the [Quilt guide](/docs/install/quilt).
::

## Next: link your account

You can already see other players' capes and cosmetics. To wear your own, link your Minecraft account: [Link your account](/docs/using/linking).

## Troubleshooting

- **The game stops with an error about missing or incompatible mods.** The error names the missing mod. Most often it is **Fabric Language Kotlin** or **Fabric API**. Add it on the **Content** tab with **Browse content**.
- **LeiCraft Client doesn't show up in the search.** Check that the instance uses **Fabric** (or Quilt) and game version **26.3**. You can also open the mod page directly: https://modrinth.com/mod/leicraftclient.
- **The jar from the website shows a warning.** That is normal for files that don't come from Modrinth. Only install jars you downloaded from the [download page](/download).

More help: [Troubleshooting](/docs/using/troubleshooting).
