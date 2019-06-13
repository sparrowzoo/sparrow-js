/*
     * 日期2009 08 09 作者:张立志 邮箱:zh_harry@163.com QQ: 492006183 IE6 ie7 遨游 火狐下测试通过
     * 功能说明:系统提示对话框 参数： msg：提示信息 isone:是否为根目录 type:提示类型 title:标题
     * sparrow.themes:全局变量设置前台皮肤图片 returnCallBack:关闭后事件 例子: win.isInFrame=false;
     */
Sparrow.win = {
    config: {
        isInFrame: false,
        showHead: true,
        titleHeight: 45,
        currentWindow: window,
        bgsound: $.url.resource + "/media/sound.wav",
        titleImg: $.url.resource + "/images/" + $.website.themes + "/panel.gif",
        closeBtnImg: $.url.resource + "/images/" + $.website.themes
            + "/panel.gif",
        OKBtnImg: $.url.resource + "/images/" + $.website.themes + "/panel.gif",
        smileImg: $.url.resource + "/images/" + $.website.themes + "/smile.gif",
        sadImg: $.url.resource + "/images/" + $.website.themes + "/sad.gif",
        lockImg: $.url.resource + "/images/" + $.website.themes + "/lock.gif",
        waitImg: $.url.resource + "/images/" + $.website.themes + "/loading.gif",
        askImg: $.url.resource + "/images/" + $.website.themes + "/smile.gif",
        tagArray: ["select", "object"],
        jalert: {
            height: "auto",
            width: "250px",
            closeCallBack: function () {
            }
        },
        dialog: {
            // 用来保存box对话框中的选择项
            descContainer: null
        }
    },
    getWindow: function () {
        return (this.config.isInFrame ? window.parent : window);
    },
    getScrollTop: function () {
        return this.getWindow().pageYOffset
            || this.getWindow().document.documentElement.scrollTop
            || this.getWindow().document.body.scrollTop;
    },
    /*
     * getScrollTop : function() { return document.documentElement &&
     * document.documentElement.scrollTop ? document.documentElement.scrollTop :
     * document.body.scrollTop; },
     */
    addSound: function () {
        // 背景音乐
        var sound = $("+bgsound.sound.doc", null, this.getWindow().document);
        sound.s.src = this.config.bgsound;
    },
    addBackDiv: function () {
        var backDiv = $("+div.backDiv.doc", null, this.getWindow().document);
        var documentHeight = Math.max(
            this.getWindow().document.body.scrollHeight,
            this.getWindow().document.documentElement.scrollHeight);
        backDiv.s.zIndex = 1000;
        backDiv.opacity(80);
        backDiv.s.style.position = "absolute";
        backDiv.s.style.width = backDiv.doc.body.offsetWidth + "px";
        backDiv.s.style.height = documentHeight + "px";
        backDiv.s.style.left = "0px";
        backDiv.s.style.top = "0px";
        backDiv.s.style.backgroundColor = "#000000";
    },
    // 固定格式对话框主体结构
    addMsgDialog: function (width, height) {
        if (!width) {
            width = this.config.jalert.width;
        }
        if (!height) {
            height = this.config.jalert.height;
        }
        var dialog = $("+div.dialog.doc", null, this.getWindow().document);
        dialog.s.zIndex = 1001;
        dialog.s.style.cssText = "position:absolute;border:#ccc 3px solid;text-align:center;font-size:10pt;background:#fff;";
        dialog.s.style.width = width;
        dialog.s.style.height = height;
    },
    // 自定义对话框主体结构 url
    addPanel: function (url) {
        var panel = $("+div.dialog.doc", null, this.getWindow().document);
        panel.s.zIndex = 1001;
        panel.s.style.cssText = "position:absolute;text-align:center;font-size: 10pt;background:white;";
        if (this.config.showHead !==false) {
            this.addTitle();
        }

        this.addRightClose();
        var frame = $("+iframe.panel.dialog", null, panel.doc);
        frame.s.setAttribute("frameborder", "0", 0);
        frame.s.scrolling = "no";
        frame.s.src = url;
        frame
            .loadComplete(function (element) {
                var width = parseInt(
                    element.contentWindow.document.body.style.width, 10);
                var height = parseInt(
                    element.contentWindow.document.body.style.height,
                    10);
                frame.s.style.width = (width - 4) + "px";
                frame.s.style.height = (height
                    - ($.win.config.showHead ? $.win.config.titleHeight : 0) - 5)
                    + "px";
                panel.s.style.width = width + "px";
                panel.s.style.height = height + "px";
                $("#dialog", null, panel.doc).center();
                if ($.win.config.showHead !== false) {
                    $("#divleft", null, panel.doc).s.innerHTML = element.contentWindow.document.title;
                }
            });
    },
    // 加标题
    addTitle: function (title) {
        if (this.config.showHead !== false) {
            var divtitle = $("+div.divtitle.dialog", null,
                this.getWindow().document);
            divtitle.s.style.cssText = "cursor:move;width:100%;height:"
                + this.config.titleHeight + "px;background-repeat:repeat;";
            divtitle.s.innerHTML = "";
            divtitle.s.style.backgroundImage = "url(" + this.config.titleImg
                + ")";
            // 真正的标题文本
            var divleft = $("+div.divleft.divtitle", null,
                this.getWindow().document);
            // divleft.unselectable = "on";

            divleft.s.className = "drag-pp";
            divleft.s.onmousedown = function (e) {
                $.event(e).drags();
            };
            divleft.s.onmouseup = function (e) {
                $.event(e).move_end();
            };
            divleft.s.style.cssText = "float:left;width:85%;height:{0}px;line-height:{0}px;color:white;text-align:left;padding:2px;font-size:10pt;font-weight: bold;"
                .format(this.config.titleHeight - 5);
            divleft.s.innerHTML = title ? title : $.website.name + "提醒您:";
        }
    },
    // 标题右上角关闭按钮
    addRightClose: function () {
        // 关闭按钮
        if (this.config.showHead) {
            var divright = $("+div.divright.divtitle", null, this
                .getWindow().document);
            divright.s.style.cssText = "float:right;width:20px;line-height:"
                + this.config.titleHeight
                + "px;color:white;text-align:right;font-size:13pt;cursor:pointer;";
            divright.s.innerHTML = "\xd7";
            divright.s.onclick = function () {
                $.win.closeClick();
            };
        }
    },
    // 内容下方的ok按钮
    addOK: function () {
        var btnOK = $("+input.btnOK.dialog", null, this.getWindow().document);
        btnOK.s.id = "btnOK";
        btnOK.s.type = "button";
        btnOK.s.style.cssText = "cursor:pointer;width:80px;height:30px;color:black;";
        btnOK.s.style.backgroundImage = "url(" + this.config.OKBtnImg + ")";
        btnOK.s.value = "\u786e\u5b9a";
        btnOK.s.onclick = function () {
            $.win.okClick();
        };
    },
    // 内容下方的取消按钮
    addClose: function () {
        var btnclose = $("+input.btnclose.dialog", null, this.getWindow().document);
        btnclose.attr("type", "button");
        btnclose.s.style.cssText = "cursor:pointer;width:80px;height:30px;c"
            + "olor:black;";
        btnclose.s.style.backgroundImage = "url(" + this.config.closeBtnImg + ")";
        btnclose.s.value = "\u5173  \u95ed";
        btnclose.s.onclick = function () {
            $.win.closeClick();
        };
    },
    // 内容正文
    addMsgContent: function () {
        var divcontent = $("+div.divcontent.dialog", null, this.getWindow().document);
        var dialog = $("#dialog", null, this.getWindow().document);
        var height = (parseInt(dialog.s.style.height, 10) - this.config.titleHeight - 50) + "px";
        divcontent.s.style.cssText = "width:100%;text-align:left;text-indent:20px;height:" + height;
    },
    okClick: function () {
    },
    closeClick: function () {
        $
            .showOrHiddenTag(this.config.tagArray, true,
                this.getWindow().document);
        $("#dialog", null, this.getWindow().document).remove();
        $("#backDiv", null, this.getWindow().document).remove();
        $("#sound", null, this.getWindow().document).remove();
        $.win.config.currentWindow.focus();
        if ($.win.config.jalert.closeCallBack) {
            $.win.config.jalert.closeCallBack();
            $.win.config.jalert.closeCallBack = null;
        }
        $.win.ok = void (0);
    }
};
//{msg:'',type:'sad',title:'',url:'',wait_message:''}
Sparrow.alert = function (msg, type, title, url, wait_message) {
    var config = {};
    if (typeof(msg) == "object") {
        config = msg;
        msg = config.msg.decodeSplitKey();
        type = config.type;
        title = config.title.decodeSplitKey();
        if (config.url) {
            url = config.url.decodeSplitKey();
        }
        if (config.wait_message) {
            wait_message = config.wait_message.decodeSplitKey();
        }
    }
    $.win.addSound();
    // 设置背景控件为false
    $.showOrHiddenTag($.win.config.tagArray, false, $.win.getWindow().document);
    // 背景层
    $.win.addBackDiv();
    // 对话框主体
    $.win.addMsgDialog();
    // 标题
    $.win.addTitle(title);
    // 内容
    $.win.addMsgContent();
    /*-----------以上部分全部一致---------------*/
    var typeimg = null;
    switch (type) {
        case "smile":
            $.win.addRightClose();
            $.win.addClose();
            typeimg = $.win.config.smileImg;
            break;
        case "sad":
            $.win.addRightClose();
            $.win.addClose();
            typeimg = $.win.config.sadImg;
            break;
        case "lock":
            typeimg = $.win.config.lockImg;
            break;
        case "wait":
            typeimg = $.win.config.waitImg;
            break;
        case "ask":
            $.win.addRightClose();
            $.win.addOK();
            $.win.addClose();
            typeimg = $.win.config.askImg;
            break;
        case undefined:
            $.win.addRightClose();
            $.win.addClose();
            break;
    }
    var content = "";
    if (typeimg) {
        content = "<br/>"
            + "<img align=\"absMiddle\" src='" + typeimg + "'/>&nbsp;&nbsp;";
    }
    if (msg) {
        content += msg;
        if (!$.isNullOrEmpty(url)) {
            //<br/><span id="timer">5</span>秒以后将自动跳转,或者<a href="{0}" target="_self">直接点击这里跳转</a>
            content += wait_message.format(url);
        }
        $("#divcontent", null, $.win.getWindow().document).s.innerHTML = content;
        $.waitRedirect("timer");
    }

    $.showOrHiddenTag("select", true, $.win.getWindow().document
        .getElementById("divcontent"));

    var dialog = $("#dialog", null, $.win.getWindow().document);// 设置浮动窗口位置
    dialog.center();
};
// config={url:'',showHead:true,srcElement:id,cache:true}宽高取自页面的宽高
Sparrow.window = function (config) {
    if (!config) {
        config = {};
    }
    if (!$.isNullOrEmpty(config.showHead)) {
        $.win.config.showHead = config.showHead;
    }
    if (!$.isNullOrEmpty(config.inFrame)) {
        $.win.config.isInFrame = config.inFrame;
    }
    // 如果本页中存在div对话框。则先将对话框删除
    url = config.url;
    $.win.closeClick();
    if (config.cache != false) {
        url = $.randomUrl(url);
    }
    if (url.indexOf("http://") < 0) {
        url = $.url.root + url;
    }
    $.showOrHiddenTag($.win.config.tagArray, false, $.win.getWindow().document);
    if (config.srcElement) {
        if (config.srcElement.indexOf('#') < 0) {
            config.srcElement = "#" + config.srcElement;
        }
        $.win.config.toTopHeight = $(config.srcElement).getAbsoluteTop() - height / 2;
    }
    // 背景层
    $.win.addBackDiv();
    $.win.addPanel(url);
};
// Register as a named AMD module
if (typeof define === "function" && define.amd) {
    define("sparrow", [], function () {
        return Sparrow;
    });
}
/* {width:1,height:2,title:'',content:'',initialize:function(){}} */
Sparrow.dialog = function (config) {
    if (!config) {
        config = {};
    }
    // 设置背景控件为false
    $.showOrHiddenTag($.win.config.tagArray, false, $.win.getWindow().document);
    // 背景层
    $.win.addBackDiv();
    // 对话框主体
    $.win.addMsgDialog(config.width, config.height);
    // 标题
    $.win.addTitle(config.title);
    // 内容
    $.win.addMsgContent();
    $.win.addOK();
    $.win.addClose();
    if (config.content) {
        $("#divcontent", null, $.win.getWindow().document).s.innerHTML = config.content;
    }
    if (config.initialize) {
        config.initialize($("divcontent"));
    }
    $("#dialog", null, $.win.getWindow().document).center();
};