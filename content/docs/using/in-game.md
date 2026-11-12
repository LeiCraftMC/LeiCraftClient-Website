---
title: In-game features
description: The LeiCraftClient options screen, the /leicraftclient commands, the tab-list badge, Discord Rich Presence, update notices and the config file.
---

Everything the mod adds to the game is on one options screen and in one chat command. This page explains every button and setting.

## Open the options screen

- **Title screen:** click **LeiCraftClient** below the Realms button. If you use Mod Menu, the button sits below **Mods**.
- **Pause menu:** press :kbd{value="Esc"} in a world. **LeiCraftClient** sits directly above **Mods** (with Mod Menu) or above Minecraft's options button.

## The options screen

From top to bottom:

| Button or line | What it does |
| --- | --- |
| **Version …** | The version of the mod you are running. |
| **Update available: …** | Only shows when there is a newer release. Opens its release page. See [Update notice](#update-notice). |
| **Custom capes** (ON/OFF) | Shows LeiCraft capes on players. When OFF, you only see normal Minecraft capes. |
| **Custom cosmetics** (ON/OFF) | Shows 3D cosmetics on players. |
| **Discord Rich Presence** (ON/OFF) | Shows on Discord what you are playing. See [Discord Rich Presence](#discord-rich-presence). |
| **Reload capes & cosmetics** | Loads everyone's capes and cosmetics again now, instead of waiting. Use it after you changed your look on the website. |
| **LeiCraft Client account** | The account section: a status line and the buttons below. |
| **Link account** / **New link** | Starts [linking](/docs/using/linking). While the game waits for you on the website, it reads **New link** and makes a fresh link. |
| **Wardrobe** | Opens the in-game [wardrobe](/docs/using/wardrobe). Greyed out until your account is linked. |
| **Unlink** | Unlinks this Minecraft account (after you confirm). Only shows when it is linked. |
| **Retry** | Only shows after an error. Tries to sign in again. |
| **Account** (ON/OFF) | Signs in to LeiCraft Client with your Minecraft session. Linking and the wardrobe need it. When OFF, the mod only shows other players' capes and cosmetics. |
| **Open website** | Opens the LeiCraft Client website in your browser. |
| **Done** | Closes the screen. |

The switches only change what **you** see. Turning off **Custom capes** doesn't hide your cape from other players. Every change is saved at once in the [config file](#config-file).

### The account status line

Below **LeiCraft Client account** you see one of these lines:

| Status | Meaning |
| --- | --- |
| Linked as … | Signed in and linked. The name is your LeiCraft Client (Discord) name. |
| Not linked | Signed in, but not linked yet. Click **Link account**. |
| Waiting for confirmation on the website… | A link is open. Confirm it in your browser. |
| Connecting… | The mod is signing in. This happens on its own after the game starts. |
| Offline account — linking unavailable | Offline (cracked) accounts can't sign in or link. |
| Account services are off | The **Account** switch is OFF. |
| Error: … | Signing in failed. Click **Retry**, or see [Troubleshooting](/docs/using/troubleshooting). |

## Commands

The `/leicraftclient` commands run on your own computer. They are never sent to the server, so they work on every server and in singleplayer.

| Command | What it does |
| --- | --- |
| `/leicraftclient` or `/leicraftclient status` | Shows your account status, and your Minecraft name and UUID when you are signed in. |
| `/leicraftclient link` | Starts linking and posts the link in the chat. If you are already linked, it shows **Linked as …**. |
| `/leicraftclient wardrobe` | Opens the wardrobe. Needs a linked account. |

Messages the mod writes to the chat on its own, like the link, start with `[LeiCraft]`.

## Tab-list badge

Players who used LeiCraft Client in the last 30 days get the LeiCraft mark in front of their name in the tab list. You only see the badge if you have the mod.

The badge doesn't depend on capes or cosmetics. It comes from the mod signing in, so you get it with a real Microsoft account and the **Account** switch ON. You don't have to link for it.

## Discord Rich Presence

With the Discord **desktop app** running, your Discord profile shows what you are doing:

| Where you are | What Discord shows |
| --- | --- |
| Menus | "In the Main Menu" |
| Singleplayer | "Playing Singleplayer" and the world name |
| A server | "Playing" and the server's name from your server list (or "Playing Multiplayer"), plus the player count |

It also shows how long you've been there, the LeiCraft logo, and two buttons: **View Profile** (your player page on the website) and **Download Client**.

- The server's address is never sent to Discord, only the name from your server list.
- Discord hides presence buttons from yourself. Your friends see them.
- Discord in the browser can't show it. If you start the desktop app later, the presence appears on its own.

**Turn it off:** set **Discord Rich Presence** to OFF in the options screen. The presence disappears right away, and the mod stops connecting to Discord.

## Update notice

Once per game start, the mod checks for a newer release. If there is one, the options screen shows a green **Update available: …** button below the version line. It opens the release page on the website, where you can download the new version.

The mod doesn't update itself. Download the new file and put it in your `mods` folder instead of the old one, so that only one LeiCraft Client file is in there. A stable version is only offered stable releases.

## Window title

The game window's title starts with **LeiCraftClient** and the mod version, followed by Minecraft's normal title, for example `LeiCraftClient <version> | Minecraft* 26.3`. If another mod changes the title, LeiCraft Client leaves it alone.

## Config file

The settings are saved in `config/leicraftclient.json` inside your game folder (in launchers like Prism Launcher or the Modrinth App, that's the instance's game folder). The mod creates it on the first start. The options screen covers the usual settings, so you rarely need to edit this file. If you do, close the game first.

```json
{
  "apiBaseUrl": "https://api.client.leicraftmc.de",
  "websiteUrl": "https://client.leicraftmc.de",
  "capesEnabled": true,
  "cosmeticsEnabled": true,
  "accountServicesEnabled": true,
  "cacheSeconds": 600,
  "discordRichPresenceEnabled": true,
  "discordAppId": "1006198534581796945"
}
```

| Key | Default | Meaning |
| --- | --- | --- |
| `capesEnabled` | `true` | **Custom capes** |
| `cosmeticsEnabled` | `true` | **Custom cosmetics** |
| `discordRichPresenceEnabled` | `true` | **Discord Rich Presence** |
| `accountServicesEnabled` | `true` | **Account** |
| `cacheSeconds` | `600` | How many seconds the mod keeps a player's capes and cosmetics before it asks again. At least `30`. |
| `websiteUrl` | `https://client.leicraftmc.de` | The website the mod's buttons open. |
| `apiBaseUrl` | `https://api.client.leicraftmc.de` | The LeiCraft Client server. Don't change it. |
| `discordAppId` | `1006198534581796945` | The Discord app for Rich Presence. Don't change it. |

If a value is broken, the mod uses the default. Missing keys are written back on the next start.

The mod writes two more things:

- `config/leicraftclient-session.json` holds your sign-in token. Keep it private and don't share it.
- `leicraftclient/cache/assets/` holds downloaded capes and models. You can delete it safely. The mod downloads them again.
