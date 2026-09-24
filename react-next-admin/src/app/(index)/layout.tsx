import type {Metadata} from "next";
import type {ReactNode} from "react";
import {routing} from "@/i18n/routing";
import "@/app/globals.css";

export const metadata: Metadata = {
    title: "Sparrow Coder",
};

export default function EntryLayout({children}: {children: ReactNode}) {
    return <html lang={routing.defaultLocale}>
    <body className="min-h-svh bg-background text-foreground antialiased">{children}</body>
    </html>;
}
