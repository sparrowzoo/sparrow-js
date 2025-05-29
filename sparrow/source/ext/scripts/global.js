// /*--------------------------本网站内的共公函数库---------------------------*/
// 版块选择对话框。发帖时的版块选择，后台管理的帖子转移，CMS管理的版块选择
document.ready(function () {
    new $.menu("topMenu", $.HORIZONTAL).init();
    // new Menu("leftMenu", $.VERTICAL).init();
});
Sparrow.user.loginCallback = function (option, args) {
    if (parent.location.href.indexOf($.url.root + '/thread') > -1) {
        parent.commentEditor.focus();
    }
    // 关注回调操作
    if (option === $.user.login.option.attention) {
        // attentionId+"|"+srcElement.id+"|"+attentionType
        args = args.split('|');
        // 调用关注操作
        $.user.attention(args[0], $(args[1]), args[2]);
    } else if (option === $.user.login.option.cancel_attention) {
        args = args.split('|');
        // 取消关注操作
        $.user.cancelAttention(args[0], $(args[1]), args[2]);
    }
    // 初始化登录条
    $.user.initLoginBar();
    win.closeClick();
};
// 加关注好友
Sparrow.user.attention = function (attentionId, srcElement, attentionType) {
    if (!attentionType)
        attentionType = "USER";
    var msg = "人";
    switch (attentionType) {
        case "USER":
            msg = "人";
            break;
        case "COMMUNITY":
            msg = "小区";
            break;
        case "TAG":
            msg = "标签";
            break;
    }
    // 当前用户未登录则提示用户登录
    var currentUserId = $.browser.getUserId();
    if (currentUserId == null || currentUserId == 0) {
        var args = attentionId + "|" + srcElement.id + "|" + attentionType;
        $.user.login.dialog($.user.login.option.attention, args);
        return;
    }
    if (currentUserId == attentionId && attentionType == "USER") {
        $.message("这个人是你哟，哈哈！", srcElement);
        return
    }
    $.ajax.req("POST", $.url.root + "/user/attention.do", function (xmlHttpRequest) {
            if (xmlHttpRequest.responseText === ajax.OK) {
                $.message("恭喜!关注成功！", $.ajax.srcElement);
                ajax.srcElement.html("-取消关注");
                ajax.srcElement.onclick = function () {
                    cancelattention(attentionId, this, attentionType);
                };
            } else {
                if (xmlHttpRequest.responseText === ajax.EXIST) {
                    $.message("哎哟！您之前已经关注过这个{0}了。".format(msg),
                        ajax.srcElement);
                    ajax.srcElement.innerHTML = "-取消关注";
                    ajax.srcElement.onclick = function () {
                        cancelattention(attentionId, this, attentionType);
                    };
                } else {
                    $.message("sorry!网络繁忙，请稍侯再试哟！", ajax.srcElement);
                }
            }
        }, true, "parameter=" + attentionType + "|" + attentionId,
        srcElement);
};
// 取消关注好友
Sparrow.user.cancelAttention = function (attentionId, srcElement, attentionType) {
    if (!attentionType)
        attentionType = "USER";
    // 当前用户未登录则提示用户登录
    var currentUserId = $.browser.getUserId();
    if (currentUserId == null || currentUserId == "0") {
        var args = attentionId + "|" + srcElement.id + "|" + attentionType;
        $.user.login.dialog($.user.login.option.cancel_attention, args);
    } else {
        ajax.req("POST", $.url.root + "/user/cancelattention.do", function (xmlHttpRequest) {
            if (xmlHttpRequest.responseText == ajax.OK) {
                $.message("取消关注！", ajax.srcElement);
                ajax.srcElement.onclick = function () {
                    attention(attentionId, this, attentionType);
                };
                ajax.srcElement.innerHTML = "+关注";
            }
        }, true, "parameter=" + attentionType + "|" + attentionId, srcElement);
    }
};

