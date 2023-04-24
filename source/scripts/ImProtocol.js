var ImProtocol = function (
    //聊天类型 0:1对1单聊 1:一对多群聊
    chatType,
    //消息类型 0:文本消息 1:图片消息
    msgType,
    //当前用户id [当前用户ID可以不传]
    currentUserId,
    // 会话key 如果是单聊，就是对方的用户id，
    // 如果是群聊，就是群id
    sessionKey,
    //消息内容
    msg,
    //客户端发送时间
    clientSendTime
) {
    this.chatType = chatType;
    this.msgType = msgType;
    this.currentUserId = currentUserId;
    this.sessionKey = sessionKey;
    this.msg = msg;
    this.clientSendTime = clientSendTime;
};

//文件消息标识
ImProtocol.TEXT_MESSAGE = 0;
//图片消息标识
ImProtocol.IMAGE_MESSAGE = 1;
//1对1单聊
ImProtocol.CHAT_TYPE_1_2_1 = 0;
//一对多群聊
ImProtocol.CHAT_TYPE_1_2_N = 1;
//撤消消息
ImProtocol.CHAT_TYPE_CANCEL = 2;

ImProtocol.CHAT_TYPE_LENGTH = 1;
ImProtocol.MSG_TYPE_LENGTH = 1;

