"use client";

import React, {useContext} from "react";
import {useTranslations} from "next-intl";
import {useRouter} from "@/common/i18n/navigation";
import {AdminContext} from "@/common/lib/admin/AdminContextProvider";
import {modules} from "@/common/lib/admin/navigation";
import {ArrowUpRight, Sparkles} from "lucide-react";

export default function Page() {
    const t = useTranslations("Home");
    const router = useRouter();
    const adminContext = useContext(AdminContext);

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-background to-muted/30 p-8">
                <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-sm text-muted-foreground">
                    <Sparkles className="h-4 w-4 text-primary"/>
                    {t("badge")}
                </div>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight">
                    {t("welcome")}
                </h1>
                <p className="mt-2 max-w-xl text-muted-foreground">
                    {t("subtitle")}
                </p>
            </section>

            <section>
                <h2 className="mb-4 text-lg font-semibold">{t("quickAccess")}</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {modules.map(({key, url, icon: Icon}) => (
                        <button
                            key={key}
                            onClick={() => adminContext.adminBroker.access(url, router)}
                            className="group flex items-start gap-4 rounded-xl border bg-card p-5 text-left transition-colors hover:bg-muted/50"
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Icon className="h-5 w-5"/>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between gap-2">
                                    <h3 className="font-medium">
                                        {t(`modules.${key}.title`)}
                                    </h3>
                                    <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"/>
                                </div>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {t(`modules.${key}.description`)}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );
}
