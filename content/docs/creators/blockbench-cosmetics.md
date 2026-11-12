---
title: Cosmetics with Blockbench
description: Build 3D cosmetics in Blockbench with the OptiFine Player Models plugin, export them and check them against the upload limits.
---

LeiCraftClient cosmetics are **OptiFine player-item models**: simple 3D boxes attached to a body part, plus a PNG texture. You make them in [Blockbench](https://www.blockbench.net), a free 3D editor for Minecraft models, with the **OptiFine Player Models** plugin.

## What you need

- **Blockbench**, as the desktop app or the web app at [blockbench.net](https://www.blockbench.net). At the time of writing the current version is 5.2.
- The plugin **OptiFine Player Models** by Ewan Howell (installed from inside Blockbench, see below).
- A LeiCraftClient community page to upload to. See [Upload and publish](/docs/creators/uploading).

## Set up Blockbench

::steps{level="3"}
### Install the plugin

In Blockbench, open **File → Plugins…**, switch to the **Available** tab and search for **OptiFine Player Models**. Click **Install**.

### Create a project

Open **File → New** (or use the start screen) and choose **OptiFine Player Model**. Click **Create New OptiFine Player Model**.

### Look at the groups

The new project already contains six groups: `head`, `body`, `leftArm`, `rightArm`, `leftLeg` and `rightLeg`. You can't delete them, and every cube must be inside one of them. The group decides which body part your item is attached to.
::

## Build the model

Add cubes inside the group of the body part your item should follow. You can create your own groups inside these six groups to keep things organized.

| Group | Follows | Ideas |
| --- | --- | --- |
| `head` | Head turning and nodding | Hats, horns, halos, glasses |
| `body` | Body, also when sneaking | Backpacks, wings, scarves |
| `leftArm`, `rightArm` | Arm swinging | Bracelets, shoulder pads, gloves |
| `leftLeg`, `rightLeg` | Leg movement while walking | Boots, leg bands |

An item can use several groups at once, for example a pair of boots on both legs.

### What is not possible

- **No animations.** OptiFine player models are static boxes. Your item still moves with its body part, because it follows the vanilla movement (walking, arm swings, sneaking, head turning). It can't have its own animation.
- **Only these six body parts.** You can't attach anything to the cape, the elytra or an item in the hand.
- **Arms on slim skins:** slim (Alex) arms are 1 pixel narrower than wide (Steve) arms, so arm items made for one arm type don't sit perfectly on the other. Make a second variant for this, see [Skin-model variants](/docs/creators/variants).

### Tips for clean models

- A cube's faces are only drawn from the outside. Flat cubes with a thickness of 0 are visible from both sides, so they work well for thin parts like feathers or flat signs.
- In-game, every texture pixel is either fully visible or fully transparent. Half-transparent pixels don't make glass-like see-through parts.
- Keep the Blockbench project file (`.bbmodel`) so you can edit the model later. You only upload the exported `.cfg` file.

## Paint the texture

The new project uses a **64×64** texture by default. Paint it in Blockbench's **Paint** tab or in any image editor.

- Save the texture as a **PNG** file. In Blockbench, use the texture's right-click menu to save or export it as an image.
- The PNG should have the same size as the texture in your project. A texture with exactly double or four times the size (for example 128×128 for a 64×64 project) also works and gives more detail, because the UVs are scaled to the image.
- The upload accepts textures up to **1024×1024** pixels and **2 MB**.

### Use the player's skin

The plugin has a project option **Use Player Texture** (probably under **File → Project…**, depending on your plugin version). With it, the mod draws the model with the wearer's own skin instead of your texture.

::note
At the time of writing, the 3D preview on the website does not support this option and always shows the texture you uploaded. The Creator Studio still requires a texture for every variant, so upload one anyway, for example a sample skin. Check the real look in-game.
::

## Export the model

Open **File → Export → Export OptiFine Player Model**. Blockbench saves a `.cfg` file (a JSON text file). Save the texture PNG separately: the upload always needs both files.

::note
The plugin has a second export, **Create OptiFine Player Model Config**, which asks for a Minecraft username. That one is for testing with OptiFine on your own computer. You don't need it for LeiCraftClient.
::

## What the exported file looks like

You don't need to edit the file by hand. This shortened example of a Christmas hat shows the structure:

```json
{
  "type": "PlayerItem",
  "credit": "Made with Blockbench",
  "textureSize": [64, 64],
  "models": [
    {
      "type": "ModelBox",
      "attachTo": "head",
      "invertAxis": "xy",
      "translate": [0, 0, 0],
      "submodels": [
        {
          "id": "christmas_hat",
          "invertAxis": "xy",
          "translate": [0, 0, 0],
          "boxes": [
            { "coordinates": [-5, 8, -5, 10, 1, 10], "textureOffset": [0, 0] },
            { "coordinates": [-4, 9, -4, 8, 1, 8], "textureOffset": [0, 11] },
            { "coordinates": [-3, 10, -3, 6, 1, 6], "textureOffset": [0, 20] }
          ]
        }
      ]
    }
  ]
}
```

- `textureSize` is the size of your texture in the project.
- Each entry in `models` is one body-part group. `attachTo` names the body part.
- `boxes` are your cubes: `coordinates` is position and size (`[x, y, z, width, height, depth]`), and `textureOffset` (or one UV per face) says where the cube's texture is.
- `submodels` are the groups you created inside a body-part group.

## Upload limits

| What | Limit |
| --- | --- |
| Model file | JSON (`.cfg` or `.json`), at most 256 KB |
| Body-part groups (`models`) | 1 to 64 |
| Parts (groups and sub-groups) | at most 512 |
| Cubes | at most 2048 |
| Nesting depth of groups | at most 16 levels |
| Texture | PNG, at most 1024×1024 and 2 MB |

When you upload, the model is checked and saved again with only the parts LeiCraftClient understands. A texture path inside the model, `sprites` and any unknown keys are removed. The Creator Studio tells you about each removal in a **Note** message. This is why you always upload the texture as its own file.

## Common upload problems

::accordion
:::accordion-item{label="Model is not valid JSON, or Invalid cosmetic model at textureSize" icon="i-lucide-circle-help"}
You probably picked the wrong file. Upload the file from **Export OptiFine Player Model**, not the Blockbench project (`.bbmodel`) or the texture PNG.
:::

:::accordion-item{label="Invalid cosmetic model … expected number" icon="i-lucide-circle-help"}
Some older, hand-written OptiFine models write numbers in quotes, like `"sizeAdd": "0.1"`. The upload only accepts plain numbers. Remove the quotes (`"sizeAdd": 0.1`), or open the model in Blockbench and export it again.
:::

:::accordion-item{label="Every box needs either textureOffset or all six face UVs" icon="i-lucide-circle-help"}
A cube has no texture position, or it has UVs for only some of its faces. Give every cube a box UV, or a UV on all six faces, and export again.
:::

:::accordion-item{label="Note: uses invertAxis … the website preview may differ" icon="i-lucide-circle-help"}
Blockbench always writes `"invertAxis": "xy"`. Other values usually come from hand-edited models. The upload still works, but the website preview can look different from the game. Check the item in-game.
:::

:::accordion-item{label="The website preview looks different from the game" icon="i-lucide-circle-help"}
At the time of writing, the website preview supports the common parts of the format. Models that use **Use Player Texture**, scaling or mirrored textures can look different there than in-game. The mod in the game is the reference.
:::
::

Next: [make variants for wide and slim arms](/docs/creators/variants) if your item touches the arms, then [upload and publish](/docs/creators/uploading) it.
