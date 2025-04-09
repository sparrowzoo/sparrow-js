"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <body>
      <SidebarProvider>
        <AppSidebar />

        <main>
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </body>
  );
}
