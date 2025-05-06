import * as React from "react";
import { Key } from "react";
import Message from "@/lib/protocol/Message";
import MyAvatar from "@/components/MyAvatar";
import HistoryMessageWrap from "@/lib/protocol/HistoryMessageWrap";

interface Props {
  message: Message;
  key: Key;
  messageWrap: HistoryMessageWrap;
  setSessionKey: any;
  handleSearch: any;
  //这里的key是React的key属性，用来标识每个组件的唯一性，在列表中必须设置，否则会出现渲染错误。
  //永远是undefined
}

export default function HistoryMessageItem(props: Props) {
  const { setSessionKey } = props;
  const { sender, content, receiver } = props.message;
  const senderDetail = props.messageWrap.userMap.get(sender.id);
  const receiverDetail = props.messageWrap.userMap.get(receiver?.id);
  return (
    <div key={props.message.messageId}>
      <div>
        <MyAvatar
          unread={0}
          showUnread={false}
          fallback={senderDetail?.userName as string}
          src={senderDetail?.avatar as string}
        />
        <div className={"flex flex-col text-left"}>
          <span
            className={"flex-1 text-xs dark:text-gray-300 light:text-gray-900"}
          >
            {senderDetail?.userName} 于{props.message.sendTime as string}
            {props.message.session.isGroup() && (
              <>
                在
                {
                  props.messageWrap.qunMaps[props.message.session.sessionKey]
                    ?.qunName
                }
                群里说:
              </>
            )}
            {!props.message.session.isGroup() && (
              <>对{receiverDetail?.userName}说：</>
            )}
            <span
              onClick={() => {
                setSessionKey(props.message.session.sessionKey);
                props.handleSearch(props.message.session.sessionKey,0);
              }}
              className={"cursor-pointer"}
            >
              点击只看【{props.message.session.sessionKey}】的会话
            </span>
          </span>
          <p
            dangerouslySetInnerHTML={{ __html: content }}
            className={
              "p-2 text-xs rounded-lg dark:text-background light:text-gray-900  bg-gray-100"
            }
          ></p>
        </div>
      </div>
    </div>
  );
}
