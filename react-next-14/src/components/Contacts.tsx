import ContactItem from "@/components/ContactItem";
import * as React from "react";
import Contact from "@/lib/protocol/contact/Contact";
import LoadingSpinner from "@/common/components/LoadingSpinner";

interface ContactsProps {
  contacts: Contact[] | undefined;
}

export default function Contacts(contactsProps: ContactsProps) {
  if (!contactsProps.contacts) {
    return <LoadingSpinner />;
  }
  if (contactsProps.contacts.length === 0) {
    return <div className={"text-center text-gray-500"}>快去加好友去</div>;
  }
  return (
    <div className={"flex flex-col gap-2"}>
      {contactsProps?.contacts?.map((contact) => (
        <ContactItem contact={contact} key={contact.userId + ""} />
      ))}
    </div>
  );
}
