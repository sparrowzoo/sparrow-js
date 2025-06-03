"use client";

import clsx from "clsx";
import {Locale} from "next-intl";
import {ChangeEvent, ReactNode, useTransition} from "react";
import {usePathname, useRouter} from "@/common/i18n/navigation";
import {useSearchParams} from "next/navigation";

export type Props = {
    children: ReactNode;
    defaultValue: string;
};
export default function LocaleSwitcherSelect(props: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const {children, defaultValue} = props;
    const [isPending, startTransition] = useTransition();
    const searchParams = useSearchParams();

    function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
        const nextLocale = event.target.value as Locale;
        localStorage.setItem("locale", nextLocale);
        // 1. 获取当前所有参数（转换为普通对象）
        const currentParams = Object.fromEntries(searchParams.entries());

        startTransition(() => {
            router.replace(
                // TypeScript will validate that only known `params`
                // are used in combination with a given `pathname`. Since the two will
                // always match for the current route, we can skip runtime checks.
                {pathname, query: {...currentParams}},
                {locale: nextLocale}
            );
        });
    }

    return (
        <label
            className={clsx(
                "relative text-gray-400",
                isPending && "transition-opacity [&:disabled]:opacity-30"
            )}
        >
            <select
                className="inline-flex appearance-none bg-transparent py-3 pl-2 pr-6"
                defaultValue={defaultValue}
                disabled={isPending}
                onChange={onSelectChange}
            >
                {children}
            </select>
            <span className="pointer-events-none absolute right-2 top-[8px]">⌄</span>
        </label>
    );
}
