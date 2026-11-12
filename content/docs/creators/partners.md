---
title: Partner pages
description: Exclusive items, redeem codes, direct gifts, page members and API keys for partner pages and the official page.
---

Partner pages and the official LeiCraft Client page work like community pages, with a few extras: items go live without a review, and you can make **exclusive** items that only selected players get, through redeem codes or direct gifts. This page explains these extras.

## Getting a partner page

The LeiCraft Client admins create partner pages and choose the owner. If you'd like one, ask the team on [Discord](https://discord.com/invite/3cdazADhtv). You need to have logged in to the website once. The page then shows up in the Creator Studio under **My pages**.

Compared to a community page:

- **Publish** makes an item live immediately. There is no moderator review.
- Items can be **Free** or **Exclusive**.
- The page has two more tabs: **Redeem codes** and **Members**.
- Moderators can still take down items or hide the page.
- Only admins can delete a partner page.

## Members

Open the **Members** tab to see who manages the page with you.

| Role | Can do |
| --- | --- |
| **Manager** | Edits items, collections, codes and grants |
| **Owner** | Also manages the members |

To add someone, click **Add member**, choose **Find user by** (**Discord user id** or **LeiCraft Client user id**), enter the id, pick a **Role** and click **Add**. They need to have logged in to the LeiCraft Client website once.

Only owners can add members, change roles in the list and remove members. An owner can also leave the page with the remove button next to their own name (**Leave page**). Managers who want to leave ask an owner to remove them.

::tip
To copy someone's Discord user id, turn on Developer Mode in Discord's advanced settings, then right-click the user and choose **Copy User ID**.
::

## Exclusive items

In the item editor, set **Availability** to **Exclusive** and click **Save**. Exclusive items are only available through redeem codes and grants.

- Only players who own the item can wear it. Owned exclusives always stay in the owner's wardrobe.
- The shop shows the item with an **Exclusive** badge. Turn off **Listed** if it shouldn't appear in the shop lists at all.
- The files of an exclusive item belong to your page. No other page can use them, even by uploading the same file again.

After you saved an item as exclusive, the editor shows an **Owners** card. See [Direct grants](#direct-grants).

## Redeem codes

Use redeem codes when you don't know the players' accounts yet, for example for giveaways or events.

::steps{level="3"}
### Open the Redeem codes tab

Click **New codes**. You can also click **Redeem codes** in an item's **Owners** card, which selects that item for you.

### Choose the items

Under **Items**, select one or more exclusive items (up to 20). The code gives all of them at once.

### Choose the code type

- **Random codes**: set **How many codes** (1 to 500). Each code gets its own uses.
- **Custom code**: type your own code, for example `SUMMER2026`. It needs 4 to 32 letters, digits or hyphens, and is not case-sensitive.

### Set the limits

- **Uses per code**: how often each code can be redeemed, or **Unlimited**.
- **Expires**: leave it empty for a code that never expires.
- **Note**: only visible to your team, for example who you gave the codes to.

### Click Create

A dialog shows the new codes. Copy single codes or redeem links, use **Copy all**, or download them as **CSV**.
::

Players redeem codes on the website under [Inventory](/dashboard/inventory). A redeem link opens the inventory with the code already filled in. For the player's side, see [Exclusive items and redeem codes](/docs/using/exclusives).

The codes list shows each code's uses and status: **Active**, **Disabled**, **Expired** or **Used up**. The menu of a code has **Copy code**, **Copy redeem link**, **Redemptions** (who redeemed it), **Edit** (uses, expiry and note), **Disable** / **Enable** and **Delete**. When you delete a code, it stops working. Players who already redeemed it keep their items.

## Direct grants

Use a grant to give an exclusive item to one specific player.

1. Open the item and go to the **Owners** card ("Give this item to specific players").
2. Under **Find user by**, choose **Minecraft name**, **Minecraft UUID**, **Discord user id** or **LeiCraft Client user id**.
3. Enter the **User** and, if you like, a **Note** (only visible to your team).
4. Click **Grant**.

The player needs a LeiCraft Client account. A Minecraft name or UUID only works once that Minecraft account is linked. For everyone else, use redeem codes.

The **Owners** list shows everyone who owns the item and whether they got it from a **Code** or a **Grant**. **Revoke** takes the item away again and unequips it from all of their Minecraft accounts.

## API keys for bots

You can automate grants and codes, for example with a Discord bot that rewards your community. For this you need an API key.

::steps{level="3"}
### Create a key

Open [API Keys](/dashboard/apikeys) in the dashboard sidebar (under **Settings**) and click **New API Key**. Enter a **Description** and choose an **Expiration** (7 to 365 days, or **No Expiration**). Click **Create API Key**.

### Copy the key

The key starts with `lcc_apikey_`. It is only shown once, so copy it right away and store it safely.

### Use it

Send the key in the `Authorization` header of your requests to `https://api.client.leicraftmc.de/v1`.
::

For example, this request grants an exclusive item to the player with the linked Minecraft account `Notch`:

```bash
curl -X POST "https://api.client.leicraftmc.de/v1/studio/pages/<pageId>/products/<productId>/owners" \
  -H "Authorization: Bearer lcc_apikey_..." \
  -H "Content-Type: application/json" \
  -d '{"minecraft_name": "Notch", "note": "Giveaway winner"}'
```

Use exactly one of `minecraft_name`, `minecraft_uuid`, `discord_id` or `user_id`. You find the page and item ids in the Creator Studio address bar (`/dashboard/studio/<pageId>/products/<productId>`), and the item editor shows the item id as `#<id>`.

::caution
An API key acts as your account. Anyone who has it can act as you, for example manage your pages in the Creator Studio. Never share it or put it in public code. If a key leaks, delete it on the [API Keys](/dashboard/apikeys) page. Anything using it stops working immediately.
::

All endpoints, including redeem codes, are described in the [API reference](https://api.client.leicraftmc.de/docs/v1).
