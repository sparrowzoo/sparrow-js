//发表新鲜事编辑器对象
var newsEditor = null;
document.ready(
    function () {
        $.user.initLoginBar();
        $.floating.init();
        $.d3Share.init();
        v.initPlaceholder(freshInfo);
        window.onscroll = $.floating.init;


        // 鼠标离开头象效果
        document.onmouseover = function (e) {
            $("#.divUserInfo").hidden();
        };

        if ($("divPublishNews") != null) {
            newsEditor = new SparrowEditor("newsEditor");
            newsEditor.config.tool.position = "bottom";
            newsEditor.config.tool.convertHTML.isConvert = false;
            newsEditor.config.style = "comment";
            newsEditor.initialize("divPublishNews");
            newsEditor.attach.setParentObject(newsEditor);
            newsEditor.attach.validate=function(){
               return v.getValidateResult(freshInfo, false);
            };
            newsEditor.attach._submit=function(){
                var postString = "mthread.forumCode=001003&mthread.content="
                    + encodeURIComponent(newsEditor.getEditorContent().filterHTML())
                    + "&mthread.title="
                    + $(freshInfo.txtTitle.ctrlId).value.trim();
                ajax.req("POST", $.url.root + "/blog/publish-fresh.do", function (xmlHttpRequest) {
                    if (xmlHttpRequest.responseText == ajax.OK) {
                        window.location.href = $.url.root + "/published-" + browser.getUserId();
                    }
                }, true, postString);
            }
        }
    }
);