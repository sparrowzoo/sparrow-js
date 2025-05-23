"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import {
  WebSocketContext,
  WebSocketContextValue,
} from "@/lib/im/WebSocketProvider";
import useCrosStorage from "@/common/hook/CrosStorageHook";
import MessageBroker from "@/lib/im/MessageBroker";
import ThreeDotLoading from "@/common/components/ThreeDotLoading";
import { format } from "util";
import { AVATAR_URL } from "@/common/lib/Env";
import IconMenu from "@/components/IconMenu";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  CircleUserRound,
  MessageCircleCode,
  SquareLibrary,
} from "lucide-react";
import LoginUser from "@/common/lib/protocol/LoginUser";
import { StorageType } from "@/common/lib/protocol/CrosProtocol";
import { useTranslations } from "next-intl";
import useNavigating from "@/common/hook/NavigatingHook";
import toast from "react-hot-toast";

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log("Chat layout render ....");

  const { redirectToLogin } = useNavigating();
  const t = useTranslations("Navigation");
  const translator = useTranslations("MessageBroker");

  const [webSocketContextValue, setWebSocketContextValue] =
    useState<WebSocketContextValue>();
  const [currentUser, setCurrentUser] = useState<LoginUser>();
  let crosStorage = useCrosStorage();
  useEffect(() => {
    if (!crosStorage) {
      return;
    }

    crosStorage.getToken(StorageType.AUTOMATIC).then((token) => {
      if (!token) {
        toast.error(translator("token-not-found"));
        redirectToLogin();
        return;
      }
      crosStorage?.locateToken(token).then((loginUser) => {
        if (loginUser?.isVisitor()) {
          toast.error(translator("token-is-visitor"));
          redirectToLogin();
          return;
        }
        const messageBroker = new MessageBroker(translator, redirectToLogin);
        const localContext = WebSocketContextValue.create(messageBroker);
        messageBroker.newMessageSignal = () => {
          console.log("sessionKey new Message Signal");
          setWebSocketContextValue(localContext?.newReference());
        };
        messageBroker.webSocket.handshakeSuccess = (loginUser: LoginUser) => {
          setCurrentUser(loginUser);
        };
        setWebSocketContextValue(localContext);
      });
    });
    return () => {
      crosStorage?.destroy();
      webSocketContextValue?.closeWebSocket();
    };
  }, [crosStorage]);

  if (!currentUser) {
    return <ThreeDotLoading />;
  }
  const avatarUrl = format(AVATAR_URL, currentUser?.userId);
  const userHome = "/chat/friends/contact?friendId=" + currentUser?.userId;
  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      <div className="flex flex-row flex-1 min-h-0 h-full w-full">
        <div className=" w-[4rem] flex flex-col  gap-4 p-2">
          <IconMenu title={t("my")} url={userHome}>
            {(className) => (
              <Image
                alt={"avatar"}
                src={avatarUrl}
                className={cn(className, "rounded-full w-full h-[3rem]")}
                width={0}
                height={0}
              />
            )}
          </IconMenu>
          <IconMenu title={t("contact")} url={"/chat/friends"}>
            {(className) => <CircleUserRound className={className} />}
          </IconMenu>
          <IconMenu title={t("session")} url={"/chat/sessions/session"}>
            {(className) => <MessageCircleCode className={className} />}
          </IconMenu>

          <IconMenu title={t("message-manage")} url={"/chat/message-search"}>
            {(className) => <SquareLibrary className={className} />}
          </IconMenu>
        </div>
        <WebSocketContext.Provider
          value={webSocketContextValue as WebSocketContextValue}
        >
          {children}
        </WebSocketContext.Provider>
      </div>
    </div>
  );
}
