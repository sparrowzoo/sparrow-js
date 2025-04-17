import ChatApi from "@/lib/ChatApi";
import ChatSession from "@/lib/protocol/session/ChatSession";
import ContactContainer from "@/lib/im/ContactContainer";
import CrosStorage from "@/common/lib/CrosStorage";
import Message from "@/lib/protocol/Message";

export default class SessionContainer {
    public chatSessions: ChatSession[] | null = null;
    private contactContainer:ContactContainer;
    private crosStorage: CrosStorage;

    public getLocalSessions() {
        return this.chatSessions;
    }

    public getChartSession(session: ChatSession) {
        return this.chatSessions?.find((chatSession) => {
            return chatSession.key() === session.key();
        });
    }

    public receiveMessage(message:Message){
        const session = this.getChartSession(message.session);
    }

    public getDefaultSession() {
        if (this.chatSessions && this.chatSessions.length > 0) {
            return this.chatSessions[0];
        }
        return null;
    }

    public async getChatSessions() {
        let localSession = this.chatSessions;
        if (localSession) {
            return localSession;
        }
        //会话依赖联系人列表
        await this.contactContainer.getContactGroup().then(async (group) => {
            await ChatApi.getSessions(this.crosStorage).then((sessions) => {
                console.log(sessions.length);
                localSession = sessions;
                this.chatSessions = localSession;
            });
        });
        return localSession;
    }

    public newSession(sessionKey: string) {
        let session = this.chatSessions?.find(
            (session) => session.key() === sessionKey
        );
        if (!session) {
            session = ChatSession.parse(sessionKey) as ChatSession;
            this.chatSessions?.push(session);
        }
        session.lastReadTime = new Date().getTime();
        this.chatSessions?.sort((a: ChatSession, b: ChatSession) => {
            return b.lastReadTime - a.lastReadTime;
        });
    }
}