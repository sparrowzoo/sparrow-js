import ChatApi from "@/api/ChatApi";
import Message from "@/common/lib/protocol/messaging/Message";
import Protocol from "@/common/lib/protocol/messaging/Protocol";
import SparrowWebSocket from "@/common/lib/SparrowWebSocket";
import ChatSession from "@/common/lib/protocol/messaging/ChatSession";
import {ChatType, MessageType, ProtocolType} from "@/common/lib/protocol/messaging/Chat";
import ChatUser from "@/common/lib/protocol/messaging/ChatUser";
import LoginUser from "@/common/lib/protocol/LoginUser";
import toast from "react-hot-toast";
import {WEBSOCKET} from "@/common/lib/Env";
import ContactContainer from "@/lib/im/ContactContainer";
import SessionContainer from "@/lib/im/SessionContainer";
import {Translator} from "@/common/lib/TranslatorType";
import {parseQuestion, QuestionEvent} from "@/lib/im/QuestionProtocol";

export default class MessageBroker {
    public contactContainer: ContactContainer;
    public sessionContainer: SessionContainer;
    public translator: Translator;
    public webSocket: SparrowWebSocket;
    public currentUser: ChatUser;
    //key:session key,value:message list
    private messageMap: Map<string, Message[]> = new Map();
    private pendingSessions = new Set<string>();
    private activeQuestions = new Map<string, QuestionEvent>();
    private submittedQuestions = new Set<string>();
    private pendingQuestionIds = new Map<string, string>();

    constructor(translator: Translator, redirectLogin: () => void, loginUser: LoginUser) {
        this.translator = translator;
        this.currentUser = ChatUser.fromLoginUser(loginUser);
        this.contactContainer = new ContactContainer(this.translator, this.currentUser);
        this.sessionContainer = new SessionContainer(
            this.translator,
            this.contactContainer,
            this.currentUser
        );
        const sparrowWebSocket = new SparrowWebSocket(
            WEBSOCKET as string,
            this.translator
        );
        this.webSocket = sparrowWebSocket;
        sparrowWebSocket.redirectLogin = redirectLogin;
        this.webSocket.onMsgCallback = (buf: ArrayBuffer) => {
            this.websocketMsgCallback(buf).catch(() => {
                console.warn("Unable to process WebSocket protocol frame");
            });
        };
        this.webSocket.offlineCallback = () => {
            if (this.translator) {
                toast.error(this.translator("offline"));
            }
        };
        this.webSocket.connectionStatusCallback = status => {
            this.newMessageSignal();
            if (status === SparrowWebSocket.ACTIVE_STATUS) {
                this.webSocket.sendMessage(Protocol.fetchUserStatus().toBytes());
            }
        };
        this.webSocket.closeCallback = () => this.releasePending();
        this.webSocket.errorCallback = () => this.releasePending();
        sparrowWebSocket.connect();
    }

    public closeWebSocket() {
        this.webSocket.close();
    }

    public async putMessage(message: Message) {
        const sessionKey = message.session.sessionKey;
        let messageList = this.messageMap.get(sessionKey);
        if (messageList == null) {
            messageList = [];
            this.messageMap.set(sessionKey, messageList);
        }
        messageList.push(message);
        await this.sessionContainer.newSession(sessionKey).then(() => {
            this.sessionContainer.appendLastMessage(message);
        });
    }

    public isPending(sessionKey: string): boolean {
        return this.pendingSessions.has(sessionKey);
    }

    public isAiSession(sessionKey: string): boolean {
        return ChatSession.parse(sessionKey)?.getOppositeUser(this.currentUser)?.isAI() ?? false;
    }

    public canAnswer(sessionKey: string, questionId: string): boolean {
        return !this.isPending(sessionKey) && !this.submittedQuestions.has(questionId)
            && this.activeQuestions.get(sessionKey)?.questionId === questionId;
    }

    public async sendAnswer(sessionKey: string, questionId: string, answers: string[]): Promise<void> {
        const question = this.activeQuestions.get(sessionKey);
        if (!this.isAiSession(sessionKey) || !question || !this.canAnswer(sessionKey, questionId)) return;
        if (answers.length !== question.questions.length || answers.some(answer => !answer.trim())) return;
        const content = question.questions.map((item, index) => `${item.question}：${answers[index].trim()}`).join("\n");
        this.submittedQuestions.add(questionId);
        this.pendingQuestionIds.set(sessionKey, questionId);
        try {
            await this.send(sessionKey, JSON.stringify({questionId, content}), MessageType.ANSWER, content);
        } catch (failure) {
            this.submittedQuestions.delete(questionId);
            this.pendingQuestionIds.delete(sessionKey);
            this.newMessageSignal();
            throw failure;
        }
    }

