const TEXT_MESSAGE = 0; // 文本
const IMAGE_MESSAGE = 1; // 图片
const CHAT_TYPE_1_2_1 = 0; // 单聊
const CHAT_TYPE_1_2_N = 1; // 群聊

class SparrowProtocol {
  constructor(...rest) {
    if (rest.length === 1) {
      // 只有一个参数 表示当前是从后端接收来的数据
      return this.onMessage(rest[0]);
    } else {
      this.sendMessage(rest);
    }
  }

  async onMessage(blob) {
    const buf = await blob.arrayBuffer;
    var dataView = new DataView(buf);
    // 定义一个偏移量(字节) 用于取各个变量对应
    var offset = 0;
    this.chatType = dataView.getUint8(offset);
    offset += 1; //chat type length=1  255 以内
    this.msgType = dataView.getUint8(offset);
    offset += 1; //msg type length=1   255 以内
    this.fromUserId = dataView.getInt32(offset);
    offset += 4; //from user id length=4  2^32 以内

    // 判断当前是单聊 还是群聊
    if (this.chatType == CHAT_TYPE_1_2_1) {
      this.currentUserId = dataView.getInt32(offset);
      offset += 4;
    }
    if (this.chatType == CHAT_TYPE_1_2_N) {
      this.sesessionKeyLength = dataView.getInt32(offset);
      offset += 4; //session key length=4
      // buffer.slice(offset , 4 + offset) =>  buffer.slice(2 , 6) 实际上取了sesessionKeyLength 的4个字节
      const sessionKeyBuffer = buf.slice(
        offset,
        this.sesessionKeyLength + offset
      );
      offset += this.sesessionKeyLength; // 上面又消耗的 4个字节  可以写作 offset +=4
      this.sessionKey = new Uint8Array(sessionKeyBuffer); // 四个字节 用 8 位无符号整型数 组成的数组
    }

    offset += 4; //msg length =4，这里 不太懂 为何要再次偏移？
    if (this.msgType == TEXT_MESSAGE) {
      // 这里就是将字符串信息 从 buffer格式的数据 转为普通的字符串
      const msgBuffer = buf.slice(offset, buf.byteLength);

      // 这里也可以使用 将 buffer => blob  使用FileReader.readAsText(Blob) 转为文本
      // const textBlob = new Blob([msgBuffer])
      // const reader = new FileReader();
      // reader.onload = function () {
      //     const content = reader.result;
      //     console.log(content);
      // }
      // reader.readAsText(textBlob);

      const chars = new Uint8Array(msgBuffer);
      this.msg = chars.toString();
    } else {
      const msgBuffer = buf.slice(offset, buf.byteLength);
      fileBlob = new Blob([msgBuffer]);
      //本地直接读即可
      //const url = window.URL.createObjectURL(file);
      this.url = window.URL.createObjectURL(fileBlob);

      // img.src = url;
      // img.onload = function () {
      //   // 释放一个之前通过调用 URL.createObjectURL创建的 URL 对象
      //   window.URL.revokeObjectURL(url);
      // };
    }

    // 最后返回 promise的 this
    return this;
  }
}