// 鼠标悬停头象效果
// 访问的userId
Sparrow.user.attention = function () {
    if (userInfo.extend.ATTENTION_RELATION == "NONE") {
        userInfo.extend.ATTENTION_RELATION = "";
        return;
    }
    // 当前用户是游客或者未关注该用户
    if (!$.browser.isLogin()
        || userInfo.extend.ATTENTION_RELATION == "NULL" || userInfo.extend.ATTENTION_RELATION == "FANS") {
        // 需要登录后关注
        attention = '<a target="_self" onclick="attention(\''
            + userId
            + '\',this);"'
            + 'href="javascript:void(0);">关注</a>';

    } else {
        // 我关注过该用户
        if (userInfo.extend.ATTENTION_RELATION == "ATTENTION" || userInfo.extend.ATTENTION_RELATION == "EACH_OTHER_ATTENTION") {
            attention = '<a target="_self" onclick="cancelattention(\''
                + userId
                + '\',this);"'
                + 'href="javascript:void(0);">取消关注</a>';
        }
    }
    userInfo.extend.ATTENTION_RELATION = attention;
};
// 登录条上的弹出第三方QQ登录对话框
Sparrow.oauth = {
    qq: function () {
        $.browser.showWindow(500, 300, $.url.root + "/oatuh/qq/login.do");
    },
    bind: function () {
        $.window({
            url: $.url.root + '/loginDialog.jsp',
            showHead: false
        });
    },
    menu: function (e) {
        $.event(e).cancelBubble();
        $('ulLogin').style.display = 'block';
    }
};

