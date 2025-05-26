"use client";
import { useRouter } from "@/common/i18n/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Page() {
  const router = useRouter();

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
      <Button onClick={() => router.push("/about")}>About</Button>
      <Button onClick={() => router.back()}>Back</Button>
    </div>
  );
}
