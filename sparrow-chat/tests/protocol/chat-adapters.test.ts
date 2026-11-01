import {describe, expect, it} from "vitest";
import Protocol from "@/common/lib/protocol/messaging/Protocol";
import {ChatType, ProtocolType} from "@/common/lib/protocol/messaging/Chat";
import ChatUser from "@/common/lib/protocol/messaging/ChatUser";
import ChatSession from "@/common/lib/protocol/messaging/ChatSession";
import Message, {AlignType} from "@/common/lib/protocol/messaging/Message";
import {Position} from "@/lib/protocol/ItemProps";
import UserCategory from "@/common/lib/UserCategory";

describe("chat adapters for shared messaging protocol", () => {
    it("preserves Base62 chat types in local factories and routes", () => {
        for (const session of [ChatSession.createSession(10 as ChatType, "group"), ChatSession.parse("Agroup")!]) {
            expect(session.chatType).toBe(10);
            expect(session.sessionKey).toBe("Agroup");
            expect(session.sessionUrl).toBe("/chat/sessions/session?sessionKey=Agroup");
        }
    });

    it("preserves letter categories when displaying decoded single-chat messages", () => {
        const sender = new ChatUser("1", 10);
        const receiver = new ChatUser("z", 61);
        const protocol = Protocol.create121Chat(ProtocolType.IM, sender, 0, receiver, "hello", 12);
        const message = Message.fromProtocol(Protocol.fromBytes(protocol.toBytes()));
        expect(message.session.sessionKey).toBe("0zA1z1");
        expect(message.session.sessionUrl).toBe("/chat/sessions/session?sessionKey=0zA1z1");
        expect(message.session.getOppositeUser(new ChatUser("1", 10))?.category).toBe(61);
        expect(message.sender.category).toBe(10);
        expect(message.receiver?.category).toBe(61);
    });

    it("provides login conversion and category helpers on shared users", () => {
        const user = ChatUser.fromLoginUser({userId: "28", category: UserCategory.VISITOR} as any);
        expect(user).toBeInstanceOf(ChatUser);
        expect(user.isVisitor()).toBe(true);
        expect(ChatUser.parse(user.key)?.isVisitor()).toBe(true);
        expect(new ChatUser("ai", UserCategory.AI).isAI()).toBe(true);
        expect(user.isAI()).toBe(false);
        expect(new ChatUser("ai", UserCategory.AI).isVisitor()).toBe(false);
        expect(user.id).toBe("28");
        expect(ChatUser.parse("ai_" + UserCategory.AI)?.isAI()).toBe(true);
        const decoded = ChatUser.fromBytes(new DataView(user.toBytes().buffer as ArrayBuffer), 0);
        expect(decoded.chatUser?.isVisitor()).toBe(true);
    });

    it("keeps routes and display defaults on every local session factory", () => {
        const sender = new ChatUser("1", 1);
        const receiver = new ChatUser("2", 1);
        for (const session of [ChatSession.create121Session(sender, receiver),
            ChatSession.createGroupSession("group"), ChatSession.createSession(1, "group"),
            ChatSession.parse("1group")!]) {
            expect(session).toBeInstanceOf(ChatSession);
            expect(session.sessionUrl).toBe(`/chat/sessions/session?sessionKey=${session.sessionKey}`);
            expect(session.unreadPosition).toBe(Position.TAIL);
            expect(session.lastReadTime).toBe(0);
            expect(session.pop).toBe(false);
        }
        const opposite = ChatSession.create121Session(sender, receiver).getOppositeUser(sender);
        expect(opposite).toBeInstanceOf(ChatUser);
        expect(opposite?.isVisitor()).toBe(false);
        expect(ChatSession.parse("")).toBeNull();
    });

    it("converts decoded wire values into chat models before displaying a message", () => {
        const sender = new ChatUser("1", UserCategory.VISITOR);
        const receiver = new ChatUser("2", 1);
        const wire = Protocol.fromBytes(Protocol.create121Chat(ProtocolType.IM, sender, 0, receiver, "hello", 12).toBytes());
        expect(wire.chatSession).not.toHaveProperty("sessionUrl");
        expect(wire.sender?.isVisitor()).toBe(true);
        const message = Message.fromProtocol(wire);
        message.currentUser = new ChatUser(sender.id, sender.category);
        expect(message.sender.isVisitor()).toBe(true);
        expect(message.receiver).toBeInstanceOf(ChatUser);
        expect(message.session).toBeInstanceOf(ChatSession);
        expect(message.session.sessionUrl).toBe(`/chat/sessions/session?sessionKey=${wire.chatSession!.sessionKey}`);
        expect(message.align).toBe(AlignType.right);
        expect(message.content).toBe("hello");
        expect(message.clientSendTime).toBe(12);
    });

    it("keeps group wire sessions free of display state while adapting messages", () => {
        const protocol = Protocol.createGroupChat(new ChatUser("1", 1), "1group", 0, "hello", 12);
        const wire = Protocol.fromBytes(protocol.toBytes());
        expect(wire.chatSession).not.toHaveProperty("sessionUrl");
        expect(wire.chatSession).not.toHaveProperty("unreadCount");
        expect(wire.chatSession).not.toHaveProperty("lastMessage");
        expect(wire.chatSession?.sessionKey).toBe("1group");
        expect(wire.toBytes()).toEqual(protocol.toBytes());
        const message = Message.fromProtocol(wire);
        expect(message.session).toBeInstanceOf(ChatSession);
        expect(message.session.sessionUrl).toBe("/chat/sessions/session?sessionKey=1group");
        expect(message.receiver).toBeNull();
    });

    it("updates keys, default routes and bytes when contact details change the session ID", () => {
        const session = ChatSession.create121Session(new ChatUser("1", 1), new ChatUser("2", 1));
        expect(session.sessionKey).toBe("011121");
        expect(session.sessionUrl).toBe("/chat/sessions/session?sessionKey=011121");
        session.id = "21121";
        expect(session.sessionKey).toBe("021121");
        expect(session.sessionUrl).toBe("/chat/sessions/session?sessionKey=021121");
        expect(new TextDecoder().decode(session.toBytes())).toBe("021121");
    });

    it("hydrates session keys into fields and restores nested messages from HTTP data", () => {
        const session = ChatSession.newLocalSession({
            sessionKey: "1group",
            name: "Group",
            unreadCount: 3,
            lastReadTime: 9,
            lastMessage: {
                sender: {id: "1", category: 1},
                content: "history",
                clientSendTime: 12,
                serverTime: 13,
                messageId: "saved-message"
            }
        } as ChatSession);
        expect(session.chatType).toBe(ChatType.GROUP);
        expect(session.id).toBe("group");
        expect(new TextDecoder().decode(session.toBytes())).toBe("1group");
        expect(session.name).toBe("Group");
        expect(session.unreadCount).toBe(3);
        expect(session.lastReadTime).toBe(9);
        expect(session.unreadPosition).toBe(Position.TAIL);
        expect(session.lastMessage).toBeInstanceOf(Message);
        expect(session.lastMessage.session.sessionKey).toBe("1group");
        expect(session.lastMessage.sender).toBeInstanceOf(ChatUser);
        expect(session.lastMessage.messageId).toBe("saved-message");
        expect(session.lastMessage.content).toBe("history");
    });

    it("uses the local session identity when HTTP data has no redundant session key", () => {
        const session = ChatSession.newLocalSession({
            chatType: ChatType.GROUP,
            id: "group",
            lastMessage: {sender: {id: "1", category: 1}, content: "history", clientSendTime: 12}
        } as ChatSession);
        expect(session.lastMessage.session).toBeInstanceOf(ChatSession);
        expect(session.lastMessage.session.sessionKey).toBe("1group");
        expect(session.lastMessage.messageId).toBe("121");
    });

    it("keeps explicitly supplied session routes", () => {
        const session = ChatSession.createGroupSession("group");
        session.sessionUrl = "/custom-chat";
        session.id = "other-group";
        expect(session.sessionUrl).toBe("/custom-chat");
    });

    it("refreshes a restored default route after the session identity changes", () => {
        const session = ChatSession.newLocalSession({
            chatType: ChatType.CHAT_1_TO_1,
            id: "11121",
            sessionKey: "011121",
            sessionUrl: "/chat/sessions/session?sessionKey=011121"
        } as ChatSession);
        session.id = "21121";
        expect(session.sessionUrl).toBe("/chat/sessions/session?sessionKey=021121");
    });
});
