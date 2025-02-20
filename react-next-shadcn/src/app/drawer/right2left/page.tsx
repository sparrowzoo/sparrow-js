"use client";

import { Drawer } from "vaul";

export default function Page() {
  return (
    <Drawer.Root direction="right">
      <Drawer.Trigger asChild>
        <button>Open Drawer</button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] h-full w-[400px] mt-24 fixed bottom-0 right-0">
          <div className="p-4 bg-white flex-1 h-full">
            <div className="max-w-md mx-auto">
              <Drawer.Title className="font-medium mb-4 bg-black">
                这里是标题
              </Drawer.Title>
              <p className="text-zinc-600 mb-8 gb-black">
                <form>
                  <input
                    className={"border border-solid border-red-900"}
                    type={"text"}
                  />
                </form>
              </p>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
