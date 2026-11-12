---
title: Essential and other cape mods
description: How LeiCraft capes and cosmetics share the player with Essential and other cape or cosmetic mods installed side by side.
---

LeiCraftClient is a normal Fabric mod, so you can install it next to other mods — including mods with their own capes and cosmetics, like Essential. This page explains how they share the player, and what to do when two of them want the same spot.

## How LeiCraftClient shows capes and cosmetics

**Capes** go into the player's skin data — the same place a normal Minecraft cape comes from. So Minecraft itself handles the cape:

- The **Cape** toggle under **Options → Skin Customization** hides and shows it, like a normal cape.
- Elytra use it: an elytra without its own texture shows the cape, as in vanilla.
- It moves and sits like a normal cape, also with a chestplate.
- For players with LeiCraftClient, a LeiCraft cape takes the place of the player's normal Minecraft cape.

**Cosmetics** are drawn as an extra layer on top of the player model. They follow the head, body, arms and legs, and they don't replace anything — so they can show next to another mod's cosmetics.

Two buttons in the LeiCraftClient options control what *you* see:

- **Custom capes** — turns LeiCraft capes on or off on your screen.
- **Custom cosmetics** — turns LeiCraft cosmetics on or off on your screen.

Turning them off doesn't hide your own cape from others: players with LeiCraftClient still see it. See [In-game options](/docs/using/in-game) for the full options screen.

## When two mods want the cape slot

A player has only one cape. If another mod or client also puts a cape on players, both write to the same slot, and **whichever applies last wins**. Which one that is depends on the mods, so you can't tell without trying. To decide it yourself:

- **To show your LeiCraft cape**, hide or take off the other mod's cape for yourself.
- **To see the other mod's capes**, turn off **Custom capes** in the LeiCraftClient options.

Cosmetics don't compete like that. LeiCraft cosmetics and another mod's cosmetics can show at the same time — they just overlap if both sit in the same spot, like two hats.

## Essential

[Essential](https://modrinth.com/mod/essential) is a normal Fabric mod, and builds for Fabric 26.3 exist (the latest we saw was from 2 November 2026). You can install it next to LeiCraftClient.

Essential has its own capes and cosmetics, and it has covered up other mods' capes before: its changelog once listed a fix for "capes from Capes Mod not appearing with Essential installed". If your LeiCraft cape doesn't show while Essential is installed:

1. Take off your Essential cape, or
2. Use Essential's setting that hides your Essential cosmetics — for yourself and for others.

If it still doesn't show, click **Reload capes & cosmetics** in the LeiCraftClient options.

## Mods that change how capes look

Some mods change how capes are drawn — for example, with physics so they wave. Such a mod may change how LeiCraft capes look too. Check that mod's own page for which clients it supports: Wavey Capes, for example, lists Lunar Client as not supported.

Mods that show capes from other cape services can compete for the same slot, so the rule above applies: whichever applies last wins.

## Clients with their own capes

Lunar Client, LabyMod, Dawn and NoRisk Client have their own cape systems. Each one shows only to players of that client, just as LeiCraft capes show only to players with LeiCraftClient. The client pages explain how to pick a cape there:

- [Lunar Client](/docs/clients/lunar-client)
- [LabyMod](/docs/clients/labymod)
- [Dawn (formerly Feather Client)](/docs/clients/dawn)
- [NoRisk Client](/docs/clients/norisk-client)

## Quick checks

::accordion
:::accordion-item{label="My cosmetics show, but my LeiCraft cape doesn't." icon="i-lucide-circle-help"}
Another mod or client probably wins the cape slot. Take off that mod's cape for yourself. Also check that **Cape** is on under **Options → Skin Customization** — turning it off hides LeiCraft capes too.
:::

:::accordion-item{label="I see someone's LeiCraft cape, but they see a different one." icon="i-lucide-circle-help"}
That's normal. Each of you sees the capes of the systems you have installed. They may have another cape mod that wins on their screen.
:::

:::accordion-item{label="Nothing from LeiCraftClient shows at all." icon="i-lucide-circle-help"}
Check that **Custom capes** and **Custom cosmetics** are on in the LeiCraftClient options, then follow [Troubleshooting](/docs/using/troubleshooting).
:::
::

## Next: link your account

To wear a cape, [link your Minecraft account](/docs/using/linking) to your LeiCraftClient account.

Something not working? See [Troubleshooting](/docs/using/troubleshooting).
