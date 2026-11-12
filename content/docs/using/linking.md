---
title: Link your Minecraft account
description: Connect a Minecraft account to your LeiCraft Client account so you can wear capes and cosmetics. It starts in the game and takes under a minute.
---

Linking connects a Minecraft account to your LeiCraft Client account (your Discord account). You need it to wear capes and cosmetics. You don't need it to *see* other players' capes.

## Before you start

- The mod is installed, and you start the game with your **Microsoft account**. See the [Quick start](/docs/getting-started/quick-start) if you're not there yet.
- You have a Discord account. You log in to the website with it.
- Linking always starts in the game. This way, only the owner of a Minecraft account can link it.

## Link your account

::steps{level="3"}
### Start the link in the game

Pick one of these two ways:

- Click **LeiCraftClient** on the title screen or in the pause menu, then click **Link account**.
- Or type `/leicraftclient link` in the chat.

The mod creates a one-time link. Minecraft asks if it may open the link in your browser. The mod also posts the link in the chat (the line starts with `[LeiCraft]`), so you can click it later. The link is valid for **10 minutes**.

### Log in on the website

The link opens the LeiCraft Client website. If you're not logged in yet, click **Continue with Discord**. After the login, you come back to the link page.

### Check and confirm

The page shows the head, name and UUID of the Minecraft account, and asks if you want to link it to your LeiCraft Client account. Check that it's your Minecraft account and your Discord name. Then click **Link account**.

The page now says **Linked!** and offers **Open wardrobe** and **Browse the shop**.

### Go back to the game

You don't need to click anything in the game. The mod checks every few seconds on its own. A message pops up ("Account linked"), and the options screen shows **Linked as …** with your name.
::

::warning
Only confirm a link that you started yourself in the game. If someone else sends you a link, don't confirm it.
::

### While the game waits

Until you confirm, the options screen shows "Waiting for confirmation on the website…", and the **Link account** button turns into **New link**. **New link** makes a fresh link. The old one stops working.

### If the link expired

After 10 minutes, the chat says: "The link expired. Use "Link account" again to get a new one." An old or already used link opens a page that says **This link doesn't work**. Every link works only once, so just start a new one in the game.

## More than one Minecraft account

You can link up to **5 Minecraft accounts** to one LeiCraft Client account. Start the game with each account and link it the same way.

- Every Minecraft account has its **own loadout**: its own cape and cosmetics.
- All of them share **one wardrobe**, so everything you saved or own is there for every account. See [Wardrobe](/docs/using/wardrobe).
- If you already have 5, the website says "You can link at most 5 Minecraft accounts". Unlink one first.

Your linked accounts are on [Minecraft accounts](/dashboard/accounts) in the dashboard. Each one has a **Wardrobe** button and an **Unlink** button. The badge **Uses the client** means the account used the mod in the last 30 days.

## Unlink an account

Unlinking takes off the cape and cosmetics that this Minecraft account wears. Your wardrobe stays as it is, because the items belong to your LeiCraft Client account. You can link the account again at any time.

::tabs
:::tabs-item{label="On the website" icon="i-lucide-globe"}
1. Open [Minecraft accounts](/dashboard/accounts).
2. Click **Unlink** next to the account.
3. Type `DELETE` to confirm and click **Unlink account**.
:::

:::tabs-item{label="In the game" icon="i-lucide-gamepad-2"}
1. Start the game with the Minecraft account you want to unlink.
2. Open **LeiCraftClient** and click **Unlink**.
3. Minecraft asks "Unlink your LeiCraft Client account?". Confirm it.
4. A message says "Account unlinked".
:::
::

### Move an account to another Discord account

A Minecraft account can only belong to one LeiCraft Client account. If it's already linked to another one, the link page shows **Already linked**, and the game says "This Minecraft account is already linked." Unlink it first (in the game, or on the website with the other Discord account). Then log in with the new Discord account and link again.

## Offline accounts can't link

Offline (cracked) accounts can't sign in to LeiCraft Client. The options screen shows "Offline account — linking unavailable", and **Link account** is greyed out. These accounts still see the capes and cosmetics of everyone else.

If the options screen says "Account services are off", turn on the **Account** switch in the same screen. See [In-game features](/docs/using/in-game).

## Is this safe?

- The mod proves that you own the Minecraft account the same way a server does when you join it: through Mojang's session server. Your Minecraft access token never leaves the game, and you never type your Microsoft password anywhere.
- After that, the mod gets its own LeiCraft Client token. It is valid for 7 days and saved in `config/leicraftclient-session.json` in your game folder.
- The website login only reads your Discord username, display name and avatar.

::caution
Keep `config/leicraftclient-session.json` private. Leave it out when you share your game folder, instance or modpack with others.
::

Something went wrong? See [Troubleshooting](/docs/using/troubleshooting).
