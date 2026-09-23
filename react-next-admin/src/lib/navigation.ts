import type {LucideIcon} from "lucide-react";
import {Building2, FolderCog, Table2, Users} from "lucide-react";

export interface MenuItem {
    key: string;
    url: string;
    icon: LucideIcon;
}

export const modules: MenuItem[] = [
    {key: "projectConfig", url: "/project-config", icon: FolderCog},
    {key: "tableConfig", url: "/table-config", icon: Table2},
    {key: "userExample", url: "/user-example", icon: Users},
    {key: "department", url: "/department", icon: Building2},
];

export interface NavGroup {
    key: string;
    items: string[]; // module keys
}

export const navGroups: NavGroup[] = [
    {key: "buildingYourApplication", items: ["projectConfig", "userExample", "department"]},
];

export const MODULES_BY_KEY: Record<string, MenuItem> = Object.fromEntries(
    modules.map((m) => [m.key, m])
);

// url -> module key, used to resolve access-history titles via i18n
export const MENU_URL_TO_KEY: Map<string, string> = new Map(
    modules.map((m) => [m.url, m.key] as [string, string])
);
