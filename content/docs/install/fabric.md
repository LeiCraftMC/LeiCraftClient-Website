---
title: Install with the Fabric installer
description: Set up Fabric for Minecraft 26.3 in the official Minecraft Launcher, then add LeiCraftClient and its two dependencies.
---

This is the official way to play with Fabric mods in the normal Minecraft Launcher. The Fabric installer adds a Fabric profile to the launcher, and you put the mods into the `mods` folder yourself.

## What you need

- The official **Minecraft Launcher** with Minecraft Java Edition.
- The **LeiCraftClient** jar from the [download page](/download) or [Modrinth](https://modrinth.com/mod/leicraftclient).
- **Fabric API** for 26.3 from [Modrinth](https://modrinth.com/mod/fabric-api).
- **Fabric Language Kotlin** 1.14.2 or newer from [Modrinth](https://modrinth.com/mod/fabric-language-kotlin).

When you download Fabric API and Fabric Language Kotlin, pick a file made for **Minecraft 26.3** and **Fabric**. All versions are listed in [Requirements](/docs/getting-started/requirements).

## Install

::steps{level="3"}
### Download the Fabric installer

Go to https://fabricmc.net/use/installer/ and download the installer for your system.

:::tabs
::::tabs-item{label="Windows" icon="i-lucide-monitor"}
Click **Download for Windows**. You get an `.exe` file, and you don't need Java for it.
::::

::::tabs-item{label="macOS" icon="i-lucide-apple"}
Click **Download installer (Universal/.JAR)**. You get a `.jar` file. To open it, Java must be installed on your Mac (for example Eclipse Temurin from https://adoptium.net).
::::

::::tabs-item{label="Linux" icon="i-lucide-terminal"}
Click **Download installer (Universal/.JAR)**. You get a `.jar` file. To run it, Java must be installed (for example the OpenJDK package of your distribution).
::::
:::

### Close the Minecraft Launcher

Close the launcher completely before you install. Otherwise it may not notice the new profile.

### Run the installer

:::tabs
::::tabs-item{label="Windows" icon="i-lucide-monitor"}
Double-click the `.exe` file you downloaded.
::::

::::tabs-item{label="macOS" icon="i-lucide-apple"}
Double-click the `.jar` file. If macOS blocks it, open **System Settings** › **Privacy & Security**, scroll down and click **Open Anyway**, then open the file again.
::::

::::tabs-item{label="Linux" icon="i-lucide-terminal"}
Open a terminal in the folder with the download and run the installer. Use the exact file name you downloaded (it contains a version number):

```bash
cd ~/Downloads
java -jar fabric-installer.jar
```
::::
:::

### Choose the settings

1. Stay on the **Client** tab.
2. **Minecraft Version:** choose **26.3**. Leave **Show snapshots** off.
3. **Loader Version:** leave the newest version. Any version from 0.19.5 up works.
4. **Launcher Location:** leave the default, unless you moved your `.minecraft` folder.
5. Keep **Create profile** checked.
6. Click **Install**.

On Windows, the installer may ask which Minecraft Launcher you use: **Microsoft Store / Xbox** or **Standalone (Win32)**. Pick the one you installed. If you got the launcher from the Microsoft Store or the Xbox app, choose the first one.

### Start Fabric once

1. Open the Minecraft Launcher.
2. In the version dropdown at the bottom left, choose **fabric-loader-26.3**.
3. Click **Play** and wait until the title screen appears. Then quit the game.

This first start downloads Minecraft 26.3 and creates the folders you need next.

### Open the mods folder

:::tabs
::::tabs-item{label="Windows" icon="i-lucide-monitor"}
Press :kbd{value="Win"} + :kbd{value="R"}, type the path below and press :kbd{value="Enter"}.

```text
%appdata%\.minecraft\mods
```
::::

::::tabs-item{label="macOS" icon="i-lucide-apple"}
In Finder, choose **Go** › **Go to Folder…**, type the path below and press :kbd{value="Return"}.

```text
~/Library/Application Support/minecraft/mods
```
::::

::::tabs-item{label="Linux" icon="i-lucide-terminal"}
Open this folder in your file manager:

```text
~/.minecraft/mods
```
::::
:::

If the `mods` folder doesn't exist, open the folder above it (`.minecraft`, or `minecraft` on macOS) and create a folder named exactly `mods` in it.

### Add the three mods

Copy these three `.jar` files into the `mods` folder:

- the LeiCraftClient jar,
- Fabric API,
- Fabric Language Kotlin.

Don't unzip them. If an older LeiCraftClient jar is already there, delete it, so only one version is in the folder.

### Start the game

Open the Minecraft Launcher, choose **fabric-loader-26.3** again and click **Play**. Look for the **LeiCraftClient** button on the title screen, below the Realms button. If you see it, LeiCraftClient is installed.
::

## Next: link your account

You can already see other players' capes and cosmetics. To wear your own, link your Minecraft account: [Link your account](/docs/using/linking).

## Troubleshooting

- **The game stops with an error about missing or incompatible mods.** Fabric Loader names the mod that is missing. Most often it is **Fabric Language Kotlin** or **Fabric API**. Download the version for 26.3 and put it into the `mods` folder.
- **There is no LeiCraftClient button.** Check that you started the **fabric-loader-26.3** profile and not the normal release. Check that the LeiCraftClient jar is in the right `mods` folder.
- **The profile doesn't show up in the launcher.** Close the launcher, run the installer again and keep **Create profile** checked.

More help: [Troubleshooting](/docs/using/troubleshooting).
