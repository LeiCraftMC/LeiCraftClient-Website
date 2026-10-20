import type {
	GetAccountApikeysResponses,
	GetAccountInventoryResponses,
	GetAccountMinecraftByUuidLoadoutResponses,
	GetAccountMinecraftResponses,
	GetAccountResponses,
	GetAccountWardrobeResponses,
	GetAdminAuditLogsData,
	GetAdminAuditLogsResponses,
	GetAdminUsersResponses,
	GetCatalogCategoriesResponses,
	GetCatalogCollectionsByCollectionIdResponses,
	GetCatalogPagesByPageIdResponses,
	GetCatalogPagesResponses,
	GetCatalogProductsByProductIdResponses,
	GetCatalogProductsResponses,
	GetModerationPagesResponses,
	GetModerationProductsResponses,
	GetModerationReportsResponses,
	GetModerationUsersByUserIdResponses,
	GetModerationUsersResponses,
	GetPlayersByUuidResponses,
	GetStudioPagesByPageIdCodesResponses,
	GetStudioPagesByPageIdCollectionsResponses,
	GetStudioPagesByPageIdMembersResponses,
	GetStudioPagesByPageIdProductsByProductIdOwnersResponses,
	GetStudioPagesByPageIdProductsResponses,
	GetStudioPagesResponses,
	PostAccountApikeysData,
} from "~/api-client";

export namespace UtilityTypes {
	export type SomePartial<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>;
}

export type UserInfo = GetAccountResponses["200"]["data"];
export type UserRole = UserInfo["role"];

export type APIKey = GetAccountApikeysResponses["200"]["data"][number];
export type NewAPIKey = NonNullable<PostAccountApikeysData["body"]>;

// Catalog
export type Category = GetCatalogCategoriesResponses["200"]["data"][number];
export type CategoryID = Category["id"];
export type CatalogPage = GetCatalogPagesResponses["200"]["data"][number];
export type CatalogPageDetail = GetCatalogPagesByPageIdResponses["200"]["data"];
export type CatalogCollection = GetCatalogCollectionsByCollectionIdResponses["200"]["data"];
export type Product = GetCatalogProductsResponses["200"]["data"][number];
export type ProductDetail = GetCatalogProductsByProductIdResponses["200"]["data"];
export type Variant = Product["variants"][number];
export type AssetRef = NonNullable<Product["texture"]>;

// Account & players
export type MinecraftAccount = GetAccountMinecraftResponses["200"]["data"][number];
export type Loadout = GetAccountMinecraftByUuidLoadoutResponses["200"]["data"];
export type WardrobeItem = GetAccountWardrobeResponses["200"]["data"][number];
export type InventoryItem = GetAccountInventoryResponses["200"]["data"][number];
export type PlayerProfile = GetPlayersByUuidResponses["200"]["data"];
export type SkinModel = MinecraftAccount["skin_model"];

// Studio
export type StudioPage = GetStudioPagesResponses["200"]["data"][number];
export type ManagedProduct = GetStudioPagesByPageIdProductsResponses["200"]["data"][number];
export type ProductStatus = ManagedProduct["status"];
export type StudioCollection = GetStudioPagesByPageIdCollectionsResponses["200"]["data"][number];
export type PageMember = GetStudioPagesByPageIdMembersResponses["200"]["data"][number];
export type RedeemCode = GetStudioPagesByPageIdCodesResponses["200"]["data"][number];
export type ProductOwner =
	GetStudioPagesByPageIdProductsByProductIdOwnersResponses["200"]["data"][number];

// Moderation & admin
export type ModerationProduct = GetModerationProductsResponses["200"]["data"][number];
export type ModerationPage = GetModerationPagesResponses["200"]["data"][number];
export type Report = GetModerationReportsResponses["200"]["data"][number];
export type ReportStatus = Report["status"];
export type ModeratedUser = GetModerationUsersResponses["200"]["data"][number];
export type ModeratedUserDetail = GetModerationUsersByUserIdResponses["200"]["data"];
export type AdminUser = GetAdminUsersResponses["200"]["data"][number];
export type AuditLogEntry = GetAdminAuditLogsResponses["200"]["data"][number];
export type AuditAction = NonNullable<NonNullable<GetAdminAuditLogsData["query"]>["action"]>;
