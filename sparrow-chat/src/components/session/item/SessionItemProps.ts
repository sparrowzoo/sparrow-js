import ChatSession from "@/common/lib/protocol/messaging/ChatSession";
import { Position } from "@/lib/protocol/ItemProps";

export default interface SessionItemProps {
  chatSession: ChatSession;
  unreadPosition?: Position;
  triggerType?: "POP" | "LINK";
}
