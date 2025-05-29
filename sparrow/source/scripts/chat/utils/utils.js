define([
  'store',
  'day',
  'chat-msg',
  'indexedDB',
  'contacts',
  'service-list',
], function (store, dayjs, chatMsg, indexedDB, contacts, serviceList) {
  const {
    CHAT_TYPE_1_2_1,
    CHAT_TYPE_1_2_N,
    DB_STORE_NAME_SESSION,
    TEXT_MESSAGE,
    targetId,
    qunNumberMap,
    ACCORD_RECALL,
    serviceStore,
    currentPage,
    MSGCHART,
  } = store;
  const DBObject = indexedDB;
  const { contactStore } = contacts;

  // 根据传来的class  滚动到底部
  const getScrollBottom = function (className, dom = document) {
    if (typeof className === 'string') {
      const scrollDom = dom.querySelector(className);
      scrollDom.scrollTop = scrollDom.scrollHeight;
    } else {
      dom = dom.querySelector(className.splice(0, 1));
      if (className.length === 1) {
        getScrollBottom(className[0], dom);
      } else {
        getScrollBottom(className, dom);
      }
    }
    const scrollDom = document.querySelector(className);
    scrollDom.scrollTop = scrollDom.scrollHeight;
  };

  // 当前发送消息的时间
  function currentSendTime() {
    return dayjs().format('HH:mm');
  }

  // 历史记录的时间格式
  function historyMsgTime(temp) {
    const currentTemp = +new Date();
    // 显示的时间格式:
    // 如果是当天的历史记录  15:02
    // 如果是昨天的历史记录  昨天 15:02
    // 早于昨天的历史        22/11/20 15:02

    const currentY = dayjs(currentTemp).format('YYYY');
    const currentM = dayjs(currentTemp).format('MM');
    const currentD = dayjs(currentTemp).format('DD');
    const currentDayTemp = dayjs(
      currentY + '-' + currentM + '-' + currentD
    ).valueOf();
    // 今天过了的时间
    const duringTime = currentTemp - currentDayTemp;
    // 一天的毫秒数
    const oneDayTime = 86400000;
    if (currentTemp - temp < duringTime) {
      // 今天的信息
      return dayjs(temp).format('HH:mm');
    }
    if (currentTemp - temp < duringTime + oneDayTime) {
      return '昨天' + dayjs(temp).format('HH:mm');
    }
    return dayjs(temp).format('YY/MM/DD HH:mm');
  }

  // session列表 时间格式
  function sessionTime(temp) {
    const currentTemp = +new Date();
    // 显示的时间格式:
    // 如果是当前的历史记录  15:02
    // 如果是昨天的历史记录  昨天
    // 早于昨天的历史        22/11/20

    const currentY = dayjs(currentTemp).format('YYYY');
    const currentM = dayjs(currentTemp).format('MM');
    const currentD = dayjs(currentTemp).format('DD');
    const currentDayTemp = dayjs(
      currentY + '-' + currentM + '-' + currentD
    ).valueOf();
    // 今天过了的时间
    const duringTime = currentTemp - currentDayTemp;
    // 一天的毫秒数
    const oneDayTime = 86400000;
    if (currentTemp - temp < duringTime) {
      // 今天的信息
      return dayjs(temp).format('HH:mm');
    }
    if (currentTemp - temp < duringTime + oneDayTime) {
      return '昨天';
    }
    return dayjs(temp).format('YY/MM/DD');
  }

  // 自动获取焦点
  function getFocus(ele) {
    if (typeof ele === 'string') {
      return document.querySelector(ele);
    }
    function select(dom, sesecter) {
      return dom.querySelector(sesecter);
    }
    let res = document;
    ele.forEach((item) => {
      res = select(res, item);
    });
    return res;
  }

  // 生成sessionKey
  function getSessionKey(chatType, selfId, targetId) {
    if (chatType === CHAT_TYPE_1_2_N) {
      return targetId;
    }
    if (selfId < targetId) {
      return selfId + '_' + targetId;
    }
    return targetId + '_' + selfId;
  }

  async function delLocalMsg(cliTime, sessionKey, type) {
    const msgObj = await DBObject.dbInstance.getData(
      sessionKey,
      DB_STORE_NAME_SESSION
    );
    const msgArrs = msgObj.messages;
    // 遍历 删除 信息
    const index = msgArrs.findIndex((item) => item.clientSendTime == cliTime);
    if (index !== -1) {
      const delMsg = msgArrs.splice(index, 1);
      changeDom(delMsg[0], type);
      // 如果撤回的是最后一项，需要通知session 列表更新 最新的信息
      // 这里已经把 撤回的msg 从历史记录中删除 相当于 length -1 所以可以和上面的索引对应起来
      if (index === msgArrs.length) {
        // 拿到上一条 msg 渲染到 session list
        let messageType, clientSendTime, msgValue;
        if (index === 0) {
          // 撤回的是第一条  没有上一条数据 设置 ''
          msgValue = '';
          clientSendTime = 0;
          messageType = TEXT_MESSAGE;
        } else {
          const {
            messageType: type,
            content,
            clientSendTime: time,
          } = msgArrs[msgArrs.length - 1];
          clientSendTime = time;
          messageType = type;
          // 判断信息的类型
          if (type === TEXT_MESSAGE) {
            msgValue = BASE64.bytesToString(BASE64.decodeBase64(content));
          } else {
            msgValue = content;
          }
        }

        // 更新 session list
        if (currentPage.page === MSGCHART) {
          contactStore.recall({
            msgValue,
            msgTime: clientSendTime,
            msgType: messageType,
            sessionKey,
          });
        } else {
          serviceList.contactStore.recall({
            msgValue,
            msgTime: clientSendTime,
            msgType: messageType,
            sessionKey,
          });
        }
      }
      await DBObject.dbInstance.recallMsg(
        sessionKey,
        DB_STORE_NAME_SESSION,
        msgArrs
      );
    }
  }

  // 修改dom
  function changeDom(
    { chatType, clientSendTime, messageType, content, fromUserId },
    type
  ) {
    let divMsgs = null;
    if (messageType === TEXT_MESSAGE) {
      divMsgs = document.querySelectorAll('.message-detail');
    } else {
      divMsgs = document.querySelectorAll('.msg-picture-detail');
    }

    // 倒叙遍历
    for (let i = divMsgs.length - 1; i >= 0; i--) {
      if (divMsgs[i].clientSendTime == clientSendTime) {
        // 隐藏当前父节点
        const divParent = divMsgs[i].parentNode;
        divParent.style.display = 'none';
        if (type === ACCORD_RECALL) {
          // 自己撤销的  可以编辑
          divParent.nextElementSibling.style = 'block';
          reEdit(divParent.nextElementSibling, messageType, content);
        } else {
          // 其他人撤销的 显示撤销的用户名
          const divOther = divParent.nextElementSibling.nextElementSibling;
          divOther.style = 'block';
          if (chatType === CHAT_TYPE_1_2_1) {
            divOther.querySelector('.recall-user').textContent =
              targetId.username;
          } else {
            divOther.querySelector('.recall-user').textContent =
              qunNumberMap.map[fromUserId].userName;
          }
        }
        break;
      }
    }
    // const index = divMsgs.findIndex((ele) => {
    //   ele.clientSendTime == cliTime;
    // });
    // if (index !== -1) {
    //   divMsgs[index];
    // }
  }

  // 主动撤回 需要绑定重新编辑的事件
  function reEdit(domEdit, msgType, value) {
    // 根据msg 类型 判断是否显示 重新编辑
    if (msgType === TEXT_MESSAGE) {
      domEdit.querySelector('.reset').addEventListener('click', (e) => {
        // 点击重新编辑的按钮，将上一次写入的值 设置到输入框中
        document.querySelector('.input-content').value = BASE64.bytesToString(
          BASE64.decodeBase64(value)
        );
      });
    } else {
      domEdit.querySelector('.reset').style.display = 'none';
    }
  }

  // 显示后端返回的msg
  function showResponseMsg(responseMsg) {
    const box = document.querySelector('.global-msg');
    box.querySelector('.response-msg').textContent = responseMsg;
    box.classList.add('animation-class');

    box.addEventListener('animationend', function () {
      box.classList.remove('animation-class');
    });
  }

  // 根据聊天类型 和 targetid 返回 当前接收的信息 应该是 我的消息 还是 联系客服
  function isMsgChart(chatType, targetId) {
    if (chatType === CHAT_TYPE_1_2_N) return true;
    // 如果是群聊  肯定是 我的消息 否则遍历 客服列表
    const flag = serviceStore.list.some((item) => item.userId == targetId);
    if (flag) {
      return false;
    } else {
      return true;
    }
  }

  // qs 将对象转为 键值对
  function converObj(obj) {
    let query = '';
    Object.keys(obj).forEach((item) => {
      const str = item + '=' + obj[item];
      query += str + '&';
    });
    query = query.substring(0, query.length - 1);
    return query;
  }

  return {
    getScrollBottom,
    currentSendTime,
    historyMsgTime,
    getFocus,
    getSessionKey,
    sessionTime,
    delLocalMsg,
    showResponseMsg,
    isMsgChart,
    converObj,
  };
});
