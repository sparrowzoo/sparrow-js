var markdown = {
    api: {preview: "/markdown/preview.json"},
    lastContext: "",
    rootPath: "",
    markdownContentId: "txtContent",
    markdownPreviewId: "divPreview",
    statusId:"divStatus",
    processing: false,
    lastPressTime: new Date().getTime(),
    load: function () {
        markdown.lastContext = $("#" + markdown.markdownContentId).value()
        window.setInterval(function () {
            var currentTime = new Date().getTime();
            if (!markdown.processing && currentTime - markdown.lastPressTime > 500 && markdown.lastContext !== $("#" + markdown.markdownContentId).value()) {
                markdown.previewRequest();
            }
        }, 1000);

        $("#" + markdown.markdownContentId).bind("onkeyup", function (e) {
            markdown.preview(e);
        });

        //textarea支持tab缩进
        $("#" + markdown.markdownContentId).bind(
            'onkeydown',
            function (e) {
                if (e.keyCode !== 9) {
                    return;
                }
                e.preventDefault();
                var indent = '    ';
                var start = this.selectionStart;
                var end = this.selectionEnd;
                var selected = window.getSelection().toString();
                selected = indent + selected.replace(/\n/g, '\n' + indent);
                this.value = this.value.substring(0, start) + selected
                    + this.value.substring(end);
                this.setSelectionRange(start + indent.length, start
                    + selected.length);
            })
    },
    preview: function () {
        var current=new Date();
        this.lastPressTime = current.getTime();
        $("#"+markdown.statusId).html("正在输入"+$("#" + markdown.markdownContentId).value().length+"字...");
    },
    previewRequest: function () {
        markdown.processing = true;
        $("#"+markdown.statusId).html("正在解析中...请稍侯<img class='loading' src='" + $.url.resource + "/images/" + $.website.themes + "/loading.gif'/>");
        $.ajax.req("POST", this.rootPath + this.api.preview, function (responseText) {
            var json = responseText.json();
            if (json.code == 0) {
                $("#" + markdown.markdownPreviewId).html(json.data.html);
                PR.prettyPrint();
                if (json.data.markdown) {
                    $("#" + markdown.markdownContentId).value(json.data.markdown);
                }
                $("#divStatus").html("解析完成!");
            }
            else {
                $("#divStatus").html("异常码:"+json.code+":"+json.key+"<br/>"+json.error);
            }
            markdown.lastContext = $("#" + markdown.markdownContentId).value()
            markdown.processing = false;

        }, "markdown=" + encodeURIComponent($("#" + markdown.markdownContentId).value()));
    }
};

define("markdown", [], function () {
    return markdown;
});