import type {ReactNode} from "react";
import {NextIntlClientProvider} from "next-intl";
import {routing} from "@/i18n/routing";
import {ThemeProvider} from "@/common/components/header/theme-provider";
import "@/app/globals.css";

export default function EntryLayout({children}: { children: ReactNode }) {
    return (
        <html lang={routing.defaultLocale} suppressHydrationWarning>
        <body className="min-h-svh bg-background text-foreground antialiased">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}
