---
title: Other launchers
description: Install LeiCraft Client with ATLauncher, or with any other launcher that can create a Fabric 26.3 instance.
---

LeiCraft Client works with every launcher that can start Minecraft 26.3 with Fabric and has a `mods` folder. This page covers ATLauncher step by step, and then the general recipe for any other launcher.

## What you need

- A launcher that can create a **Fabric** instance for **Minecraft 26.3**.
- The **LeiCraft Client** jar from the [download page](/download) or [Modrinth](https://modrinth.com/mod/leicraftclient).
- **Fabric API** for 26.3 from [Modrinth](https://modrinth.com/mod/fabric-api).
- **Fabric Language Kotlin** 1.14.2 or newer from [Modrinth](https://modrinth.com/mod/fabric-language-kotlin).

## ATLauncher

::steps{level="3"}
### Create the instance

1. Open the **Create Pack** tab.
2. **Instance Name**: anything you like.
3. **Minecraft Version**: **26.3**.
4. **Loader**: **Fabric**.
5. **Loader Version**: the newest one is fine (0.19.5 or newer).
6. Click **Create Instance**.

### Add the mods from Modrinth

On the new instance's card, click **Add Mods**. Choose Modrinth as the source and search for each mod, then install it:

- `LeiCraft Client`
- `Fabric API`
- `Fabric Language Kotlin`

### Or add the jar from our website

If you downloaded the LeiCraft Client jar from the [download page](/download), click **Edit Mods** on the instance's card, then **Add Mod**. Choose the jar and pick **Mod** as the type. Add Fabric API and Fabric Language Kotlin with **Add Mods** as above.

### Start the game

Start the instance. Look for the **LeiCraftClient** button on the title screen, below the Realms button. If you see it, LeiCraft Client is installed.
::

## Any other launcher

Launcher menus differ, but the recipe is always the same:

::steps{level="3"}
### Create a Fabric 26.3 instance

Create a new instance or profile with Minecraft **26.3** and **Fabric Loader 0.19.5 or newer**. If your launcher can't create Fabric instances, use the [Fabric installer](/docs/install/fabric) with the official Minecraft Launcher, or one of the launchers from the [quick start](/docs/getting-started/quick-start) instead.

### Find the mods folder

Open the instance's folder. Most launchers have a button like "Open folder" for this. Inside is a folder called `mods`. If it's missing, start the instance once, or create the folder yourself.

### Add the three mods

Copy the LeiCraft Client jar, Fabric API and Fabric Language Kotlin into the `mods` folder. Don't unzip them.

If your launcher has its own mod browser, you can use it for Fabric API and Fabric Language Kotlin. Make sure it gives you the versions for 26.3 and Fabric.

### Start the game

Start the instance. Look for the **LeiCraftClient** button on the title screen, below the Realms button. If you see it, LeiCraft Client is installed.
::

::warning
Your launcher must sign in with a real (premium) Minecraft account if you want to wear capes. With an offline or cracked account you still see everyone's capes and cosmetics, but you can't link an account. See [Link your account](/docs/using/linking).
::

## Next: link your account

You can already see other players' capes and cosmetics. To wear your own, link your Minecraft account: [Link your account](/docs/using/linking).

## Troubleshooting

- **The game stops with an error about missing or incompatible mods.** The error names the missing mod. Most often it is **Fabric Language Kotlin** or **Fabric API**. Add the version for 26.3 to the `mods` folder.
- **There is no LeiCraftClient button.** Check that the instance runs **Fabric** on **26.3**, and that the jar is in this instance's `mods` folder, not in another one.

More help: [Troubleshooting](/docs/using/troubleshooting).
