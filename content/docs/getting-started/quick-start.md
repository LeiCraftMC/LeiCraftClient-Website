---
title: Quick start
description: From zero to wearing your first cape in five steps, with links to the install guide for your launcher.
---

This page takes you from nothing to wearing your first cape. Each step links to a longer guide if you need more detail.

## Before you start

- **Minecraft Java Edition**, bought and signed in with your Microsoft account. Offline (cracked) accounts can see capes but can't link an account, so they can't wear one.
- **A Discord account.** Your LeiCraft Client account is your Discord account.
- **Minecraft 26.3.** LeiCraft Client needs exactly this version. See [Requirements](/docs/getting-started/requirements).

## Pick your launcher

Every guide below ends at the same point: the game starts and shows the **LeiCraftClient** button on the title screen. Pick the one that matches how you play.

::icon-card-grid
---
cards:
  - icon: i-lucide-download
    title: Fabric installer
    description: The official way, with the normal Minecraft Launcher.
    to: /docs/install/fabric
  - icon: i-lucide-package
    title: Modrinth App
    description: Installs LeiCraft Client and its dependencies in a few clicks.
    to: /docs/install/modrinth-app
  - icon: i-lucide-boxes
    title: Prism Launcher
    description: Separate instances for every setup, with a built-in mod browser.
    to: /docs/install/prism-launcher
  - icon: i-lucide-flame
    title: CurseForge
    description: A Fabric profile in the CurseForge app, with the mod added by hand.
    to: /docs/install/curseforge
  - icon: i-lucide-layout-grid
    title: Other launchers
    description: ATLauncher and any launcher with a mods folder.
    to: /docs/install/other-launchers
  - icon: i-lucide-layers
    title: Quilt
    description: Quilt Loader with the normal Fabric API. Should work, not officially tested.
    to: /docs/install/quilt
  - icon: i-lucide-circle-slash
    title: NeoForge
    description: Not possible for Minecraft 26.3 yet. Read why and what to do instead.
    to: /docs/install/neoforge
---
::

## The five steps

::steps{level="3"}
### Install Fabric for Minecraft 26.3

Set up Minecraft 26.3 with Fabric Loader 0.19.5 or newer. Follow the guide for your launcher from the list above.

### Add the three mods

Put these three files into your `mods` folder:

- **LeiCraft Client** from the [download page](/download) or [Modrinth](https://modrinth.com/mod/leicraftclient)
- **Fabric API** for 26.3 from [Modrinth](https://modrinth.com/mod/fabric-api)
- **Fabric Language Kotlin** 1.14.2 or newer from [Modrinth](https://modrinth.com/mod/fabric-language-kotlin)

:::warning
Don't forget Fabric Language Kotlin. It is a separate mod and no other mod brings it along. Without it, the game stops with a dependency error.
:::

### Start the game

Start Minecraft with your Fabric profile or instance. On the title screen you now see a **LeiCraftClient** button below the Realms button. If you use Mod Menu, it sits below **Mods** instead. You find the same button in the pause menu.

### Link your Minecraft account

1. Click **LeiCraftClient**, then **Link account**.
2. Minecraft asks if it may open a website. Confirm, and the link opens in your browser. The mod also posts the link in chat. It is valid for 10 minutes.
3. Log in with **Continue with Discord**, then click **Link account** on the website.

Back in the game, the options screen shows **Linked as …** after a few seconds. More details: [Link your account](/docs/using/linking).

### Pick a cape

1. Open the [shop](/shop) and choose a free cape.
2. Click **Save to wardrobe** on its page.
3. Open your [wardrobe](/dashboard/wardrobe), select the cape and click **Save**. If you linked more than one Minecraft account, first pick the account at the top.

You can also do this in the game: **LeiCraftClient** → **Wardrobe**. Other LeiCraft Client players see your new cape within a few minutes.
::

## What's next

- Learn everything the wardrobe can do: [Wardrobe](/docs/using/wardrobe).
- See the options screen, commands and settings: [In the game](/docs/using/in-game).
- Something doesn't work? See [Troubleshooting](/docs/using/troubleshooting).
- Want to make your own capes? Start at [For creators](/docs/creators/overview).
