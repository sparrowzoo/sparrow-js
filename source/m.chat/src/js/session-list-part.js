const divSessionList = document
  .querySelector(".session-list-part")
  .querySelector(".session-list");

divSessionList.addEventListener("click", function (e) {
  location.hash = "session-detail-part";
});
