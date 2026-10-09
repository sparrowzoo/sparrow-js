import * as React from "react";
import {icons, Menu, type LucideIcon, type LucideProps} from "lucide-react";

const iconMap = icons as Record<string, LucideIcon>;

const toPascalCase = (name: string): string =>
    name
        .split(/[-_\s]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("");

export function getIcon(name: string): LucideIcon {
    return iconMap[name] ?? iconMap[toPascalCase(name)] ?? Menu;
}

interface Prop extends LucideProps {
    name: string;
}

export default function DynamicIcon({name, ...props}: Prop) {
    const Icon = getIcon(name);
    return <Icon {...props} />;
}
