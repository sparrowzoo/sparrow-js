import {beforeEach, describe, expect, it, vi} from "vitest";
import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import Message from "@/common/lib/protocol/messaging/Message";
import Protocol from "@/common/lib/protocol/messaging/Protocol";
import ChatUser from "@/common/lib/protocol/messaging/ChatUser";
import ChatSession from "@/common/lib/protocol/messaging/ChatSession";
import {MessageType, ProtocolType} from "@/common/lib/protocol/messaging/Chat";
import MessageContent from "@/components/session/MessageContent";
import {parseQuestion} from "@/lib/im/QuestionProtocol";
import MessageBroker from "@/lib/im/MessageBroker";

vi.mock("@/common/lib/SparrowWebSocket", () => ({default: class {
    txid = 0;
    connect() {}
    close() {}
    sendMessage = vi.fn();
}}));
vi.mock("@/api/ChatApi", () => ({default: {getMessages: async () => []}}));
vi.mock("@/lib/im/ContactContainer", () => ({default: class {}}));
vi.mock("@/lib/im/SessionContainer", () => ({default: class {
    newSession = async () => {};
    appendLastMessage() {}
    plusUnreadCount() {}
    read() {}
}}));
vi.mock("react-hot-toast", () => ({default: {error: vi.fn()}}));
const user = new ChatUser("42", 1);
const ai = new ChatUser("0", 2);
const key = ChatSession.create121Session(user, ai).sessionKey;
const question = {questionId: "q-1", questions: [{header: "Travel", question: "Choose transport", multiSelect: false,
    options: [{label: "Train", description: "Public transport"}, {label: "Car", description: "Drive yourself"}]}]};
const frame = (type: MessageType, content: string) => Protocol.create121Chat(ProtocolType.AI_RESPONSE, ai, type, user, content, 100).toBytes().buffer as ArrayBuffer;
function render(type: MessageType, content: string, active = false) {
    const message = Message.fromProtocol(Protocol.fromBytes(frame(type, content)));
    return renderToStaticMarkup(React.createElement(MessageContent, {message, zh: false, canAnswer: () => active, onAnswer: () => {}}));
}

describe("AI message rendering", () => {
    it("renders text literally, Markdown as markup, and sanitizes HTML", () => {
        expect(render(MessageType.TEXT, "<strong>literal</strong>")).toContain("&lt;strong&gt;literal&lt;/strong&gt;");
        expect(render(MessageType.MARKDOWN, "**bold**")).toContain("<strong>bold</strong>");
        const html = render(MessageType.HTML, '<strong>safe</strong><script>alert(1)</script><img src="x" onerror="alert(1)">');
        expect(html).toContain("<strong>safe</strong>");
        expect(html).not.toContain("<script");
        expect(html).not.toContain("onerror");
    });
    it("renders questions as selectable cards and invalid structures as errors", () => {
        const html = render(MessageType.QUESTION, JSON.stringify(question), true);
        expect(html).toContain('type="radio"');
        expect(html).toContain("Train");
        expect(html).toContain("Send answers");
        expect(render(MessageType.QUESTION, "{}", true)).toContain("Invalid question");
        expect(render(MessageType.QUESTION, JSON.stringify(question))).toContain('disabled=""');
        expect(() => parseQuestion('{"questionId":"q","questions":[]}')).toThrow();
    });
    it("displays answer text rather than protocol JSON", () => {
        expect(render(MessageType.ANSWER, JSON.stringify({questionId: "q", content: "Train"}))).toContain(">Train</div>");
        expect(render(MessageType.ANSWER, "Train")).toContain(">Train</div>");
    });
});

