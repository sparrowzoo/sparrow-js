"use client";
import * as React from "react";
import { Suspense, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { format } from "util";
import { AVATAR_URL } from "@/common/lib/Env";
import ChatSession from "@/lib/protocol/session/ChatSession";
import { WebSocketContext } from "@/lib/im/WebSocketProvider";
import DirectSession from "@/components/session/DirectSession";
import MyAvatar from "@/components/MyAvatar";
import QunDetailWrap from "@/lib/protocol/contact/QunDetailWrap";
import ThreeDotLoading from "@/common/components/ThreeDotLoading";

function Group() {
  const searchParams = useSearchParams();
  const groupId = searchParams?.get("groupId");
  const webSocketContextValue = useContext(WebSocketContext);
  const messageBroker = webSocketContextValue.messageBroker;
  const headSrc = format(AVATAR_URL, groupId);
  const chatSession = ChatSession.createGroupSession(groupId as string);
  const [groupDetail, setGroupDetail] = useState<QunDetailWrap | undefined>();

  async function asyncFetchGroupDetail() {
    await messageBroker.contactContainer
      .fetchGroupDetail(groupId as string)
      .then((groupDetail) => {
        setGroupDetail(groupDetail as QunDetailWrap);
      });
  }

  useEffect(() => {
    asyncFetchGroupDetail().then((r) => {
      console.log("group detail", r);
    });
  }, [groupId]);
  if (!groupDetail) {
    return <ThreeDotLoading />;
  }

  const { detail, members, userDicts } = groupDetail;
  debugger;
  return (
    <div className={"flex flex-col p-4 shadow-md"}>
      <div className="flex flex-row items-center text-left gap-4">
        <MyAvatar
          unread={0}
          showUnread={false}
          fallback={detail?.qunName}
          src={headSrc}
        />
        <div>
          <strong>{detail?.qunName}</strong>
          <br />
          <span>{detail.nationality}</span>
        </div>
      </div>
      <p className={"mt-2 text-gray-500 text-left"}>{detail.announcement}</p>
      <div className={"flex flex-col gap-2"}>
        <h2>Group members</h2>
        <div className={"grid grid-cols-4 gap-2"}>
          {members.map((member) => (
            <div
              className={"flex flex-row items-center text-sm gap-2"}
              key={member.memberId}
            >
              <MyAvatar
                key={member.memberId}
                unread={0}
                showUnread={false}
                fallback={
                  userDicts.get(member.memberId)?.nickName ||
                  userDicts.get(member.memberId)?.userName ||
                  ""
                }
                src={userDicts.get(member.memberId)?.avatar as string}
              />
              <div className={"flex flex-col"}>
                <span>{userDicts.get(member.memberId)?.nickName}</span>
                <span className={"text-gray-500"}>
                  {userDicts.get(member.memberId)?.userName} ID:{" "}
                  {member.memberId}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <DirectSession sessionKey={chatSession.sessionKey} />
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense>
      <Group />
    </Suspense>
  );
}
