"use client";

import React, {useContext} from "react";
import {useTranslations} from "next-intl";
import {useRouter} from "@/common/i18n/navigation";
import {AdminContext} from "@/common/lib/admin/AdminContextProvider";
import {modules} from "@/lib/navigation";
import {ArrowUpRight, Sparkles} from "lucide-react";

export default function Page() {
    const t = useTranslations("Home");
    const router = useRouter();
    const adminContext = useContext(AdminContext);

    return (
        <div className="admin-page flex flex-1 flex-col gap-8 lg:gap-10">
            <section className="rounded-2xl border border-border/70 bg-card px-6 py-8 sm:px-9 sm:py-10 lg:px-11 lg:py-12">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/8 px-3 py-1.5 text-xs font-medium tracking-wide text-primary">
                    <Sparkles className="size-3.5" aria-hidden="true"/>
                    {t("badge")}
                </div>
                <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                    {t("welcome")}
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                    {t("subtitle")}
                </p>
            </section>

            <section aria-labelledby="quick-access-heading">
                <h2 id="quick-access-heading" className="mb-5 text-base font-semibold tracking-tight text-foreground">{t("quickAccess")}</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {modules.map(({key, url, icon: Icon}) => (
                        <button
                            key={key}
                            onClick={() => adminContext.adminBroker.access(url, router)}
                            className="group flex h-full min-h-48 flex-col rounded-2xl border border-border/70 bg-card p-6 text-left transition-[border-color,background-color,box-shadow] duration-200 hover:border-primary/35 hover:bg-accent/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
                        >
                            <div className="mb-6 flex w-full items-start justify-between gap-4">
                                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
                                    <Icon className="size-5" strokeWidth={1.75} aria-hidden="true"/>
                                </div>
                                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground/60 transition-[color,transform] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary motion-reduce:transform-none motion-reduce:transition-none" aria-hidden="true"/>
                            </div>
                            <div>
                                <h3 className="text-base font-semibold tracking-tight text-foreground">
                                    {t(`modules.${key}.title`)}
                                </h3>
                                <p className="mt-2 text-sm leading-6 text-muted-foreground">
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