describe("AI broker protocol", () => {
    let broker: MessageBroker;
    beforeEach(() => { broker = new MessageBroker((key => key) as any, () => {}, {userId: user.id, category: user.category} as any); });
    it("uses common AI3 protocol and preserves the selected response type", async () => {
        await broker.sendMessage(key, "hello");
        const wire = Protocol.fromBytes(vi.mocked(broker.webSocket.sendMessage).mock.calls[0][0] as Uint8Array<ArrayBuffer>);
        expect(wire.protocolType).toBe(ProtocolType.AI_REQUEST);
        expect(wire.messageType).toBe(MessageType.AI);
        expect(wire.getStringPayload()).toBe("hello");
        expect(broker.isPending(key)).toBe(true);
        await broker.websocketMsgCallback(frame(MessageType.MARKDOWN, "**reply**"));
        expect(broker.isPending(key)).toBe(false);
        expect((await broker.getMessageList(key)).filter(message => !message.timeline).at(-1)?.messageType).toBe(MessageType.MARKDOWN);
    });
    it("submits ANSWER5 with questionId once and unlocks retry after ERROR", async () => {
        await broker.websocketMsgCallback(frame(MessageType.QUESTION, JSON.stringify(question)));
        expect(broker.canAnswer(key, question.questionId)).toBe(true);
        await Promise.all([broker.sendAnswer(key, question.questionId, ["Train"]), broker.sendAnswer(key, question.questionId, ["Train"])]);
        const send = vi.mocked(broker.webSocket.sendMessage);
        expect(send).toHaveBeenCalledTimes(1);
        const wire = Protocol.fromBytes(send.mock.calls[0][0] as Uint8Array<ArrayBuffer>);
        expect(wire.messageType).toBe(MessageType.ANSWER);
        expect(wire.protocolType).toBe(ProtocolType.AI_REQUEST);
        expect(JSON.parse(wire.getStringPayload()!)).toEqual({questionId: "q-1", content: "Choose transport：Train"});
        expect(broker.canAnswer(key, "q-1")).toBe(false);
        await broker.websocketMsgCallback(new Uint8Array([ProtocolType.ERROR]).buffer);
        expect(broker.isPending(key)).toBe(false);
        expect(broker.canAnswer(key, "q-1")).toBe(true);
        await broker.sendAnswer(key, "q-1", ["Car"]);
        expect(send).toHaveBeenCalledTimes(2);
        await broker.websocketMsgCallback(frame(MessageType.TEXT, "Car selected"));
        expect(broker.canAnswer(key, "q-1")).toBe(false);
    });
    it("restores question interaction and notifies the UI after a send failure", async () => {
        await broker.websocketMsgCallback(frame(MessageType.QUESTION, JSON.stringify(question)));
        const states: boolean[] = [];
        broker.newMessageSignal = () => states.push(broker.canAnswer(key, "q-1"));
        const send = vi.mocked(broker.webSocket.sendMessage);
        send.mockImplementationOnce(() => { throw new Error("connection closed"); });
        await expect(broker.sendAnswer(key, "q-1", ["Train"])).rejects.toThrow("connection closed");
        expect(broker.isPending(key)).toBe(false);
        expect(broker.canAnswer(key, "q-1")).toBe(true);
        expect(states.at(-1)).toBe(true);
        await broker.sendAnswer(key, "q-1", ["Train"]);
        expect(send).toHaveBeenCalledTimes(2);
    });
    it("preserves ordinary rich chat as HTML1 and rejects inactive questions", async () => {
        const peerKey = ChatSession.create121Session(user, new ChatUser("7", 1)).sessionKey;
        await broker.sendMessage(peerKey, "<strong>Hello</strong>");
        const send = vi.mocked(broker.webSocket.sendMessage);
        const wire = Protocol.fromBytes(send.mock.calls[0][0] as Uint8Array<ArrayBuffer>);
        expect(wire.protocolType).toBe(ProtocolType.IM);
        expect(wire.messageType).toBe(MessageType.HTML);
        expect(wire.getStringPayload()).toBe("<strong>Hello</strong>");
        await broker.sendAnswer(key, "missing", ["Train"]);
        expect(send).toHaveBeenCalledTimes(1);
    });
});
