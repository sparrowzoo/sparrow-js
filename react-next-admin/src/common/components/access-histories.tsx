"use client";

import React, {useContext, useEffect, useReducer} from "react";
import {AdminContext} from "@/common/lib/admin/AdminContextProvider";
import {useRouter} from "@/common/i18n/navigation";
import {History, Trash2, X} from "lucide-react";
import {SidebarTrigger} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {useTranslations} from "next-intl";
import {cn} from "@/lib/utils";

type AccessHistoriesProps = {
    showSidebarTrigger?: boolean;
};

export default function AccessHistories({
    showSidebarTrigger = true,
}: AccessHistoriesProps) {
    const {adminBroker} = useContext(AdminContext);
    const router = useRouter();
    const t = useTranslations("AccessHistories");

    // 订阅 broker 的变更信号，增删/清空后自动刷新
    const [, forceRender] = useReducer((x: number) => x + 1, 0);
    useEffect(() => adminBroker.subscribe(forceRender), [adminBroker]);

    const accessHistories =
        adminBroker.accessHistoryContainer.getAccessHistories();

    return (
        <div className="flex min-w-0 flex-1 flex-row items-center gap-4">
            {showSidebarTrigger && (
                <>
                    <SidebarTrigger className="-ml-1 shrink-0" />
                    <Separator
                        orientation="vertical"
                        className="mr-2 h-4 shrink-0"
                    />
                </>
            )}

            <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto">
                <span className="flex shrink-0 items-center gap-1.5 px-1 text-xs font-medium text-muted-foreground">
                    <History className="h-3.5 w-3.5" />
                    {t("label")}
                </span>

                {accessHistories.length === 0 ? (
                    <span className="shrink-0 px-1 text-xs text-muted-foreground/60">
                        {t("empty")}
                    </span>
                ) : (
                    accessHistories.map((history) => (
                        <div
                            key={history.url}
                            className="group flex shrink-0 items-center overflow-hidden rounded-full border border-border bg-background text-xs shadow-xs transition-colors hover:border-violet-500/40 hover:bg-accent"
                        >
                            <button
                                type="button"
                                title={history.title}
                                onClick={() =>
                                    adminBroker.access(history.url, router)
                                }
                                className="max-w-[10rem] truncate px-3 py-1 font-medium text-foreground transition-colors hover:text-violet-600 dark:hover:text-violet-300"
                            >
                                {history.title}
                            </button>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        type="button"
                                        aria-label={t("remove")}
                                        onClick={() =>
                                            adminBroker.deleteHistory(
                                                history.url
                                            )
                                        }
                                        className={cn(
                                            "flex h-5 w-5 items-center justify-center rounded-full",
                                            "text-muted-foreground/70 transition-colors",
                                            "hover:bg-destructive/10 hover:text-destructive"
                                        )}
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>{t("remove")}</TooltipContent>
                            </Tooltip>
                        </div>
                    ))
                )}

                {accessHistories.length > 0 && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                type="button"
                                aria-label={t("clear-all")}
                                onClick={() => adminBroker.clearHistory()}
                                className={cn(
                                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                                    "text-muted-foreground/70 transition-colors",
                                    "hover:bg-destructive/10 hover:text-destructive"
                                )}
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>{t("clear-all")}</TooltipContent>
                    </Tooltip>
                )}
            </div>
        </div>
    );
}