ImProtocol.prototype.toBytes = function () {
    this.currentUserId = parseInt(this.currentUserId, 10);
    this.currentUserIdBytes = this.currentUserId.toBytes();
    this.currentUserIdLength = this.currentUserIdBytes.length;
    if (this.chatType === ImProtocol.CHAT_TYPE_1_2_N) {
        //4bytes|session-key
        //长度|session-key

        //session key 自己的字节
        this.sessionKeyBytes = this.sessionKey.toArrayBuffer();
        //session key 字节的长度
        this.sessionKeyBytesLength = this.sessionKeyBytes.length;
        //session key length's bytes
        this.sessionKeyLengthBytes= this.sessionKeyBytesLength.toBytes();
        //session key length's bytes length
        this.sessionKeyLengthLength = 4; //int 4bytes
    } else {
        this.targetUserId = parseInt(this.sessionKey, 10);
        this.targetUserIdBytes = this.targetUserId.toBytes();
        this.targetUserIdLength = 4;//int 4bytes
    }

    this.contentBytes=this.msgType===ImProtocol.TEXT_MESSAGE?this.msg.toArrayBuffer():this.msg;
    this.msgLength = this.msgType===ImProtocol.TEXT_MESSAGE ? this.contentBytes.length : this.msg.byteLength;;
    this.msgLengthBytes = this.msgLength.toBytes();
    this.msgLengthLength = 4;//int 4bytes
    this.sendTimeBytes = (this.clientSendTime + "").toArrayBuffer();
    this.sendTimeLength = this.sendTimeBytes.length;

    var totalLength = 0;
    if (this.chatType === ImProtocol.CHAT_TYPE_1_2_N) {
        totalLength =
            ImProtocol.CHAT_TYPE_LENGTH +
            ImProtocol.MSG_TYPE_LENGTH +
            this.currentUserIdLength + //4
            this.sessionKeyLengthLength + //4
            this.sessionKeyBytesLength +
            this.msgLengthLength + //4
            this.msgLength +
            this.sendTimeLength;
    } else {
        totalLength =
            ImProtocol.CHAT_TYPE_LENGTH +
            ImProtocol.MSG_TYPE_LENGTH +
            this.currentUserIdLength + //4
            this.targetUserIdLength + //4
            this.msgLengthLength + //4
            this.msgLength +
            this.sendTimeLength;
    }
    let result = new Uint8Array(totalLength);
    var offset = 0;
    result.set([this.chatType, this.msgType], offset);
    offset += ImProtocol.CHAT_TYPE_LENGTH +
        ImProtocol.MSG_TYPE_LENGTH;
    result.set(this.currentUserIdBytes, offset);
    offset += this.currentUserIdLength;
    if (this.chatType === ImProtocol.CHAT_TYPE_1_2_N) {
        result.set(this.sessionKeyLengthBytes, offset);
        offset += this.sessionKeyLengthLength;
        result.set(this.sessionKeyBytes, offset);
        offset += this.sessionKeyBytesLength;
    } else {
        result.set(this.targetUserIdBytes, offset);
        offset += this.targetUserIdLength;
    }
    result.set(this.msgLengthBytes, offset);
    offset += this.msgLengthLength;
    result.set(this.contentBytes, offset);
    offset += this.msgLength;
    result.set(this.sendTimeBytes, offset);
    return result;
};
//收到推送的消息
ImProtocol.parse = function (blob,callback) {
    //当客户端收到服务端发来的消息时，触发onmessage事件，
    // 参数e.data包含server传递过来的数据
     (async () => {
        const buf = await blob.arrayBuffer();
        if (buf.byteLength === 1) {
            console.log("对方不在线!!!!");
            return;
        }
        var dataView = new DataView(buf);
        var offset = 0;
        this.chatType = dataView.getUint8(offset);
        // 服务器撤消事件推送
        if (this.chatType === 2) {
            console.log("撤销协议");
            offset += 1;
            const sessionKeyLength = dataView.getInt32(offset);
            offset += 4; //session key length=4
            const sessionKeyBuffer = buf.slice(offset, sessionKeyLength + offset);
            offset += sessionKeyLength;
            const sessionKey = new Uint8Array(sessionKeyBuffer).toString();
            const clientSendTimeLength = dataView.getInt32(offset);
            offset += 4; //session key length=4
            const clientSendTimeBuffer = buf.slice(
                offset,
                clientSendTimeLength + offset
            );
            const clientSendTime = +new Uint8Array(clientSendTimeBuffer).toString();
            console.log(sessionKeyLength, sessionKey, clientSendTime);
            callback({
                chatType: this.chatType,
                clientSendTime: clientSendTime,
                sessionKey: sessionKey,
            });
            return;
        }

        //正常接收消息推送
        offset += ImProtocol.CHAT_TYPE_LENGTH; //chat type length=1
        this.msgType = dataView.getUint8(offset);
        offset += ImProtocol.MSG_TYPE_LENGTH; //msg type length=1
        //消息来源 对方用户id
        //因为是接收消息，所以fromUserId就是对方用户id
        this.fromUserId = dataView.getInt32(offset);
        offset += 4; //from user id length=4
        if (this.chatType === ImProtocol.CHAT_TYPE_1_2_1) {
            //因为是接收消息，所以currentUserId是接收人ID，即当前用户ID
            this.currentUserId = dataView.getInt32(offset);
            offset += 4;
        }
        if (this.chatType === ImProtocol.CHAT_TYPE_1_2_N) {
            //群聊获取session key
            this.sesessionKeyLength = dataView.getInt32(offset);
            offset += 4; //session key length=4
            const sessionKeyBuffer = buf.slice(
                offset,
                this.sesessionKeyLength + offset
            );
            offset += this.sesessionKeyLength;
            //构建session key
            this.sessionKey = new Uint8Array(sessionKeyBuffer).toString();
        }

        //实际的消息长度
        this.msgLength = dataView.getInt32(offset);
        offset += 4; //msg length =4

        //文本消息解析
        if (this.msgType === ImProtocol.TEXT_MESSAGE) {
            const msgBuffer = buf.slice(offset, offset + this.msgLength);
            const chars = new Uint8Array(msgBuffer);
            this.msg = chars.toString();
            //console.log(this.msg);
        } else {
            //图片消息解析
            //const img = document.getElementById('img');
            const msgBuffer = buf.slice(offset, offset + this.msgLength);
            var fileBlob = new Blob([msgBuffer]);
            //本地直接读即可
            //const url = window.URL.createObjectURL(file);
            this.url = window.URL.createObjectURL(fileBlob);
        }
        offset += this.msgLength;
        //客户端发送时间【对方传过来】
        this.clientSendTime = new Uint8Array(buf.slice(offset, buf.byteLength)).toString();

        callback({
            chatType: this.chatType,
            msgType: this.msgType,
            fromUserId: this.fromUserId,
            currentUserId: this.currentUserId,
            content:this.msg,
            url:this.url,
            clientSendTime: this.clientSendTime,
            sessionKey: this.sessionKey
        });
    })();
}

export {ImProtocol}
