---
title: Creating capes and cosmetics
description: Who can publish capes and cosmetics on LeiCraftClient, how the moderator review works, and how partner pages differ.
---

Anyone with a LeiCraftClient account can share their own capes and 3D cosmetics. Items on community pages are free for every player, and everyone who uses the mod sees them in-game. This page explains the kinds of shop pages, how the review works and when your items become visible.

## Who can create

- **Everyone** can create **one community page** in the **Creator Studio** at [/dashboard/studio](/dashboard/studio). You log in with Discord, like everywhere else on the website. There is no extra sign-up.
- The **official page** (the LeiCraftClient team's own shop) and **partner pages** are set up by the LeiCraftClient admins. The admins also choose who owns the page. If you are interested in a partner page, ask the team on [Discord](https://discord.com/invite/3cdazADhtv).

| | Community page | Partner page / official page |
| --- | --- | --- |
| Who creates it | You, in the Creator Studio | The LeiCraftClient admins |
| How many | One per user | One official page, one page per partner |
| Who manages it | Only you | Owners and managers |
| Review | Every item, the page profile and the collections are reviewed by a moderator | No review: **Publish** makes an item live immediately |
| Availability | Always free | Free or **Exclusive** |
| Redeem codes and direct gifts | No | Yes, see [Partner pages](/docs/creators/partners) |
| Address in the shop | `/shop/community/<slug>` | `/shop/partner/<slug>` or `/shop/official` |

## What you can make

::card-group
:::card{title="Capes" icon="i-lucide-flag" to="/docs/creators/capes"}
A 2:1 PNG texture in the standard Minecraft cape layout, from 64×32 up to 2048×1024.
:::

:::card{title="Cosmetics with Blockbench" icon="i-lucide-box" to="/docs/creators/blockbench-cosmetics"}
3D items on the head, body, arms or legs, made with the OptiFine Player Models plugin.
:::

:::card{title="Skin-model variants" icon="i-lucide-shapes" to="/docs/creators/variants"}
Make one cosmetic fit both wide (Steve) and slim (Alex) arms.
:::

:::card{title="Upload and publish" icon="i-lucide-upload" to="/docs/creators/uploading"}
The Creator Studio step by step: page, items, collections, review.
:::
::

## How the review works

A moderator looks at everything on a community page before other players can see it. Moderators review each item and can reject it with a note that explains why.

### Items

Every item has a status. You see it as a badge in the item list and in the item editor.

| Status | What it means for you |
| --- | --- |
| **Draft** | Only you can see it in the Creator Studio. Nobody can wear it. New items start here. |
| **In review** | You clicked **Submit for review**. A moderator will look at it. Click **Withdraw** to move it back to drafts. |
| **Published** | Approved. The item is in the shop and players can wear it. |
| **Rejected** | A moderator rejected it. The editor shows their note. Fix the problem and click **Submit for review** again. |
| **Taken down** | A moderator removed the item. It is hidden everywhere and you can't edit it. If you think this is a mistake, contact the team on Discord. |

### Your page profile and collections

The page profile (name, URL slug, description, icon and banner) and your collections are reviewed too.

- When you create your page, it goes into the review queue automatically. The Creator Studio shows **Profile in review**.
- Your page and its items become public only after a moderator approved the page profile **and** the items.
- Until that first approval, your edits apply right away.
- After the first approval, profile and collection edits wait for a moderator. The button in **Page settings** says **Submit changes**, and you see **Changes in review**. The shop keeps showing the approved version until then.
- If a moderator rejects your changes, **Page settings** shows **Your last changes were rejected** with their note. The waiting changes are dropped, so make them again after you fixed the problem.

### Editing something that is already live

::warning
On a community page, changing the **name**, **description**, **images** (cape texture or shop image) or **variants** of a published item sends it back to **In review**. The item is hidden in the shop and in-game until a moderator approves it again. Collect your changes and make them in one go.
::

Changing an item's **Collection**, **Sort order** or **Listed** setting does not need a new review.

## When is something visible?

- An item shows in the shop and in-game only when it is **Published** and its page is public.
- **Listed** is on by default. Unlisted items don't appear in the shop lists, but anyone with the link can still open them.
- After a player equips your item, other LeiCraftClient players see it within a few minutes (the mod caches player profiles for about 10 minutes).
- Players without the mod see vanilla Minecraft. They don't see any LeiCraftClient capes or cosmetics.

## Moderation and reports

- Players can report items, pages and collections with the **Report** button, for example as **Copyright / stolen design** or **Impersonation**. Only upload your own work, or work you have permission to use.
- Moderators can take down any item (status **Taken down**) and hide any page (**Hidden by moderators**). This also applies to partner pages.
- Deleting an item removes it from every wardrobe and inventory. This can't be undone.

## Questions

There are no other written content rules in the Creator Studio at the time of writing. If you are not sure whether something is allowed, or you want to know why an item was rejected, ask on the [LeiCraftClient Discord](https://discord.com/invite/3cdazADhtv).
