import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import React from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import ListItem from "@/app/menu/nav/radix/ListItem";

export default function Page() {
  return (
    <div>
      <h1>Horizontal Nav</h1>
      <NavigationMenu.Root
        orientation="horizontal"
        className="relative z-[1] bg-black flex w-full justify-center"
      >
        <NavigationMenu.List className="center shadow-blackA4 m-0 flex gap-[10px] rounded-[6px] text-white bg-block p-1 shadow-[0_2px_10px]">
          <NavigationMenu.Item>
            <NavigationMenu.Trigger className="text-violet11 bg-block hover:bg-violet3 focus:shadow-violet7 group flex select-none items-center justify-between gap-[2px] rounded-[4px] px-3 py-2 text-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]">
              Learn{" "}
              <ChevronDownIcon
                className="relative top-[1px] ml-1 h-3 w-3 transition duration-300 group-data-[state=open]:rotate-180"
                aria-hidden="true"
              />
            </NavigationMenu.Trigger>
            <NavigationMenu.Content className="data-[motion=from-start]:animate-enterFromLeft bg-block data-[motion=from-end]:animate-enterFromRight data-[motion=to-start]:animate-exitToLeft data-[motion=to-end]:animate-exitToRight absolute top-0 left-0 w-full sm:w-auto">
              <ul className="one m-0 grid bg-block list-none gap-x-[10px] p-[22px] sm:w-[500px] sm:grid-cols-[0.75fr_1fr]">
                <li className="row-span-3 grid">
                  <div className="bg-block mt-4 mb-[7px] text-[18px] font-medium leading-[1.2] text-white">
                    Radix Primitives
                  </div>
                </li>
                <ListItem title="Stitches" href="/stitches">
                  CSS-in-JS with best-in-class developer experience.
                </ListItem>
                <ListItem title="Colors" href="/colors">
                  Beautiful, thought-out palettes with auto dark mode.
                </ListItem>
                <ListItem
                  href="https://radix-ui.com/primitives/docs/components/icons"
                  title="Icons"
                >
                  A crisp set of 15x15 icons, balanced and consistent.
                </ListItem>
              </ul>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <NavigationMenu.Trigger className="text-violet11 hover:bg-violet3 focus:shadow-violet7 group flex select-none items-center justify-between gap-[2px] rounded-[4px] px-3 py-2 text-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]">
              Overview{" "}
              <ChevronDownIcon
                className="relative top-[1px] ml-1 h-3 w-3 transition duration-300 group-data-[state=open]:rotate-180"
                aria-hidden="true"
              />
            </NavigationMenu.Trigger>
            <NavigationMenu.Content className="bg-block absolute top-0 left-0 w-full sm:w-auto">
              <ul className="m-0 grid list-none gap-x-[10px] p-[22px] sm:w-[600px] sm:grid-flow-col sm:grid-rows-3">
                <ListItem
                  title="Introduction"
                  href="/primitives/docs/overview/introduction"
                >
                  Build high-quality, accessible design systems and web apps.
                </ListItem>
                <ListItem
                  href="/primitives/docs/overview/installation"
                  title="Getting started"
                >
                  A quick tutorial to get you up and running with Radix
                  Primitives.
                </ListItem>
                <ListItem
                  title="Styling"
                  href="/primitives/docs/overview/styling"
                >
                  Unstyled and compatible with any styling solution.
                </ListItem>
                <ListItem
                  title="Animation"
                  href="/primitives/docs/overview/animation"
                >
                  Use CSS keyframes or any animation library of your choice.
                </ListItem>
                <ListItem
                  title="Accessibility"
                  href="/primitives/docs/overview/accessibility"
                >
                  Tested in a range of browsers and assistive technologies.
                </ListItem>
                <ListItem
                  title="Releases"
                  href="/primitives/docs/overview/releases"
                >
                  Radix Primitives releases and their changelogs.
                </ListItem>
              </ul>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <NavigationMenu.Link
              className="text-violet11  hover:bg-violet3 focus:shadow-violet7 block select-none rounded-[4px] px-3 py-2 text-[15px] font-medium leading-none no-underline outline-none focus:shadow-[0_0_0_2px]"
              href="https://github.com/radix-ui"
            >
              Github
            </NavigationMenu.Link>
          </NavigationMenu.Item>

          <NavigationMenu.Indicator className="data-[state=visible]:animate-fadeIn data-[state=hidden]:animate-fadeOut top-full z-[1] flex h-[10px] items-end justify-center overflow-hidden transition-[width,transform_250ms_ease]">
            <div className="relative top-[70%] h-[10px] w-[10px] rotate-[45deg] rounded-tl-[2px] bg-block" />
          </NavigationMenu.Indicator>
        </NavigationMenu.List>
        <div className="absolute border border-sky-500 z-[20] top-full left-0 flex w-full justify-center">
          <NavigationMenu.Viewport className=" border bordre-sky-500 z-[20] top-full left-0 flex w-full justify-center data-[state=open]:animate-scaleIn data-[state=closed]:animate-scaleOut relative mt-[10px] h-[var(--radix-navigation-menu-viewport-height)] w-full origin-[top_center] overflow-hidden rounded-[6px] bg-block transition-[width,_height] duration-300 sm:w-[var(--radix-navigation-menu-viewport-width)]" />
        </div>
      </NavigationMenu.Root>
    </div>
  );
}
