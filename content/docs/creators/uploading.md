---
title: Upload and publish
description: Create your community page in the Creator Studio, upload capes and cosmetics, group them in collections and submit them for review.
---

Everything you share goes through the **Creator Studio** on the website. This guide walks you through it from an empty account to a published item. You need a cape texture or a Blockbench cosmetic ready. See [Cape textures](/docs/creators/capes) and [Cosmetics with Blockbench](/docs/creators/blockbench-cosmetics).

## Create your community page

::steps{level="3"}
### Open the Creator Studio

Log in on the website with Discord and open the dashboard. In the sidebar, under **Creator Studio**, click **My pages**. You can also go to [/dashboard/studio](/dashboard/studio) directly.

### Click Create my page

The dialog **Create your community page** opens. Name and URL slug are already filled in from your Discord account.

### Fill in the page details

- **Name**: shown in the shop (up to 64 characters).
- **URL slug**: the address of your page, shown below the field as `/shop/community/<slug>`. It needs 3 to 32 characters: lowercase letters, numbers and hyphens, and it must start and end with a letter or number. Every slug can only be used once.
- **Description**: optional, up to 2000 characters.

You can change all of this later.

### Click Create page

Your page opens in the Creator Studio. It goes into the review queue right away, and the studio shows **Waiting for the first review**.
::

Every user can have one community page. The tabs at the top of your page are **Items**, **Collections** and **Page settings**.

## Set up the page profile

Open **Page settings**. Under **Profile** you can change the name, slug and description, and add two images:

- **Icon**: a square image.
- **Banner**: a wide image, about 4:1.

Click **Save**. After your page was approved once, the button is called **Submit changes**, and the changes wait for a moderator. See [How the review works](/docs/creators/overview#how-the-review-works).

## Add an item

::steps{level="3"}
### Create the item

On the **Items** tab, click **New item**. Choose the type, **Cape** (a 2:1 PNG texture) or **Cosmetic** (a Blockbench model + texture), enter a **Name** and click **Create**. The item editor opens. New items are a **Draft**.

### Fill in the details

In the **Details** card:

- **Name** and **Description**.
- **Availability**: community items are always **Free** ("Community items are free for everyone.").
- **Listed**: unlisted items are only reachable by link.
- **Collection**: optional, see [Collections](#group-items-in-collections).
- **Sort order**: lower numbers come first.
- **Shop image**: optional tile image for the shop. Without it, the shop shows the texture.

### Upload the files

- **Cape:** upload your PNG under **Cape texture**.
- **Cosmetic:** in the **Variants** card, click **Add variant**. Choose what it **Fits**, upload the **Model** (`.cfg`) and the **Texture** (PNG), then click **Add variant**. Add more variants if needed, see [Skin-model variants](/docs/creators/variants).

### Save

Click **Save** in the **Details** card. **Discard** undoes your unsaved changes. Variants save on their own with **Add variant** or **Save variant**.

### Check the preview

The 3D preview on the right shows the item on the skin of your first linked Minecraft account. Switch between **Wide arms** and **Slim arms**. For capes, the **Elytra** button shows the elytra. Cape previews already show unsaved texture changes. Cosmetic previews only show saved variants.

### Submit for review

Click **Submit for review**. The button is disabled while you have unsaved changes ("Save your changes first"). A cape needs a texture, and a cosmetic needs at least one variant. The status changes to **In review**.
::

When a moderator approved your page profile and the item, its status is **Published** and **View in shop** takes you to its shop page. If it is **Rejected**, the editor shows the moderator's note. Fix the problem and submit again.

## File requirements

The upload button shows the rules for each file. Files that break them are rejected with **Upload failed** and a message that explains why.

| File | Rules |
| --- | --- |
| Cape texture | PNG, 2:1 (64×32 up to 2048×1024), width a multiple of 64 |
| Cosmetic model | Blockbench OptiFine model export (`.cfg` / `.json`), at most 256 KB |
| Cosmetic texture | PNG, up to 1024×1024 |
| Icon, banner, shop image, cover image | PNG, up to 2048×2048 |

Every PNG can be at most 2 MB. Only PNG works for images, not JPG, GIF or WebP. If the upload changed something in your model (for example, it removed a texture path), you get a **Note** message. See [Upload limits](/docs/creators/blockbench-cosmetics#upload-limits).

::note
A file you upload but never save to an item, page or collection is deleted after about 24 hours. Upload it again if you need it later.
::

## Group items in collections

Collections are optional sets of items, like "Summer 2026".

1. Open the **Collections** tab and click **New collection**.
2. Enter a **Name**, an optional **Description**, a **Cover image** and a **Sort order**. Click **Create**.
3. Open an item and choose the collection in its **Collection** field. Click **Save**.

Collections are reviewed together with your page profile. Until then, a collection shows **Not public yet**. Later edits show **Changes in review**. Deleting a collection keeps its items. They just no longer belong to a collection.

## Change or remove an item

- **Withdraw** takes an item out of review and back to **Draft**.
- **Unpublish** takes a published item offline and back to **Draft**. Players can't wear it while it is a draft.
- Changing the name, description, images or variants of a published community item sends it back to review. It is hidden until it is approved again.
- **Delete item** (in the **Danger zone**) removes the item from every wardrobe and inventory. This can't be undone.
- **Delete page** in **Page settings** deletes your page with all of its items and collections.

## Partner and official pages

On partner pages and the official page, the button is **Publish** instead of **Submit for review**, and items go live immediately. Those pages also have **Redeem codes** and **Members** tabs. See [Partner pages](/docs/creators/partners).
