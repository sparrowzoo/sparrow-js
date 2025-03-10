//im 封装的底层通信协议 保证对前台的协议是一致的
var ImProtocol = function (
  //聊天类型 0:1对1单聊 1:一对多群聊
  chatType,
  //消息类型 0:文本消息 1:图片消息
  msgType,
  //当前用户id [当前用户ID可以不传]
  sender,
  //接收方ID
  receiver,
  // 会话key,如果是1对一会话，可以不传
  sessionKey,
  //消息内容
  msg,
  //客户端发送时间
  clientSendTime
) {
  this.chatType = chatType;
  this.msgType = msgType;
  this.sender = sender;
  this.receiver = receiver;
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
  var currentUserId = parseInt(this.sender, 10);
  var currentUserIdBytes = currentUserId.toBytes();
  var currentUserIdLength = currentUserIdBytes.length;

  var sessionKeyBytes = null;
  var sessionKeyBytesLength = null;
  var sessionKeyLengthBytes = null;
  var sessionKeyLengthLength = 4; //int 4bytes

  var receiverBytes = null;
  var receiverLength = 4; //int 4bytes
  if (this.chatType === ImProtocol.CHAT_TYPE_1_2_N) {
    sessionKeyBytes = this.sessionKey.toArrayBuffer();
    //session key 字节的长度
    sessionKeyBytesLength = sessionKeyBytes.length;
    //session key length's bytes
    sessionKeyLengthBytes = sessionKeyBytesLength.toBytes();
    //session key length's bytes length
    sessionKeyLengthLength = 4; //int 4bytes
  } else {
    receiverBytes = this.receiver.toBytes();
  }

  var contentBytes =
    this.msgType === ImProtocol.TEXT_MESSAGE
      ? this.msg.toArrayBuffer()
      : this.msg;
  var msgLength =
    this.msgType === ImProtocol.TEXT_MESSAGE
      ? contentBytes.length
      : this.msg.byteLength;

  var msgLengthBytes = msgLength.toBytes();
  var msgLengthLength = 4; //int 4bytes
  var sendTimeBytes = (this.clientSendTime + "").toArrayBuffer();
  var sendTimeLength = sendTimeBytes.length;

  var totalLength = 0;
  if (this.chatType === ImProtocol.CHAT_TYPE_1_2_N) {
    totalLength =
      ImProtocol.CHAT_TYPE_LENGTH +
      ImProtocol.MSG_TYPE_LENGTH +
      currentUserIdLength + //4
      sessionKeyLengthLength + //4
      sessionKeyBytesLength +
      msgLengthLength + //4
      msgLength +
      sendTimeLength;
  } else {
    totalLength =
      ImProtocol.CHAT_TYPE_LENGTH +
      ImProtocol.MSG_TYPE_LENGTH +
      currentUserIdLength + //4
      receiverLength + //4
      msgLengthLength + //4
      msgLength +
      sendTimeLength;
  }
  let result = new Uint8Array(totalLength);
  var offset = 0;
  result.set([this.chatType, this.msgType], offset);
  offset += ImProtocol.CHAT_TYPE_LENGTH + ImProtocol.MSG_TYPE_LENGTH;
  result.set(currentUserIdBytes, offset);
  offset += currentUserIdLength;
  if (this.chatType === ImProtocol.CHAT_TYPE_1_2_N) {
    result.set(sessionKeyLengthBytes, offset);
    offset += sessionKeyLengthLength;
    result.set(sessionKeyBytes, offset);
    offset += sessionKeyBytesLength;
  } else {
    result.set(receiverBytes, offset);
    offset += receiverLength;
  }
  result.set(msgLengthBytes, offset);
  offset += msgLengthLength;
  result.set(contentBytes, offset);
  offset += msgLength;
  result.set(sendTimeBytes, offset);
  return result.buffer;
};
ImProtocol.cancel = function (dataView, buf, callback) {
  var offset = 0;
  var chatType = dataView.getUint8(offset);
  console.log("撤销协议");
  offset += 1;
  const sessionKeyLength = dataView.getInt32(offset);
  offset += 4; //session key length=4
  const sessionKeyBuffer = buf.slice(offset, sessionKeyLength + offset);
  offset += sessionKeyLength;
  const sessionKey = new Uint8Array(sessionKeyBuffer).toString();
  const clientSendTimeLength = dataView.getInt32(offset);
  offset += 4; //session key length=4
  const clientSendTimeBuffer = buf.slice(offset, clientSendTimeLength + offset);
  const clientSendTime = +new Uint8Array(clientSendTimeBuffer).toString();
  console.log(sessionKeyLength, sessionKey, clientSendTime);
  callback({
    chatType: chatType,
    clientSendTime: clientSendTime,
    sessionKey: sessionKey,
  });
};
//收到推送的消息
ImProtocol.parse = async function (blob, callback) {
  //当客户端收到服务端发来的消息时，触发onmessage事件，
  // 参数e.data包含server传递过来的数据
  const buf = await blob.arrayBuffer();
  var offset = 0;
  var dataView = new DataView(buf);
  var chatType = dataView.getUint8(offset);
  // 服务器撤消事件推送
  if (chatType === 2) {
    ImProtocol.cancel(dataView, buf, callback);
    return;
  }
  var receiver = null;
  var sessionKey = null;
  var text = null;
  var msgBuffer = null;
  var sender = null;
  var clientSendTime = null;
  var serverTime = null;

  //正常接收消息推送
  offset += ImProtocol.CHAT_TYPE_LENGTH; //chat type length=1
  var msgType = dataView.getUint8(offset);
  offset += ImProtocol.MSG_TYPE_LENGTH; //msg type length=1
  //消息来源 对方用户id
  //因为是接收消息，所以fromUserId就是对方用户id
  sender = dataView.getInt32(offset);
  offset += 4; //from user id length=4
  if (chatType === ImProtocol.CHAT_TYPE_1_2_1) {
    //因为是接收消息，所以currentUserId是接收人ID，即当前用户ID
    receiver = dataView.getInt32(offset);
    sessionKey = ImProtocol.generate121SessionKey(sender, receiver);
    offset += 4;
  }
  if (chatType === ImProtocol.CHAT_TYPE_1_2_N) {
    //群聊获取session key
    var sessionKeyLength = dataView.getInt32(offset);
    offset += 4; //session key length=4
    const sessionKeyBuffer = buf.slice(offset, sessionKeyLength + offset);
    offset += sessionKeyLength;
    //构建session key
    sessionKey = new Uint8Array(sessionKeyBuffer).toString();
  }

  //实际的消息长度
  var msgLength = dataView.getInt32(offset);
  offset += 4; //msg length =4

  //文本消息解析
  if (msgType === ImProtocol.TEXT_MESSAGE) {
    const msgBuffer = buf.slice(offset, offset + msgLength);
    const chars = new Uint8Array(msgBuffer);
    text = chars.toString();
    //console.log(this.msg);
  } else {
    //图片消息解析
    //const img = document.getElementById('img');
    msgBuffer = buf.slice(offset, offset + msgLength);
  }
  offset += msgLength;
  //客户端发送时间【对方传过来】
  var clientTimeServiceTimePair = new Uint8Array(
    buf.slice(offset, buf.byteLength)
  ).toString();
  console.log("im protocol ", JSON.stringify(clientTimeServiceTimePair));
  var clientServiceTimeArray = clientTimeServiceTimePair.split("_");
  clientSendTime = parseInt(clientServiceTimeArray[0], 10);
  serverTime = parseInt(clientServiceTimeArray[1], 10);

  callback({
    chatType: chatType,
    msgType: msgType,
    sender: sender,
    receiver: receiver,
    msg: msgType === ImProtocol.TEXT_MESSAGE ? text : msgBuffer,
    clientSendTime: clientSendTime,
    serverTime: serverTime,
    sessionKey: sessionKey,
  });
};
ImProtocol.getOppositeUser = function (vue, session) {
  // 如果有session 则以session 优先否则以queryString 优先
  var sessionKey = session
    ? session.chatSession.sessionKey
    : vue.$route.query.key;
  if (Sparrow.isNullOrEmpty(sessionKey)) {
    //会在?token=###&targetUserId=n的url 初始化session 列表的对方id
    //所以以session 优先
    var oppositeUserId = vue.$route.query.targetUserId;
    if (oppositeUserId != null) {
      //有临时会话 直接返回
      return parseInt(oppositeUserId, 10);
    }
    return null;
  }
  var sessionArray = sessionKey.split("_");
  if (sessionArray.length < 2) {
    return -1;
  }
  var userId1 = parseInt(sessionArray[0], 10);
  var userId2 = parseInt(sessionArray[1], 10);
  if (userId1 === vue.$getUserId()) {
    return userId2;
  }
  return userId1;
};
ImProtocol.generate121SessionKey = function (userId, userId2) {
  if (userId < userId2) {
    return userId + "_" + userId2;
  }
  return userId2 + "_" + userId;
};

export { ImProtocol };
