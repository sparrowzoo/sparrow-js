import * as React from "react";
import Contact from "@/lib/protocol/contact/Contact";
import {
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Dialog from "@/components/pop/Dialog";

interface ContactProps {
  contact: Contact;
}

export default function ContactItem(contactProps: ContactProps) {
  const { contact } = contactProps;
  return (
    <SidebarMenuItem className={"gap-2"}>
      <SidebarMenuButton className={"flex flex-row gap-4"}>
        <Dialog contact={contact} />
      </SidebarMenuButton>
      <SidebarMenuBadge></SidebarMenuBadge>
    </SidebarMenuItem>
  );
}
