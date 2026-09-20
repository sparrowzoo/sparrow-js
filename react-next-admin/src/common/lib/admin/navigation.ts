import {
    FolderCog,
    Table2,
    Users,
} from "lucide-react";
import type {LucideIcon} from "lucide-react";

export interface MenuItem {
    key: string;
    url: string;
    icon: LucideIcon;
}

export const modules: MenuItem[] = [
    {key: "projectConfig", url: "/project-config", icon: FolderCog},
    {key: "tableConfig", url: "/table-config", icon: Table2},
    {key: "userExample", url: "/user-example", icon: Users},
];

export interface NavGroup {
    key: string;
    items: string[]; // module keys
}

export const navGroups: NavGroup[] = [
    {key: "buildingYourApplication", items: ["projectConfig", "userExample"]},
];

export const MODULES_BY_KEY: Record<string, MenuItem> = Object.fromEntries(
    modules.map((m) => [m.key, m])
);

// url -> module key, used to resolve access-history titles via i18n
export const MENU_URL_TO_KEY: Record<string, string> = Object.fromEntries(
    modules.map((m) => [m.url, m.key])
);
