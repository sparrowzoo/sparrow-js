Sparrow.page = {
	toTargetPage: function (pageCount, pageFormat, srcElement) {
		var consumerPageIndex = parseInt($('consumerPageIndex').value);
		var currentPageIndex = parseInt($('spanCurrentPageIndex').innerHTML
			.trim());
		if (consumerPageIndex <= 0 || consumerPageIndex > pageCount) {
			$.message('超出页码范围', srcElement);
			return;
		}
		if (consumerPageIndex === currentPageIndex) {
			$.message('当前页即是目标页', srcElement);
			return;
		}
		window.location.href = pageFormat.replace("$pageIndex", consumerPageIndex);
	},
	consumerAction: null,
	submit: function (pageIndex, formIndex) {
		$("currentPageIndex").value = pageIndex;
		window.location.href = "#top";
		if (this.consumerAction != null) {
			this.consumerAction(pageIndex);
			return;
		}
		$.submit(null, formIndex);
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
			return
		}
		window.location.href = nextLink;
	}
};