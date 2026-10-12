"use client";
import * as React from "react";
import {Suspense, useContext} from "react";
import {useSearchParams} from "next/navigation";
import {resolveAvatar} from "@/common/lib/AvatarUtils";
import DirectSession from "@/components/session/DirectSession";
import ChatSession from "@/lib/protocol/session/ChatSession";
import ChatUser from "@/lib/protocol/ChatUser";
import {WebSocketContext} from "@/lib/im/WebSocketProvider";
import Contact from "@/lib/protocol/contact/Contact";
import UserCategory from "@/common/lib/UserCategory";
import MyAvatar from "@/components/MyAvatar";
import {Link} from "@/common/i18n/navigation";
import {useTranslations} from "next-intl";
import {useLoginUser} from "@/common/lib/LoginUserProvider";

function ContactDetail() {
    const t = useTranslations("MessageBroker");
    const {user} = useLoginUser();
    const searchParams = useSearchParams();
    const webSocketContextValue = useContext(WebSocketContext);
    const friendId = searchParams?.get("friendId");
    if (!friendId) {
        return null;
    }
    if (!user) {
        return null;
    }

    const currentUser = ChatUser.fromLoginUser(user);
    let friend = new ChatUser(friendId as string, UserCategory.REGISTER);
    const contact =
        webSocketContextValue.messageBroker.contactContainer.getContactDetail(
            friend
        ) as Contact;
    const headSrc = resolveAvatar(contact.avatar, friendId);
    const userName = contact.nickName ? contact.nickName : contact.userName;
    friend = new ChatUser(contact.userId, contact.category);
    const chatSession = ChatSession.create121Session(
        currentUser,
        friend
    );

    return (
        <div className={"im-profile-card flex flex-col p-4 shadow-md"}>
            <div className="im-profile-heading flex flex-row items-center gap-4 text-left">
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
                        <br/>
                        <label className={"w-fit inline-block"}>{t("account")}:</label>
                        <span>
              {contact.userName} 【ID{contact.userId}】
            </span>
                    </Link>
                </div>
            </div>
            <p className={"im-profile-description mt-2 text-gray-500 text-left text-sm"}>
                {contact.signature}
            </p>
            <DirectSession sessionKey={chatSession.sessionKey}/>
        </div>
    );
}

export default function ContactPage() {
    return (
        <Suspense>
            <ContactDetail/>
        </Suspense>
    );
}
