"use client";
import * as React from "react";
import { Suspense, useContext } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AVATAR_URL } from "@/common/lib/Env";
import { DynamicImage } from "@/components/img/DynamicImage";
import DirectSession from "@/components/session/DirectSession";
import ChatSession from "@/lib/protocol/session/ChatSession";
import ChatUser from "@/lib/protocol/ChatUser";
import { format } from "util";
import { WebSocketContext } from "@/lib/im/WebSocketProvider";
import Contact from "@/lib/protocol/contact/Contact";
import UserCategory from "@/common/lib/UserCategory";

function ContactDetail() {
  const searchParams = useSearchParams();
  const webSocketContextValue = useContext(WebSocketContext);

  const friendId = searchParams?.get("friendId");

  const currentUser = ChatUser.getCurrentUser();
  let friend = new ChatUser(friendId as string, UserCategory.REGISTER);
  const contact =
    webSocketContextValue.messageBroker.contactContainer.getContactDetail(
      friend
    ) as Contact;
  const headSrc = contact.avatar
    ? contact.avatar
    : format(AVATAR_URL, friendId);
  friend = new ChatUser(contact.userId, contact.category);
  const chatSession = ChatSession.create121Session(
    currentUser as ChatUser,
    friend
  );
  if (!friendId) {
    return <h1>欢迎来到志哥聊编程</h1>;
  }

  return (
    <div className={"flex flex-col p-4 shadow-md"}>
      <div className="flex flex-row items-center text-left">
        <Link href={chatSession.sessionUrl}>
          <DynamicImage
            className={"w-16 h-16 rounded-full mr-4"}
            src={headSrc}
            alt={"Contact Avatar"}
            width={0}
            height={0}
          />
        </Link>
        <div>
          <Link href={chatSession.sessionUrl}>
            <strong>
              {contact?.nickName} {contact?.nationality}
            </strong>
            <br />
            <label className={"w-10 inline-block"}>帐号</label>
            <span>{contact.userName}</span>
            <br />
            <label className={"w-10 inline-block"}>ID:</label>
            <span> {contact.userId}</span>
          </Link>
        </div>
      </div>
      <p className={"mt-2 text-gray-500 text-left text-sm"}>
        {contact.signature}
      </p>
      <DirectSession sessionKey={chatSession.sessionKey} />
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense>
      <ContactDetail />
    </Suspense>
  );
}
