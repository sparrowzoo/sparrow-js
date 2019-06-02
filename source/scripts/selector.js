/**
 * @return {null}
 * name.
 * tag.
 */
var Sparrow = function (selector) {
    var args = Array.prototype.slice.call(arguments, 0);
    if (selector == null || typeof (selector) === "undefined") {
        return null;
    }
    if (typeof(selector) === "function") {
        //call不为数组
        //apply 的参数为数组
        //Array.prototype.slice 将arguments 转化成数组
        return selector.apply(selector, args.slice(1));
    }
    //jsonp./system/cms/jsonp.jsp.id.http://www.baidu.com
    if (args[0] === "jsonp") {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.language = "javascript";
        script.src = args[1];
        script.id = args[2];
        var oldScript = document.getElementById(script.id);
        if (oldScript != null) {
            document.head.removeChild(oldScript);
        }
        document.head.appendChild(script);
        return;
    }

    var sparrow_id = selector;
    if (typeof (selector) === "object") {
        sparrow_id = "#." + selector.id;
    }
    var parent = args[1];
    var doc = args.length === 3 ? args[2] : document;
    if (parent != null && typeof(parent) === "object") {
        if (parent.id != null && typeof(parent.id) !== "undefined") {
            parent.id = "sparrow_" + $.random();
        }
        sparrow_id += parent.id;
    }
    if ($.global(sparrow_id)) {
        return $.global(sparrow_id);
    }
    if (typeof (selector) !== "object" && selector.indexOf(".") === -1) {
        return doc.getElementById(selector);
    }
    if (window === this)
        return new Sparrow(selector, parent, doc);
    var doms = [];
    this.selector = selector;
    this.doc = doc;
    if (typeof (selector) === "object") {
        doms[0] = selector;
        if (!selector.id) {
            selector.id = "sparrow_" + $.random();
        }
        this.selector = "#." + selector.id;
        sparrow_id = this.selector;
    } else if (selector.indexOf(".") > -1) {
        var selectorArray = selector.split(".");
        switch (selectorArray[0]) {
            case "#":
                doms[0] = doc.getElementById(selectorArray[1]);
                break;
            case "tag":
                doms = doc.getElementsByTagName(selectorArray[1]);
                break;
            case "name":
                var name = selectorArray[1];
                if (selectorArray.length === 3) {
                    name += "." + selectorArray[2];
                }
                doms = doc.getElementsByName(name);
                break;
            case "new":
                //new.input.id.parentId.type
                //new.input&button.id.parentId.type
                doms[0] = doc.createElement(selectorArray[1]);
                if (selectorArray.length >= 3) {
                    doms[0].id = selectorArray[2];
                } else {
                    doms[0].id = "sparrow_" + $.random();
                }
                this.selector = "#." + selectorArray[2];
                sparrow_id = this.selector;
                if (selectorArray.length >= 4) {
                    if (selectorArray[3] === "doc") {
                        this.doc.body.appendChild(doms[0]);
                    } else {
                        this.doc.getElementById(selectorArray[3]).appendChild(
                            doms[0]);
                    }
                }
                break;
            case "son":
                var childs = [];
                if (!parent) {
                    parent = $(selectorArray[2]);
                }
                var allChilds = parent.getElementsByTagName(selectorArray[1]);
                if (selectorArray[1] === "li") {
                    parent = allChilds[0].parentNode;
                }
                this.s = parent;
                if (!parent.id) {
                    parent.id = "sparrow_" + $.random();
                }
                for (var i = 0; i < allChilds.length; i += 1) {
                    if (allChilds[i].parentNode === parent) {
                        childs[childs.length] = allChilds[i];
                    }
                }
                doms = childs;
                break;
            case "for":
                var labelList = doc.getElementsByTagName("label");
                var forId = selectorArray[1];
                for (var i = 0; i < labelList.length; i += 1) {
                    if (labelList[i].attributes["for"].value === forId) {
                        doms[0] = labelList[i];
                        break;
                    }
                }
                break;
            case "checkedValue":
                var selectedTag = [];
                var tagArray = doc.getElementsByName(selectorArray[1]);
                var attribute = null;
                if (selectorArray.length > 2) {
                    attribute = selectorArray[2];
                }
                // 获取当前已经选中的标签
                for (var i = 0; i < tagArray.length; i++) {
                    if (tagArray[i].checked) {
                        if (attribute) {
                            selectedTag[selectedTag.length] = (tagArray[i].attributes[attribute].value);
                        } else {
                            selectedTag[selectedTag.length] = (tagArray[i].value);
                        }
                    }
                }
                doms = selectedTag;
                break;
        }
    }
    if (selector) {
        var arr = [];
        for (var i = 0; i < doms.length; i++) {
            arr.push(doms[i]);
        }
        this.length = 0;
        if (doms.length > 0) {
            if (!this.s) {
                this.s = doms[0];
            }
            if (this.s && this.s.id) {
                $.global(sparrow_id, this);
            }
        }
        [].push.apply(this, arr);
    }
    this.interval = [];
    return this;
};

window.$ = window.Sparrow = Sparrow;