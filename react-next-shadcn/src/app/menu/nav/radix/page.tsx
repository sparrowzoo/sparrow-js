import React from "react";
import {cn} from "@/lib/utils";
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


            <NavigationMenu.Root orientation="vertical">
                <NavigationMenu.List>
                    <NavigationMenu.Item>
                        <NavigationMenu.Trigger>Item one</NavigationMenu.Trigger>
                        <NavigationMenu.Content
                            className="bg-white left-20 border absolute w-full sm:w-auto">
                            <ul className="m-0 grid list-none gap-x-[10px] p-[22px] sm:w-[600px] sm:grid-flow-col sm:grid-rows-3">
                                <ListItem
                                    title="Introduction"
                                    props={{href: "/primitives/docs/overview/introduction"}}
                                >
                                    Build high-quality, accessible design systems and web apps.
                                </ListItem>
                                <ListItem
                                    props={{href: "/primitives/docs/overview/installation"}}
                                    title="Getting started"
                                >
                                    A quick tutorial to get you up and running with Radix
                                    Primitives.
                                </ListItem>
                                <ListItem
                                    title="Styling"
                                    props={{href: "/primitives/docs/overview/styling"}}
                                >
                                    Unstyled and compatible with any styling solution.
                                </ListItem>
                                <ListItem
                                    title="Animation"
                                    props={{href: "/primitives/docs/overview/animation"}}
                                >
                                    Use CSS keyframes or any animation library of your choice.
                                </ListItem>
                                <ListItem
                                    title="Accessibility"
                                    props={{href: "/primitives/docs/overview/accessibility"}}
                                >
                                    Tested in a range of browsers and assistive technologies.
                                </ListItem>
                                <ListItem
                                    title="Releases"
                                    props={{href: "/primitives/docs/overview/releases"}}
                                >
                                    Radix Primitives releases and their changelogs.
                                </ListItem>
                            </ul>
                        </NavigationMenu.Content>
                    </NavigationMenu.Item>
                    <NavigationMenu.Item>
                        <NavigationMenu.Trigger>Item two</NavigationMenu.Trigger>
                        <NavigationMenu.Content className="bg-white left-20 text-black absolute w-full sm:w-auto">
                            <ul className="m-0 grid list-none gap-x-[10px] p-[22px] sm:w-[600px] sm:grid-flow-col sm:grid-rows-3">
                                <ListItem
                                    title="Introduction"
                                    props={{href: "/primitives/docs/overview/introduction"}}
                                >
                                    Build high-quality, accessible design systems and web apps.
                                </ListItem>
                                <ListItem
                                    props={{href: "/primitives/docs/overview/installation"}}
                                    title="Getting started"
                                >
                                    A quick tutorial to get you up and running with Radix
                                    Primitives.
                                </ListItem>
                                <ListItem
                                    title="Styling"
                                    props={{href: "/primitives/docs/overview/styling"}}
                                >
                                    Unstyled and compatible with any styling solution.
                                </ListItem>
                                <ListItem
                                    title="Animation"
                                    props={{href: "/primitives/docs/overview/animation"}}
                                >
                                    Use CSS keyframes or any animation library of your choice.
                                </ListItem>
                                <ListItem
                                    title="Accessibility"
                                    props={{href: "/primitives/docs/overview/accessibility"}}
                                >
                                    Tested in a range of browsers and assistive technologies.
                                </ListItem>
                                <ListItem
                                    title="Releases"
                                    props={{href: "/primitives/docs/overview/releases"}}
                                >
                                    Radix Primitives releases and their changelogs.
                                </ListItem>
                            </ul>
                        </NavigationMenu.Content>
                    </NavigationMenu.Item>
                </NavigationMenu.List>
            </NavigationMenu.Root>

            <NavigationMenu.Root className={"bg-black border"}>
                <NavigationMenu.List>
                    <NavigationMenu.Item>
                        <NavigationMenu.Trigger>菜单</NavigationMenu.Trigger>
                        <NavigationMenu.Content className={"border border-red-700"}>菜单内容</NavigationMenu.Content>
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
                                                        <NavigationMenu.Trigger>子菜单一 子菜单</NavigationMenu.Trigger>
                                                        <NavigationMenu.Content className={"border border-red-700"}>
                                                            <NavigationMenu.Sub defaultValue="sub1">
                                                                <NavigationMenu.List>
                                                                    <NavigationMenu.Item value="sub1">
                                                                        <NavigationMenu.Trigger>Sub item one</NavigationMenu.Trigger>
                                                                        <NavigationMenu.Content>
                                                                            Sub item one content
                                                                        </NavigationMenu.Content>
                                                                    </NavigationMenu.Item>
                                                                    <NavigationMenu.Item value="sub2">
                                                                        <NavigationMenu.Trigger>Sub item two</NavigationMenu.Trigger>
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
};

