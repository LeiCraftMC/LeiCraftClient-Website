---
title: Troubleshooting
description: Fixes for the most common problems — the game won't start, linking fails, your cape doesn't show, and where to find the log.
---

Find your problem below. If nothing helps, ask on [Discord](#get-help) and bring your log file.

## The game doesn't start

### A mod is missing or too old

LeiCraft Client needs three other things. If one is missing or too old, Fabric Loader doesn't start the game. Instead it shows an error that names what's wrong. Look for these names:

| Name in the error | Fix |
| --- | --- |
| `fabric-language-kotlin` | Install **Fabric Language Kotlin** 1.14.2 or newer from [Modrinth](https://modrinth.com/mod/fabric-language-kotlin). This is the one people forget. |
| `fabric-api` | Install **Fabric API** for 26.3 from [Modrinth](https://modrinth.com/mod/fabric-api). |
| `fabricloader` | Your Fabric Loader is too old. Install **0.19.5** or newer. |
| `minecraft` | Wrong Minecraft version. This release of LeiCraft Client needs exactly **26.3**. |

Always download the file for **Minecraft 26.3** and **Fabric**. Keep only one file of each mod in the `mods` folder, and delete old LeiCraft Client files after an update. All versions are listed in [Requirements](/docs/getting-started/requirements).

### The game crashes

Save `logs/latest.log` ([where to find it](#find-the-log-file)) and ask on Discord.

## The LeiCraftClient button is missing

- Check that you started the right profile or instance, and that the mod is in **its** `mods` folder.
- The button goes below the Realms button (or Mod Menu's **Mods**). Mods that rebuild the title screen can hide it. Then use the button in the pause menu, or the [commands](/docs/using/in-game#commands).

## Account status problems

The options screen and `/leicraftclient status` show your account status.

| Status | What to do |
| --- | --- |
| Offline account — linking unavailable | You play with an offline (cracked) account. Linking and the wardrobe need a real Microsoft account. You still see everyone's capes. |
| Account services are off | Turn the **Account** switch ON in the **LeiCraftClient** options. |
| Connecting… (for a long time) | Check your internet connection. To sign in again, turn the **Account** switch OFF and ON. |
| Error: Mojang rejected the session (restart the launcher) | Close the game and your launcher, start them again, and sign in to your Microsoft account if asked. |
| Error: Mojang session servers are unavailable | Mojang's servers have a problem. Wait a bit, then click **Retry**. |
| Error: API unreachable: … | The game can't reach the LeiCraft Client server. Check your internet. A firewall, antivirus or school network may block it. Try again later. |

"Can't reach the LeiCraft Client API: …" in the wardrobe means the same as the last row.

## Linking doesn't work

| Problem | What to do |
| --- | --- |
| "The link expired. Use "Link account" again to get a new one." | The link was older than 10 minutes. Click **Link account** again. |
| The website says **This link doesn't work** | The link expired or was already used. Make a new one in the game. |
| The website says **Already linked** | This Minecraft account belongs to another LeiCraft Client account. Unlink it there first, or click **Unlink** in the game. |
| "You can link at most 5 Minecraft accounts" | Unlink an account you don't use on [Minecraft accounts](/dashboard/accounts). |
| The browser didn't open | Click the link the mod posted in the chat. |
| The game doesn't show **Linked as …** | It takes a few seconds. If you closed the game in between, start it again. |

More about linking: [Link your account](/docs/using/linking).

## I don't see my cape

Go through this list from top to bottom:

1. **Are you linked?** The **LeiCraftClient** options show **Linked as …**.
2. **Did you save?** On the website, the wardrobe only changes your look after you click **Save**. The **Equip on …** button in the shop saves at once.
3. **Right account?** Every Minecraft account has its own loadout. In the [wardrobe](/dashboard/wardrobe), pick the account you play with.
4. **Custom capes is ON** in the **LeiCraftClient** options.
5. **Minecraft's own cape switch is ON:** in Minecraft's options, open **Skin Customization** and check **Cape**. It hides LeiCraft capes too.
6. **Give it time.** A change from the website reaches the game within about 10 minutes. Click **Reload capes & cosmetics** to load it now.
7. **Check the website:** open `https://client.leicraftmc.de/players/` followed by your Minecraft name. If your cape is listed under **Wearing**, your save worked.

### Other players don't see it

- They need LeiCraft Client too. Players without it see your normal skin.
- Their game also waits up to about 10 minutes before it asks again. They can click **Reload capes & cosmetics**.
- Another cape mod or client may draw its own cape over yours. See [Essential and other cape mods](/docs/clients/other-cape-mods).

An item that moderators took down stops showing for everyone.

### Cosmetics are missing or look wrong

- Check that **Custom cosmetics** is ON in the options.
- The cosmetic sits wrong on your arms? Pick another variant or **Automatic**. See [Variants](/docs/using/wardrobe#variants).
- You can wear at most 10 cosmetics at once.

## "Too many requests — try again in … s"

The LeiCraft Client server limits how often you can do some things. For example, you can create 10 links in 10 minutes for one Minecraft account. Wait for the seconds the message shows, then try again. The mod also waits on its own.

On the website, the inventory says "Too many redeem attempts. Try again later." after 10 codes in 10 minutes.

## Discord doesn't show what I'm playing

- Rich Presence needs the Discord **desktop app**. Discord in the browser can't show it.
- Check that **Discord Rich Presence** is ON in the **LeiCraftClient** options.
- You never see your own buttons. Ask a friend to look at your profile.
- Check that Discord's own privacy settings allow sharing your activity.

## Find the log file

The game writes everything that happens to `logs/latest.log` in your game folder. It is replaced on every start, so copy it right after the problem happened.

- **Minecraft Launcher:** the `.minecraft` folder. On Windows, press :kbd{value="Win"} + :kbd{value="R"}, type `%appdata%\.minecraft` and press :kbd{value="Enter"}.
- **Prism Launcher, Modrinth App, CurseForge and others:** the instance's game folder. Most launchers have a button to open it.

Lines from the mod contain `LeiCraft`, for example `LeiCraft sign-in failed: …`.

::caution
Share `logs/latest.log` when you ask for help, but never `config/leicraftclient-session.json`. That file holds your sign-in token.
::

## Get help

Ask on the [LeiCraftMC Discord](https://discord.com/invite/3cdazADhtv). Tell us:

- what you did and what happened,
- the output of `/leicraftclient status`,
- your launcher and your list of mods,
- and attach `logs/latest.log`.
