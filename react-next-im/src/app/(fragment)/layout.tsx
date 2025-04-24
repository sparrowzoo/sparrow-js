import "./globals.css";
import * as React from "react";

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
  return <>{children}</>;
}
