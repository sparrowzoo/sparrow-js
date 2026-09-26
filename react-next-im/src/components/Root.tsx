import * as React from "react";
import {Toaster} from "react-hot-toast";
import {ThemeProvider} from "@/common/components/header/theme-provider";
import ImHeader from "@/components/im-header";

export default async function Root({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <>
            <Toaster position="top-center" reverseOrder={true}/>
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
            >
                <div className="im-shell flex h-dvh flex-col">
                    <ImHeader/>
                    <div className="im-content min-h-0 flex-1 overflow-auto">{children}</div>
                </div>
            </ThemeProvider>
        </>
    );
}
