import * as React from "react";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/common/components/header/theme-provider";
import Header from "@/common/components/header/header";

export default async function Root({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log("Root component rendered");

  return (
    <>
      <Toaster position="top-center" reverseOrder={true} />
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <Header showProfile={true} />
        {children}
      </ThemeProvider>
    </>
  );
}
