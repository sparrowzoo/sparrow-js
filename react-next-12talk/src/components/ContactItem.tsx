import Link from "next/link";
import * as React from "react";
import { NEXT_ASSET_PREFIX } from "@/common/lib/Env";
import { DynamicImage } from "@/components/img/DynamicImage";
import ChatSession from "@/lib/protocol/ChatSession";
import ChatUser from "@/lib/protocol/ChatUser";
import Contact from "@/lib/protocol/contact/Contact";

interface ContactProps {
  contact: Contact;
}

export default function ContactItem(contactProps: ContactProps) {
    const { contact } = contactProps;
  const headSrc = `/avatar/${contact.userId}.jpg`;
  const sessionKey=ChatSession.create121Session(ChatUser.getCurrentUser() as ChatUser,new ChatUser(contact.userId+"",ChatUser.CATEGORY_REGISTER)).key();
  const sessionUrl=`${NEXT_ASSET_PREFIX}/chat/sessions/session?sessionKey=${sessionKey}`;
  //const contactUrl = `${NEXT_ASSET_PREFIX}/chat/friends/contact?friendId=${contact.userId}`;
  return (
    <div className="flex items-center text-left">
      <Link href={sessionUrl}>
        <DynamicImage
          src={headSrc}
          alt={"header"}
          width={50}
          height={50}
          className={"w-16 h-16 rounded-full mr-4"}
        />
      </Link>
      <div>
        <Link href={sessionUrl}>
          <strong>{contact.userName}-{contact.userId}</strong>
          <br />
          <span>{contact.nationality}</span>
        </Link>
      </div>
    </div>
  );
}
