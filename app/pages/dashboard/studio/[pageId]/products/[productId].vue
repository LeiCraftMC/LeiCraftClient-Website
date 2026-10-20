<script setup lang="ts">
import { useMinecraftAccountsStore } from "~/composables/stores/useMinecraftAccountsStore";
import type { AssetRef, ManagedProduct, StudioCollection, StudioPage } from "~/utils/types";

const route = useRoute();
const toast = useToast();
const studioPage = useSubrouterInjectedData<StudioPage>("studio_page").inject();
const page = studioPage.data;
const pageId = page.value.id;
const productId = Number(route.params.productId);

const isCommunity = computed(() => page.value.category === "community");

const { data: result, refresh } = await useAPIAsyncData(
	`studio-product-${productId}`,
	async () =>
		await useAPI((api) =>
			api.getStudioPagesByPageIdProductsByProductId({ path: { pageId, productId } }),
		),
);

const loadError = computed(() =>
	result.value?.success
		? null
		: createError({
				statusCode: result.value?.code ?? 500,
				statusMessage: result.value?.message ?? "Failed to load the item",
			}),
);
const product = computed(
	() => (result.value?.success ? result.value.data : null) as ManagedProduct | null,
);

const collections = await useAPILazyAsyncData<StudioCollection[]>(
	`studio-page-${pageId}-collections`,
	async () => {
		const res = await useAPI((api) => api.getStudioPagesByPageIdCollections({ path: { pageId } }));
		return res.success ? res.data : [];
	},
);

// The select can't hold `null`, so 0 stands for "no collection".
const collectionItems = computed(() => [
	{ label: "No collection", value: 0 },
	...(collections.data.value ?? []).map((collection) => ({
		label: collection.name,
		value: collection.id,
	})),
]);

// Form
interface ProductForm {
	name: string;
	description: string;
	availability: ManagedProduct["availability"];
	listed: boolean;
	collection: number;
	sort_order: number;
	texture: AssetRef | null;
	preview: AssetRef | null;
}

const form = reactive<ProductForm>({
	name: "",
	description: "",
	availability: "free",
	listed: true,
	collection: 0,
	sort_order: 0,
	texture: null,
	preview: null,
});

function resetForm() {
	const current = product.value;
	if (!current) return;
	Object.assign(form, {
		name: current.name,
		description: current.description,
		availability: current.availability,
		listed: current.listed,
		collection: current.collection_id ?? 0,
		sort_order: current.sort_order,
		texture: current.texture,
		preview: current.preview,
	} satisfies ProductForm);
}

watch(product, resetForm, { immediate: true });

const dirty = computed(() => {
	const current = product.value;
	if (!current) return false;
	return (
		form.name !== current.name ||
		form.description !== current.description ||
		form.availability !== current.availability ||
		form.listed !== current.listed ||
		form.collection !== (current.collection_id ?? 0) ||
		form.sort_order !== current.sort_order ||
		form.texture?.id !== current.texture?.id ||
		form.preview?.id !== current.preview?.id
	);
});

const locked = computed(() => product.value?.status === "disabled");
const saving = ref(false);

async function save() {
	const current = product.value;
	if (!current || !form.name.trim()) return;

	saving.value = true;
	const res = await useAPI((api) =>
		api.putStudioPagesByPageIdProductsByProductId({
			path: { pageId, productId },
			body: {
				name: form.name.trim(),
				description: form.description,
				availability: form.availability,
				listed: form.listed,
				collection_id: form.collection || null,
				sort_order: form.sort_order,
				preview_asset_id: form.preview?.id ?? null,
				...(current.type === "cape" ? { texture_asset_id: form.texture?.id ?? null } : {}),
			},
		}),
	);
	saving.value = false;

	if (!res.success) {
		toast.add({ title: "Could not save the item", description: res.message, color: "error" });
		return;
	}
	toast.add({
		title: "Saved",
		description:
			res.data.status === "pending_review" && current.status === "published"
				? "The changes are live again once a moderator approved them."
				: undefined,
		icon: "i-lucide-check",
		color: "success",
	});
	await refresh();
}

