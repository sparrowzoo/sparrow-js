import {ChatType} from "@/lib/protocol/Chat";
import ChatUser from "@/lib/protocol/ChatUser";
import {format} from "util";
import {AVATAR_URL, NEXT_ASSET_PREFIX} from "@/common/lib/Env";
import MessageBroker from "@/lib/im/MessageBroker";
import Message from "@/lib/protocol/Message";

export default class ChatSession {
    private _id: string;
    private _name: string;
    private _avatarUrl: string;
    private _lastReadTime: number = 0;
    private _lastMessage: Message;
    private _hasNewMessage: boolean;
    private _unreadCount: number;
    private _sessionUrl: string;
    private _isPulled: boolean = false;

    get isPulled(): boolean {
        return this._isPulled;
    }

    set isPulled(value: boolean) {
        this._isPulled = value;
    }

    get lastMessage(): Message {
        return this._lastMessage;
    }

    set lastMessage(value: Message) {
        this._lastMessage = value;
    }

    get hasNewMessage(): boolean {
        return this._hasNewMessage;
    }

    set hasNewMessage(value: boolean) {
        this._hasNewMessage = value;
    }

    get unreadCount(): number {
        return this._unreadCount;
    }

    set unreadCount(value: number) {
        this._unreadCount = value;
    }

    get avatarUrl(): string {
        return this._avatarUrl;
    }

    set avatarUrl(value: string) {
        this._avatarUrl = value;
    }

    get sessionUrl(): string {
        return this._sessionUrl;
    }

    set sessionUrl(value: string) {
        this._sessionUrl = value;
    }



    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }


    get lastReadTime(): number {
        return this._lastReadTime;
    }

    set lastReadTime(value: number) {
        this._lastReadTime = value;
    }

    private _chatType: ChatType;

    get chatType(): ChatType {
        return this._chatType;
    }

    set chatType(value: ChatType) {
        this._chatType = value;
    }


    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    public static create121Session(sender: ChatUser, receiver: ChatUser) {
        const chatSession = new ChatSession();
        chatSession.chatType = ChatType.CHAT_1_TO_1;
        chatSession.id = chatSession.generateKey(sender, receiver);
        return chatSession;
    }

    public static createSession(chatType: ChatType, id: string) {
        const chatSession = new ChatSession();
        chatSession.chatType = chatType;
        chatSession.id = id;
        return chatSession;
    }

    public static parse(sessionKey: string) {
        if (sessionKey == null) {
            return null;
        }
        const chatSession = new ChatSession();
        const chatType: ChatType = parseInt(
            sessionKey.substring(0, 1),
            10
        ) as ChatType;
        const id = sessionKey.substring(1);
        chatSession._chatType = chatType;
        chatSession.id = id;
        return chatSession;
    }

    public static createGroupSession(groupId: string): ChatSession {
        const chatSession = new ChatSession();
        chatSession.chatType = ChatType.GROUP;
        chatSession.id = groupId;
        return chatSession;
    }

    public isGroup(): boolean {
        return this._chatType == ChatType.GROUP;
    }

    public isOne2One() {
        return this._chatType == ChatType.CHAT_1_TO_1;
    }

    public getOppositeUser(): ChatUser | null {
        const currentUser = ChatUser.getCurrentUser();
        if (currentUser == null) {
            return null;
        }
        if (this._chatType === ChatType.GROUP) {
            return null;
        }

        const bigUserCategory = this.id.substring(0, 1);
        const smallUserCategory = this.id.substring(1, 2);
        const bitUserLength = parseInt(this.id.substring(2, 4), 10);
        const bigUserId = this.id.substring(4, 4 + bitUserLength);
        const smallUserId = this.id.substring(4 + bitUserLength);

        const bigUser = new ChatUser(bigUserId, parseInt(bigUserCategory, 10));
        const smallUser = new ChatUser(
            smallUserId,
            parseInt(smallUserCategory, 10)
        );

        if (bigUser.equals(currentUser)) {
            return smallUser;
        }
        return bigUser;
    }

    public toBytes(): Uint8Array {
        const encoder = new TextEncoder();
        return encoder.encode(this._chatType + this.id);
    }

    public key(): string {
        return this.chatType + this.id;
    }

    public async getSessionDetail(
        messageBroker: MessageBroker
    ): Promise<SessionDetail> {
        const sessionDetail = new SessionDetail();
        sessionDetail.chatType = this.chatType;
        sessionDetail.lastReadTime = this.lastReadTime;
        sessionDetail.sessionKey = this.key();
        sessionDetail.sessionUrl = `${NEXT_ASSET_PREFIX}/chat/sessions/session?sessionKey=${this.key()}`;

        if (this?.isOne2One()) {
            const oppositeUser = this?.getOppositeUser();
            return await messageBroker.contactContainer
                .getContactDetail(oppositeUser as ChatUser)
                .then((contact) => {
                    if (contact) {
                        sessionDetail.name = contact.userName;
                        sessionDetail.avatarUrl = contact.avatar;
                    }
                    return sessionDetail;
                });
        }
        const group = messageBroker.contactContainer.getGroupDetail(
            this?.id as string
        );
        sessionDetail.name = group?.qunName + "群";
        sessionDetail.avatarUrl = format(AVATAR_URL, group?.qunId);
        return sessionDetail;
    }

    private generateKey(sender: ChatUser, receiver: ChatUser): string {
        if (sender == null || receiver == null) {
            return "";
        }
        let bigUser = sender;
        let smallUser = receiver;
        if (sender.id <= receiver.id) {
            debugger;
            bigUser = receiver;
            smallUser = sender;
        }

        let length = (bigUser.id + "").length;
        let len = length + "";
        if (length < 10) {
            len = "0" + length;
        }
        return (
            bigUser.category +
            "" +
            smallUser.category +
            "" +
            len +
            "" +
            bigUser.id +
            smallUser.id
        );
    }
}
