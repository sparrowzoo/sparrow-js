import SessionIdentity from "./SessionIdentity";
import {Position} from "./Position";
import Message from "./Message";

/** Reusable local session state; the wire protocol only uses SessionIdentity. */
export default class ChatSession extends SessionIdentity {
    public name: string;
    public avatarUrl: string;
    public lastReadTime: number = 0;
    public unreadPosition: Position = Position.TAIL;
    public unreadCount: number = 0;
    public lastMessage: Message;
    public isPulled: boolean = false;
    public pop: boolean = false;
    private _sessionUrl: string;

    get sessionUrl(): string {
        return this._sessionUrl ?? `/chat/sessions/session?sessionKey=${this.sessionKey}`;
    }

    set sessionUrl(value: string) {
        this._sessionUrl = value;
    }

    public static newLocalSession(remoteSession: ChatSession): ChatSession {
        const localSession = ChatSession.parse(remoteSession.sessionKey)
            ?? ChatSession.createSession(remoteSession.chatType, remoteSession.id);
        localSession.name = remoteSession.name;
        localSession.avatarUrl = remoteSession.avatarUrl;
        localSession.unreadCount = remoteSession.unreadCount ?? 0;
        localSession.lastReadTime = remoteSession.lastReadTime ?? 0;
        localSession.unreadPosition = remoteSession.unreadPosition ?? Position.TAIL;
        localSession.isPulled = remoteSession.isPulled ?? false;
        localSession.pop = remoteSession.pop ?? false;
        // A restored default route must continue following changes to the identity.
        const sessionUrl = remoteSession.sessionUrl;
        if (sessionUrl !== localSession.sessionUrl) localSession.sessionUrl = sessionUrl;
        if (remoteSession.lastMessage) {
            localSession.lastMessage = Message.fromMessage(remoteSession.lastMessage, localSession.sessionKey);
        }
        return localSession;
    }
}
