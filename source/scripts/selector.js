/**
 * @return {null}
 * name.
 * #id  id
 * &name address equal name
 * <tag tag name 
 * !son dot below
 * $for ---for 4
 * *checked_value * equal multi
 * +//new create
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
        sparrow_id = "#" + selector.id;
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
    if (typeof (selector) !== "object" &&
        selector.indexOf("#") === -1
        &&selector.indexOf("!") === -1
        &&selector.indexOf("$") === -1
        &&selector.indexOf("&") === -1
        &&selector.indexOf("*") === -1
        &&selector.indexOf("+") === -1
        &&selector.indexOf("^") === -1) {
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
        this.selector = "#" + selector.id;
        sparrow_id = this.selector;
    } else if (typeof selector==='string') {
        var switch_char=selector.substring(0,1);
        selector=selector.substring(1);
        var selectorArray = selector.split(".");
        switch (switch_char) {
            case "#"://id
                doms[0] = doc.getElementById(selector);
                break;
            case "^": //tag
                doms = doc.getElementsByTagName(selector);
                break;
            case "&": //name
                doms = doc.getElementsByName(selector);
                break;
            case "+":
                //+input.id.parentId.type
                //+input&button.id.parentId.type
                doms[0] = doc.createElement(selectorArray[0]);
                if (selectorArray.length >= 2) {
                    doms[0].id = selectorArray[1];
                } else {
                    doms[0].id = "sparrow_" + $.random();
                }
                this.selector = "#" + selectorArray[1];
                sparrow_id = this.selector;
                if (selectorArray.length >= 3) {
                    if (selectorArray[2] === "doc") {
                        this.doc.body.appendChild(doms[0]);
                    } else {
                        this.doc.getElementById(selectorArray[2]).appendChild(
                            doms[0]);
                    }
                }
                break;
            case "!":
                var childs = [];
                if (!parent) {
                    parent = $(selectorArray[1]);
                }
                var allChilds = parent.getElementsByTagName(selectorArray[0]);
                if (selectorArray[0] === "li") {
                    parent = allChilds[0].parentNode;
                }
                this.s = parent;
                if (!parent.id) {
                    parent.id = "sparrow_" + $.random();
                }
                for (var i = 0; i < allChilds.length; i ++) {
                    if (allChilds[i].parentNode === parent) {
                        childs[childs.length] = allChilds[i];
                    }
                }
                doms = childs;
                break;
            case "$": //for 4
                var labelList = doc.getElementsByTagName("label");
                for (var i = 0; i < labelList.length; i ++) {
                    if (labelList[i].attributes["for"].value === selector) {
                        doms[0] = labelList[i];
                        break;
                    }
                }
                break;
            case "*":
                var selectedTag = [];
                var tagArray = doc.getElementsByName(selectorArray[0]);
                var attribute = null;
                if (selectorArray.length > 1) {
                    attribute = selectorArray[1];
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