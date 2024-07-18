import React from "react";
import { cn } from "@/lib/utils";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";

const ListItem = React.forwardRef(
  (
    {
      className,
      children,
      title,
      ...props
    }: {
      className?: string;
      children: React.ReactNode;
      title: string;
      props: any;
    },
    forwardedRef
  ) => (
    <li>
      <NavigationMenu.Link asChild>
        <a
          className={cn(
            "focus:shadow-[0_0_0_2px] focus:shadow-violet7 hover:bg-mauve3 block select-none rounded-[6px] p-3 text-[15px] leading-none no-underline outline-none transition-colors",
            className
          )}
          {...props}
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

export default function Page() {
  return (
    <div className="h-screen w-screen">
      <NavigationMenu.Root className={"bg-black border"}>
        <NavigationMenu.List>
          <NavigationMenu.Item>
            <NavigationMenu.Trigger>菜单</NavigationMenu.Trigger>
            <NavigationMenu.Content className={"border border-red-700"}>
              菜单内容
            </NavigationMenu.Content>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Trigger>菜单2</NavigationMenu.Trigger>
            <NavigationMenu.Content className={"bg-black border"}>
              <NavigationMenu.Sub defaultValue="sub1">
                <NavigationMenu.List>
                  <NavigationMenu.Item value="sub1-2">
                    <NavigationMenu.Trigger>子菜单一</NavigationMenu.Trigger>
                    <NavigationMenu.Content>
                      <NavigationMenu.Sub defaultValue="sub1-2">
                        <NavigationMenu.List>
                          <NavigationMenu.Item value="sub1-1">
                            <NavigationMenu.Trigger>
                              子菜单一 子菜单
                            </NavigationMenu.Trigger>
                            <NavigationMenu.Content
                              className={"border border-red-700"}
                            >
                              <NavigationMenu.Sub defaultValue="sub1">
                                <NavigationMenu.List>
                                  <NavigationMenu.Item value="sub1">
                                    <NavigationMenu.Trigger>
                                      Sub item one
                                    </NavigationMenu.Trigger>
                                    <NavigationMenu.Content>
                                      Sub item one content
                                    </NavigationMenu.Content>
                                  </NavigationMenu.Item>
                                  <NavigationMenu.Item value="sub2">
                                    <NavigationMenu.Trigger>
                                      Sub item two
                                    </NavigationMenu.Trigger>
                                    <NavigationMenu.Content>
                                      Sub item two content
                                    </NavigationMenu.Content>
                                  </NavigationMenu.Item>
                                </NavigationMenu.List>
                              </NavigationMenu.Sub>
                            </NavigationMenu.Content>
                          </NavigationMenu.Item>
                        </NavigationMenu.List>
                      </NavigationMenu.Sub>
                    </NavigationMenu.Content>
                  </NavigationMenu.Item>
                  <NavigationMenu.Item value="sub2">
                    <NavigationMenu.Trigger>子菜单二</NavigationMenu.Trigger>
                    <NavigationMenu.Content className={"border border-red-700"}>
                      子菜单二内容
                    </NavigationMenu.Content>
                  </NavigationMenu.Item>
                  <NavigationMenu.Item value="sub3">
                    <NavigationMenu.Trigger>子菜单三</NavigationMenu.Trigger>
                    <NavigationMenu.Content className={"border border-red-700"}>
                      子菜单三内容
                    </NavigationMenu.Content>
                  </NavigationMenu.Item>
                </NavigationMenu.List>
              </NavigationMenu.Sub>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </div>
  );
}
