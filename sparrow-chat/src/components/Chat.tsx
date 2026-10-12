"use client";
import * as React from "react";
import {useEffect, useState} from "react";
import {WebSocketContext, WebSocketContextValue,} from "@/lib/im/WebSocketProvider";
import {useLoginUser} from "@/common/lib/LoginUserProvider";
import MessageBroker from "@/lib/im/MessageBroker";
import ThreeDotLoading from "@/common/components/ThreeDotLoading";
import IconMenu from "@/components/IconMenu";
import Image from "next/image";
import {cn} from "@/lib/utils";
import {CircleUserRound, MessageCircleCode, SquareLibrary,} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import useNavigating from "@/common/hook/NavigatingHook";
import toast from "react-hot-toast";

export default function ChatLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    console.log("Chat layout render ....");

    const {redirectToLogin} = useNavigating();
    const t = useTranslations("Navigation");
    const translator = useTranslations("MessageBroker");
    const locale = useLocale();
    const {user, status, refresh} = useLoginUser();

    const [webSocketContextValue, setWebSocketContextValue] =
        useState<WebSocketContextValue>();

    useEffect(() => {
        if (status !== "ready") {
            return;
        }
        if (!user || user.isVisitor()) {
            toast.error(translator(user ? "token-is-visitor" : "token-not-found"));
            redirectToLogin();
            return;
        }
        const messageBroker = new MessageBroker(translator, redirectToLogin, user);
        const localContext = WebSocketContextValue.create(messageBroker);
        messageBroker.newMessageSignal = () => {
            setWebSocketContextValue(localContext?.newReference());
        };
        setWebSocketContextValue(localContext);
        return () => {
            localContext?.closeWebSocket();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, user]);

    if (status === "loading") {
        return <ThreeDotLoading/>;
    }

    if (status === "error") {
        return (
            <div className="flex h-full flex-col items-center justify-center gap-4">
                <p>{locale.startsWith("zh") ? "账户读取失败" : "Unable to load account"}</p>
                <button type="button" onClick={refresh}>
                    {locale.startsWith("zh") ? "重试" : "Retry"}
                </button>
            </div>
        );
    }

    if (!user || user.isVisitor() || !webSocketContextValue) {
        return <ThreeDotLoading/>;
    }

    const avatarUrl = user.getAvatar();
    const userHome = "/chat/friends/contact?friendId=" + user.userId;
    return (
        <div className="im-chat-shell flex h-full min-h-0 flex-col">
            <div className="im-workspace flex flex-row flex-1 min-h-0 h-full w-full">
                <div className="im-navigation w-[4rem] flex flex-col  gap-4 p-2">
                    <IconMenu title={t("my")} url={userHome}>
                        {(className) => (
                            <Image
                                alt={"avatar"}
                                src={avatarUrl}
                                className={cn(className, "im-navigation-avatar rounded-full w-full h-[3rem]")}
                                width={0}
                                height={0}
                            />
                        )}
                    </IconMenu>
                    <IconMenu title={t("contact")} url={"/chat/friends"}>
                        {(className) => <CircleUserRound className={className}/>}
                    </IconMenu>
                    <IconMenu title={t("session")} url={"/chat/sessions/session"}>
                        {(className) => <MessageCircleCode className={className}/>}
                    </IconMenu>

                    <IconMenu title={t("message-manage")} url={"/chat/message-search"}>
                        {(className) => <SquareLibrary className={className}/>}
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
