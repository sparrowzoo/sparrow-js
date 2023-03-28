define([
  'chat-msg',
  'api',
  'utils',
  'indexedDB',
  'store',
  'contacts',
  'system-inform',
  'contact-service',
], function (
  chatMsg,
  api,
  utils,
  indexedDB,
  store,
  contacts,
  systemInform,
  contactService
) {
  const { getMsgList, showSessionList, getDefaultChat } = chatMsg;

  const { getFocus, getSessionKey, showResponseMsg } = utils;
  const DBObject = indexedDB;
  // const dbInstance = initIndexedDB();

  const {
    CHAT_TYPE_1_2_1,
    CHAT_TYPE_1_2_N,
    selfId,
    DB_STORE_NAME_SESSION,
    DB_STORE_NAME_USER,
    DB_STORE_NAME_QUN,
    setTargetId,
    serviceStore,
    currentPage,
    MSGCHART,
    SERVICECHART,
  } = store;
  // const { initContack } = require("../store/contacts.js");
  const { contactStore } = contacts;

  // 全局删除 id 对象
  let removeID = null;

  // 获取左侧菜单，准备添加点击事件
  const menu = document.querySelector('.menu');
  const menuList = menu.querySelectorAll('.menu-item');
  // 当前激活的菜单项
  let activeMenu = '0';

  // 给菜单的父元素注册点击事件 事件委托
  menu.addEventListener('click', async (e) => {
    activeMenu = e.target.getAttribute('data-menu');
    showContentByMenu(activeMenu);
    // 只要点击了左侧菜单 面包屑就重置
    showCrumbsByIndex(0);

    // 我的好友
    if (activeMenu == 0) {
      // 点击我的好友 会发送请求好友和群聊的请求
      showFriendsList();
    }
    // 聊天消息
    if (activeMenu == 1) {
      // 点击聊天消息 默认跳转到群聊列表的第一个联系人
      getDefaultChat();

      // 并且设置全局的page 信息
      currentPage.changePage(MSGCHART);

      // 获取焦点
      const dom = getFocus(['.chat-msg', '.input-content']);
      dom.focus();
    }
    // 系统通知
    if (activeMenu == 2) {
      const res = await api.systemNotice();
      systemInform.renderInfo(res.data);
    }
    // 客服
    if (activeMenu == 3) {
      // 跳转到 第一个客服 session
      contactService.getDefaultChat();

      // 并且设置全局的page 信息
      currentPage.changePage(SERVICECHART);
      const dom = getFocus(['.service', '.input-content']);
      dom.focus();
    }
  });

  // 展示默认的content
  showContentByMenu(activeMenu);
  // 给三个select 注册点击事件
  registerSelectItemClick();

  // 根据 menu 显示对应的主体内容
  function showContentByMenu(activeIndex) {
    // 先将所有的 content 隐藏 然后将 对应的index 的content 显示
    const conts = document.querySelector('.main').children;
    for (let i = 0; i < conts.length; i++) {
      if (i == activeIndex) {
        conts[i].style.display = 'block';
      } else {
        conts[i].style.display = 'none';
      }
    }

    // 激活菜单的样式
    menuList.forEach((ele, index) => {
      if (index == activeMenu) {
        ele.style.color = '#FFF';
        ele.style.backgroundColor = '#282d3b';
      } else {
        ele.style.color = '#000';
        ele.style.backgroundColor = '#f7f7f7';
      }
    });
  }

  // 如果当前登录的是客服，则取消联系客服模块
  function hideService() {
    menuList[3].style.display = 'none';
  }

  // 展示首页的好友列表
  function showFriendsList() {
    // 发送请求后 默认展示的 就是好友列表
    showCardByIndex(0);
    getRelationList();
  }

  // 好友列表 联系人
  async function getRelationList(originContact) {
    let contacterObj = null;

    if (originContact) {
      contacterObj = originContact;
    } else {
      // 没有传入参数 从数据库中获取
      contacterObj = await getUses_Quns();
    }

    // 渲染好友 / 群
    if (contacterObj.users.length !== 0) {
      createListDom(CHAT_TYPE_1_2_1, contacterObj.users, '.my-friend');
    }

    if (contacterObj.quns.length !== 0) {
      createListDom(CHAT_TYPE_1_2_N, contacterObj.quns, '.my-group');
    }
  }

  // 向数据库中拿用户 / 群
  async function getUses_Quns() {
    const userArr = await DBObject.dbInstance.getAll(DB_STORE_NAME_USER);
    const qunArr = await DBObject.dbInstance.getAll(DB_STORE_NAME_QUN);
    const obj = {
      users: userArr,
      quns: qunArr,
    };
    return obj;
  }

  // 好友列表 / 群 创建DOM 并渲染列表
  function createListDom(type, list, template) {
    const itemId = type === CHAT_TYPE_1_2_1 ? 'userId' : 'qunId';
    const itemName = type === CHAT_TYPE_1_2_1 ? 'userName' : 'qunName';

    const contentDiv = document.querySelector(template);
    const userListTemplate = document.querySelector('#user-list');
    const contentItemDiv = userListTemplate.content.cloneNode(true);
    const itemFragment = new DocumentFragment();
    // 生成好友列表
    list.forEach((item) => {
      // 复制一份 准备根据list 渲染数据
      const copyConItemDiv = contentItemDiv.cloneNode(true);
      // 用户 / 群头像
      const imgDiv = copyConItemDiv.querySelector('img');
      imgDiv.src = item.avatar || item.unitIcon;
      // 国籍 图片
      const imgFlag = copyConItemDiv.querySelector('.img-flag');
      imgFlag.src = item.flagUrl;
      // 用户 / 详细信息
      const userDiv = copyConItemDiv.querySelectorAll('span');
      userDiv[0].innerText = item[itemName];
      // 操作按钮
      const divOperate = copyConItemDiv.querySelector('.operate');
      divOperate.setAttribute('data-user_id', item[itemId]);
      divOperate.setAttribute('data-user_name', item[itemName]);
      divOperate.item = item;
      // 群聊需要改变模板
      if (type === CHAT_TYPE_1_2_N) {
        imgFlag.style.display = 'none';
        userDiv[1].innerText = '群公告' + item.announcement;
        const buttonRemove = divOperate.querySelector('button');
        buttonRemove.innerText = '删除群聊';
      }
      // 新的朋友 修改模板
      if (template === '.new-friend') {
        const buttons = divOperate.querySelectorAll('button');
        buttons[0].innerText = '拒绝';
        buttons[1].innerText = '通过';
      }
      itemFragment.appendChild(copyConItemDiv);
    });
    // 先清空父容器，再添加子元素  防止重复添加
    contentDiv.innerHTML = '';
    contentDiv.appendChild(itemFragment);

    // 为按钮添加点击事件 注册删除好友 & 聊一下的事件  事件委托
    const btnContainers = document
      .querySelector(template)
      .querySelectorAll('.operate');

    btnContainers.forEach((ele) => {
      ele.addEventListener('click', function (e) {
        if (e.target.getAttribute('data-type') === 'remove') {
          if (e.currentTarget.item.members) {
            removeGroup(e.currentTarget.getAttribute('data-user_id'));
          } else {
            // 当前是删除用户
            removeUser(e.currentTarget.getAttribute('data-user_id'));
          }
        }
        if (e.target.getAttribute('data-type') === 'chat') {
          chatBy(
            e.currentTarget.getAttribute('data-user_id'),
            e.currentTarget.getAttribute('data-user_name'),
            type,
            this.item.avatar
          );
        }
      });
    });
  }

  // 首次进入 拿到好友 / 群列表 生成会话列表
  // async function initSessionData(users, quns) {
  //   const u = await Promise.all(
  //     users.map(async (user) => {
  //       const sessinKey = getSessionKey(
  //         CHAT_TYPE_1_2_1,
  //         selfId.value,
  //         user.userId
  //       );
  //       return compareMsg(sessinKey, user);
  //     })
  //   );
  //   const q = await Promise.all(
  //     quns.map((item) => {
  //       const sessinKey = getSessionKey(
  //         CHAT_TYPE_1_2_N,
  //         selfId.value,
  //         item.qunId
  //       );
  //       return compareMsg(sessinKey, item);
  //     })
  //   );
  //   // 先对会话列表做保存
  //   contactStore.initContact([...u, ...q]);
  //   // 渲染 聊天消息的列表
  //   showSessionList();
  // }
  // 和保存的最后一条数据做比对  将当前用户 以及添加一个 unReadCount lastMessage 属性  1 客服
  // async function compareMsg(keyPath, contacter) {
  //   // 向数据库中查询与当前用户的历史记录
  //   const sessionItem = await DBObject.dbInstance.getData(
  //     keyPath,
  //     DB_STORE_NAME_SESSION
  //   );
  //   // 未读数量 / 最新信息
  //   let unReadCount = -1;
  //   let lastMessage = '';

  //   // 与当前用户有聊天记录  才会有未读和 最新信息
  //   if (sessionItem) {
  //     // 如果有最新消息的记录时间 => lastReadTime 倒叙遍历 历史记录
  //     if (sessionItem.lastReadTime) {
  //       const count = sessionItem.messages.length - 1;
  //       for (let i = count; i >= 0; i--) {
  //         if (sessionItem.messages[i].serverTime < sessionItem.lastReadTime) {
  //           unReadCount = count - i;
  //           break;
  //         }
  //       }
  //       // 依然是 -1 说明当前未读记录 已经超过历史记录的最大存储,未读数设置为历史记录总数
  //       if (unReadCount === -1) {
  //         unReadCount = count + 1;
  //       }
  //     } else {
  //       // 没有lastReadTime 未读数直接返回历史记录的数量
  //       unReadCount = sessionItem.messages?.length;
  //     }
  //     lastMessage = sessionItem.messages[sessionItem.messages.length - 1];
  //     contacter.unReadCount = unReadCount;
  //     contacter.lastMessage = lastMessage;
  //     return contacter;
  //   } else {
  //   }
  // }

  // 区分历史记录
  function diffSessionList(sessiionArr) {
    // 历史记录分为三种 : 好友的 临时会话 客服
    const newSessionArr = getUnreadCount(sessiionArr);
    const serviceHistory = [];
    // 首先过滤出客服的
    const msgHistory = newSessionArr.filter((item) => {
      const flag = serviceStore.list.some((serviceItem) => {
        return item.chatSession.target == serviceItem.userId;
      });

      if (flag) {
        // 说明当前是客服的历史记录
        serviceHistory.push(item);
      }
      return !flag;
    });
    createMyMsgSessionList(msgHistory);
    createServiceSessionList(serviceHistory);
  }

  // 获取未读数和最新的msg
  function getUnreadCount(sessionArr) {
    return sessionArr.map((sessionItem) => {
      let unReadCount = -1;
      let lastMessage = '';

      if (sessionItem.lastReadTime) {
        const count = sessionItem.messages.length - 1;
        for (let i = count; i >= 0; i--) {
          if (sessionItem.messages[i].serverTime < sessionItem.lastReadTime) {
            unReadCount = count - i;
            break;
          }
        }
        // 依然是 -1 说明当前未读记录 已经超过历史记录的最大存储,未读数设置为历史记录总数
        if (unReadCount === -1) {
          unReadCount = count + 1;
        }
      } else {
        // 没有lastReadTime 未读数直接返回历史记录的数量
        unReadCount = sessionItem.messages?.length;
      }

      lastMessage = sessionItem.messages[sessionItem.messages.length - 1];
      sessionItem.unReadCount = unReadCount;
      sessionItem.lastMessage = lastMessage;
      return sessionItem;
    });
  }
  // 我的消息 session list
  async function createMyMsgSessionList(sessionItem) {
    // 我的消息要区分 好友和 临时会话  通过查通讯录是否为好友区分
    // 用于接收临时会话用户的id
    const temporaryList = [];
    // 用于保存好友的信息
    const firendSessionList = sessionItem.map(async (item) => {
      // 区分 群 / 好友 的 keyPath storeName
      const storeNmae =
        item.chatSession.chatType === CHAT_TYPE_1_2_1
          ? DB_STORE_NAME_USER
          : DB_STORE_NAME_QUN;
      const keyPath =
        item.chatSession.target === -1
          ? item.chatSession.sessionKey
          : item.chatSession.target;
      const session = await DBObject.dbInstance.getData(keyPath, storeNmae);
      if (session) {
        // 当前不是临时聊天的记录
        session.lastMessage = item.lastMessage;
        session.unReadCount = item.unReadCount;
      } else {
        temporaryList.push(item);
      }
      return session;
    });

    const listArr = await Promise.all(firendSessionList);

    const temporarySessionList = await getTemporaryInfo(temporaryList);
    // 先对会话列表做保存
    contactStore.initContact([...listArr, ...temporarySessionList]);
    // 渲染 聊天消息的列表
    showSessionList();
  }

  // 发送请求 获取临时会话的详细用户信息
  async function getTemporaryInfo(temporaryArr) {
    // 如果没有临时会话直接返回空数组
    const arrLength = temporaryArr.length;
    const params = temporaryArr.map((item) => item.chatSession.target);

    if (arrLength === 0) return temporaryArr;
    // 前端分页  每100条 发送一个网络请求 .. 需要测试
    if (arrLength > 100) {
      // 保存所有的网络请求
      const allAjax = [];
      // 对targetid 分片，分片请求
      let count = arrLength - 100;
      let num = 1;
      while (count > 100) {
        count -= 100;
        num++;
      }
      let i = 0;
      for (; i < num; i++) {
        const paramsSlice = params.slice(i * 100, (i + 1) * 100);
        const ajaxSlice = await api.getDetailByIdArr(paramsSlice);
        allAjax.push(ajaxSlice);
      }
      // 不足 100个的请求
      const paramsLast = params.slice(i * 100, arrLength);
      const ajaxLast = await api.getDetailByIdArr(paramsLast);
      allAjax.push(ajaxLast);

      // 等所有的请求同时回来,将所有的 data 合并到一起
      const res = Promise.all(allAjax); // [{} ,{} ,...]
      const allData = [];
      res.forEach((item) => {
        allData.push(...item.data);
      });
      // 构造数据
      const temporarySessionList = allData.map((item, index) => {
        // 获取最后一条信息
        item.lastMessage = temporaryArr[index].lastMessage;
        item.unReadCount = temporaryArr[index].unReadCount;
        return item;
      });
      return temporarySessionList;
    } else {
      // 数据小于 100 不需要分页
      const { data } = await api.getDetailByIdArr(params);
      const temporarySessionList = data.map((item, index) => {
        // 获取最后一条信息
        item.lastMessage = temporaryArr[index].lastMessage;
        item.unReadCount = temporaryArr[index].unReadCount;
        return item;
      });
      return temporarySessionList;
    }
  }

  // 联系客服 session list
  function createServiceSessionList() {
    // 客服不需要 特殊处理 ，每个客服必须渲染session list
  }

  // 通过按钮的weakMap
  const applyButtonWeakMap = new WeakMap();

  // 新的朋友 渲染DOM
  async function createNewFriend() {
    const { data } = await api.newFriend();
    // 如果没有新朋友 不执行下面的逻辑
    if (data.length === 0) return;
    // createListDom(CHAT_TYPE_1_2_1, res.data, '.new-friend');
    const contentDiv = document.querySelector('.new-friend');
    const userListTemplate = document.querySelector('#user-list');
    const contentItemDiv = userListTemplate.content.cloneNode(true);
    const itemFragment = new DocumentFragment();
    // 生成好友列表
    data.forEach((item) => {
      // 复制一份 准备根据list 渲染数据
      const copyConItemDiv = contentItemDiv.cloneNode(true);
      // 用户头像
      const imgDiv = copyConItemDiv.querySelector('img');
      imgDiv.src = item.vo.avatar || 'http://r.sparrowzoo.net/images/user.png';
      // 国籍 图片
      const imgFlag = copyConItemDiv.querySelector('.img-flag');
      imgFlag.src =
        item.vo.flagUrl || 'http://r.sparrowzoo.net/images/flag.jpg';
      // 用户 / 详细信息
      const userDiv = copyConItemDiv.querySelectorAll('span');
      userDiv[0].innerText = item.vo.userName;
      // 操作按钮
      // 判断当前新朋友的状态
      if (item.status === 1) {
        // 当前是已通过申请的好友
        const divOperate = copyConItemDiv.querySelector('.operate');
        const divPass = copyConItemDiv.querySelector('.operate-res');
        divOperate.style.display = 'none';
        divPass.style.display = 'block';
      } else if (item.status === 2) {
        // 申请状态为已拒绝
        const divOperate = copyConItemDiv.querySelector('.operate');
        const divPass = copyConItemDiv.querySelector('.operate-res');
        divOperate.style.display = 'none';
        divPass.textContent = '已拒绝';
        divPass.style.display = 'block';
      } else {
        // 申请未处理状态
        const divOperate = copyConItemDiv.querySelector('.operate');
        // 将新朋友接口信息保存在dom 元素中
        divOperate.item = item.vo;
        // 将当前申请的id 保存起来 用于发送通过 / 拒绝好友的请求
        divOperate.item.id = item.id;
        // 新的朋友 修改模板
        const buttons = divOperate.querySelectorAll('button');
        buttons[0].innerText = '拒绝';
        buttons[1].innerText = '通过';

        // 通过按钮，保存这当前申请用户的信息
        applyButtonWeakMap.set(buttons[1], item.vo);
      }

      itemFragment.appendChild(copyConItemDiv);
    });
    // 先清空父容器，再添加子元素  防止重复添加
    contentDiv.innerHTML = '';
    contentDiv.appendChild(itemFragment);

    // 为按钮添加点击事件 注册删除好友 & 聊一下的事件  事件委托
    const btnContainers = document
      .querySelector('.new-friend')
      .querySelectorAll('.operate');

    btnContainers.forEach((ele) => {
      ele.addEventListener('click', function (e) {
        if (e.target.getAttribute('data-type') === 'remove') {
          rejectApply(this.item.id, this);
        }
        if (e.target.getAttribute('data-type') === 'chat') {
          passApply(this.item.id, this);
        }
      });
    });
  }

  // 新朋友，根据id 查询好友的详细信息
  async function getFriendDetail(arr) {
    const friendsApi = [];
    arr.forEach((item) => {
      const id = item.applyUserId;
      friendsApi.push(api.getDetailById({ id }));
    });
    const detailArr = await Promise.all(friendsApi);
    return detailArr;
  }

  async function chatBy(user_id, username, chatType, avatar) {
    // 聊天之前 设置全局的聊天对象
    const currentSession = getSessionKey(chatType, selfId.value, user_id);
    setTargetId(user_id, username, chatType, avatar, currentSession);
    // 聊一聊 跳转到 消息页面 需要把左侧菜单设置为第二项活跃
    activeMenu = '1';
    showContentByMenu('1');
    // 判断 是否和当前用户有session 记录，没有记录 需要新增一个session
    const flag = contactStore.contactList.some((item) => {
      if (chatType == CHAT_TYPE_1_2_1) {
        return item.userId == user_id;
      } else {
        return item.qunId == user_id;
      }
    });
    if (flag) {
      // 有session 记录 可以直接渲染聊天记录
      // getMsgList(user_id, username, chatType);
    } else {
      // 没有session 记录，需要在跳到消息页面之前 向 contactStore.contactList 添加这个记录，并且添加到第一条
      // 根据 聊天类型 群 / 用户 选择查询的表 以及生成主键名
      const storeName =
        chatType == CHAT_TYPE_1_2_1 ? DB_STORE_NAME_USER : DB_STORE_NAME_QUN;
      const keyPath = chatType == CHAT_TYPE_1_2_1 ? user_id * 1 : user_id;
      const sessionItem = await DBObject.dbInstance.getData(keyPath, storeName);
      // chatMsg.addSessionItem(sessionItem);
      // 同步到contacts 中
      sessionItem.lastMessage = {
        session: getSessionKey(chatType, selfId.value, user_id),
      };
      // 添加到contactList
      contactStore.addContactItem(sessionItem);
    }
    getMsgList(user_id, username, chatType);

    // 获取焦点
    const dom = getFocus(['.chat-msg', '.input-content']);
    dom.focus();
  }
  function removeUser(id) {
    console.log('remove', id);
    removeID = {
      id,
      type: CHAT_TYPE_1_2_1,
    };
    document.querySelector('.del-friend').style.display = 'block';
    document.querySelector('.global-mask').style.display = 'block';
  }
  function removeGroup(id) {
    removeID = {
      id,
      type: CHAT_TYPE_1_2_N,
    };
    document.querySelector('.del-friend').style.display = 'block';
    document.querySelector('.global-mask').style.display = 'block';
  }

  // 拒绝好友
  async function rejectApply(id, dom) {
    console.log(dom);
    const params = {
      id,
      status: '2',
    };
    const res = await api.auditFriend(params);
    showResponseMsg(res.msg);
    const divParent = dom.parentNode;

    const divOperate = divParent.querySelector('.operate');
    const divPass = divParent.querySelector('.operate-res');
    divOperate.style.display = 'none';
    divPass.textContent = '已拒绝';
    divPass.style.display = 'block';
  }
  // 通过申请
  async function passApply(id, dom) {
    const params = {
      id,
      status: '1',
    };
    const res = await api.auditFriend(params);
    // if (res.code === 200) {
    //   // 通过申请后，请求申请的好友详细信息，
    // }
    showResponseMsg(res.msg);
    if (res.code !== 200) return;

    const divParent = dom.parentNode;
    const divPass = divParent.querySelector('.operate-res');
    dom.style.display = 'none';
    divPass.style.display = 'block';

    // 通过好友申请后，向通讯录中 添加好友，并保存好友到数据库中，并创建session ...
    const applyBtnDom = dom.querySelectorAll('button')[1];
    addFriendById(applyButtonWeakMap.get(applyBtnDom));
  }
  // 我的好友页面下 三个按钮的点击
  function registerSelectItemClick() {
    const selItems = document.querySelectorAll('.select-item');
    // 切换主体显示内容
    for (let i = 0; i < selItems.length; i++) {
      selItems[i].addEventListener('click', function (e) {
        if (e.currentTarget.getAttribute('data-type') === '0') {
          // 切换dialog的显示状态
          const dialog = document.querySelector('.add-friend');
          dialog.style.display =
            dialog.style.display === 'none' ? 'block' : 'none';
          // 控制遮罩层显示
          document.querySelector('.global-mask').style.display =
            dialog.style.display;
        } else {
          showCardByIndex(e.currentTarget.getAttribute('data-type'));
        }

        if (i !== 0) {
          // 取消左侧菜单我的好友的样式
          const divMyFriend = document.querySelector('.menu-item');
          divMyFriend.style.color = '#000';
          divMyFriend.style.backgroundColor = '#f7f7f7';
        }
      });
    }
  }

  // 根据点击的索引 展示群 / 新朋友
  function showCardByIndex(index) {
    console.log(index);
    const divCards = document.querySelector('.content').children;
    for (let i = 0; i < divCards.length; i++) {
      if (i == index) {
        divCards[i].style.display = 'block';
      } else {
        divCards[i].style.display = 'none';
      }
    }
    if (index == 1) {
      // 请求新的好友列表
      createNewFriend();
    }
    showCrumbsByIndex(index);
  }

  // 根据索引 动态显示面包屑的提示文字
  function showCrumbsByIndex(index) {
    const spanCrumbs = document.querySelector('.change-step');
    const spanSecondCrumb = document.querySelector('.nav-msg');
    if (index == '0') {
      spanSecondCrumb.classList.add('active-nav');
      spanCrumbs.style.display = 'none';
      return;
    }
    const spanCrumbText = spanCrumbs.querySelector('.active-nav');
    if (index === '1') {
      spanCrumbText.innerText = '新的朋友';
      spanCrumbs.style.display = 'inline';
      spanSecondCrumb.classList.remove('active-nav');
    }
    if (index === '2') {
      spanSecondCrumb.classList.remove('active-nav');
      spanCrumbText.innerText = '我的群聊';
      spanCrumbs.style.display = 'inline';
    }
  }

  addFriendDialog();
  // 添加朋友弹层的申请 取消事件
  function addFriendDialog() {
    const inputSearch = document
      .querySelector('.add-friend')
      .querySelector('input');
    const divOperateParent = document
      .querySelector('.add-friend')
      .querySelector('.operate');
    divOperateParent.addEventListener('click', async function (e) {
      if (e.target.getAttribute('data-type') === 'remove') {
        // 点击取消
        console.log('cancel');
        document.querySelector('.add-friend').style.display = 'none';
        document.querySelector('.global-mask').style.display = 'none';
      }
      if (e.target.getAttribute('data-type') === 'chat') {
        // 点击申请
        // console.log(inputSearch.value);
        addFriendByMobile(inputSearch.value);
      }
      inputSearch.value = '';
    });
  }

  // 根据手机号发送请求 查询用户
  async function addFriendByMobile(mobile) {
    const res = await api.getDetailByPhone({
      mobile: mobile,
    });
    const divAddInput = document.querySelector('.add-input');
    const divUserDetail = document.querySelector('.search-user-detail');
    if (res.code !== 200) {
      showResponseMsg(res.msg);
      return;
    }

    divAddInput.style.display = 'none';
    divUserDetail.style.display = 'block';
    divUserDetail.querySelector('img').src = res.data.portrait;
    divUserDetail.querySelector('span').textContent = res.data.name;
    applyFriendById(res.data.id);
  }

  // 根据id 发送好友申请
  async function applyFriendById(id) {
    const divAddInput = document.querySelector('.add-input');
    const divUserDetail = document.querySelector('.search-user-detail');
    // 发送申请请求
    divUserDetail.querySelector('button').onclick = async function (e) {
      const r = await api.addFriendById({ id });
      showResponseMsg(r.msg);

      document.querySelector('.add-friend').style.display = 'none';
      document.querySelector('.global-mask').style.display = 'none';
      divAddInput.style.display = 'block';
      divUserDetail.style.display = 'none';
    };
    // 点击关闭图标
    divUserDetail.querySelector('.iconfont').onclick = function (e) {
      document.querySelector('.add-friend').style.display = 'none';
      document.querySelector('.global-mask').style.display = 'none';
      divAddInput.style.display = 'block';
      divUserDetail.style.display = 'none';
    };
  }

  // 删除好友
  async function removeFriendById() {
    const res = await api.removeFriend({ id: removeID.id });
    if (res.code === 200) {
      // 删除好友后,
      removeContactDom('.my-friend', 'userId');
    }
    showResponseMsg(res.msg);
  }

  // 删除群
  async function removeGroupById() {
    const res = await api.removeGroup({ id: removeID.id });
    if (res.code === 200) {
      // 删除群后,
      removeContactDom('.my-group', 'qunId');
    }
    showResponseMsg(res.msg);
  }
  // 删除好友 / 群的 sessionList indexedb 通讯录的数据
  async function removeContactDom(selecter, idType) {
    const parent = document.querySelector(selecter);
    const DomList = parent.querySelectorAll('.user-item');
    let i = 0;
    // 删除dom 就是删除通讯录列表
    for (let len = DomList.length; i < len; i++) {
      if (DomList[i].querySelector('.operate').item[idType] == removeID.id) {
        break;
      }
    }
    parent.removeChild(DomList[i]);

    // 删除session 列表
    const sessionKey = getSessionKey(
      CHAT_TYPE_1_2_1,
      selfId.value,
      removeID.id
    );
    contactStore.delItem(sessionKey);

    // 删除indexDB联系人 deleteData
    const keyPath =
      removeID.type === CHAT_TYPE_1_2_1 ? removeID.id * 1 : removeID.id;
    const storeName =
      removeID.type === CHAT_TYPE_1_2_1
        ? DB_STORE_NAME_USER
        : DB_STORE_NAME_QUN;
    const res = await DBObject.dbInstance.deleteData(keyPath, storeName);
    if (res === 'ok') {
      console.log('删除成功');
    }
  }

  // 新增好友 通讯录增加 session 列表增加 indexDB增加
  async function addFriendById(item) {
    // 通讯录 是根据indexedDB保存的用户来渲染的，所以直接保存数据库中就行
    await DBObject.dbInstance.putStoreItem(item, DB_STORE_NAME_USER);
    console.log('添加成功');

    // 添加成功后，新增session list,相当于手动触发聊一下
    chatBy(
      item.userId,
      item.userName,
      CHAT_TYPE_1_2_1,
      item.avatar || item.portrait
    );
  }

  // 删除弹层的取消 / 确认事件
  const btnContainer = document
    .querySelector('.del-friend')
    .querySelector('.operate');
  btnContainer.addEventListener('click', async (e) => {
    if (e.target.getAttribute('data-type') === 'remove') {
      console.log('点击取消');
    } else {
      console.log('点击确认');
      document.querySelector('.loading').display = 'block';
      if (removeID.type === CHAT_TYPE_1_2_1) {
        await removeFriendById();
      } else {
        await removeGroupById();
      }
      document.querySelector('.loading').display = 'none';
    }
    removeID = null;
    document.querySelector('.del-friend').style.display = 'none';
    document.querySelector('.global-mask').style.display = 'none';
  });

  return {
    getRelationList,
    diffSessionList,
    hideService,
  };
});