// Publish / unpublish
const publishing = ref(false);
const isLive = computed(
	() => product.value?.status === "published" || product.value?.status === "pending_review",
);

async function setPublished(publish: boolean) {
	publishing.value = true;
	const res = await useAPI((api) =>
		publish
			? api.postStudioPagesByPageIdProductsByProductIdPublish({ path: { pageId, productId } })
			: api.postStudioPagesByPageIdProductsByProductIdUnpublish({ path: { pageId, productId } }),
	);
	publishing.value = false;

	if (!res.success) {
		toast.add({
			title: publish ? "Could not publish" : "Could not unpublish",
			description: res.message,
			color: "error",
		});
		return;
	}
	toast.add({
		title: !publish
			? "Moved back to drafts"
			: res.data.status === "pending_review"
				? "Submitted for review"
				: "Published",
		icon: "i-lucide-check",
		color: "success",
	});
	await refresh();
}

// Delete
const showDelete = ref(false);

async function deleteProduct() {
	const res = await useAPI((api) =>
		api.deleteStudioPagesByPageIdProductsByProductId({ path: { pageId, productId } }),
	);
	if (!res.success) {
		toast.add({ title: "Could not delete the item", description: res.message, color: "error" });
		throw new Error(res.message);
	}
	toast.add({ title: "Item deleted", icon: "i-lucide-trash-2", color: "success" });
	await navigateTo(`/dashboard/studio/${pageId}`);
}

// Preview
const { skinURL } = useMinecraftAssets();
const accounts = await useMinecraftAccountsStore().use();
const previewAccount = computed(() => accounts.value?.[0]);
const previewSlim = ref(previewAccount.value?.skin_model === "slim");
const previewElytra = ref(false);
const previewVariantId = ref<number | null>(null);

const previewVariant = computed(() =>
	pickVariant(
		product.value?.variants ?? [],
		previewVariantId.value,
		previewSlim.value ? "slim" : "wide",
	),
);

// Showing a variant made for one arm type switches the mannequin to that type.
watch(previewVariantId, () => {
	const skinModel = previewVariant.value?.skin_model;
	if (skinModel && skinModel !== "any") previewSlim.value = skinModel === "slim";
});

const viewerCosmetics = computed(() =>
	product.value?.type === "cosmetic" && previewVariant.value
		? [{ texture: previewVariant.value.texture.url, model: previewVariant.value.model.url }]
		: [],
);
</script>

