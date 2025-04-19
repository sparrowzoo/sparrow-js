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

function Contact() {
  const searchParams = useSearchParams();
  const webSocketContextValue = useContext(WebSocketContext);

  const friendId = searchParams?.get("friendId");
  const headSrc = format(AVATAR_URL, friendId);

  const currentUser = ChatUser.getCurrentUser();
  const friend = new ChatUser(friendId as string, ChatUser.CATEGORY_REGISTER);
  const chatSession = ChatSession.create121Session(
    currentUser as ChatUser,
    friend
  );
  const contact =
    webSocketContextValue.messageBroker.contactContainer.getContactDetail(
      friend
    );

  return (
    <div className={"flex flex-col p-4 bg-white shadow-md"}>
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
              {contact?.userName} ID:{contact?.nationality}
            </strong>
            <br />
            <span>{}</span>
          </Link>
        </div>
      </div>
      <p className={"mt-2 text-gray-500 text-left text-sm"}>
        {contact?.userName}{" "}
      </p>
      <DirectSession sessionKey={chatSession.sessionKey} />
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense>
      <Contact />
    </Suspense>
  );
}
