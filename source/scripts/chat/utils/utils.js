define(["store", "day", "chat-msg", "indexedDB", "contacts"], function (
  store,
  dayjs,
  chatMsg,
  indexedDB,
  contacts
) {
  const {
    CHAT_TYPE_1_2_1,
    CHAT_TYPE_1_2_N,
    DB_STORE_NAME_SESSION,
    TEXT_MESSAGE,
    targetId,
    qunNumberMap,
    ACCORD_RECALL,
  } = store;
  const DBObject = indexedDB;
  const { contactStore } = contacts;

  // 根据传来的class  滚动到底部
  const getScrollBottom = function (className) {
    const scrollDom = document.querySelector(className);
    scrollDom.scrollTop = scrollDom.scrollHeight;
  };

  // 当前发送消息的时间
  function currentSendTime() {
    return dayjs().format("HH:mm");
  }

  // 历史记录的时间格式
  function historyMsgTime(temp) {
    const currentTemp = +new Date();
    // 显示的时间格式:
    // 如果是当天的历史记录  15:02
    // 如果是昨天的历史记录  昨天 15:02
    // 早于昨天的历史        22/11/20 15:02

    const currentY = dayjs(currentTemp).format("YYYY");
    const currentM = dayjs(currentTemp).format("MM");
    const currentD = dayjs(currentTemp).format("DD");
    const currentDayTemp = dayjs(
      currentY + "-" + currentM + "-" + currentD
    ).valueOf();
    // 今天过了的时间
    const duringTime = currentTemp - currentDayTemp;
    // 一天的毫秒数
    const oneDayTime = 86400000;
    if (currentTemp - temp < duringTime) {
      // 今天的信息
      return dayjs(temp).format("HH:mm");
    }
    if (currentTemp - temp < duringTime + oneDayTime) {
      return "昨天" + dayjs(temp).format("HH:mm");
    }
    return dayjs(temp).format("YY/MM/DD HH:mm");
  }

  // session列表 时间格式
  function sessionTime(temp) {
    const currentTemp = +new Date();
    // 显示的时间格式:
    // 如果是当前的历史记录  15:02
    // 如果是昨天的历史记录  昨天
    // 早于昨天的历史        22/11/20

    const currentY = dayjs(currentTemp).format("YYYY");
    const currentM = dayjs(currentTemp).format("MM");
    const currentD = dayjs(currentTemp).format("DD");
    const currentDayTemp = dayjs(
      currentY + "-" + currentM + "-" + currentD
    ).valueOf();
    // 今天过了的时间
    const duringTime = currentTemp - currentDayTemp;
    // 一天的毫秒数
    const oneDayTime = 86400000;
    if (currentTemp - temp < duringTime) {
      // 今天的信息
      return dayjs(temp).format("HH:mm");
    }
    if (currentTemp - temp < duringTime + oneDayTime) {
      return "昨天";
    }
    return dayjs(temp).format("YY/MM/DD");
  }

  // 自动获取焦点
  function getFocus(ele) {
    if (typeof ele === "string") {
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
      return selfId + "_" + targetId;
    }
    return targetId + "_" + selfId;
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
      if (index === msgArrs.length) {
        console.log(msgArrs[msgArrs.length - 1]);
        const { messageType, serverTime, session, content, clientSendTime } =
          msgArrs[msgArrs.length - 1];
        let msgValue = "";
        // 判断信息的类型
        if (messageType === TEXT_MESSAGE) {
          msgValue = BASE64.bytesToString(BASE64.decodeBase64(content));
        } else {
          msgValue = content;
        }
        contactStore.recall({
          msgValue,
          msgTime: serverTime || clientSendTime,
          msgType: messageType,
          sessionKey: session,
        });
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
      divMsgs = document.querySelectorAll(".message-detail");
    } else {
      divMsgs = document.querySelectorAll(".msg-picture-detail");
    }

    // 倒叙遍历
    for (let i = divMsgs.length - 1; i >= 0; i--) {
      if (divMsgs[i].clientSendTime == clientSendTime) {
        // 隐藏当前父节点
        const divParent = divMsgs[i].parentNode;
        divParent.style.display = "none";
        if (type === ACCORD_RECALL) {
          // 自己撤销的  可以编辑
          divParent.nextElementSibling.style = "block";
          reEdit(divParent.nextElementSibling, messageType, content);
        } else {
          // 其他人撤销的 显示撤销的用户名
          const divOther = divParent.nextElementSibling.nextElementSibling;
          divOther.style = "block";
          if (chatType === CHAT_TYPE_1_2_1) {
            divOther.querySelector(".recall-user").textContent =
              targetId.username;
          } else {
            divOther.querySelector(".recall-user").textContent =
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
      domEdit.querySelector(".reset").addEventListener("click", (e) => {
        // 点击重新编辑的按钮，将上一次写入的值 设置到输入框中
        document.querySelector(".input-content").value = BASE64.bytesToString(
          BASE64.decodeBase64(value)
        );
      });
    } else {
      domEdit.querySelector(".reset").style.display = "none";
    }
  }

  return {
    getScrollBottom,
    currentSendTime,
    historyMsgTime,
    getFocus,
    getSessionKey,
    sessionTime,
    delLocalMsg,
  };
});
