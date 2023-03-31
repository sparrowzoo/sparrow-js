define(['indexedDB', 'store'], function (indexedDB, store) {
  const { DB_STORE_NAME_USER, qunNumberMap, DEFAULTAVATAR } = store;
  const DBObject = indexedDB;

  function init() {
    addMoreFriend();
  }
  // 群聊中 添加好友按钮的点击事件
  function addMoreFriend() {
    console.log('添加按钮注册');
    const addFriendIcon = document
      .querySelector('.group-more-part')
      .querySelector('.search-add');
    addFriendIcon.onclick = function () {
      const addFriendDialog = document.querySelector('.dialog-add-friend-wrap');
      addFriendDialog.style.display =
        addFriendDialog.style.display === 'none' ? 'block' : 'none';
      registerAddClick();
      registerWindowClick();
      createFriendList();
    };
  }

  // 注册弹层整体的点击事件，阻止冒泡，防止侧边栏缩回
  function registerAddClick() {
    const addFriendDialog = document.querySelector('.dialog-add-friend');
    addFriendDialog.onclick = function (e) {
      e.stopPropagation();
    };
  }

  // 在添加好友层显示出来后，监听window 点击，准备隐藏弹层和侧边栏，隐藏后，需要移除此次事件
  function registerWindowClick() {
    function windowClick() {
      console.log('window add click');
      const dialogDiv = document.querySelector('.dialog-add-friend-wrap');
      // 关闭弹层
      dialogDiv.style.display = 'none';
      // 清空已选择列表
      clearChooseList();
      // 在弹层关闭后，移除这一层的window click 事件
      window.removeEventListener('click', windowClick);
    }
    window.addEventListener('click', windowClick);
  }

  // 注册搜索弹层相关事件
  function registerDialogEvent() {
    const dialogDiv = document.querySelector('.dialog-add-friend-wrap');

    // 关闭图标的点击事件
    dialogDiv.querySelector('.icon-cuowukongxin').onclick = function (e) {
      dialogDiv.style.display = 'none';
      clearChooseList();
    };

    // 取消按钮点击事件
    dialogDiv.querySelector('.cancel-btn').onclick = function (e) {
      dialogDiv.style.display = 'none';
      clearChooseList();
    };

    // 搜索联系人事件
    const inputSearch = document
      .querySelector('.dialog-add-friend')
      .querySelector('input');
    inputSearch.oninput = function (e) {
      filterUser(e.target.value);
    };
  }

  // 根据搜索框 过滤联系人
  function filterUser(searchStr) {
    const userList = document
      .querySelector('.dialog-user-list')
      .querySelector('.user-list').children;

    for (let i = 0; i < userList.length; i++) {
      if (
        userList[i].querySelector('.username').textContent.includes(searchStr)
      ) {
        userList[i].style.display = 'flex';
      } else {
        userList[i].style.display = 'none';
      }
    }
  }

  // 在弹层中 生成好友列表
  async function createFriendList() {
    const templateUser = document.querySelector('#add-firend-user');
    const userDiv = templateUser.content.cloneNode(true);
    const parentDiv = document
      .querySelector('.dialog-user-list')
      .querySelector('.user-list');
    const fragmentUserContainer = new DocumentFragment();
    // 拿到保存的所有联系人
    const firends = await DBObject.dbInstance.getAll(DB_STORE_NAME_USER);
    // 拿到群成员
    const members = qunNumberMap.map;
    const { operateDom, changNum } = changeChooseUser();
    firends.forEach((item, index) => {
      const users = userDiv.cloneNode(true);
      users.querySelector('img').src = item.avatar || DEFAULTAVATAR;
      users.querySelector('.username').textContent = item.userName;
      // 不能在模板元素上添加，可以在子节点上添加
      users.querySelector('.check-box').item = item;
      item.index = index;

      // 过滤联系人，如果当前联系人已经是群成员，不需要添加点击事件
      const flag = members[item.userId];
      if (flag) {
        users.querySelector('.check-box').querySelector('i').style.display =
          'block';
        users.querySelector('.check-box').querySelector('i').style.color =
          '#999';
      } else {
        // 给每个用户注册点击事件
        users.querySelector('.check-box').onclick = function () {
          if (this.querySelector('i').style.display === 'none') {
            // 是要添加用户到群
            this.querySelector('i').style.display = 'block';
            operateDom(item);
          } else {
            // 再次点击 是要从已选择的列表中，删除点击的用户
            this.querySelector('i').style.display = 'none';
            unload(item.index);
            // 修改已选择数量
            changNum();
          }
        };
      }

      fragmentUserContainer.appendChild(users);
    });
    parentDiv.innerHTML = '';
    parentDiv.appendChild(fragmentUserContainer);
  }

  // 动态显示选择的联系人,
  function changeChooseUser() {
    const parentDiv = document.querySelector('.dialog-choose-list');
    const chooseContainer = parentDiv.querySelector('.choose-user');
    const templateUser = document.querySelector('#add-firend-user');
    const userDiv = templateUser.content.cloneNode(true);
    const divChooseedNum = parentDiv.querySelector('span');
    let chooseNum = 0;
    divChooseedNum.textContent = chooseNum;
    // 先清空列表  确保数据干净
    chooseContainer.innerHTML = '';
    // 使用到闭包，记得释放内存
    function operateDom(chooseUser) {
      chooseNum++;
      divChooseedNum.textContent = chooseNum;
      const users = userDiv.cloneNode(true);
      users.querySelector('img').src = chooseUser.avatar;
      users.querySelector('.username').textContent = chooseUser.userName;
      // 不能在模板元素上添加，可以在子节点上添加
      // 生成已选择用户的 dom  修改样式 并插入到已选择的卡片区域
      const checkBox = users.querySelector('.check-box');
      checkBox.item = chooseUser;
      checkBox
        .querySelector('i')
        .classList.replace('icon-duigou1', 'icon-cuowu');
      checkBox.querySelector('i').style.display = 'block';
      // 给当前选择的用户添加点击事件
      checkBox.onclick = function (e) {
        chooseNum--;
        divChooseedNum.textContent = chooseNum;
        // 卸载当前dom
        unload(this.item.index);
        // 取消选择框
        cancelChoose(this.item.index);
      };
      chooseContainer.appendChild(users);
    }
    // 改变已选择数量
    function changNum() {
      chooseNum--;
      divChooseedNum.textContent = chooseNum;
    }
    return {
      operateDom,
      changNum,
    };
  }

  // 取消选择
  function cancelChoose(index) {
    console.log('取消');
    const chooseListContainer = document
      .querySelector('.dialog-user-list')
      .querySelector('.user-list');
    const userList = chooseListContainer.querySelectorAll('.user-item');
    userList[index].querySelector('i').style.display = 'none';
  }

  // 卸载DOM 已选择列表
  function unload(chooseIndex) {
    const unChooseList = document
      .querySelector('.dialog-choose-list')
      .querySelector('.choose-user')
      .querySelectorAll('.user-item');
    for (let i = 0; i < unChooseList.length; i++) {
      if (
        unChooseList[i].querySelector('.check-box').item.index === chooseIndex
      ) {
        unChooseList[i].remove();
        break;
      }
    }
  }

  // 清空已选择列表
  function clearChooseList() {
    const parentDiv = document.querySelector('.dialog-choose-list');
    const chooseContainer = parentDiv.querySelector('.choose-user');
    chooseContainer.innerHTML = '';
  }

  return { addMoreFriend, registerDialogEvent };
});
