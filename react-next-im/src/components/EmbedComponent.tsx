// components/EmbedComponent.tsx
"use client";

import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import Login from "@/components/Login";

export default function EmbedComponent() {
  useEffect(() => {
    const container = document.getElementById("content-container");
    if (!container) return;

    const root = createRoot(container);
    root.render(<Login />);

    return () => root.unmount();
  }, []);

  return null;
}
