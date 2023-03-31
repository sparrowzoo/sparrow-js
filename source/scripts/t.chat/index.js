define(['websocket', 'api', 'store', 'chat-msg'], function (
  websocket,
  api,
  store,
  chatMsg
) {
  // 获取token、selfId、targetId
  const query = location.search.substring(1); // 获取 ? 后的参数
  const queryArr = query.split('&');
  const token = queryArr[0].split('=')[1];
  const selfId = queryArr[1].split('=')[1];
  const targetId = queryArr[2].split('=')[1];
  const { createWS } = websocket;
  const { changeSelfId, setTargetId } = store;
  // 获取当前用户信息，获取目标聊天用户信息
  async function initInfo() {
    const userArr = await Promise.all([
      api.getDetailById({ id: selfId }, token),
      api.getDetailById({ id: targetId }, token),
    ]);
    console.log(userArr);
    changeSelfId(
      userArr[0].data.id,
      userArr[0].data.portrait ||
        'https://img1.imgtp.com/2023/01/29/odnUWlDQ.jpg'
    );
    const CHAT_TYPE_1_2_1 = 0;
    setTargetId(
      userArr[1].data.id,
      userArr[1].data.name,
      CHAT_TYPE_1_2_1,
      userArr[1].data.portrait ||
        'https://img1.imgtp.com/2023/01/29/odnUWlDQ.jpg',
      'sessionKey'
    );
    console.log(userArr[0].data.id);
    const ws = createWS(userArr[0].data.id);
    chatMsg.getWsInstance(ws);
    // 初始化 页面
    chatMsg.initChatPage();
  }
  initInfo();
});
