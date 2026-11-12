---
title: Cape textures
description: The cape texture format for LeiCraftClient: allowed sizes, the 64×32 layout, the elytra area and HD capes.
---

A cape is a single PNG image in the standard Minecraft cape layout, the same layout that OptiFine capes use. If you already have a 2:1 cape made for Minecraft or OptiFine, it most likely works as it is. If your file is a cropped cape that is smaller than 64×32 but uses the same pixel layout, place it in the top-left corner of an empty 64×32 image first.

## The format at a glance

- **PNG** only.
- **2:1 aspect ratio** (twice as wide as high).
- The **width must be a multiple of 64**: from **64×32** (standard) up to **2048×1024**.
- At most **2 MB** per file.

The Creator Studio shows this as a hint next to the upload button: **PNG, 2:1 (64×32 up to 2048×1024)**. Files that don't match are rejected with an error that names the size you uploaded.

| Size | Scale | Notes |
| --- | --- | --- |
| 64×32 | 1× | Standard Minecraft cape size |
| 128×64 | 2× | |
| 256×128 | 4× | |
| 512×256 | 8× | |
| 1024×512 | 16× | |
| 2048×1024 | 32× | Largest allowed size |

Other widths that are a multiple of 64 work too (for example 192×96).

## Layout on 64×32

In the game, the cape is a box that is 10 pixels wide, 16 pixels high and 1 pixel thick. Its six sides are unfolded in the top-left corner of the texture. The elytra uses a second area to the right.

```text
x = 0  1           11 12          22
       +-----------+-----------+
       |    top    |  bottom   |                y = 0
   +---+-----------+---+-------+---+
   | s |           | s |           |
   | i |  face 1   | i |  face 2   |            y = 1 to 16
   | d |  10 x 16  | d |  10 x 16  |
   | e |           | e |           |
   +---+-----------+---+-----------+

   Elytra: from x = 22, y = 0 to x = 46, y = 22 (to the right of the cape)
   Not to scale. Use the table below for exact pixels.
```

| Part | Top-left pixel (x, y) | Size (width × height) |
| --- | --- | --- |
| Top edge | 1, 0 | 10 × 1 |
| Bottom edge | 11, 0 | 10 × 1 |
| Side edge | 0, 1 | 1 × 16 |
| Big face 1 | 1, 1 | 10 × 16 |
| Side edge | 11, 1 | 1 × 16 |
| Big face 2 | 12, 1 | 10 × 16 |
| Elytra (both wings) | 22, 0 | 24 × 22 |

Everything outside these areas is not used. You can leave it transparent.

One big face is the back side that you see behind the player, the other is the inside that faces the player's back. Paint both, then check which one is which in the 3D preview of the Creator Studio before you publish.

::tip
The thin edges (top, bottom and sides) are only 1 pixel wide, but you see them when the cape swings. Give them a color that matches the faces next to them.
::

## HD capes

For a bigger texture, multiply every coordinate and size from the table by the scale (width ÷ 64). For example, on a **128×64** cape (scale 2):

- Big face 1 starts at (2, 2) and is 20 × 32 pixels.
- The elytra goes from (44, 0) to (92, 44).

Keep the 2:1 ratio. A texture like 128×128 is rejected.

## The elytra

When a player wears an elytra, it uses the cape texture, like in vanilla Minecraft. Both wings use the same area of the texture, one of them mirrored.

::warning
If you leave the elytra area empty, the elytra of players who wear your cape can look empty or see-through. Paint the elytra area too, even if you mainly design the cape.
::

Check the elytra before you publish. The 3D preview in the item editor has an **Elytra** button. On a published item's shop page, the preview has **Show as elytra**.

## How the cape shows in-game

- The mod hands the cape to Minecraft like a normal cape. Minecraft's own cape setting in the skin customization options hides and shows it, and it moves like any vanilla cape.
- At the time of writing, capes are still images. The mod has no cape animation.
- Players without LeiCraftClient don't see your cape.

## Templates and tools

You can paint capes in any image editor that saves PNG with transparency, for example GIMP, Krita, Aseprite, Paint.NET or Photoshop. Start from an empty 64×32 image (or a bigger 2:1 size), and turn off smoothing or anti-aliasing so the pixels stay sharp.

When the texture is ready, continue with [Upload and publish](/docs/creators/uploading).
