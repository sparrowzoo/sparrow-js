
import Vue from "vue"
import Vuex from "vuex" //引入vuex
Vue.use(Vuex) //使用vuex
import { wsmessage2data, data2wsmessage, localmessage2data } from '../lib/sparrowChat'
import { createWs } from '../lib/webSocket'
import { read, cancel } from '../request'
export default new Vuex.Store({
    state: {
        sessions: [],
        contacts: {},
        systemInfos: [],
        ws: null,
        userId: null,
        token: null,
    },
    getters: {
        getSessionById: (state) => (id) => {
            return state.sessions.find(session => session.chatSession.sessionKey === id)
        },
        getUserById: (state) => (userId) => {
            if (state.contacts.users) {
                return state.contacts.users.find(user => user.userId === userId)
            }
            return null
        },
        getUserImageById: (state) => (userId) => {
            if (state.contacts.users) {
                const user = state.contacts.users.find(user => user.userId === userId)
                if (user) {
                    return user.avatar
                }
            }
            return null
        },
        getQunById: (state) => (qunId) => {
            if (state.contacts.quns) {
                return state.contacts.quns.find(qun => qun.qunId === qunId)
            }
            return null
        }
    },
    mutations: {
        setToken(state, token) {
            state.token = token
        },
        setWs(state, ws) {
            state.ws = ws
        },
        setUserId(state, userId) {
            state.userId = userId
        },
        setSessions(state, sessions) {
            state.sessions = sessions;
        },
        setLastReadTime(state, sessionKey) {
            state.sessions.find(session => session.chatSession.sessionKey === sessionKey).lastReadTime = Date.now()
        },
        setContacts(state, contacts) {
            state.contacts = contacts;
        },
        addSession(state, session) {
            state.sessions.push(session)
        },
        removeMessage(state, { sessionKey, clientSendTime }) {
            const session = state.sessions.find(session => session.chatSession.sessionKey === sessionKey)
            console.log("removeMessage", session)
            if (session) {
                session.messages = session.messages.filter(message => message.clientSendTime !== clientSendTime)
            }
        },
        setSystemInfos(state, systemInfos) {
            state.systemInfos = systemInfos;
        }
    },
    actions: {
        logout(context) {
            if (context.state.ws) {
                context.state.ws.reconnect = () => { }
                context.state.ws.close()
                context.commit("setWs", null)
            }
            context.commit("setUserId", null)
            context.commit("setSessions", [])
            context.commit("setContacts", {})
        },
        initWs(context) {
            const f = () => {
                let ws = createWs(context.state.userId, async (e) => {
                    const result = await wsmessage2data(e.data)
                    console.log(result)
                    if (result.chatType === 2) {
                        //取消的逻辑//修改本地数据
                        context.commit('removeMessage', { sessionKey: result.sessionKey, clientSendTime: result.clientSendTime })
                    } else {
                        //其他消息的逻辑
                        let session = context.getters.getSessionById(result.session)
                        console.log(session)
                        if (!session) {
                            session =
                            {
                                "chatSession": {
                                    "chatType": result.chatType,
                                    "me": context.state.userId,
                                    "sessionKey": result.session,
                                    "target": result.targetUserId
                                },
                                "lastReadTime": result.clientSendTime - 1,
                                "messages": [
                                ]
                            }
                            context.commit("addSession", session)
                        }
                        session.messages.push(result)
                    }
                }, () => {
                    console.log("重连");
                    f()
                })
                context.commit("setWs", ws)
            }
            f()

        },
        sendMessage(context, { chatType, msgType, from, to, sessionKey, msg, image, clientSendTime }) {
            console.log(context, chatType, msgType, from, to, sessionKey, msg)
            const result = data2wsmessage(chatType, msgType, from, to, sessionKey, msg, clientSendTime)
            console.log(result);
            context.state.ws.send(result)

            const localresult = localmessage2data(chatType, msgType, from, to, sessionKey, msg, image, clientSendTime)
            console.log(localresult)
            let session = context.getters.getSessionById(localresult.session)
            console.log(session)
            if (session) {
                session.messages.push(localresult)
            }
        },
        async readSession(context, sessionKey) {
            // 修改远程数据
            const session = context.getters.getSessionById(sessionKey);
            const res = await read({
                chatType: session.chatSession.chatType,
                sessionKey: session.chatSession.sessionKey,
                userId: session.chatSession.me
            })
            //修改本地数据
            context.commit('setLastReadTime', sessionKey)

        },

        async cancelMessage(context, { fromUserId, clientSendTime, sessionKey, chatType }) {
            console.log(context, fromUserId, clientSendTime, sessionKey, chatType)
            // 修改远程数据
            const res = await cancel({
                fromUserId: fromUserId,
                clientSendTime: clientSendTime + "",
                sessionKey: sessionKey,
                chatType: chatType,
            })
            if (res === true) {
                //修改本地数据
                context.commit('removeMessage', { sessionKey, clientSendTime })
            }
        },
    },
    modules: {

    }
})