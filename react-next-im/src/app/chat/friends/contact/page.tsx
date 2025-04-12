"use client";
import * as React from "react";
import { Suspense, useContext } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AVATAR_URL, NEXT_ASSET_PREFIX } from "@/common/lib/Env";
import { DynamicImage } from "@/components/img/DynamicImage";
import DirectSession from "@/components/DirectSession";
import ChatSession from "@/lib/protocol/session/ChatSession";
import ChatUser from "@/lib/protocol/ChatUser";
import { format } from "util";
import { WebSocketContext } from "@/lib/WebSocketProvider";

function Contact() {
  const searchParams = useSearchParams();
  const webSocketContextValue = useContext(WebSocketContext);

  const userId = searchParams?.get("friendId");
  const headSrc = format(AVATAR_URL, userId);

  const sender = ChatUser.getCurrentUser();
  const receiver = new ChatUser(userId as string, ChatUser.CATEGORY_REGISTER);
  const chatSession = ChatSession.create121Session(
    sender as ChatUser,
    receiver
  );
  const contactUrl = `${NEXT_ASSET_PREFIX}/chat/sessions/session?sessionKey=${chatSession.key()}`;
  const contact = webSocketContextValue.messageBroker.getContactFromLocal(
    userId as string
  );

  return (
    <div className={"flex flex-col p-4 bg-white shadow-md"}>
      <div className="flex flex-row items-center text-left">
        <Link href={contactUrl}>
          <DynamicImage
            className={"w-16 h-16 rounded-full mr-4"}
            src={headSrc}
            alt={"Contact Avatar"}
            width={0}
            height={0}
          />
        </Link>
        <div>
          <Link href={contactUrl}>
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
      <DirectSession sessionKey={chatSession.key()} />
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
