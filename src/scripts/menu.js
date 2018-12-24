
/*
 * 垂直菜单 menu 与child的对应关系是以 menu.id+_child=child.id 对应
 * 水平菜单 用索引对应 因为html 结构决定
 * position[child.id]=child.position(height etc...)
 * */
function Menu(obj, position) {
    this.config = // 菜单显示需要的常量配置
        {
            current_menu: null,
            left_limit: -1,
            period: 3,
            frameDiv: null, // 菜单提示框的DIV
            srcElement: null, // 事件源控件保存选中的提示结果
            width: 300, // 提示框显示宽度
            position: {},//高度
            container: null, // 菜单显示的窗口
            parent: null, // 父菜单
            menu: [],
            list: [],//水平菜单的列表 与menu 一一 对应
            childs: [],//快捷菜单隐藏时使用
            brothers: []// 兄弟节点
        };
    this.obj = obj;
    //obj为leftMenu 则id默认为divLeftMenu
    //for different obj in container
    this.id = "div" + this.obj.firstCharUpperCase();
    this.position = position ? position : "SIDE";// 位置默认右上角
    $.global(obj, this);
}

Menu.prototype = {
    init: function () {
        if (this.position === $.SIDE) {
            this.config.frameDiv = $("new.div").s;
            this.config.frameDiv.onmouseover = function (e) {
                $.event(e).cancelBubble();
            };
            document.body.appendChild(this.config.frameDiv);
            this.config.frameDiv.style.cssText = $.css.menu.frame.format(
                this.config.width, 0, 0);
            var menuHTML = [];
            menuHTML.push('<ul style="{0}">'.format($.css.menu.ul
                .format(this.config.width - 2)));
            for (var i = 0; i < this.config.menu.length; i++) {
                menuHTML
                    .push('<li style="{0}" {3}><a href="javascript:void(0);" onclick="{1}.itemClick({2});"  style="width:{4}px;display:inline-block;cursor:pointer"><span style="float:left">{5}</span><span  style="float:right;">{6}</span></a></li>'
                        .format(
                            $.css.menu.li.format(this.config.width),
                            this.obj,
                            i,
                            this.config.menu[i].more ? 'onmouseover="{0}.itemMore(this,{1});"'
                                    .format(this.obj, i)
                                : '', this.config.width,
                            this.config.menu[i].text,
                            this.config.menu[i].more ? ">>" : ""));
            }
            menuHTML.push('</ul>');
            this.config.frameDiv.innerHTML = menuHTML.join("");
        }
        else if (this.position === $.VERTICAL) {
            if (!$(this.id)) {
                return;
            }
            var item = $("son.div." + this.id);
            var obj = this.obj;
            item
                .each(function (i) {
                    var menu = $.global(obj);
                    var item_link = $("son.a", this)[0];
                    item_link.id = menu.id + "_" + menu.position + "_menu_" + i;
                    var child = $("son.ul", this)[0];
                    if (child) {
                        child.id = item_link.id + "_child";
                        menu.config.position[child.id] = child.offsetHeight;
                        child.style.display = "none";
                        child.style.height = "0px";
                        $(child).bind("onmouseover", function (e) {
                            $.event(e).cancelBubble();
                        });

                        $(item_link)
                            .bind(
                                "onmouseover",
                                function (e) {
                                    $.event(e).cancelBubble();
                                    var child = $("#." + this.id + "_child");
                                    var current_menu = null;
                                    if (menu.config.current_menu != null) {
                                        if (child === menu.config.current_menu) {
                                            return;
                                        }
                                        current_menu = menu.config.current_menu;
                                        current_menu.stop();
                                    }
                                    menu.config.current_menu = child;
                                    child.s.style.display = "block";
                                    child.move_end = function () {
                                        if (current_menu != null) {
                                            current_menu.animation("{height:'0px'}", menu.config.period);
                                        }
                                    };
                                    child
                                        .animation(
                                            "{height:'"
                                            + menu.config.position[child.s.id]
                                            + "px'}",
                                            menu.config.period);
                                });
                    }
                });
        }
        else if (this.position === $.HORIZONTAL) {
            if (!$(this.id)) {
                return;
            }
            var div = $("son.div." + this.id);
            //初始化菜单
            this.config.menu = $("son.li", div[0]);
            //初始化菜单对应的列表
            this.config.list = $("son.ul", div[1]);
            this.config.left_limit = $("#." + this.id).getAbsoluteLeft();
            if (this.config.position["height"] == null) {
                this.config.position["height"] = 30;
            }
            var menu = $.global(this.obj);
            $(document)
                .bind("onmouseover", function () {
                        menu.hidden(this);
                    });
            this.config.menu
                .each(function (i) {
                    this.id = menu.obj + "_" + menu.position + "_menu_" + i;
                    //初始化list的位置和事件
                    var list = $(menu.config.list[i]);
                    list.s.style.cssText = "height:{0}px;overflow:hidden;width:{1}px;".format(list.s.offsetHeight, list.s.offsetWidth);
                    list.s.id = this.id + "_child";
                    list.bind("onmouseover", function (e) {
                        $.event(e).cancelBubble();
                    });

                    //初始化当前菜单的事件
                    $(this)
                        .bind(
                            "onmouseover",
                            function (e) {
                                e = $.event(e);
                                e.cancelBubble();
                                if (e.srcElement.tagName !== "LI") {
                                    return;
                                }
                                var list = $(e.srcElement.id + "_child");
                                if (menu.config.current_menu != null) {
                                    if (list === menu.config.current_menu) {
                                        return;
                                    }
                                    $(menu.config.current_menu).stop();
                                }
                                menu.config.current_menu = list;
                                list.parentNode.style.height = "0";
                                var top = ($(menu.id).offsetTop - $.win.getScrollTop());
                                if (top <= 0) {
                                    top = 0;
                                }
                                list.parentNode.style.top = (top + menu.config.menu[0].offsetHeight - 8) + "px";
                                if (list.getElementsByTagName("li").length > 0) {
                                    //显示当前list 并且隐藏其他列表
                                    menu.config.list.each(function () {
                                        this.style.display = "none";
                                    });
                                    list.style.display = "block";
                                    var left = parseInt(e.srcElement.offsetLeft, 10)
                                        - (parseInt(list.style.width, 10) - e.srcElement.offsetWidth) / 2;
                                    if (left < menu.config.left_limit) {
                                        left = menu.config.left_limit;
                                    }
                                    list.style.marginLeft = left + 'px';
                                    $(list.parentNode).stop();
                                    $(list.parentNode)
                                        .animation(
                                            "{height:'"
                                            + menu.config.position["height"]
                                            + "px'}",
                                            menu.config.period);
                                }
                            });
                });
        }
    },
    itemClick: function (index) {
        alert("click:" + this.config.menu[index].text);
    }, itemMore: function (srcElement, index) {
        alert("more:" + this.config.menu[index].text);
    },
    show: function (srcElement, parentMenu) {
        this.config.parent = parentMenu;
        this.config.srcElement = srcElement;
        var scrollTop = 0;
        if (this.config.container)
            scrollTop = this.config.container.scrollTop;
        var left = $(this.config.srcElement).getAbsoluteLeft();
        if (this.config.position === this.SIDE) {
            left += this.config.srcElement.offsetWidth;
        }
        var top = $(this.config.srcElement).getAbsoluteTop()
            - scrollTop;
        this.config.frameDiv.style.left = left + "px";
        this.config.frameDiv.style.top = (top - 2) + "px";
        this.config.frameDiv.style.display = "block";
        // 显示菜单同时隐藏子菜单
        for (var i = 0; i < this.config.childs.length; i++) {
            this.config.childs[i].hidden();
        }
        // 隐藏兄弟菜单
        for (var i = 0; i < this.config.brothers.length; i++) {
            this.config.brothers[i].hidden();
        }
    },
    hidden: function () {
        if (this.position === $.SIDE) {
            if (this.config.frameDiv) {
                this.config.frameDiv.style.display = "none";
                // 隐藏其子菜单
                for (var i = 0; i < this.config.childs.length; i++) {
                    this.config.childs[i].hidden();
                }
            }
        }
        else if (this.position === $.HORIZONTAL) {
            var menu = this;
            if (this.config.current_menu != null) {
                $(this.config.current_menu.parentNode).stop();
                $(this.config.current_menu.parentNode).move_end = function () {
                    menu.config.current_menu = null;
                };
                $(this.config.current_menu.parentNode).animation("{height:'0px'}",
                    this.config.period);
            }
        }
    },
    dispose: function () {
        if (this.config.frameDiv) {
            document.body.removeChild(this.config.frameDiv);
        }
    }
};