<template>
	<UError v-if="loadError" :error="loadError" />

	<div v-else-if="product" class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
		<div class="min-w-0 space-y-6">
			<!-- Status -->
			<div class="flex flex-wrap items-center justify-between gap-3">
				<div class="flex items-center gap-3">
					<UButton
						:to="`/dashboard/studio/${pageId}`"
						color="neutral"
						variant="ghost"
						icon="i-lucide-arrow-left"
						aria-label="Back to items"
					/>
					<div>
						<h2 class="text-lg font-semibold text-white">{{ product.name }}</h2>
						<p class="text-sm capitalize text-slate-400">{{ product.type }} · #{{ product.id }}</p>
					</div>
					<StudioStatusBadge :status="product.status" />
				</div>
				<div class="flex flex-wrap gap-2">
					<UButton
						v-if="product.status === 'published' && page.status === 'active'"
						:to="`/shop/products/${product.id}`"
						target="_blank"
						color="neutral"
						variant="ghost"
						icon="i-lucide-external-link"
					>
						View in shop
					</UButton>
					<UButton
						v-if="isLive"
						color="neutral"
						variant="soft"
						icon="i-lucide-eye-off"
						:loading="publishing"
						:disabled="locked"
						@click="setPublished(false)"
					>
						{{ product.status === "pending_review" ? "Withdraw" : "Unpublish" }}
					</UButton>
					<UTooltip v-else :text="dirty ? 'Save your changes first' : ''" :disabled="!dirty">
						<UButton
							icon="i-lucide-send"
							:loading="publishing"
							:disabled="locked || dirty"
							@click="setPublished(true)"
						>
							{{ isCommunity ? "Submit for review" : "Publish" }}
						</UButton>
					</UTooltip>
				</div>
			</div>

			<UAlert
				v-if="product.status === 'disabled'"
				color="error"
				variant="soft"
				icon="i-lucide-ban"
				title="Taken down by a moderator"
				:description="product.review_note ?? 'Contact the LeiCraft Client team on Discord if you think this is a mistake.'"
			/>
			<UAlert
				v-else-if="product.status === 'rejected'"
				color="error"
				variant="soft"
				icon="i-lucide-circle-x"
				title="Rejected in review"
				:description="`${product.review_note ?? 'No reason given.'} Fix it and submit again.`"
			/>
			<UAlert
				v-else-if="product.status === 'pending_review'"
				color="warning"
				variant="soft"
				icon="i-lucide-hourglass"
				title="Waiting for a moderator"
				description="The item goes live as soon as it is approved."
			/>
			<UAlert
				v-else-if="isCommunity && product.status === 'published'"
				color="neutral"
				variant="soft"
				icon="i-lucide-info"
				description="Changing the name, description, images or variants sends the item back to review. It stays hidden until it is approved again."
			/>

			<!-- Details -->
			<DashboardSectionCard title="Details" icon="i-lucide-file-text">
				<template #actions>
					<UButton v-if="dirty" color="neutral" variant="ghost" size="sm" @click="resetForm">Discard</UButton>
					<UButton
						size="sm"
						icon="i-lucide-save"
						:loading="saving"
						:disabled="!dirty || locked || !form.name.trim()"
						@click="save"
					>
						Save
					</UButton>
				</template>

				<div class="space-y-5">
					<UFormField label="Name" required>
						<UInput v-model="form.name" class="w-full" :maxlength="64" :disabled="locked" />
					</UFormField>
					<UFormField label="Description">
						<UTextarea v-model="form.description" :rows="4" class="w-full" :maxlength="2000" :disabled="locked" />
					</UFormField>

					<div class="grid gap-5 md:grid-cols-2">
						<UFormField
							label="Availability"
							:description="
								isCommunity
									? 'Community items are free for everyone.'
									: 'Exclusive items are only available through redeem codes and grants.'
							"
						>
							<URadioGroup
								v-model="form.availability"
								orientation="horizontal"
								:disabled="locked || isCommunity"
								:items="[
									{ label: 'Free', value: 'free' },
									{ label: 'Exclusive', value: 'exclusive' },
								]"
							/>
						</UFormField>
						<UFormField label="Listed" description="Unlisted items are only reachable by link.">
							<USwitch v-model="form.listed" :disabled="locked" />
						</UFormField>
						<UFormField label="Collection">
							<USelect v-model="form.collection" :items="collectionItems" class="w-full" :disabled="locked" />
						</UFormField>
						<UFormField label="Sort order" description="Lower numbers come first.">
							<UInputNumber v-model="form.sort_order" class="w-full" :disabled="locked" />
						</UFormField>
					</div>

					<div class="grid gap-5 md:grid-cols-2">
						<UFormField
							v-if="product.type === 'cape'"
							label="Cape texture"
							required
							description="Standard Minecraft cape layout; animated or HD capes keep the 2:1 ratio."
						>
							<StudioAssetUpload
								kind="cape_texture"
								:url="form.texture?.url"
								:disabled="locked"
								@uploaded="form.texture = $event"
							/>
						</UFormField>
						<UFormField label="Shop image" description="Optional tile image, otherwise the texture is shown.">
							<StudioAssetUpload
								kind="image"
								:url="form.preview?.url"
								:disabled="locked"
								clearable
								@uploaded="form.preview = $event"
								@cleared="form.preview = null"
							/>
						</UFormField>
					</div>
				</div>
			</DashboardSectionCard>

			<!-- Variants -->
			<DashboardSectionCard
				v-if="product.type === 'cosmetic'"
				title="Variants"
				description="Blockbench model + texture, one per skin type"
				icon="i-lucide-shapes"
			>
				<StudioVariantList
					v-model:preview-variant-id="previewVariantId"
					:page-id="pageId"
					:product="product"
					:disabled="locked"
					@changed="refresh()"
				/>
			</DashboardSectionCard>

			<!-- Owners -->
			<DashboardSectionCard
				v-if="!isCommunity && product.availability === 'exclusive'"
				title="Owners"
				description="Give this item to specific players"
				icon="i-lucide-gift"
			>
				<template #actions>
					<UButton
						size="sm"
						variant="soft"
						icon="i-lucide-ticket"
						:to="`/dashboard/studio/${pageId}/codes?product=${product.id}`"
					>
						Redeem codes
					</UButton>
				</template>
				<StudioProductOwners :page-id="pageId" :product-id="product.id" />
			</DashboardSectionCard>

			<!-- Danger zone -->
			<DashboardSectionCard title="Danger zone" icon="i-lucide-alert-triangle" tone="danger">
				<div class="flex flex-wrap items-center justify-between gap-4">
					<p class="text-sm text-slate-400">
						Deleting removes the item from every wardrobe and inventory. This can't be undone.
					</p>
					<UButton color="error" variant="soft" icon="i-lucide-trash-2" @click="showDelete = true">
						Delete item
					</UButton>
				</div>
			</DashboardSectionCard>
		</div>

		<!-- Preview -->
		<aside class="space-y-3 xl:sticky xl:top-4 xl:self-start">
			<div class="relative h-105 overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
				<SkinViewer
					:skin="skinURL(previewAccount?.uuid)"
					:slim="previewSlim"
					:cape="product.type === 'cape' ? (form.texture?.url ?? null) : null"
					:elytra="previewElytra"
					:back="product.type === 'cape'"
					:cosmetics="viewerCosmetics"
					animation="idle"
				/>
				<div
					v-if="product.type === 'cosmetic' && !product.variants.length"
					class="absolute inset-x-4 top-4 rounded-lg bg-slate-900/80 px-3 py-2 text-center text-xs text-slate-300"
				>
					Add a variant to see the cosmetic
				</div>
			</div>
			<div class="flex flex-wrap gap-2">
				<UButton
					size="sm"
					color="neutral"
					:variant="previewSlim ? 'soft' : 'ghost'"
					icon="i-lucide-person-standing"
					@click="previewSlim = !previewSlim"
				>
					{{ previewSlim ? "Slim arms" : "Wide arms" }}
				</UButton>
				<UButton
					v-if="product.type === 'cape'"
					size="sm"
					color="neutral"
					:variant="previewElytra ? 'soft' : 'ghost'"
					icon="i-lucide-feather"
					@click="previewElytra = !previewElytra"
				>
					Elytra
				</UButton>
			</div>
			<p class="text-xs text-slate-500">
				{{
					previewAccount
						? `Shown on ${previewAccount.name}'s skin.`
						: "Link a Minecraft account to preview on your own skin."
				}}
				{{ product.type === "cape" ? "Unsaved texture changes are already shown." : "Shows saved variants." }}
			</p>
		</aside>
	</div>

	<DashboardDeleteModal
		v-model:open="showDelete"
		title="Delete item"
		:warning-text="`This deletes ${product?.name ?? 'the item'} for everyone who owns or wears it.`"
		:on-delete="deleteProduct"
		prevent-auto-close
	/>
</template>
