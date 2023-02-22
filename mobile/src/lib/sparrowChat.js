
import { Base64 } from 'js-base64'

//小端模式
//number 要转换的整形数值
//length 要转成什么byte数组，规定数组的长度
//如uint16，则length=2表示两个字节，转成的byte数组长度是length=2
//如uint32，则length=2表示两个字节，转成的byte数组长度是length=4
Number.prototype.toBytes = function () {
  let length = 4;//只支持32位以下数字，32位以上会有精度问题
  let number = this;
  var bytes = [];
  var i = length;
  do {
    console.log(number.toString(2));
    bytes[--i] = number & 255;
    number = number >> 8;
  } while (i);
  return bytes;
};

Array.prototype.toUint8Array = function () {
  let bytes = this;
  var array = new Uint8Array(bytes.length);
  for (let i = 0; i < array.length; i++) {
    array[i] = bytes[i];
  }
  return array;
};

String.prototype.toArray = function () {
  var bytes = [];
  var len, c;
  len = this.length;
  for (var i = 0; i < len; i++) {
    c = this.charCodeAt(i);
    if (c >= 0x010000 && c <= 0x10ffff) {
      bytes.push(((c >> 18) & 0x07) | 0xf0);
      bytes.push(((c >> 12) & 0x3f) | 0x80);
      bytes.push(((c >> 6) & 0x3f) | 0x80);
      bytes.push((c & 0x3f) | 0x80);
    } else if (c >= 0x000800 && c <= 0x00ffff) {
      bytes.push(((c >> 12) & 0x0f) | 0xe0);
      bytes.push(((c >> 6) & 0x3f) | 0x80);
      bytes.push((c & 0x3f) | 0x80);
    } else if (c >= 0x000080 && c <= 0x0007ff) {
      bytes.push(((c >> 6) & 0x1f) | 0xc0);
      bytes.push((c & 0x3f) | 0x80);
    } else {
      bytes.push(c & 0xff);
    }
  }
  return bytes;
};

Uint8Array.prototype.toString = function () {
  /**
   * https://www.javascripture.com/DataView
   * DataViews allow heterogeneous access to data stored in an ArrayBuffer. Values can be read and stored at any byte offset without alignment constraints.
   * @type {DataView}
   */
  var dataView = new DataView(this.buffer);
  var ints = new Uint8Array(this.buffer.byteLength);
  for (var i = 0; i < ints.length; i++) {
    ints[i] = dataView.getUint8(i);
  }
  var str = "",
    _arr = ints;
  for (var i = 0; i < _arr.length; i++) {
    var one = _arr[i].toString(2),
      v = one.match(/^1+?(?=0)/);
    if (v && one.length === 8) {
      var bytesLength = v[0].length;
      var store = _arr[i].toString(2).slice(7 - bytesLength);
      for (var st = 1; st < bytesLength; st++) {
        store += _arr[st + i].toString(2).slice(2);
      }
      str += String.fromCharCode(parseInt(store, 2));
      i += bytesLength - 1;
    } else {
      str += String.fromCharCode(_arr[i]);
    }
  }
  return str;
};


const TEXT_MESSAGE = 0;
const IMAGE_MESSAGE = 1;
const CHAT_TYPE_1_2_1 = 0;
const CHAT_TYPE_1_2_N = 1;

// 生成sessionKey
const getSessionKey = function (from, to) {
  if (from < to) {
    return from + "_" + to;
  }
  return to + "_" + from;
}

