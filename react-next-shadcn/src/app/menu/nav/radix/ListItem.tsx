import React from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { cn } from "@/lib/utils";

const ListItem = React.forwardRef(
  (
    {
      className,
      children,
      title,
      href,
    }: {
      className?: string;
      children: React.ReactNode;
      title: string;
      href: string;
    },
    forwardedRef
  ) => (
    <li>
      <NavigationMenu.Link asChild>
        <a
          href={href}
          className={cn(
            "focus:shadow-[0_0_0_2px] focus:shadow-violet7 hover:bg-mauve3 block select-none rounded-[6px] p-3 text-[15px] leading-none no-underline outline-hidden transition-colors",
            className
          )}
        >
          <div className="text-violet12 mb-[5px] font-medium leading-[1.2]">
            {title}
          </div>
          <p className="text-mauve11 leading-[1.4]">{children}</p>
        </a>
      </NavigationMenu.Link>
    </li>
  )
);
ListItem.displayName = "ListItem";

export default ListItem;
