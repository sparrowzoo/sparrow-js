import React from "react";
import { createRoot } from "react-dom/client";
import Page from "./page";

const root = createRoot(document.getElementById("app")!);
root.render(<Page />);
