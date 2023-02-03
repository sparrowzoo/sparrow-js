import "./css/index.less";
import "./js/group-detail-part.js";
import "./js/session-list-part.js";
import "./js/session-detail-part";

// hash 和页面之间的映射关系
const urlMap = {
  "": 0,
  "session-detail-part": 1,
  "group-detail-part": 2,
};

// 回退事件
const iconBack = document.querySelectorAll(".arrows-l");

iconBack.forEach((item) => {
  item.addEventListener("click", (e) => {
    history.back();
  });
});
const container = document.querySelector(".wrapper");
// 根据hash 动态切换页面的显示
function changPageByHash() {
  let queryType = "";
  if (location.hash) {
    queryType = location.hash.slice(1);
  }
  for (let i = 0; i < container.children.length; i++) {
    if (i == urlMap[queryType]) {
      container.children[i].style.display = "block";
    } else {
      container.children[i].style.display = "none";
    }
  }
}
window.onload = function () {
  changPageByHash();
};

window.addEventListener("hashchange", function (e) {
  changPageByHash();
});
