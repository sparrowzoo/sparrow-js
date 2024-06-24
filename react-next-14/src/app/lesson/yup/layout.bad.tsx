import type {Metadata} from "next";
import React from "react";

export const metadata: Metadata = {
    title: "掘土",
    description: "axtlive zhanglizhi",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        {children}
        </html>
    )
}
