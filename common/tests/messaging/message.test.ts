import {describe, expect, it} from "vitest";
import Message from "@/common/lib/protocol/messaging/Message";
import Protocol from "@/common/lib/protocol/messaging/Protocol";
import ChatUser from "@/common/lib/protocol/messaging/ChatUser";
import {MessageType, ProtocolType} from "@/common/lib/protocol/messaging/Chat";

describe("messages preserve rendering type", () => {
    it("keeps a question's type and JSON through wire decoding and model conversion", () => {
        const content = JSON.stringify({questionId: "q1", questions: [{question: "Which language?"}]});
        const protocol = Protocol.create121Chat(ProtocolType.AI_RESPONSE,
            new ChatUser("0", 2), 4, new ChatUser("1", 1), content, 123);
        const message = Message.fromProtocol(Protocol.fromBytes(protocol.toBytes()));
        expect(message.messageType).toBe(4);
        expect(message.content).toBe(content);
        expect(message.sender.id).toBe("0");
        expect(message.receiver?.id).toBe("1");
        const restored = Message.fromMessage(JSON.parse(JSON.stringify(message)), message.session.sessionKey);
        expect(restored.messageType).toBe(4);
        expect(restored.content).toBe(content);
    });

    it("uses the agreed public numbers for all rendering types", () => {
        expect([MessageType.TEXT, MessageType.HTML, MessageType.MARKDOWN,
            MessageType.AI, MessageType.QUESTION, MessageType.ANSWER]).toEqual([0, 1, 2, 3, 4, 5]);
    });
});
