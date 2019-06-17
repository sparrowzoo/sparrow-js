Sparrow.page = {
    toTargetPage: function (pageCount, pageFormat, srcElement) {
        var defPageIndex = parseInt($('defPageIndex').value);
        var currentPageIndex = parseInt($('spanCurrentPageIndex').innerHTML
            .trim());
        if (defPageIndex <= 0 || defPageIndex > pageCount) {
            $.message('超出页码范围', srcElement);
        } else if (defPageIndex === currentPageIndex) {
            $.message('当前页即是目标页', srcElement);
        } else {
            window.location.href = pageFormat.replace("$pageIndex", defPageIndex);
        }
    },
    defaction: null,
    action: function (pageIndex, formIndex) {
        $("currentPageIndex").value = pageIndex;
        window.location.href = "#top";
        if (this.defaction != null) {
            this.defaction(pageIndex);
        } else {
            $.submit(null, formIndex);
        }
    },
    next: function () {
        var elementArray = $("divPage").getElementsByTagName("a");
        var nextLink = null;
        for (var i = 0; i < elementArray.length; i++) {
            if (elementArray[i].innerHTML === "下一页") {
                nextLink = elementArray[i].href;
                break;
            }
        }
        if ($.isNullOrEmpty(nextLink)) {
            alert("亲，您已经翻到最后了哟");
        } else {
            window.location.href = nextLink;
        }
    }
};