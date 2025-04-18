"use client";
import ContactItem from "@/components/pop/ContactItem";
import * as React from "react";
import Contact from "@/lib/protocol/contact/Contact";
import { SidebarMenu } from "@/components/ui/sidebar";
import Link from "next/link";
import ThreeDotLoading from "@/common/components/ThreeDotLoading";

interface ContactsProps {
  contacts: Contact[] | undefined;
}

export default function Contacts(contactsProps: ContactsProps) {
  console.log(contactsProps.contacts);

  if (!contactsProps.contacts) {
    return <ThreeDotLoading />;
  }
  if (contactsProps.contacts.length === 0) {
    return (
      <Link className={"text-center font-bold text-sm"} href={"/"}>
        please server admin to add you to client server
      </Link>
    );
  }
  return (
    <SidebarMenu className={"gap-4"}>
      {contactsProps?.contacts?.map((contact) => (
        <ContactItem contact={contact} key={contact.userId} />
      ))}
    </SidebarMenu>
  );
}
