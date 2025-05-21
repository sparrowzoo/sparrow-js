import Fetcher from "@/common/lib/Fetcher";
import Result from "@/common/lib/protocol/Result";
import Message from "@/lib/protocol/Message";
import HistoryMessageWrap from "@/lib/protocol/HistoryMessageWrap";
import Contact from "@/lib/protocol/contact/Contact";
import SessionMeta from "@/lib/protocol/session/SessionMeta";
import Group from "@/lib/protocol/contact/Group";

export default class MessageApi {
  public static async querySessions(
    userId: string,
    userName: string,
    userNickName: string,
    translator: (key: string) => string
  ): Promise<SessionMeta[]> {
    return await Fetcher.post(
      "/chat/v2/session-list.json",
      {
        userId: userId,
        userName: userName,
        userNickName: userNickName,
      },
      translator
    ).then((res: Result) => {
      return res?.data;
    });
  }

  public static async queryMessages(
    sessionKey: string,
    content: string,
    beginDate: string,
    endDate: string,
    lastMessageId: number,
    translator: (key: string) => string
  ): Promise<HistoryMessageWrap> {
    return await Fetcher.post(
      "/chat/v2/query-history-messages.json",
      {
        sessionKey: sessionKey,
        content: content,
        beginDate: beginDate,
        endDate: endDate,
        lastMessageId: lastMessageId,
      },
      translator
    ).then((response: Result) => {
      let messageWrap = response.data;
      const localMessageWrap = new HistoryMessageWrap();
      let messages: Message[] = [];
      localMessageWrap.historyMessages = messages;
      for (let message of messageWrap.historyMessages) {
        messages.push(Message.fromMessage(message, message?.sessionKey));
      }
      const qunMaps: Map<string, Group> = new Map();
      localMessageWrap.qunMaps = qunMaps;
      for (let groupId in messageWrap.qunMaps) {
        if (!messageWrap.qunMaps.hasOwnProperty(groupId)) {
          continue;
        }
        const group = Group.fromJson(messageWrap.qunMaps[groupId]);
        qunMaps.set(groupId, group);
      }

      const userMap: Map<string, Contact> = new Map();

      for (let userId in messageWrap.userMaps) {
        if (!messageWrap.userMaps.hasOwnProperty(userId)) {
          continue;
        }
        const contact = Contact.fromRemoteJson(messageWrap.userMaps[userId]);
        userMap.set(userId, contact);
      }
      localMessageWrap.userMap = userMap;
      return localMessageWrap;
    });
  }
}
