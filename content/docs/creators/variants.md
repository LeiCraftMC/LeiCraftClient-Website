---
title: Skin-model variants
description: Make one cosmetic fit wide (Steve) and slim (Alex) arms, or offer several looks, with variants.
---

Minecraft skins come in two body models: **wide arms** (Steve, 4 pixels wide) and **slim arms** (Alex, 3 pixels wide). An arm item made for one type floats next to the arm or sinks into it on the other. Variants fix this: you upload one model per skin type, and LeiCraft Client picks the right one for each player automatically.

## What a variant is

Every cosmetic has **at least one** and **up to 8** variants. In the item editor, a variant has these fields:

| Field | What it is |
| --- | --- |
| **Name** | Shown to players when they pick a variant (up to 32 characters) |
| **Fits** | **Any skin**, **Wide arms (Steve)** or **Slim arms (Alex)** |
| **Order** | Lower numbers come first |
| **Model** | The exported Blockbench model (`.cfg`) |
| **Texture** | The PNG texture for this model |

Each variant has its own model and texture. Variants can share the same texture file if only the model differs.

## Which variant a player sees

The website and the mod use the same rule:

1. The variant the player picked in their wardrobe, if they picked one.
2. Otherwise, the first variant made for the player's skin model (**Wide arms (Steve)** or **Slim arms (Alex)**).
3. Otherwise, the first **Any skin** variant.
4. Otherwise, the first variant.

"First" means the lowest **Order**. Players can override the automatic choice: on the website in the wardrobe or on the item's shop page (**Automatic** or a variant), and in-game with the **Variant: …** button in the wardrobe. See [Wardrobe](/docs/using/wardrobe).

## Which setup do I need?

| Your cosmetic | Variants |
| --- | --- |
| Doesn't touch the arms (hat, backpack, wings, boots) | One variant, **Fits: Any skin** |
| Sits on the arms (bracelets, gloves, shoulder pads) | Two variants: **Wide arms (Steve)** and **Slim arms (Alex)** |
| Different looks, for example colors | Several **Any skin** variants with clear names. The lowest **Order** is the default. |

::tip
For an arm item you can also use **Any skin** for the wide version and add a **Slim arms (Alex)** variant. Wide-arm players then get the **Any skin** variant, and slim-arm players get theirs.
::

When you add variants, the Creator Studio makes suggestions. The first variant is called **Default** and fits **Any skin**. The next one suggests a wide or slim variant. You can change all of them.

## Make a slim version

::steps{level="3"}
### Finish the wide version

Build the item for wide (Steve) arms first, then export the model and save the texture.

### Make a copy

Save a copy of your Blockbench project, so you can change it without breaking the wide version.

### Adjust the arm parts

On slim skins, the arm is 3 pixels wide instead of 4. The missing pixel is on the outer side of the arm. Move parts on the outside of the arm 1 pixel toward the body, and make parts that go around the arm (bracelets, sleeves) 1 pixel narrower.

### Export and upload

Export the slim model and add it as a second variant with **Fits: Slim arms (Alex)**.
::

## Preview your variants

The 3D preview in the item editor shows your variants on the skin of your first linked Minecraft account.

- Click **Preview** on a variant to show it. If the variant is made for one arm type, the mannequin switches to that arm type.
- Use the **Wide arms** / **Slim arms** button to switch the arm type yourself. Without a pinned variant, the preview then uses the same automatic rule as the game.
- The preview **shows saved variants**. Click **Add variant** or **Save variant** first.

## Changing variants later

- Each variant saves on its own with **Save variant**.
- **Delete** removes a variant. Players who picked it go back to the automatic choice. You can't delete the last variant of a published item or an item in review. Unpublish or withdraw it first.
- On a community page, adding, changing or deleting a variant of a published item sends the item back to review. See [How the review works](/docs/creators/overview#how-the-review-works).
