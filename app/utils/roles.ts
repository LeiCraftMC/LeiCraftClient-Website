/**
 * Single source of truth for the badge color used to represent a user role, so every list and
 * profile shows roles the same way.
 */
export function getRoleColor(
	role: string | null | undefined,
): "error" | "warning" | "primary" | "neutral" {
	switch (role) {
		case "admin":
			return "error";
		case "moderator":
			return "warning";
		case "user":
			return "primary";
		default:
			return "neutral";
	}
}

/** Moderators and admins see the moderation area. */
export function isStaffRole(role: string | null | undefined) {
	return role === "admin" || role === "moderator";
}