// 解析ws接收到的消息
const wsmessage2data = async (blob) => {
  const result = {
    chatType: null,
    clientSendTime: null,
    content: null,
    fromUserId: null,
    messageType: null,
    serverTime: null,
    session: null,
    targetUserId: null
  }
  const buf = await blob.arrayBuffer();
  console.log(buf)
  if (buf.byteLength === 1) {
    console.log("对方不在线!!!!");
    throw "对方不在线!!!!";
  }
  const dataView = new DataView(buf);
  let offset = 0;
  result.chatType = dataView.getUint8(offset);
  console.log("result.chatType", result.chatType)
  offset += 1; //chat type length=1
  if (result.chatType === 2) {
    // 撤销的逻辑
    const sesessionKeyLength = dataView.getInt32(offset);
    offset += 4; //session key length=4
    const sessionKeyBuffer = buf.slice(
      offset,
      sesessionKeyLength + offset
    );
    offset += sesessionKeyLength;
    const sessionKey = new Uint8Array(sessionKeyBuffer).toString();
    const clientSendTimeLength = dataView.getInt32(offset);
    offset += 4; //clientSendTime length=4
    const clientSendTimeBuffer = buf.slice(
      offset,
      clientSendTimeLength + offset
    );
    offset += clientSendTimeLength;
    const clientSendTime = +new Uint8Array(clientSendTimeBuffer).toString();
    console.log(sesessionKeyLength, sessionKey, clientSendTime)
    return {
      chatType: result.chatType,
      clientSendTime: clientSendTime,
      sessionKey: sessionKey,
    }
  }
  result.messageType = dataView.getUint8(offset);
  offset += 1; //msg type length=1
  result.fromUserId = dataView.getInt32(offset);
  offset += 4; //from user id length=4
  // 普通用户消息
  if (result.chatType === CHAT_TYPE_1_2_1) {
    result.targetUserId = dataView.getInt32(offset);
    offset += 4;
    result.session = getSessionKey(result.fromUserId, result.targetUserId)
  }
  //群消息
  else {
    const sesessionKeyLength = dataView.getInt32(offset);
    offset += 4; //session key length=4
    const sessionKeyBuffer = buf.slice(
      offset,
      sesessionKeyLength + offset
    );
    offset += sesessionKeyLength;
    result.session = new Uint8Array(sessionKeyBuffer).toString();
  }
  const msgLength = dataView.getInt32(offset);
  offset += 4; //msg length =4
  // 文本消息类型
  if (result.messageType === TEXT_MESSAGE) {
    result.content = Base64.encode(new Uint8Array(buf.slice(offset, offset + msgLength)).toString());
  }
  // 图片消息类型
  else {
    result.content = window.URL.createObjectURL(new Blob([buf.slice(offset, offset + msgLength)]));
  }
  offset += msgLength;
  result.clientSendTime = +new Uint8Array(buf.slice(offset, buf.byteLength)).toString();
  console.log(result.clientSendTime)
  result.serverTime = result.clientSendTime
  return result;
}
// 解析本地数据到页面
const localmessage2data = (chatType, msgType, from, to, sessionKey, msg, image, clientSendTime) => {
  const result = {
    chatType: chatType,
    clientSendTime: clientSendTime,
    content: null,
    fromUserId: from,
    messageType: msgType,
    serverTime: Date.now(),
    session: sessionKey,
    targetUserId: to
  }
  // 文本消息类型
  if (result.messageType === TEXT_MESSAGE) {
    result.content = Base64.encode(msg).toString();
  }
  // 图片消息类型
  else {
    result.content = image;
  }
  return result;
}

const data2wsmessage = function (chatType, msgType, from, to, sessionKey, msg, clientSendTime) {
  const chatTypeLength = 1;
  const msgTypeLength = 1;
  const currentUserId = parseInt(from, 10);
  const currentUserIdBytes = currentUserId.toBytes();
  const currentUserIdLength = currentUserIdBytes.length;
  let sessionKeyBytes;
  let sessionKeyBytesLength;
  let sessionKeyLengthBytes;
  let sesessionKeyLengthLength;
  let targetUserId;
  let targetUserIdBytes;
  let targetUserIdLength;
  if (chatType === CHAT_TYPE_1_2_N) {
    //session key 自己的字节
    sessionKeyBytes = sessionKey.toArray();
    //session key length 比如 10 qun_1000000
    sessionKeyBytesLength = sessionKeyBytes.length;
    //session key length's bytes
    sessionKeyLengthBytes = sessionKeyBytesLength.toBytes();
    //session key length's bytes length
    sesessionKeyLengthLength = sessionKeyLengthBytes.length; //4
  } else {
    targetUserId = parseInt(to, 10);
    targetUserIdBytes = targetUserId.toBytes();
    targetUserIdLength = targetUserIdBytes.length;
  }
  const msgLength = msg.length ? msg.length : msg.byteLength;
  const msgLengthBytes = msgLength.toBytes();
  const msgLengthLength = msgLengthBytes.length;
  const sendTimeBytes = (clientSendTime + "").toArray();
  const sendTimeLength = sendTimeBytes.length;

  // toBytes
  let totalLength = 0;
  if (chatType === CHAT_TYPE_1_2_N) {
    totalLength =
      chatTypeLength +
      msgTypeLength +
      currentUserIdLength + //4
      sesessionKeyLengthLength + //4
      sessionKeyBytesLength +
      msgLengthLength + //4
      msgLength +
      sendTimeLength;
  } else {
    totalLength =
      chatTypeLength +
      msgTypeLength +
      currentUserIdLength + //4
      targetUserIdLength + //4
      msgLengthLength + //4
      msgLength +
      sendTimeLength;
  }
  let result = new Uint8Array(totalLength);
  let offset = 0;
  result.set([chatType, msgType], offset);
  offset += msgTypeLength + chatTypeLength;
  result.set(currentUserIdBytes, offset);
  offset += currentUserIdLength;
  if (chatType === CHAT_TYPE_1_2_N) {
    result.set(sessionKeyLengthBytes, offset);
    offset += sesessionKeyLengthLength;
    result.set(sessionKeyBytes, offset);
    offset += sessionKeyBytesLength;
  } else {
    result.set(targetUserIdBytes, offset);
    offset += targetUserIdLength;
  }
  result.set(msgLengthBytes, offset);
  offset += msgLengthLength;
  result.set(msg, offset);
  offset += msgLength;
  result.set(sendTimeBytes, offset);
  return result;
}

export { wsmessage2data, data2wsmessage, localmessage2data, getSessionKey }