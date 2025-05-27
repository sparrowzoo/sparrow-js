"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React, { useContext } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { AdminContext } from "@/lib/admin/AdminContextProvider";
import { useRouter } from "@/common/i18n/navigation";
import { Button } from "@/components/ui/button";

export default function Page() {
  const router = useRouter();
  const adminContext = useContext(AdminContext);

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">
                Building Your Application
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Data Fetching</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <ResizablePanelGroup className="h-full" direction="horizontal">
          <ResizablePanel
            className="border-1 w-[200px] h-full"
            minSize={25}
            maxSize={45}
            defaultSize={25}
          ></ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel
            minSize={25}
            maxSize={75}
            defaultSize={75}
          ></ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50">
          <Button
            onClick={() => {
              adminContext.adminBroker.access("/dashboard", router);
            }}
          >
            Dashboard
          </Button>
          <br />
          <Button
            onClick={() => {
              adminContext.adminBroker.access("/access-history", router);
            }}
          >
            Access History
          </Button>
          <Button onClick={() => router.back()}>Back</Button>
        </div>
        <div className="aspect-video rounded-xl bg-muted/50"></div>
        <div className="aspect-video rounded-xl bg-muted/50"></div>
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min"></div>
    </>
  );
}
