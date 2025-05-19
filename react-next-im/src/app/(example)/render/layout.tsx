import "@/app/globals.css";
import { Metadata, Viewport } from "next";
import * as React from "react";

export const metadata: Metadata = {
  title: "sparrow zoo",
  description: "welcome to sparrow zoo",
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log("html layout rendered");

  return (
    <html>
      <body
        className={
          "mx-auto text-left justify-center align-middle content-center w-full "
        }
      >
        {children}
      </body>
    </html>
  );
}
