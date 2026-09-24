"use client";

import {ChevronDown, Languages, LoaderCircle} from "lucide-react";
import {type Locale} from "next-intl";
import {Children, type ComponentProps, isValidElement, type ReactNode, useState, useTransition} from "react";
import {getPathname, usePathname} from "@/common/i18n/navigation";
import {useParams, useRouter} from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {cn} from "@/lib/utils";
import styles from "./locale-switcher.module.css";

export type Props = {
    children: ReactNode;
    defaultValue: string;
    label?: string;
    className?: string;
    /** Kept for compatibility; styles the menu trigger instead of a native select. */
    selectClassName?: string;
    contentClassName?: string;
    shortLabels?: Record<string, string>;
};

export default function LocaleSwitcherSelect({
    children,
    defaultValue,
    label = "Language",
    className,
    selectClassName,
    contentClassName,
    shortLabels = {},
}: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const [isPending, startTransition] = useTransition();
    const [open, setOpen] = useState(false);
    // Preserve the existing <option> API used by LocaleSwitcher and host projects.
    const options = Children.toArray(children).flatMap((child) => {
        if (!isValidElement<ComponentProps<"option">>(child) || child.type !== "option") return [];
        return [{value: String(child.props.value), label: child.props.children, disabled: child.props.disabled}];
    });
    const selected = options.find((option) => option.value === defaultValue);
    const selectedText = typeof selected?.label === "string" ? selected.label : defaultValue;

    function changeLocale(value: string) {
        setOpen(false);
        if (value === defaultValue || isPending) return;
        const nextLocale = value as Locale;
        try {
            localStorage.setItem("locale", nextLocale);
        } catch {
            // Language navigation still works when browser storage is unavailable.
        }
        // Persist the preference; static pages always use the explicit URL locale.
        document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; SameSite=lax`;
        const localizedPathname = getPathname({
            locale: nextLocale,
            // Both the route template and its params come from the current matched route.
            href: {pathname, params} as Parameters<typeof getPathname>[0]["href"],
        });
        // Keep repeated parameters, encoding and Passport's raw ?return-url unchanged.
        // Localize only the pathname: next-intl would otherwise normalize the URL suffix.
        const href = `${localizedPathname}${window.location.search}${window.location.hash}`;
        startTransition(() => {
            router.replace(href, {scroll: false});
        });
    }

    return (
        <span className={cn(styles.root, className)}>
            <DropdownMenu modal={false} open={open} onOpenChange={(nextOpen) => setOpen(nextOpen && !isPending)}>
                <DropdownMenuTrigger asChild>
                    <button type="button" className={cn(styles.trigger, selectClassName)}
                            aria-label={`${label}: ${selectedText}`} aria-busy={isPending} aria-disabled={isPending}>
                        <Languages data-slot="locale-icon" size={16} strokeWidth={1.7} aria-hidden="true"/>
                        <span data-slot="locale-label" className={styles.label}>
                            {options.map((option) => <span key={option.value} className={styles.measure} aria-hidden="true">{shortLabels[option.value] ?? option.label}</span>)}
                            <span key={defaultValue} className={styles.current}>{shortLabels[defaultValue] ?? selected?.label ?? defaultValue}</span>
                        </span>
                        <span data-slot="locale-indicator" className={styles.indicator} aria-hidden="true">
                            {isPending
                                ? <LoaderCircle size={14} className={styles.spinner}/>
                                : <ChevronDown size={14} strokeWidth={1.7} className={styles.chevron}/>}
                        </span>
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={8} collisionPadding={12}
                                     className={cn(styles.content, contentClassName)}>
                    <DropdownMenuRadioGroup value={defaultValue} onValueChange={changeLocale} aria-label={label}>
                        {options.map((option) => (
                            <DropdownMenuRadioItem key={option.value} value={option.value}
                                                   disabled={option.disabled || isPending} className={styles.option}>
                                <span lang={option.value}>{option.label}</span>
                            </DropdownMenuRadioItem>
                        ))}
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </span>
    );
}
