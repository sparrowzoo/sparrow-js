"use client";
import { useRouter } from "@/common/i18n/navigation";
import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { AdminContext } from "@/lib/admin/AdminContextProvider";

export default function Page() {
  const router = useRouter();
  const adminContext = useContext(AdminContext);

  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>About Page</h1>
      <p>This is the about page of the React Next Admin Template.</p>
      Count: {count}
      <Button onClick={() => setCount(count + 1)}>Increment</Button>
      <br />
      <Button onClick={() => router.push("/dashboard")}>Dashboard</Button>
      <br />
      <Button onClick={() => router.push("/access-history")}>
        Access History
      </Button>
      <Button onClick={() => router.back()}>Back</Button>
      <h1>带历史记录操作</h1>
      <Button
        onClick={() => {
          adminContext.adminBroker.access("/access-history", router);
        }}
      >
        历史记录
      </Button>
      <Button
        onClick={() => {
          adminContext.adminBroker.access("/dashboard", router);
        }}
      >
        Dashboard
      </Button>
    </div>
  );
}
