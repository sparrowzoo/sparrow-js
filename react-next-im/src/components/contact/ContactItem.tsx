import * as React from "react";
import Contact from "@/lib/protocol/contact/Contact";
import CommonItem from "@/components/CommonItem";
import { SidebarMenuItem } from "@/components/ui/sidebar";

interface ContactProps {
  contact: Contact;
}

export default function ContactItem(contactProps: ContactProps) {
  const { contact } = contactProps;
  const contactUrl = `/chat/friends/contact?friendId=${contact.userId}`;
  return (
    <SidebarMenuItem>
      <CommonItem
        id={contact.userId}
        name={contact.nickName ? contact.nickName : contact.userName}
        description={contact.signature}
        link={contactUrl}
        avatar={contact.avatar}
        nationality={contact.nationality}
      />
    </SidebarMenuItem>
  );
}
