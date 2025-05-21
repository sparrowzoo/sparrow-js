import * as React from "react";
import { Key } from "react";
import Message from "@/lib/protocol/Message";
import MyAvatar from "@/components/MyAvatar";
import HistoryMessageWrap from "@/lib/protocol/HistoryMessageWrap";
import { useTranslations } from "next-intl";

interface Props {
  message: Message;
  key: Key;
  messageWrap: HistoryMessageWrap;
  handleSearch: any;
  //这里的key是React的key属性，用来标识每个组件的唯一性，在列表中必须设置，否则会出现渲染错误。
  //永远是undefined
}

export default function HistoryMessageItem(props: Props) {
  const t = useTranslations("MessageSearch");

  const { sender, content, receiver } = props.message;
  const senderDetail = props.messageWrap.userMap.get(sender.id);
  const receiverDetail = props.messageWrap.userMap.get(receiver?.id);
  return (
    <div
      className={"flex flex-row justify-start items-start gap-2 mt-2"}
      key={props.message.messageId}
    >
      <MyAvatar
        unread={0}
        showUnread={false}
        fallback={senderDetail?.userName as string}
        src={senderDetail?.avatar as string}
      />
      <div className={"flex flex-col text-left gap-2"}>
        <span
          className={
            " flex flex-row text-xs dark:text-gray-300 light:text-gray-900"
          }
        >
          {senderDetail?.userName} {t("at")}
          {props.message.sendTime as string}
          {props.message.session.isGroup() && (
            <>
              {t("in-group")}【
              {
                props.messageWrap.qunMaps[props.message.session.sessionKey]
                  ?.qunName
              }
              】{t("say")}
            </>
          )}
          {!props.message.session.isGroup() && (
            <>
              {t("to")} {receiverDetail?.userName} {t("say")}
            </>
          )}
          <span
            onClick={() => {
              props.handleSearch(props.message.session.sessionKey, 0);
            }}
            className={"cursor-pointer pl-2"}
          >
            {t("only-see")}【{props.message.session.sessionKey}】{t("session")}
          </span>
        </span>
        <p
          dangerouslySetInnerHTML={{ __html: content }}
          className={
            "p-2 text-xs rounded-lg dark:text-foreground light:text-gray-900"
          }
        ></p>
      </div>
    </div>
  );
}
