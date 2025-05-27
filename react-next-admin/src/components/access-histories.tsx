import React, { useContext } from "react";
import { AdminContext } from "@/lib/admin/AdminContextProvider";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/common/i18n/navigation";
import { X } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function AccessHistories() {
  const adminContext = useContext(AdminContext);
  const router = useRouter();
  const accessHistories =
    adminContext.adminBroker.accessHistoryContainer.getAccessHistories();
  return (
    <div className={"flex flex-row items-center justify-start  gap-4"}>
      <SidebarTrigger className="-ml-1"></SidebarTrigger>
      <Separator orientation="vertical" className="mr-2 h-4"></Separator>

      {accessHistories.map((history) => {
        return (
          <div className={"flex flex-row items-center justify-center"}>
            <Button
              className={"p-0 m-0"}
              onClick={() => {
                adminContext.adminBroker.access(history.url, router);
              }}
              variant={"link"}
              key={history.url}
            >
              {history.title}
            </Button>
            <X
              onClick={() =>
                adminContext.adminBroker.deleteHistory(history.url)
              }
              className={
                "w-4 h-4 text-xs hover:bg-gray-300 hover:text-foreground cursor-pointer"
              }
            />
          </div>
        );
      })}
    </div>
  );
}
