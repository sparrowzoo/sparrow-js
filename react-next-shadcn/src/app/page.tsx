"use client";
import { DirectionProvider } from "@radix-ui/react-direction";

export default function Home() {
  return (
    <DirectionProvider dir={"rtl"}>
      <div className="bg-background text-foreground">
        To use CSS variables for theming set tailwind.cssVariables to true in
        your components.json file. className="bg-background text-foreground"
      </div>
      <div className="bg-zinc-950 dark:bg-white">
        Utility classes className="bg-zinc-950 dark:bg-white" "cssVariables":
        false
      </div>

      <div className="bg-primary text-primary-foreground">Hello</div>
    </DirectionProvider>
  );
}
