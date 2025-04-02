import ContactItem from "@/components/ContactItem";
import * as React from "react";
import Contact from "@/lib/protocol/contact/Contact";

interface ContactsProps {
  contacts: Contact[] | undefined;
}

export default function Contacts(contactsProps: ContactsProps) {
  if (!contactsProps.contacts) {
    return <div>loading...</div>;
  }
  return (
    <div className={"flex flex-col gap-2"}>
      {contactsProps?.contacts?.map((contact) => (
        <ContactItem contact={contact} key={contact.userId + ""} />
      ))}
    </div>
  );
}
