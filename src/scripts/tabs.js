Sparrow.prototype.tabs = function (config) {
    if (!config) {
        config = {};
    }
    var withIndexClass = config.withIndexClass;
    var currentIndex = config.index;
    var tabchilds = $("son.div." + this.s.id);
    var title = tabchilds[0];
    var tabArray = $("son.li", title);
    var content = tabchilds[1];
    var contentList = $("son.div", content);
    tabArray.each(function (tab_index) {
        if (this.className !== "close" && this.className !== "more") {
            $($("son.a", this)[0]).bind(
                "onclick",
                function (e) {
                    var srcElementHyperLink = $.event(e).srcElement;
                    if (srcElementHyperLink.tagName === "SPAN") {
                        srcElementHyperLink = srcElementHyperLink.parentNode;
                    }
                    var tabIndex = $(srcElementHyperLink.parentNode).attr("tab_index");
                    var rev = $(srcElementHyperLink).attr("rev");
                    if (rev) {
                        var moreHyperCtrl = $("son.a",
                            tabArray[tabArray.length - 1]);
                        moreHyperCtrl[0].href = rev;
                    }
                    contentList.each(function (contentIndex) {
                        if (withIndexClass)
                            tabArray[0].className = "index";
                        if (contentIndex === tabIndex) {
                            tabArray[contentIndex].className = "select";
                            this.className = "block";
                        } else {
                            tabArray[contentIndex].className = "noselect";
                            this.className = "none";
                        }
                    });
                });
        }
        $(this).attr("tab_index", tab_index);
    });
    if (currentIndex) {
        tabArray[currentIndex].onclick();
    }
};