Sparrow.thread = {
    count: {
        config: {
            threadName: "threadId",
            userId: $.browser.getUserId(),
            css_class: {
                up: "up",
                down: "down",
                like: "like",

                uped: "uped",
                downed: "downed",
                liked: "liked"
            },
            msg: {
                liked: "亲 您已经收藏过了!",
                uped: "亲 您已经顶过该帖!",
                downed: "亲 您已经踩过该帖!"
            },
            key: {
                up: "up",
                down: "down",
                like: "like"
            },
            url: {
                like: "/blog/thread/like.json",
                up: "/blog/thread/up.json",
                down: "/blog/thread/down.json"
            },
            element_prefix: {
                like_hyper: "thread_like_hyper_",
                up_hyper: "thread_up_hyper_",
                down_hyper: "thread_down_hyper_",
                like_count: "thread_like_count_",
                up_count: "thread_up_count_",
                down_count: "thread_down_count_"
            }
        },
        islock: function (k, threadId) {
            var key = k + $.thread.count.config.userId;
            var threads = $.browser.getCookie(key);
            var threadArray = threads ? threads.split(",") : [];
            return threadArray.indexOf(threadId) > -1;
        },
        lock: function (k, threadId) {
            var currentDate = new Date();
            var expire = (new Date((currentDate.getMonth() + 1) + "/"
                + (currentDate.getDate() + 1) + "/" + currentDate.getFullYear())
                .getTime() - currentDate.getTime()) / 1000;
            var key = k + $.thread.count.config.userId;
            var threads = $.browser.getCookie(key);
            var threadArray = threads ? threads.split(",") : [];
            if (threadArray.indexOf(threadId) == -1) {
                threadArray.push(threadId);
            }
            $.browser.setCookie(key, threadArray.join(","), expire);
        },
        init: function () {
            var threadIdArray = $("&" + $.thread.count.config.threadName);
            if (threadIdArray == null) {
                return null;
            }
            for (var i = 0; i < threadIdArray.length; i++) {
                var threadId = threadIdArray[i].value;
                if (this.islock($.thread.count.config.key.like, threadId)) {
                    // 不允许喜欢
                    $($.thread.count.config.element_prefix.like_hyper + threadId).onclick = function () {
                        $.message($.thread.count.config.msg.liked, this);
                    };
                } else {
                    // 可以喜欢
                    $($.thread.count.config.element_prefix.like_hyper + threadId).onclick = function () {
                        $.thread.count.like(this.id.substring($.thread.count.config.element_prefix.like_hyper.length));
                    };
                }
                if (this.islock($.thread.count.config.key.up, threadId)) {
                    // 顶过
                    $($.thread.count.config.element_prefix.up_hyper + threadId).onclick =
                        $($.thread.count.config.element_prefix.down_hyper + threadId).onclick = function () {
                            $.message($.thread.count.config.msg.uped, this);
                        };
                    continue;
                }
                if (this.islock($.thread.count.config.key.down, threadId)) {
                    // 踩过
                    $($.thread.count.config.element_prefix.up_hyper + threadId).onclick =
                        $($.thread.count.config.element_prefix.down_hyper + threadId).onclick = function () {
                            $.message($.thread.count.config.msg.downed, this);
                        };
                    continue;
                }

                // 可以顶也可以踩
                $($.thread.count.config.element_prefix.up_hyper + threadId).onclick = function () {
                    $.thread.count.up(this.id
                        .substring($.thread.count.config.element_prefix.up_hyper.length));
                };
                $($.thread.count.config.element_prefix.down_hyper + threadId).onclick = function () {
                    $.thread.count
                        .down(this.id
                            .substring($.thread.count.config.element_prefix.down_hyper.length));
                };
            }
        },
        like: function (threadId) {
            // 当前用户未登录则提示用户登录
            if (!$.browser.isLogin()) {
                $.user.login.dialog($.user.login.ns_callback.like_thread, threadId);
                return;
            }
            if ($.thread.count.islock($.thread.count.config.key.like, threadId)) {
                $.message($.thread.count.config.msg.liked, this);
                return;
            }
            $.ajax.json($.url.root + $.thread.count.config.url.like, "threadId=" + threadId,
                function () {
                    var sparrowSrc = $($.ajax.srcElement);
                    var count = parseInt(sparrowSrc.html());
                    sparrowSrc.html(count + 1);
                    $.message("+1", $.ajax.srcElement);
                    $($.thread.count.config.element_prefix.like_hyper
                        + threadId).onclick = function () {
                        $.message($.thread.count.config.msg.liked, this);
                    };
                    $.thread.count.lock($.thread.count.config.key.like, threadId);
                },
                $($.thread.count.config.element_prefix.like_count + threadId));
        },
        up: function (threadId) {
            $.ajax
                .json(
                    $.url.root + $.thread.count.config.url.up,
                    "threadId=" + threadId,
                    function (result) {
                        var sparrowSrc = $($.ajax.srcElement);
                        var count = parseInt(sparrowSrc.html());
                        sparrowSrc.html(count + 1);
                        $.message("+1", $.ajax.srcElement);
                        $($.thread.count.config.element_prefix.up_hyper
                            + threadId).onclick = $($.thread.count.config.element_prefix.down_hyper
                            + threadId).onclick = function () {
                            $.message($.thread.count.config.msg.uped,
                                $(this.id));
                        };
                        $.thread.count.lock($.thread.count.config.key.up,
                            threadId);
                    },
                    $($.thread.count.config.element_prefix.up_count
                        + threadId));
        },
        down: function (threadId) {
            $.ajax
                .json(
                    $.url.root + this.config.url.down,
                    "threadId=" + threadId,
                    function (result) {
                        var sparrowSrc = $($.ajax.srcElement);
                        var count = parseInt(sparrowSrc.html());
                        sparrowSrc.html(count - 1);
                        $.message("-1", $.ajax.srcElement);

                        $($.thread.count.config.element_prefix.up_hyper
                            + threadId).onclick = $($.thread.count.config.element_prefix.down_hyper
                            + threadId).onclick = function () {
                            $.message($.thread.count.config.msg.downed,
                                $(this.id));
                        };
                        $.thread.count.lock($.thread.count.config.key.down,
                            threadId);
                    },
                    $($.thread.count.config.element_prefix.down_count
                        + threadId));
        }
    },
    // 删除主帖
    del: function (threadId, authorId) {
        if (!$.user.editable(authorId)) {
            return;
        }
        if (window.confirm(l.message.deleteConfirm)) {
            $.ajax.json($.url.root + "/blog/thread/delete.json", "threadId=" + threadId + "&userId=" + authorId,
                function (result) {
                    if (window.location.href
                        .indexOf($.url.root + "/thread") == 0) {
                        window.location.href = $.url.root;
                    } else {
                        window.location.href = window.location.href;
                    }
                });
        }
    },
    like: {
        over: function (threadId) {
            $("thread_like_" + threadId).innerHTML = "+ 1";
        },
        out: function (threadId) {
            $("thread_like_" + threadId).innerHTML = "喜欢";
        },
        loginCallback: function (threadId) {
            $.thread.count.like(threadId);
        }
    },
    over: function (threadId, writerId) {
        if (!$.user.editable(writerId)) {
            return;
        }
        $("divManage_" + threadId).style.visibility = "visible";
        $("divManage_" + threadId).onmouseover = function (e) {
            $.event(e).cancelBubble()
        };
    },
    comment: {
        config: {
            url: {
                del: $.url.root + "/blog/comment/delete.json",
                up: $.url.root + "/blog/comment/up-down.json",
                down: $.url.root + "/blog/comment/up-down.json"
            },
            element_prefix: {
                up_hyper: "comment_up_hyper_",
                down_hyper: "comment_down_hyper_",
                up_count: "comment_up_count_",
                down_count: "comment_down_count_"
            }
        },
        // 编辑回帖
        edit: function (writerId) {
            if ($.user.editable(writerId)) {

            }
        },
        // 删除回帖
        del: function (commentId, writerId) {
            if ($.user.editable(writerId)) {
                if (window.confirm(commentInfo.deleteConfirm)) {
                    $.ajax.json($.thread.comment.config.url.del, "commentId=" + commentId,
                        function (xmlHttpRequest) {
                            window.location.href = $.browser
                                    .getCurrentUrlWithoutParameter()
                                + "?t=" + Math.random();
                        });
                }
            }
        },
        // 顶回帖
        up: function (commentId, srcElement) {
            $.ajax.json($.thread.comment.url.up, "parameter=true&commentId=" + commentId,
                function (xmlHttpRequest) {
                    if (xmlHttpRequest.responseText.indexOf($.ajax.OK) >= 0) {
                        $($.thread.comment.element_prefix.up_count + commentId).innerHTML = xmlHttpRequest.responseText
                            .split('|')[1];
                        $($.thread.comment.element_prefix.up_hyper + commentId).onclick = $($.thread.comment.element_prefix.up_hyper
                            + commentId).onclick = function () {
                            $.message(
                                "\u54c8\u54c8\u60a8\u5df2\u7ecf\u7838\u8fc7\u4e86\uff0c\u60a8\u53ef\u4ee5\u8bc4\u4ef7\u5176\u4ed6\u5e16\u5b50",
                                $.ajax.srcElement);
                        };
                    } else {
                        $.message(
                            "\u54c8\u54c8\u60a8\u5df2\u7ecf\u7838\u8fc7\u4e86\uff0c\u60a8\u53ef\u4ee5\u8bc4\u4ef7\u5176\u4ed6\u5e16\u5b50",
                            $.ajax.srcElement);

                    }
                },
                srcElement);
        },
// 凿回帖
        down: function (commentId, srcElement) {
            $.ajax
                .req(
                    "POST",
                    $.thread.comment.url.down,
                    function (xmlHttpRequest) {
                        if (xmlHttpRequest.responseText.indexOf(ajax.OK) >= 0) {
                            $($.thread.comment.element_prefix.down_count + commentId).innerHTML = xmlHttpRequest.responseText
                                .split('|')[1];
                            $($.thread.comment.element_prefix.down_hyper + commentId).onclick = $($.thread.comment.element_prefix.down_hyper
                                + commentId).onclick = function () {
                                $
                                    .message(
                                        "\u54c8\u54c8 \u60a8\u5df2\u7ecf\u7838\u8fc7\u4e86\uff0c\u60a8\u53ef\u4ee5\u8bc4\u4ef7\u5176\u4ed6\u5e16\u5b50",
                                        ajax.srcElement);
                            };
                        } else {
                            $
                                .message(
                                    "\u54c8\u54c8 \u60a8\u5df2\u7ecf\u7838\u8fc7\u4e86\uff0c\u60a8\u53ef\u4ee5\u8bc4\u4ef7\u5176\u4ed6\u5e16\u5b50",
                                    $.ajax.srcElement);
                        }
                    }, true, "parameter=false&commentId=" + commentId,
                    srcElement);
        },
        page: function (threadId, pageIndex) {
            $.ajax.get($.url.root
                + "/comment-page-" + threadId + "-" + pageIndex, function (httpRequest) {
                if (httpRequest.responseText.indexOf(ajax.FAIL) > -1) {
                    $.message(httpRequest.responseText.split("|")[1]);
                }
                else {
                    $("divCommentList").innerHTML = httpRequest.responseText;
                }
            });
        }
    }
};
Sparrow.floating = {
    currentScrollItem: null,
    currentScrollItemContainerTop: null,
    currentScrollItemContainerBottom: null,
    authorContainer:null,
    author:{
        left:null,
        top:null,
        avatar:null,
        name:null,
        id:null
    },

    fixedAuthor:function(){
        var threadAuthor=$("threadAuthor");
        this.authorContainer=$(threadAuthor);
        this.author.top=this.authorContainer.getAbsoluteTop();
        this.author.left=this.authorContainer.getAbsoluteLeft()-threadAuthor.offsetWidth-5;
        this.authorContainer.fix(this.author.top,this.author.left);
    },
    init: function () {
        var sort = $("#divSort");
        var banner = $("#divBanner");
        var topMenu = $("#divHorizontalMenu");
        var fixHeight = topMenu.s.offsetHeight;
        var scrollTop = $.win.getScrollTop();
        if (scrollTop > banner.s.offsetHeight - topMenu.s.offsetHeight) {
            topMenu.fix(0, 0);
            sort.fix(fixHeight);
        }
        else {
            topMenu.s.style.position = "static";
            sort.s.style.position = "static";
        }
        //$("#.diloag").center();
        var threadList = document.getElementById("divThreadList");
        if (threadList == null) {
            return;
        }
        var itemArray = threadList.getElementsByTagName("div");
        if (itemArray.length == 0) {
            return;
        }
        // 已经存在当前滚动菜单
        if ($.floating.currentScrollItem != null) {
            // 如果当前滚动菜单在当前帖的范围内
            if (scrollTop > $.floating.currentScrollItemContainerTop
                && scrollTop < $.floating.currentScrollItemContainerBottom) {
                $($.floating.currentScrollItem).fix(fixHeight);
            } else {
                // 如果不在范围内清除
                if ($.floating.currentScrollItem != null) {
                    $.floating.currentScrollItem.style.position = "static";
                    $.floating.currentScrollItem = null;
                }
            }
        } else {
            for (var i = 0; i < itemArray.length; i++) {
                var item = null;
                //头象滚动
                if (itemArray[i].className == "head") {
                    item = itemArray[i];
                } else {
                    continue;
                }
                var scrollItemContainerTop = $(item.parentNode).getAbsoluteTop();
                // 50调节数字
                var scrollItemContainerBottom = scrollItemContainerTop
                    + item.parentNode.offsetHeight - item.offsetHeight - 50;

                // 如果满足滚动条件
                if (scrollTop > scrollItemContainerTop
                    && scrollTop < scrollItemContainerBottom) {
                    $.floating.currentScrollItem = itemArray[i];
                    $.floating.currentScrollItemContainerTop = scrollItemContainerTop;
                    $.floating.currentScrollItemContainerBottom = scrollItemContainerBottom;
                    $($.floating.currentScrollItem).fix(fixHeight);
                    break;
                }
            }
        }
    }
};
Sparrow.forum = {
// 子版块菜单显示效果 列表页和内容页使用
    child: function (e, parentForumId, forumId) {
        var forum = $name("forum");
        if (forum != null) {
            for (var i = 0; i < forum.length; i++) {
                $("div" + forum[i].value).style.display = "none";
            }
        }
        $.event(e).cancelBubble();
        var srcElement = $.event(e).getSrcElement();
        var top = position.getAbsoluteTopPosByCtrl(srcElement)
            + srcElement.clientHeight + 10;
        var left = position.getAbsoluteLeftPosByCtrl(srcElement);
        if (parentForumId != "0") {
            var parentForumDiv = $("div" + parentForumId);
            if (parentForumDiv) {
                parentForumDiv.style.cssText = "display:block;background:#ffffff;position:absolute;border:#ccc 1px solid;width:200px;height:auto;left:{0}px;top:{1}px;"
                    .format(left, top);
            } else {
                $.ajax
                    .req(
                        "POST",
                        $.url.root + "/system/forum/load.do",
                        function (xmlHttpRequest) {
                            var listJSON = xmlHttpRequest.responseText
                                .json();
                            if (listJSON != null) {
                                var forumDiv = $c("div");
                                var listHtml = [];
                                document.body.appendChild(forumDiv);
                                forumDiv.onmouseover = function (e) {
                                    $.event(e).cancelBubble();
                                };
                                forumDiv.id = "div" + parentForumId;
                                forumDiv.style.cssText = cssText.menuFrameDiv
                                    .format(200, left, top);
                                // 为了删除下拉菜单
                                listHtml
                                    .push('<input name="forum" value="{0}" type="hidden"/>'
                                        .format(parentForumId));
                                listHtml
                                    .push('<ul style="{0}">'
                                        .format(cssText.menuUl
                                            .format(196)));
                                for (var i = 0; i < listJSON.length; i++) {
                                    if (listJSON[i].UUID != forumId) {
                                        var forumUrl = $.url.root
                                            + "/bbs/thread/list/"
                                            + listJSON[i].UUID
                                            + "/page1.html";
                                        listHtml
                                            .push("<li style=\"{0}\"><a href=\"{1}\"><span>{2}</span></a></li>"
                                                .format(
                                                    cssText.menuLi
                                                        .format(194),
                                                    forumUrl,
                                                    listJSON[i].Name));
                                    }
                                }
                                listHtml.push("</ul>");
                                forumDiv.innerHTML = listHtml.join("");
                            }
                        }, true, "loadOption=child|" + parentForumId);
            }
        }
    }
};
Sparrow.player = {
    /* 初始化视频播放按钮 */
    init: function (srcElement, flashUrl) {
        var youku = /http:\/\/player.youku.com\/player.php/gi;
        var sohu = /http:\/\/share.vrs.sohu.com\/([0-9]*?)\/v\.swf.*/gi;

        flashUrl = flashUrl.split('#')[0];

        if (flashUrl.search(youku) >= 0) {
            flashUrl += "?isAutoPlay=true";
        } else if (flashUrl.search(sohu) >= 0) {
            flashType = "sohu";
            var startIndex = flashUrl.indexOf("/v.swf");
            flashUrl = flashUrl.substring(0, startIndex) + "/v.swf?autoplay=true";
        }

        var flashContainer = srcElement.parentNode;
        var play = new Image();
        var backgroundDiv = $("new.div");
        backgroundDiv.style.width = srcElement.offsetWidth + "px";
        backgroundDiv.style.height = srcElement.offsetHeight + "px";
        backgroundDiv.style.left = "0px";
        backgroundDiv.style.top = "0px";

        backgroundDiv.style.backgroundColor = "#000";
        backgroundDiv.style.position = "absolute";
        backgroundDiv.style.display = "none";
        setOpacity(backgroundDiv, 30);
        play.src = $.url.resource + "/" + $.websit + "/images/play.png?t="
            + Math.random();
        play.className = "play";
        play.setAttribute("flashUrl", flashUrl);
        play.onmouseover = function () {
            backgroundDiv.style.display = "block";
        };
        play.onmouseout = function () {
            backgroundDiv.style.display = "none";
        };
        play.onload = function () {
            var parentWidth = srcElement.offsetWidth;
            var parentHeight = srcElement.offsetHeight;
            this.style.left = (parentWidth - this.offsetWidth) / 2 + "px";
            this.style.top = (parentHeight - this.offsetHeight) / 2 + "px";
        };
        play.onclick = function () {
            $.browser.showWindow(500, 400, this.attributes["flashUrl"].value);
        };
        flashContainer.appendChild(backgroundDiv);
        flashContainer.appendChild(play);
    }
};
Sparrow.attach = {
    config: {
        // 目标窗口id
        descContainerId: null,
        // 内容的HTML(用于判断当前附件是否已插入到编辑器)
        contentHtml: null,
        // 不前帖子的附件json对象
        attachJson: null
    },
    init: function () {
        if ($.attach.config.attachJson == null) {
            return
        }
        var attachItem = [];
        for (var i = 0; i < $.attach.config.attachJson.length; i++) {
            // 如果是图片并且已经插入到编辑器则不显示附件
            if ($.attach.config.attachJson[i].fileType.toLowerCase().indexOf(
                'image') > -1
                && $.attach.config.contentHtml
                    .indexOf($.attach.config.attachJson[i].url) > 0) {
                continue;
            }
            attachItem
                .push('<div style="border: #ccc 1px solid; width: 300px;">');
            attachItem
                .push('<a style="font-size: 14pt; font-weight: bold;" target="_blank" href="');
            attachItem.push($.url.root);
            attachItem.push('/file-downLoad?fileId=');
            attachItem.push($.attach.config.attachJson[i].fileId);
            attachItem.push('">');
            attachItem.push($.attach.config.attachJson[i].clientFileName);
            attachItem.push('</a><br />');
            // 文件大小
            attachItem.push('<a>{0}</a><br />'
                .format($.attach.config.attachJson[i].strFileLength));
            // 上传时间
            attachItem.push('<a>{0}</a><br />'
                .format($.attach.config.attachJson[i].createTime));
            // 备注
            if ($.attach.config.attachJson[i].remarks.trim() != "") {
                attachItem.push('<a>{0}</a><br />'
                    .format(this.config.attachJson[i].remarks));
            }
            // 下载次数
            attachItem
                .push('<a href="{0}/file-downLoad?fileId={1}">下载</a>【<span class="highlight">{2}</span>】</div>'
                    .format($.url.root,
                        $.attach.config.attachJson[i].fileId,
                        $.attach.config.attachJson[i].downLoadTimes));
        }
        $($.attach.config.descContainerId).innerHTML = attachItem.join("");
    }
};
// 标签选择对话框
var tagDialog = {
    config: {
        size: {
            width: 500,
            height: 300
        },
        manage: false,
        maxAllowSelected: 5,
        tagContainerId: "divContainer",
        pager: "divPager",
        menu: "divMenu",
        tagName: "txtTagName",
        selectedTag: "selected_tag",
        selectedIdArray: [],
        selectedNameArray: []
    },
    callback: function () {
        var descContainer = win.config.box.descContainer;
        var selectedTags = $(descContainer).innerHTML.replace(/，/g, ',').split(
            ',');
        var tagArray = this.config.selectedNameArray;
        for (var i = 0; i < tagArray.length; i++) {
            if (tagArray[i].checked) {
                var tagName = tagArray[i];
                // 没有该标签
                if (selectedTags.indexOf(tagName) <= -1) {
                    selectedTags.push(tagName);
                }
            }
        }
        $(descContainer).innerHTML = selectedTags.join(",");
        win.closeClick();
        v.isNull(threadInfo.hdnTags);
    },
    show: function (width, height) {
        page.defaction = tagDialog._init;
        if (!width) {
            width = this.config.size.width;
        }
        if (!height) {
            height = this.config.size.height;
        }
        if ($("hdnForumCode")) {
            win.ok = function () {
                tagDialog.callback();
            };
            var tagHTML = [];
            tagHTML
                .push('<div>标签<input id="'
                    + tagDialog.config.tagName
                    + '" type="text"/><input type="button" value="查询" onclick="tagDialog._init();"/></div>');
            tagHTML.push('<div style="overflow:scroll;width:' + (width - 30)
                + 'px;height:' + (height - 170) + 'px;" id="'
                + tagDialog.config.tagContainerId
                + '" class="tagContent"><img src="' + $.url.resource
                + '/images/loading.gif"/></div>');
            tagHTML.push('<div id="' + tagDialog.config.pager + '"></div>');
            if (tagDialog.config.manage) {
                tagHTML
                    .push('<div id="'
                        + tagDialog.config.menu
                        + '"><a href="'
                        + $.url.root
                        + '/system/tag/manage.jsp" target="_blank">新标签</a> <a href="javascript:void();" onclick="win.closeClick();showTag();">重新加载</a></div>');
            }
            $.diloag({
                width: width,
                height: height,
                title: "请选择标签",
                content: tagHTML.join("")
            });
            this._init();

        } else {
            jalert("请先选择版块", "sad");
        }
    },
    _init: function () {
        this.config.selectedIdArray = [];
        this.config.selectedNameArray = [];
        var formData = "forumCode=" + $("hdnForumCode").value + "&tagName="
            + $(tagDialog.config.tagName).value;
        if ($("currentPageIndex") != null) {
            formData += "&currentPageIndex=" + $("currentPageIndex").value;
        }
        ajax
            .req(
                "POST",
                $.url.root + "/tag/loadTags.do",
                function (xmlHttpRequest) {
                    var resultArray = xmlHttpRequest.responseText
                        .split("|");
                    var tagList = resultArray[0].json();
                    if (tagList == null) {
                        $(tagDialog.config.tagContainerId).innerHTML = 'tag is null';
                        return;
                    }
                    var tagCount = 0;
                    var tagHTML = [];
                    var selectedTag = $checkedValue(tagDialog.config.selectedTag);
                    for (var i = 0; i < tagList.length; i++) {
                        tagCount++;
                        tagHTML
                            .push('<input {0} onclick="tagDialog.check(this);" name="tag" value="{1}" tagName="{2}" id="chk_{1}" type="checkbox" name="selectTag"><label class="tag" for="chk_{1}">{2}</label>'
                                .format(
                                    selectedTag
                                        .indexOf(tagList[i].TagId) >= 0 ? 'checked="checked"'
                                        : '',
                                    tagList[i].TagId,
                                    tagList[i].TagName));

                    }
                    $(tagDialog.config.tagContainerId).innerHTML = tagHTML
                        .join("");
                    $(tagDialog.config.pager).innerHTML = resultArray[1];
                }, true, formData);
    },
    check: function (srcElement) {
        var selectedCount = $checkedValue("tag").length;
        if (srcElement.checked && selectedCount > this.config.maxAllowSelected) {
            $.message("最多允许选择" + this.config.maxAllowSelected + "个标签");
            srcElement.checked = false;
            return;
        }
        var tagId = srcElement.value;
        var tagName = srcElement.attributes["tagName"].value;
        if (srcElement.checked) {
            this.config.selectedIdArray.push(tagId);
            this.config.selectedNameArray.push(tagName);
        } else {
            this.config.selectedIdArray.remove(tagId);
            this.config.selectedNameArray.remove(tagName);
        }
    }
};
