"use client";

import * as React from "react";
import {Users} from "lucide-react";

export default function Page() {

    return (
        <div className="admin-page">
            <section className="flex min-h-52 items-center gap-5 rounded-2xl border border-border/70 bg-card p-6 sm:p-9">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/8 text-primary">
                    <Users className="size-6" strokeWidth={1.75} aria-hidden="true"/>
                </div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    User 示例
                </h1>
            </section>
        </div>
    );
}
