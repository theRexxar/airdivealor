/**
 * Permission catalog for role-based access control. Roles are sets of these keys.
 * Each Home section has its own edit permission, so a role can be limited to, say, prices and reviews.
 */
import { HOME_SECTIONS } from "./home-sections";

export interface PermissionDef {
  key: string;
  label: string;
  group: string;
}

export const PERMISSIONS: PermissionDef[] = [
  { key: "home.view", label: "See the Home page sections", group: "Home page" },
  ...HOME_SECTIONS.map((s) => ({ key: `home.${s.key}.edit`, label: `Edit “${s.label}”`, group: "Home page" })),
  { key: "home.layout", label: "Show, hide and reorder sections", group: "Home page" },
  { key: "home.publish", label: "Publish changes to the live site", group: "Home page" },
  { key: "media.view", label: "See the media library", group: "Media" },
  { key: "media.upload", label: "Upload photos and videos", group: "Media" },
  { key: "media.delete", label: "Delete media", group: "Media" },
  { key: "users.view", label: "See users", group: "Users and roles" },
  { key: "users.manage", label: "Invite, edit and disable users", group: "Users and roles" },
  { key: "roles.manage", label: "Create and edit roles", group: "Users and roles" },
  { key: "audit.view", label: "See the activity log", group: "Users and roles" },
];

export const PERMISSION_KEYS = PERMISSIONS.map((p) => p.key);
export const sectionEditPermission = (key: string) => `home.${key}.edit`;

/** Roles created by the seed. Super admin always has every permission. */
export const DEFAULT_ROLES: { name: string; description: string; system?: boolean; permissions: string[] | "all" }[] = [
  { name: "Super admin", description: "Full access, including users and roles.", system: true, permissions: "all" },
  {
    name: "Editor",
    description: "Edits and publishes the Home page and manages media.",
    permissions: PERMISSION_KEYS.filter((k) => k.startsWith("home.") || k === "media.view" || k === "media.upload"),
  },
  {
    name: "Contributor",
    description: "Edits Home page drafts and uploads media; cannot publish.",
    permissions: PERMISSION_KEYS.filter((k) => (k.startsWith("home.") && k !== "home.publish" && k !== "home.layout") || k === "media.view" || k === "media.upload"),
  },
  { name: "Viewer", description: "Read-only access to the CMS.", permissions: ["home.view", "media.view"] },
];
