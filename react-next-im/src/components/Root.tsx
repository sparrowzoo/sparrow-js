"use client";
import * as React from "react";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/header/theme-provider";
import Header from "@/components/header/header";

export default function Root({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Toaster position="top-center" reverseOrder={true} />
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <Header />
        {children}
      </ThemeProvider>
    </>
  );
}
