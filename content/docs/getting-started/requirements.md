---
title: Requirements
description: The Minecraft version, mod loader and mods that LeiCraftClient needs, and where to download them.
---

LeiCraftClient is a Fabric mod for Minecraft Java Edition. This page lists everything it needs, so you can check your setup before you install it.

## At a glance

| What | Version | Notes |
| --- | --- | --- |
| Minecraft Java Edition | **26.3** | Exactly this version. Other versions can't load this release of the mod. |
| Java | 25 | Minecraft 26.3 needs it. Launchers bring the right Java with them. |
| Fabric Loader | **0.19.5** or newer | The newest stable version is fine. |
| Fabric API | for 26.3 | A separate mod. |
| Fabric Language Kotlin | **1.14.2** or newer | A separate mod, easy to miss. |

Bedrock Edition (phones, consoles, Windows "Minecraft for Windows") can't use mods like this one.

## The three mods to install

You put these three files into your `mods` folder. Always pick the file for **Minecraft 26.3** and **Fabric**.

| Mod | Version | Download |
| --- | --- | --- |
| LeiCraftClient | the latest release | [Download page](/download) or [Modrinth](https://modrinth.com/mod/leicraftclient) |
| Fabric API | the latest for 26.3 | [Modrinth](https://modrinth.com/mod/fabric-api) |
| Fabric Language Kotlin | 1.14.2 or newer | [Modrinth](https://modrinth.com/mod/fabric-language-kotlin) |

::warning
**Fabric Language Kotlin is the one people forget.** LeiCraftClient is written in Kotlin, and this mod brings the Kotlin runtime. It is not bundled with LeiCraftClient, and no other mod installs it for you. Version 1.14.1 also exists for 26.3, but it is too old: you need **1.14.2** or newer.
::

If one of them is missing or too old, the game doesn't start. Fabric Loader shows an error that names the missing mod. See [Troubleshooting](/docs/using/troubleshooting).

The [download page](/download) has the newest LeiCraftClient release and every older release with its changelog. Once the mod is installed, it tells you about new releases on its options screen.

## Mod loader

LeiCraftClient is built and tested for **Fabric**. Other loaders:

| Loader | Works? | Guide |
| --- | --- | --- |
| Fabric | Yes | [Fabric installer](/docs/install/fabric), or any launcher below |
| Quilt | Should work, not officially tested | [Quilt](/docs/install/quilt) |
| NeoForge | Not for 26.3 yet | [NeoForge](/docs/install/neoforge) |
| Forge | No | Nothing can run Fabric mods on current Forge versions. |

To use LeiCraftClient inside another client (Lunar Client, LabyMod and others), see the [client compatibility overview](/docs/clients/overview).

## Java

Minecraft 26.3 needs Java 25. You usually don't have to install it yourself: the official Minecraft Launcher and the big launchers (Modrinth App, Prism Launcher, CurseForge) bring their own Java or download it for you.

You only need your own Java to run the Fabric installer `.jar` on macOS or Linux. See [Install with the Fabric installer](/docs/install/fabric).

## Accounts

What you need depends on what you want to do:

- **To see capes and cosmetics:** nothing extra. Install the mod and play.
- **To wear your own:** a LeiCraftClient account and a linked Minecraft account.
  - Your LeiCraftClient account is your **Discord account**. You log in on the website with Discord, so there is no password. When you log in for the first time, you also join the LeiCraftMC Discord server.
  - You can link up to **5 Minecraft accounts**. Each one has its own cape and cosmetics.
  - The Minecraft account must be a real (premium) Java account. Offline or cracked accounts can't link, but they still see everyone's capes.

See [Link your account](/docs/using/linking) for the steps.

## Servers

Servers need nothing. LeiCraftClient is client-side only, so it works on any server and in singleplayer. There is no plugin or server mod to install.

Other players only see your cape if they use LeiCraftClient too. Players without it see your normal skin.

## Optional mods

- **Mod Menu**: not needed. If you have it, the **LeiCraftClient** button on the title screen moves below Mod Menu's **Mods** button.
