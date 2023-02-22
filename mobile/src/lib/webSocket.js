function createWs(userId, messagehandler, reconnectHandler) {
    console.log("current user:" + userId)
    let ws = new WebSocket("ws://chat.sparrowzoo.com/websocket", [userId]);
    //申请一个WebSocket对象，参数是服务端地址，同http协议使用http://开头一样，WebSocket协议的url使用ws://开头，另外安全的WebSocket协议使用wss://开头
    // ws.reconnect = function () {
    //     console.log("重连");
    //     createWs(userId, messagehandler)
    // }
    ws.closeHeartBeat = function () {
        if (ws.clientTimer) {
            clearTimeout(ws.clientTimer)
        }
        if (ws.serverTimer) {
            clearTimeout(ws.serverTimer)
        }
    }
    ws.startHeartBeat = function () {
        ws.closeHeartBeat()
        // 开启心跳
        ws.clientTimer = setTimeout(() => {
            ws.send("PING")
            // console.log("客户端心跳", new Date());
            ws.serverTimer = setTimeout(() => {
                reconnectHandler()
            }, 12 * 1000);
        }, 10 * 1000);
    }
    ws.onopen = function (e) {
        //当WebSocket创建成功时，触发onopen事件
        console.log("ws.onopen", e);
        ws.startHeartBeat()
    }
    ws.onmessage = (e) => {
        console.log("onmessage", e);
        if (e.data === 'PONG') {
            // console.log("服务端心跳", new Date());
            ws.startHeartBeat();
        } else {
            messagehandler(e);
        }
        //     const result = await wsmessage2data(e.data)
        //     console.log(result)
        //     if (result.chatType === 2) {
        //         //取消的逻辑//修改本地数据
        //         context.commit('removeMessage', { sessionKey: result.sessionKey, clientSendTime: result.clientSendTime })
        //     } else {
        //         //其他消息的逻辑
        //         let session = context.getters.getSessionById(result.session)
        //         console.log(session)
        //         if (session) {
        //             session.messages.push(result)
        //         }
        //     }
    }
    ws.onclose = function (e) {
        //当客户端收到服务端发送的关闭连接请求时，触发onclose事件
        ws.closeHeartBeat();
        console.log("ws.onclose", e);
        if (e.wasClean) {
            // 干净的关闭，客户端主动关闭 不需要发起重连,关闭上一个心跳
            console.log("不重连");
        } else {
            // 异常关闭 需要发起重连
            setTimeout(() => {
                reconnectHandler()
            }, 500);
        }
    }
    ws.onerror = function (e) {
        //如果出现连接、处理、接收、发送数据失败的时候触发onerror事件
        console.log("ws.onerror", e);
        ws.onclose(e);
    }
    return ws;
}

export { createWs } 