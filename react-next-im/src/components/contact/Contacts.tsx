"use client";
import ContactItem from "@/components/contact/ContactItem";
import * as React from "react";
import Contact from "@/lib/protocol/contact/Contact";
import { SidebarMenu } from "@/components/ui/sidebar";
import {Link} from "@/common/i18n/navigation";
import ThreeDotLoading from "@/common/components/ThreeDotLoading";

interface ContactsProps {
  contacts: Contact[] | undefined;
}

export default function Contacts(contactsProps: ContactsProps) {
  if (!contactsProps.contacts) {
    return <ThreeDotLoading />;
  }
  if (contactsProps.contacts.length === 0) {
    return (
      <Link className={"im-contact-empty text-center font-bold text-sm"} href={"/"}>
        No contacts found.
      </Link>
    );
  }
  return (
    <SidebarMenu className={"im-contact-list gap-2"}>
      {contactsProps?.contacts?.map((contact) => (
        <ContactItem contact={contact} key={contact.userId + ""} />
      ))}
    </SidebarMenu>
  );
}
