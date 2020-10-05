Sparrow.user = {
    login: {
        dialog: function (nsOfCallBack, args) {
            var url = $.url.passport + "/login-dialog?register=false&callback-ns=" + nsOfCallBack;
            if (!$.isNullOrEmpty(args)) {
                url += '&parameter=' + args;
            }
            document.domain=$.browser.cookie.root_domain;
            $.window({url: url, showHead: false});
        },
        ns_callback: {
            publish: "thread.publish",
            attention: "user.attention",
            cancel_attention: "user.attention.cancel",
            comment: "thread.comment",
            upload: "upload",
            like_thread: "thread.like"
        }
    },
    getZone: function (userId) {
        return $.url.root + "/zone-" + userId;
    },
    getAvatar: function (avatar) {
        return avatar ? avatar
            : $.DEFAULT_AVATOR_URL;
    },
    // 是否有编辑权限
    editable: function (authorId) {
        var currentUserId = $.browser.getUserId();
        if (currentUserId <= 0) {
            return false;
        }
        return authorId === currentUserId
    },
    initLoginBar: function () {
        if (!$("divAccount")) {
            return
        }
        if ($.browser.isLogin()) {
            $("divAccount").style.display = "block";
            $("divLogin").style.display = "none";
            var hyperUser=$("hyperUser");
            $(hyperUser).html($.browser.getUserName());
            hyperUser.title = $.browser.getUserName();
            hyperUser.href = $.user.getZone($.browser.getUserId());
            return;
        }
        $("divAccount").style.display = "none";
        $("divLogin").style.display = "block";
    },
    // 游客的鼠标悬停头象效果
    initAvatar: function (srcElement, userInfo) {
        var divUserInfo = $("divUserInfo");
        if (divUserInfo == null) {
            divUserInfo = $("new.div.divUserInfo");
            divUserInfo.s.style.cssText = "border: #ccc 1px solid; position: absolute; width:300px; height:120px; display: none; background: #ffffff;overflow: hidden;";
            divUserInfo.s.onmouseover = function (e) {
                $.event(e).cancelBubble();
            };
            document.body.appendChild(divUserInfo.s);
        }
        $("divUserInfo").style.top = $(srcElement).getAbsoluteTop() - 2 + "px";
        $("divUserInfo").style.left = $(srcElement).getAbsoluteLeft() - 2 + "px";

        var POPUP_HTML = [];
        POPUP_HTML.push('<table style="border: 0;background:#fff;" cellpadding="0" cellspacing="0">');
        POPUP_HTML.push('<tr>');
        POPUP_HTML.push('<td style="border: 0; width:60px;" valign="top">');
        POPUP_HTML.push('<a href="{0}" target="_blank"><img style="width:50px; height: 50px; border: 2px #EDEDED solid;" src="{1}" /></a>'.format(this.getZone(userInfo.userId), this.getAvatar(userInfo.avatar)));
        POPUP_HTML.push('</td>');
        POPUP_HTML.push('<td style="border: 0; width: 240px; line-height: 25px;text-align:left;">');
        POPUP_HTML.push('昵称:<a href="{2}" target="_blank"><span>{0}</span></a>{1}<br />'.format(userInfo.userLoginName, userInfo.extend.ATTENTION_RELATION, this.getZone(userInfo.userId)));
        POPUP_HTML.push('性别:<span>{0}</span><br />'.format(userInfo.sexName));
        if (userInfo.createTime) {
            POPUP_HTML.push('注册日期:<span>{0}</span><br />'.format(userInfo.createTime.split(".")[0]));
        }

        if (userInfo.lastLoginTime) {
            POPUP_HTML.push('最后登陆:<span>{0}</span><br />'.format(userInfo.lastLoginTime.split(".")[0]));
        }
        if (!$.isNullOrEmpty(userInfo.status)) {
            POPUP_HTML.push('状态：<span>{0}</span><br />'.format(userInfo.status));
        }

        if (userInfo.extend && userInfo.extend.COUNT) {
            POPUP_HTML.push('COUNT：<span>{0}</span><br />'.format(userInfo.extend.COUNT));
        }
        $("divUserInfo").innerHTML = POPUP_HTML.join("");
        $("#divUserInfo").show();

        // 鼠标离开头象效果
        document.onmouseover = function (e) {
            $("#divUserInfo").hidden();
        };
    },
    // 鼠标悬停头象效果
    // 访问的userId
    popup: function (srcElement, userId, e) {
        $.ajax.json($.url.root + "/user/popup.json", "userId=" + userId,
            function (result) {
                var userInfo = result.value;
                this.attention();
                $.user.initAvatar($.ajax.srcElement, userInfo);
            }, $.event(e).srcElement);
        $.event(e).cancelBubble();
    },
    attention:function () {
        return false;
        /**
         * // 是否关注过
         var attention = "";
         if (userInfo.extend.ATTENTION_RELATION != "NONE") {
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
                }
         else {
                    userInfo.extend.ATTENTION_RELATION = ""
                }
         */
    }
};