import "@/app/globals.css";
import { Metadata, Viewport } from "next";
import * as React from "react";
import Root from "@/components/Root";

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

/**
 * The root layout is defined at the top level of the app directory and applies to all routes.
 * This layout is required and must contain html and body tags,
 * allowing you to modify the initial HTML returned from the server.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body
        className={
          "mx-auto text-left justify-center align-middle content-center w-full "
        }
      >
        <Root>{children}</Root>
      </body>
    </html>
  );
}
