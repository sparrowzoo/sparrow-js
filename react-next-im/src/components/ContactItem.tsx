import * as React from "react";
import { NEXT_ASSET_PREFIX } from "@/common/lib/Env";
import Contact from "@/lib/protocol/contact/Contact";
import CommonItem from "@/components/CommonItem";

interface ContactProps {
  contact: Contact;
}

export default function ContactItem(contactProps: ContactProps) {
  const { contact } = contactProps;
  const contactUrl = `${NEXT_ASSET_PREFIX}/chat/friends/contact?friendId=${contact.userId}`;
  return (
    <CommonItem
      id={contact.userId}
      name={contact.nickName}
      description={contact.signature}
      link={contactUrl}
      avatar={contact.avatar}
      nationality={contact.nationality}
    />
  );
}
