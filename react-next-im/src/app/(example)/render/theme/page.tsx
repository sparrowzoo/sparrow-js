'use client'
import {ThemeProvider} from "next-themes";
import * as React from "react";

export default function Mode() {
    return <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
    >
        <div>hi</div>
        {/*<Header showProfile={true}/>*/}

    </ThemeProvider>
}
