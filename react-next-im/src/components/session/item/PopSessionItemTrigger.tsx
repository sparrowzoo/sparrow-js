import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import * as React from "react";
import { useContext } from "react";
import Session from "@/components/session/Session";
import ChatSession from "@/lib/protocol/session/ChatSession";
import BaseTrigger from "@/components/session/item/BaseTrigger";
import { Position } from "@/lib/protocol/ItemProps";
import { WebSocketContext } from "@/lib/im/WebSocketProvider";

interface DialogProps {
  session: ChatSession;
}

export default function PopSessionItemTrigger(dialogProps: DialogProps) {
  const { session } = dialogProps;
  console.log("PopSessionItemTrigger", session);
  const [isOpen, setIsOpen] = React.useState(session.pop);
  const webSocketContextValue = useContext(WebSocketContext);
  const sessionsPromise =
    webSocketContextValue.messageBroker.sessionContainer.getChatSessions();

  return (
    <Popover open={isOpen}>
      <PopoverTrigger
        onClick={async () => {
          await sessionsPromise.then((sessions) => {
            sessions?.forEach((s) => {
              s.pop = false;
            });
          });
          session.pop = !isOpen;
          setIsOpen(session.pop);
          webSocketContextValue.messageBroker.newMessageSignal();
        }}
        className={"w-full flex flex-row gap-4"}
      >
        <BaseTrigger unreadPosition={Position.TAIL} chatSession={session} />
      </PopoverTrigger>
      <PopoverContent
        sideOffset={10}
        className={"w-fit h-fit"}
        alignOffset={0}
        draggable={"true"}
        side={"left"}
        align={"center"}
      >
        <SidebarProvider className={"w-fit h-fit min-h-full"}>
          <Sidebar className={"relative min-h-full w-[600px] h-[600px]"}>
            <Session sessionKey={session.sessionKey} />
          </Sidebar>
        </SidebarProvider>
      </PopoverContent>
    </Popover>
  );
}