    public async sendMessage(sessionKey: string, content: string): Promise<void> {
        await this.send(sessionKey, content, this.isAiSession(sessionKey) ? MessageType.AI : MessageType.HTML);
    }

    private async send(sessionKey: string, content: string, messageType: MessageType, displayContent = content): Promise<void> {
        const chatSession = ChatSession.parse(sessionKey);
        if (!chatSession || !content.trim() || this.isPending(sessionKey)) return;
        const isAi = this.isAiSession(sessionKey);
        const protocol = chatSession.chatType === ChatType.CHAT_1_TO_1
            ? Protocol.create121Chat(isAi ? ProtocolType.AI_REQUEST : ProtocolType.IM, this.currentUser,
                messageType, chatSession.getOppositeUser(this.currentUser) as ChatUser, content, Date.now())
            : Protocol.createGroupChat(this.currentUser, sessionKey, messageType, content, Date.now());
        if (isAi) this.pendingSessions.add(sessionKey);
        try {
            this.webSocket.sendMessage(protocol.toBytes());
            const message = Message.fromProtocol(protocol);
            message.content = displayContent;
            if (isAi && messageType !== MessageType.ANSWER) this.activeQuestions.delete(sessionKey);
            await this.putMessage(message);
            this.sessionContainer.read(message.session);
            this.newMessageSignal();
        } catch (failure) {
            this.pendingSessions.delete(sessionKey);
            this.newMessageSignal();
            throw failure;
        }
    }

    private releasePending(): void {
        for (const questionId of this.pendingQuestionIds.values()) this.submittedQuestions.delete(questionId);
        this.pendingSessions.clear();
        this.pendingQuestionIds.clear();
        this.newMessageSignal();
    }

    public async getMessageList(sessionKey: string) {
        let messageList = this.messageMap.get(sessionKey);
        if (messageList != null) {
            return this.wrapMessages(messageList);
        }
        messageList = await ChatApi.getMessages(sessionKey, this.translator);
        this.messageMap.set(sessionKey, messageList);
        return this.wrapMessages(messageList);
    }

    public newMessageSignal = () => {
    };

    /** Non-chat events are exposed without inventing UI behavior for their payloads. */
    public onControlEvent: (protocol: Protocol) => void = (protocol) => {
        console.log("control event ", JSON.stringify(protocol));
    };

    public async websocketMsgCallback(buf: ArrayBuffer): Promise<void> {
        const protocol = Protocol.fromBytes(buf);
        if (protocol.protocolType === ProtocolType.ERROR) {
            // ERROR 只有事件标记，没有 session 字段；结束当前等待并允许重新提交答案。
            this.releasePending();
            toast.error(this.translator?.("ai_reply_failed") ?? "AI could not reply. Please retry.");
            this.onControlEvent(protocol);
            return;
        }
        if (protocol.protocolType === ProtocolType.OFFLINE) {
            this.webSocket.offlineCallback?.({offline: true});
            this.onControlEvent(protocol);
            return;
        }
        if (protocol.protocolType !== ProtocolType.IM &&
            protocol.protocolType !== ProtocolType.AI_REQUEST &&
            protocol.protocolType !== ProtocolType.AI_RESPONSE) {
            this.onControlEvent(protocol);
            return;
        }
        const message = Message.fromProtocol(protocol);
        if (protocol.protocolType === ProtocolType.AI_RESPONSE) {
            const sessionKey = message.session.sessionKey;
            this.pendingSessions.delete(sessionKey);
            this.pendingQuestionIds.delete(sessionKey);
            this.activeQuestions.delete(sessionKey);
            if (message.messageType === MessageType.QUESTION) {
                try {
                    this.activeQuestions.set(sessionKey, parseQuestion(message.content));
                } catch {
                    // 仍交给渲染器显示无效问题提示，不能让一次坏消息卡住整个会话。
                }
            }
        }
        await this.putMessage(message);
        this.sessionContainer.plusUnreadCount(message);
        this.newMessageSignal();
    }

    /**
     * 指定联系人初始化会话 普通用户或者游客
     * @param contacts
     */
    public async initSessionsByContacts(contacts: string[]) {
        this?.contactContainer?.initContact([]);
        await this?.sessionContainer.initSessions(contacts);
    }

    //平台客服初始化，无联系人
    public initSessions() {
        this.contactContainer.initContact([]);
        return this.sessionContainer.getChatSessions();
    }

    private wrapMessages(messages: Message[]): Message[] {
        let preTime: number = 0;
        const newMessages: Message[] = [];
        for (const message of messages) {
            message.currentUser = this.currentUser;
            newMessages.push(message);
            if (message.clientSendTime - preTime > 1000 * 60 * 5) {
                newMessages.push(Message.newTimeLine(message.clientSendTime));
            }
            preTime = message.clientSendTime;
        }
        return newMessages;
    }
}
