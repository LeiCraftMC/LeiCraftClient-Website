---
title: Install on Quilt
description: Run LeiCraft Client on Quilt Loader for Minecraft 26.3, with the normal Fabric API and Fabric Language Kotlin.
---

Quilt Loader can load Fabric mods, so LeiCraft Client should run on Quilt too. You install it with the normal Fabric API and Fabric Language Kotlin, not with Quilt's own libraries.

::warning
**Not officially tested.** We build and test LeiCraft Client on Fabric. Quilt should work, but we don't test every release on it. If something breaks, tell us on [Discord](https://discord.com/invite/3cdazADhtv), and use [Fabric](/docs/install/fabric) in the meantime.
::

## Good to know first

- **Use Fabric API, not Quilted Fabric API.** Since Minecraft 26.1, the Quilt project no longer makes the Quilt Standard Libraries (QSL), Quilted Fabric API (QFAPI) or Quilt Kotlin Libraries for new Minecraft versions. Quilt Loader itself is still made. On 26.3 you use the normal **Fabric API** and **Fabric Language Kotlin**.
- **Quilt Loader 0.30.2 or newer.** Quilt Loader tells mods which Fabric Loader version it stands in for, and LeiCraft Client needs Fabric Loader 0.19.5 or newer. Quilt Loader 0.30.2 is the first stable version that matches Fabric Loader 0.19.5. With an older Quilt Loader, the game refuses to start.

## What you need

- A launcher that can create a **Quilt** instance for **Minecraft 26.3**, for example [Prism Launcher](/docs/install/prism-launcher) or the [Modrinth App](/docs/install/modrinth-app). You can also use the Quilt installer from https://quiltmc.org/en/install/ with the official Minecraft Launcher.
- **Quilt Loader** 0.30.2 or newer.
- The **LeiCraft Client** jar from the [download page](/download) or [Modrinth](https://modrinth.com/mod/leicraftclient).
- **Fabric API** for 26.3 from [Modrinth](https://modrinth.com/mod/fabric-api).
- **Fabric Language Kotlin** 1.14.2 or newer from [Modrinth](https://modrinth.com/mod/fabric-language-kotlin).

## Install

::steps{level="3"}
### Create a Quilt 26.3 instance

:::tabs
::::tabs-item{label="Prism Launcher" icon="i-lucide-boxes"}
Click **Add Instance** → **Custom**, pick **26.3**, choose **Quilt** under **Mod Loader** and click **OK**.
::::

::::tabs-item{label="Modrinth App" icon="i-lucide-package"}
Click **Create new instance** → **Custom setup**. Set **Loader** to **Quilt**, the game version to **26.3** and **Loader version** to **Stable**, then click **Create instance**.
::::

::::tabs-item{label="Minecraft Launcher" icon="i-lucide-download"}
Download the Quilt installer from https://quiltmc.org/en/install/ and run it. Choose the client install, Minecraft **26.3** and the newest loader version, and install. It works like the [Fabric installer](/docs/install/fabric): close the launcher first, then start the new Quilt profile once so the `mods` folder is created.
::::
:::

### Check the loader version

Make sure the instance uses Quilt Loader **0.30.2 or newer**. In Prism Launcher and the Modrinth App, the newest stable version is fine.

### Add the three mods

Add **LeiCraft Client**, **Fabric API** and **Fabric Language Kotlin** to the instance's `mods` folder. In Prism Launcher and the Modrinth App, you can use the built-in mod browser, as in the [Prism Launcher](/docs/install/prism-launcher) and [Modrinth App](/docs/install/modrinth-app) guides.

If the mod browser of your launcher hides Fabric mods in a Quilt instance, download the three jars from Modrinth and add them as files.

:::caution
Don't install Quilted Fabric API (QFAPI) or QSL together with Fabric API. On 26.3 you need only the normal Fabric API.
:::

### Start the game

Start the instance. Look for the **LeiCraftClient** button on the title screen, below the Realms button. If you see it, LeiCraft Client is installed.
::

## Next: link your account

You can already see other players' capes and cosmetics. To wear your own, link your Minecraft account: [Link your account](/docs/using/linking).

## Troubleshooting

- **The game stops with an error about missing or incompatible mods.** The error names the missing mod. Most often it is **Fabric Language Kotlin** or **Fabric API**. Add the version for 26.3.
- **The error mentions `fabricloader` or a Fabric Loader version.** Your Quilt Loader is probably older than 0.30.2. Change the instance to the newest stable Quilt Loader.
- **Something else breaks.** Try the same mods on [Fabric](/docs/install/fabric). If it works there and not on Quilt, please tell us on [Discord](https://discord.com/invite/3cdazADhtv).

More help: [Troubleshooting](/docs/using/troubleshooting).
