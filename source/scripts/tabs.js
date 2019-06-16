Sparrow.prototype.tabs = function (config) {
    if (!config) {
        config = {};
    }
    //首页的样式，默认为无
    var withIndexClass = config.withIndexClass;
    //当前tab 的index
    var currentIndex = config.index;
    //tab 框的子div
    var tabchilds = $("!div." + this.s.id);
    //第一个为title tab 控制
    var tabControllerContainer = tabchilds[0];
    //具体的tab 控制框
    var tabControllerList = $("!li", tabControllerContainer);
    //第二个为内容框
    var contentContainer = tabchilds[1];
    //具体的内容框
    var contentList = $("!div", contentContainer);
    //每个控制框的绑定事件
    tabControllerList.each(function (tab_index) {
        $(this).attr("tab_index", tab_index);
        if (this.className.indexOf("close")>0 ||this.className.indexOf("more")>0) {
           return;
        }
        //<a><span onclick=></span></a>
            $($("!a", this)[0]).bind(
                "onclick",
                function (e) {
                    var srcElementHyperLink = $.event(e).srcElement;
                    if (srcElementHyperLink.tagName === "SPAN") {
                        srcElementHyperLink = srcElementHyperLink.parentNode;
                    }
                    var tabIndex = $(srcElementHyperLink.parentNode).attr("tab_index");
                    //将当前的rev http://www.w3school.com.cn/tags/att_a_rev.asp
                    var rev = $(srcElementHyperLink).attr("rev");
                    if (rev) {
                        var moreHyperCtrl = $("!a",
                            tabControllerList[tabControllerList.length - 1]);
                        moreHyperCtrl[0].href = rev;
                    }
                    contentList.each(function (contentIndex) {
                        if (withIndexClass)
                            tabControllerList[0].className = "pure-menu-item pure-menu-heading";
                        if (contentIndex == tabIndex) {
                            tabControllerList[contentIndex].className = "pure-menu-item pure-menu-selected";
                            this.className = "block";
                        } else {
                            tabControllerList[contentIndex].className = "pure-menu-item";
                            this.className = "none";
                        }
                    });
                });
    });
    //select 当前tab
    if (currentIndex) {
        tabControllerList[currentIndex].onclick();
    }
};