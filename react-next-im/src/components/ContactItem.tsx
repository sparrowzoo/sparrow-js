import * as React from "react";
import { NEXT_ASSET_PREFIX } from "@/common/lib/Env";
import ChatSession from "@/lib/protocol/session/ChatSession";
import ChatUser from "@/lib/protocol/ChatUser";
import Contact from "@/lib/protocol/contact/Contact";
import {
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import MyAvatar from "@/components/MyAvatar";

interface ContactProps {
  contact: Contact;
}

export default function ContactItem(contactProps: ContactProps) {
  const { contact } = contactProps;
  const sessionKey = ChatSession.create121Session(
    ChatUser.getCurrentUser() as ChatUser,
    new ChatUser(contact.userId + "", ChatUser.CATEGORY_REGISTER)
  ).key();
  const sessionUrl = `${NEXT_ASSET_PREFIX}/chat/sessions/session?sessionKey=${sessionKey}`;
  const contactUrl = `${NEXT_ASSET_PREFIX}/chat/friends/contact?friendId=${contact.userId}`;
  return (
    <SidebarMenuItem className={"gap-2"}>
      <SidebarMenuButton asChild>
        <Link href={contactUrl}>
          <MyAvatar
            fallback={contact?.userName as string}
            src={contact.avatar}
          />
          <span>
            {contact.userName}-{contact.userId}
          </span>
        </Link>
      </SidebarMenuButton>
      <SidebarMenuBadge></SidebarMenuBadge>
    </SidebarMenuItem>
  );
}
