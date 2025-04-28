"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/header/theme-provider";
import Header from "@/components/header/header";
import ThreeDotLoading from "@/common/components/ThreeDotLoading";

export default function Root({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);
  if (loading) {
    return <ThreeDotLoading />;
  }
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
