export interface MenuItem {
    key: string;
    url: string;
    icon: string;
}

export const modules: MenuItem[] = [
    {key: "projectConfig", url: "/project-config", icon: "FolderCog"},
    {key: "tableConfig", url: "/table-config", icon: "Table2"},
    {key: "userExample", url: "/user-example", icon: "Users"},
    {key: "department", url: "/department", icon: "Building2"},
    {key: "organization", url: "/organization", icon: "Network"},
    {key: "position", url: "/position", icon: "Briefcase"},
    {key: "app", url: "/app", icon: "AppWindow"},
    {key: "microService", url: "/micro-service", icon: "Boxes"},
    {key: "adminUser", url: "/admin-user", icon: "UserRound"},
    {key: "userGroup", url: "/user-group", icon: "UsersRound"},
    {key: "role", url: "/role", icon: "UserCog"},
    {key: "permission", url: "/permission", icon: "KeyRound"},
    {key: "dictType", url: "/dict-type", icon: "Database"},
    {key: "dictItem", url: "/dict-item", icon: "List"},
    {key: "dictTypeI18n", url: "/dict-type-i18n", icon: "Languages"},
    {key: "dictItemI18n", url: "/dict-item-i18n", icon: "Globe"},
];

export interface MenuParent {
    key: string;
    icon: string;
    items: string[]; // module keys
}

export const navParents: MenuParent[] = [
    {
        key: "systemManagement",
        icon: "Settings",
        items: ["department", "userExample", "projectConfig", "tableConfig"],
    },
    {
        key: "permissionManagement",
        icon: "ShieldCheck",
        items: ["app", "microService", "organization", "position", "adminUser", "userGroup", "role", "permission"],
    },
    {
        key: "systemSettings",
        icon: "Settings2",
        items: ["dictType", "dictItem", "dictTypeI18n", "dictItemI18n"],
    },
];

export const MODULES_BY_KEY: Record<string, MenuItem> = Object.fromEntries(
    modules.map((m) => [m.key, m])
);

// url -> module key, used to resolve access-history titles via i18n
export const MENU_URL_TO_KEY: Map<string, string> = new Map(
    modules.map((m) => [m.url, m.key] as [string, string])
);
