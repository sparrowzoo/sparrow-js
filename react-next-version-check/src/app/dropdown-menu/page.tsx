"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// @ts-ignore
import md from "./error.md";
import BadCaseShower from "@/components/BadCaseShower";

export default function ModeToggle() {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => console.log("light")}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => console.log("dark")}>
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => console.log("system")}>
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <BadCaseShower
        right={'"next": "14.2.5"'}
        wrong={'"next": "14.2.5"'}
        markdown={md}
      />
    </div>
  );
}
