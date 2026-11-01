import Fetcher from "@/common/lib/Fetcher";
import Message from "@/common/lib/protocol/messaging/Message";
import HistoryMessageWrap from "@/lib/protocol/HistoryMessageWrap";
import Contact from "@/lib/protocol/contact/Contact";
import SessionMeta from "@/lib/protocol/session/SessionMeta";
import Group from "@/lib/protocol/contact/Group";

interface RemoteHistoryGroup {
    id: string | number;
    name: string;
    avatar: string;
    announcement: string;
    nationality: string;
    remark: string;
    ownerId: string | number;
    categoryId: number;
}

interface RemoteHistoryMessageWrap {
    historyMessages: Message[];
    qunMaps: Record<string, RemoteHistoryGroup>;
    userMaps: Record<string, Contact>;
}

export default class MessageApi {
    public static async querySessions(
        userId: string,
        userName: string,
        userNickName: string,
        translator: (key: string) => string
    ): Promise<SessionMeta[]> {
        return await Fetcher.post<SessionMeta[]>(
            {
                url: "/chat/v2/session-list.json",
                body: {
                    userId: userId,
                    userName: userName,
                    userNickName: userNickName,
                },
                translator: translator
            }
        ).then((res) => {
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
        return await Fetcher.post<RemoteHistoryMessageWrap>({
                url: "/chat/v2/query-history-messages.json",
                body:
                    {
                        sessionKey: sessionKey,
                        content: content,
                        beginDate: beginDate,
                        endDate: endDate,
                        lastMessageId: lastMessageId,
                    },
                translator: translator
            }
        ).then((response) => {
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
                const remoteGroup = messageWrap.qunMaps[groupId];
                const group = new Group();
                group.qunId = String(remoteGroup.id);
                group.qunName = remoteGroup.name;
                group.avatar = remoteGroup.avatar;
                group.announcement = remoteGroup.announcement;
                group.nationality = remoteGroup.nationality;
                group.remark = remoteGroup.remark;
                group.ownerId = String(remoteGroup.ownerId);
                group.categoryId = remoteGroup.categoryId;
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
