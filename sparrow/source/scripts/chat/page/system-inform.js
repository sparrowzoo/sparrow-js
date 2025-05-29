define(['api'], function (api) {
  function renderInfo(list) {
    const contentDiv = document.querySelector('.inform');
    const templateInfo = document.querySelector('#system-inform');
    const contentItemDiv = templateInfo.content.cloneNode(true);
    const itemFragment = new DocumentFragment();
    list.forEach((item) => {
      const copyConItemDiv = contentItemDiv.cloneNode(true);
      // 文本太长，做截断
      if (item.noticeTitle.length > 50) {
        copyConItemDiv.querySelector('p').textContent =
          item.noticeTitle.substr(0, 50) + '...';
      } else {
        copyConItemDiv.querySelector('p').textContent = item.noticeTitle;
      }
      copyConItemDiv.querySelector('p').textDetail = item.noticeTitle;
      contentItemDiv.querySelector('.inform-time').textContent =
        item.createTime;

      itemFragment.appendChild(copyConItemDiv);
    });
    // 先清空父容器，再添加子元素  防止重复添加
    contentDiv.innerHTML = '';
    contentDiv.appendChild(itemFragment);
    unflod();
  }
  // 展开 / 收起
  function unflod() {
    console.log('pp');
    const infoList = document
      .querySelector('.inform')
      .querySelectorAll('.inform-operate');
    for (let i = 0; i < infoList.length; i++) {
      infoList[i].addEventListener('click', function () {
        this.textContent = this.textContent === '收起' ? '展开全部' : '收起';
        // 获取当前父元素的 兄弟元素 修改显示文本
        const textDom = infoList[i].parentNode.previousElementSibling;
        const msg = textDom.textDetail;
        textDom.textDetail = textDom.textContent;
        textDom.textContent = msg;
      });
    }
  }

  return { renderInfo };
});
