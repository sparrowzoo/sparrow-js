"use client";
import * as React from "react";
import { Suspense, useContext } from "react";
import { useSearchParams } from "next/navigation";
import { AVATAR_URL } from "@/common/lib/Env";
import DirectSession from "@/components/session/DirectSession";
import ChatSession from "@/lib/protocol/session/ChatSession";
import ChatUser from "@/lib/protocol/ChatUser";
import { format } from "util";
import { WebSocketContext } from "@/lib/im/WebSocketProvider";
import Contact from "@/lib/protocol/contact/Contact";
import UserCategory from "@/common/lib/UserCategory";
import MyAvatar from "@/components/MyAvatar";
import { Link } from "@/common/i18n/navigation";

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
  const userName = contact.nickName ? contact.nickName : contact.userName;
  friend = new ChatUser(contact.userId, contact.category);
  const chatSession = ChatSession.create121Session(
    currentUser as ChatUser,
    friend
  );
  if (!friendId) {
    return <h1></h1>;
  }

  return (
    <div className={"flex flex-col p-4 shadow-md"}>
      <div className="flex flex-row items-center gap-4 text-left">
        <Link href={chatSession.sessionUrl}>
          <MyAvatar
            unread={0}
            showUnread={false}
            fallback={userName}
            src={headSrc}
          />
        </Link>
        <div>
          <Link href={chatSession.sessionUrl}>
            <strong>
              {contact?.nickName} {contact?.nationality}
            </strong>
            <br />
            <label className={"w-10 inline-block"}>帐号</label>
            <span>
              {contact.userName} ID:{contact.userId}
            </span>
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
