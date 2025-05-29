Sparrow.prototype.tabs = function (config) {
  if (!config) {
    config = {};
  }
  var tabClickCallback = config.tabClickCallback;
  //首页的样式，默认为无
  var withIndexClass = config.withIndexClass;
  //当前tab 的index
  var currentIndex = config.index;
  //tab 框的子div
  var tabChildren = $("!div." + this.s.id);
  //第一个为title tab 控制
  var controllerContainer = tabChildren[0];
  //具体的tab 控制框
  var controllerMenuList = $("!li", controllerContainer);
  //第二个为内容框
  var contentContainer = tabChildren[1];
  //具体的内容框
  var contentList = $("!div", contentContainer);
  var menuSwitch = function (tabIndex) {
    if (tabClickCallback) {
      tabClickCallback(tabIndex);
    }
    var menuHyperCtrl = $("!a", controllerMenuList[tabIndex])[0];
    //将当前的rev  more
    // http://www.w3school.com.cn/tags/att_a_rev.asp
    var rev = $(menuHyperCtrl).attr("rev");
    if (rev) {
      var moreHyperCtrl = $(
        "!a",
        controllerMenuList[controllerMenuList.length - 1]
      );
      moreHyperCtrl[0].href = rev;
    }
    contentList.each(function (contentIndex) {
      if (withIndexClass) {
        controllerMenuList[0].className = "pure-menu-item pure-menu-heading";
      }
      if (contentIndex == tabIndex) {
        controllerMenuList[contentIndex].className =
          "pure-menu-item pure-menu-selected";
        this.className = "block";
        return;
      }
      controllerMenuList[contentIndex].className = "pure-menu-item";
      this.className = "none";
    });
  };
  //每个控制框的绑定事件
  controllerMenuList.each(function (tab_index) {
    $(this).attr("tab_index", tab_index);
    if (
      this.className.indexOf("close") > 0 ||
      this.className.indexOf("more") > 0
    ) {
      return;
    }
    //<a><span onclick=></span></a>
    $(this).bind("onclick", function () {
      var tabIndex = $(this).attr("tab_index");
      menuSwitch(tabIndex);
    });
  });
  //select 当前tab
  if (currentIndex) {
    menuSwitch(currentIndex);
  }
};
