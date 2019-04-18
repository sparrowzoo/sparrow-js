
// 类搜索框提示信息
function Tooltip(obj) {
    this.config = // 提示框显示需要的常量配置
        {
            tooltipDiv: null, // 显示提示框的DIV
            showFullName: true, // 是否显示全名称
            descIdHidden: null, // 保存ID的隐藏控件
            descSelectList: null, // 保存item的select控件
            srcElement: null, // 事件源控件保存选中的提示结果
            width: 300, // 提示框显示宽度
            maxLength: 5
            // 允许输入的最大长度
        };
    /*----------------提示框显示需要的变量--------------------*/
    this.obj = obj; // 当前对象引用需要与定义的对象同名
    this.currentIndex = -1; // 当前显示的索引
    this.listCount = 0; // 需要显示的列表所有个数
    this.keyCode = 0; // 当前显示
    this.listArray = []; // 需要显示的内容列表 列表项(uuid,name,fullName)
}

Tooltip.prototype = {
    init: function () {
        if (typeof (this.config.toolipDiv) == "string") {
            this.config.toolipDiv = $(this.config.toolipDiv);
        }
        if (typeof (this.config.descIdHidden) == "string") {
            this.config.descIdHidden = $(this.config.descIdHidden);
        }
        if (typeof (this.config.srcElement) == "string") {
            this.config.srcElement = $(this.config.srcElement);
        }
        if (typeof (this.config.descSelectList) == "string") {
            this.config.descSelectList = $(this.config.descSelectList);
        }
        this.config.toolipDiv = $("new.div").s;
        document.body.appendChild(this.config.toolipDiv);
        var sparrowElement = $(this.config.srcElement);
        var left = sparrowElement.getAbsoluteLeft();
        var top = sparrowElement.getAbsoluteTop()
            + this.config.srcElement.clientHeight - 1;
        this.config.toolipDiv.style.cssText = "text-align:left;display:none;background:#ffffff;border:#ccc 1px solid;position:absolute;width:"
            + this.config.width + "px;left:" + left + "px;top:" + top + "px;";

        this.config.toolipDiv.onmouseover = function (e) {
            $.event(e).cancelBubble();
        };
        this.config.toolipDiv.onclick = function (e) {
            $.event(e).cancelBubble();
        };
        // 由于原控件可能会有此事件，为在原控件基础上附加方法，故写成如下方式
        // 示例代码onfocus='v.showMessage(studentInfo.txtClass);'onblur='v.isNull(studentInfo.txtClass);
        var htmlEvents = "$(#." + this.obj + ".config.srcElement).bind('onkeyup',function(e){" + this.obj + ".show(e);});" +
            "$(#."
            + this.obj + ".config.srcElement).bind('onblur',function(){if("
            + this.obj + ".config.descIdHidden.value==''){" + this.obj
            + ".config.srcElement.value='';}});";
        evel(htmlEvents);
    }, prepare: function () {
        $.message("请实现该函数以准备提示框数据列表");
    },
    prepareCallBack: function () {
        if (this.listArray === null || this.listArray.length === 0) {
            this.config.toolipDiv.innerHTML = "没有检查到相关内容...";
        } else {
            var content = [];
            content
                .push("<ul style=\"padding:0px;height:auto;margin:3px;list-style:none;width:"
                    + (this.config.width - 4) + "px;\">");
            this.listCount = this.listArray.length;
            for (var i = 0; i < this.listArray.length; i++) {
                if (this.listArray[i]) {
                    content
                        .push("<li  title='"
                            + this.listArray[i][2]
                            + "' id=\"item"
                            + i
                            + "\"style=\"cursor:pointer;padding:5px;width:"
                            + (this.config.width - 10)
                            + "px;line-height:30px;border-bottom:#ccc 1px dotted;\" onclick=\""
                            + this.obj + ".showItem(" + i + ");\">");
                    content.push(this.listArray[i][2]);
                    content.push("</li>");
                }
            }
            content.push("</ul>");
            this.config.toolipDiv.innerHTML = content.join("");

        }
        this.config.toolipDiv.style.display = "block";
    },
    show: function (e) {
        e = e || window.event;
        this.keyCode = e.keyCode;
        if (this.config.srcElement.value.trim().length > 0) {
            if (this.keyCode == 13) {
                this.appendToItemList();
                this.config.toolipDiv.style.display = "none";
                this.currentIndex = -1;
                this.listCount = 0;
                if (this.config.descIdHidden.value.trim() == "") {
                    var currentLi = $("item0");
                    if (currentLi) {
                        var currentItem = this.listArray[0];
                        this.config.descIdHidden.value = currentItem[0];
                        this.config.srcElement.value = this.config.showFullName == true ? currentItem[2]
                            : currentItem[1];
                        if (this.selectedCallBack) {
                            this.selectedCallBack(currentItem);
                        }
                    }
                }
            } else if (this.keyCode == 38 || this.keyCode == 40) {
                this.upAndDown();
            } else if ((this.keyCode == 8 || this.keyCode == 46)
                && this.config.srcElement.value.length > this.config.maxLength) {
                this.config.srcElement.value = "";
                this.config.descIdHidden.value = "";
            } else {
                this.prepare();
            }
        } else {
            this.config.toolipDiv.style.display = "none";
            this.currentIndex = -1;
            this.listCount = 0;
            this.config.descIdHidden.value = "";
        }
    },
    showItem: function (itemIndex) {
        var item = this.listArray[itemIndex];
        this.config.descIdHidden.value = item[0];
        this.config.srcElement.value = this.config.showFullName === true ? item[2]
            : item[1];
        this.currentIndex = itemIndex;
        this.config.srcElement.focus();
        this.config.toolipDiv.style.display = "none";
        if (this.selectedCallBack) {
            this.selectedCallBack(item);
        }
    },
    upAndDown: function () {
        if (this.keyCode == 38) {
            if (this.currentIndex !== 0) {
                this.currentIndex--;
            } else {
                this.currentIndex = this.listCount - 1;
            }
        } else {
            if (this.currentIndex != this.listCount - 1) {
                this.currentIndex++;
            } else {
                this.currentIndex = 0;
            }
        }
        if (this.currentIndex > this.listCount || this.currentIndex < 0) {
            this.currentIndex = 0;
        }
        var currentLi = $("item" + this.currentIndex);
        var currentItem = this.listArray[this.currentIndex];
        this.config.descIdHidden.value = currentItem[0];
        this.config.srcElement.value = this.config.showFullName == true ? currentItem[2]
            : currentItem[1];
        if (this.selectedCallBack) {
            this.selectedCallBack(currentItem);
        }
        for (var i = 0; i < this.listCount; i++) {
            var item = $("item" + i);
            if (item) {
                item.style.backgroundColor = "#ffffff";
                item.style.fontWeight = "normal";
            }
        }
        currentLi.style.backgroundColor = "#FF99FF";
        currentLi.style.fontWeight = "bold";
    },
    hidden: function () {
        if (this.config.toolipDiv) {
            this.config.toolipDiv.style.display = "none";
        }
    },
    appendToItemList: function () {
        if (this.config.descSelectList
            && this.config.srcElement.value.trim() !== "") {
            $(this.config.descSelectList).addItem(this.config.srcElement.value,
                this.config.descIdHidden.value);
            this.config.srcElement.value = "";
        }
    }
};