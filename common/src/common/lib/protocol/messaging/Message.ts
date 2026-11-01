import ChatUser from "./ChatUser";
import ChatSession from "./ChatSession";
import {format} from "date-fns";
import Protocol from "./Protocol";
import {ProtocolType} from "./Chat";

export enum AlignType { left = "left", right = "right" }

export default class Message {
    public sessionKey: string;
    public messageId: string;
    public sender: ChatUser;
    public receiver: ChatUser | null;
    public content: string;
    public session: ChatSession;
    public clientSendTime: number;
    public serverTime: number | null;
    public currentUser: ChatUser;
    private _timeline: number;

    get timeline() { return this._timeline; }
    set timeline(value) { this.messageId = value + ""; this._timeline = value; }
    get align(): AlignType { return this.isSender() ? AlignType.right : AlignType.left; }
    get sendTime(): string {
        const date = new Date(this.clientSendTime);
        return format(this.clientSendTime, date.getDate() === new Date().getDate() ? "HH:mm" : "MM/dd HH:mm");
    }

    static fromProtocol(protocol: Protocol): Message {
        if ((protocol.protocolType !== ProtocolType.IM && protocol.protocolType !== ProtocolType.AI_REQUEST && protocol.protocolType !== ProtocolType.AI_RESPONSE) || protocol.sender == null || protocol.chatSession == null || protocol.clientSendTime == null) throw new Error("A chat message requires a complete IM or AI protocol");
        const message = new Message();
        message.sender = new ChatUser(protocol.sender.id, protocol.sender.category);
        message.session = ChatSession.createSession(protocol.chatSession.chatType, protocol.chatSession.id);
        message.receiver = protocol.receiver == null ? null : new ChatUser(protocol.receiver.id, protocol.receiver.category);
        message.content = protocol.getStringPayload() ?? "";
        message.clientSendTime = protocol.clientSendTime;
        message.serverTime = protocol.serverTime;
        message.messageId = protocol.clientSendTime + "" + protocol.sender.id;
        return message;
    }

    static newTimeLine(time: number) { const timeline = new Message(); timeline.timeline = time; return timeline; }

    static fromMessage(remoteMessage: Message, sessionKey: string): Message {
        const localMessage = new Message();
        localMessage.sender = new ChatUser(remoteMessage.sender.id, remoteMessage.sender.category);
        const session = ChatSession.parse(sessionKey);
        localMessage.session = session as ChatSession;
        if (session?.isOne2One() && remoteMessage.receiver != null) localMessage.receiver = new ChatUser(remoteMessage.receiver.id, remoteMessage.receiver.category);
        localMessage.content = remoteMessage.content;
        localMessage.clientSendTime = remoteMessage.clientSendTime;
        localMessage.serverTime = remoteMessage.serverTime;
        localMessage.messageId = remoteMessage.messageId;
        if (!localMessage.messageId) localMessage.messageId = remoteMessage.clientSendTime + "" + remoteMessage.sender.id;
        return localMessage;
    }

    public getTimeline() { return format(this._timeline, new Date(this._timeline).getDate() === new Date().getDate() ? "HH:mm" : "yyyy-MM-dd HH:mm"); }
    public isSender() { return this.currentUser != null && this.sender.equals(this.currentUser); }
}
