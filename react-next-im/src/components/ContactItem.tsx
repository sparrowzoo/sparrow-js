import * as React from "react";
import { AVATAR_URL, NEXT_ASSET_PREFIX } from "@/common/lib/Env";
import ChatSession from "@/lib/protocol/session/ChatSession";
import ChatUser from "@/lib/protocol/ChatUser";
import Contact from "@/lib/protocol/contact/Contact";
import {
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { DynamicImage } from "@/components/img/DynamicImage";
import { format } from "util";

interface ContactProps {
  contact: Contact;
}

export default function ContactItem(contactProps: ContactProps) {
  const { contact } = contactProps;
  const avatar = format(AVATAR_URL, contact.userId);
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
          <DynamicImage
            src={avatar}
            alt={"header"}
            width={0}
            height={0}
            className={"w-8 h-8 rounded-full mr-4"}
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
