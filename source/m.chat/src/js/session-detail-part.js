const divCurrentPage = document.querySelector(".session-detail-part");

// 查看群信息
function registerIconMore() {
  divCurrentPage
    .querySelector(".icon-more")
    .addEventListener("click", function () {
      location.hash = "group-detail-part";
    });
}
registerIconMore();
