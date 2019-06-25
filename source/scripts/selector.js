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
var Sparrow = function (selector,parent,doc,cache,sparrowContainerKey) {
    if (window === this) {
        var args = Array.prototype.slice.call(arguments, 0);
        if (!selector) {
            return null;
        }
        //execute method and return result for constant
        /**
         * root_domain: $(function () {
            return window.location.host.substr(window.location.host.indexOf('.'));
        })
         */
        if (typeof(selector) === "function") {
            //call不为数组
            //apply 的参数为数组
            //Array.prototype.slice 将arguments 转化成数组
            return selector.apply(selector, args.slice(1));
        }

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
            return null;
        }

        sparrowContainerKey = selector;
        if (typeof (selector) === "object") {
            sparrowContainerKey = "#" + selector.id;
        }

        parent =null;
        doc = document;
        cache=true;
        if(args.length>=2) {
            //selector,cache
            if (typeof args[1] == "boolean") {
                cache = args[1];
            }
            else {
                //selector,parent
                parent = args[1];
            }
            if (args.length >= 3) {
                //selector,parent,cache
                if (typeof args[2] == "boolean") {
                    cache = args[2];
                }
                else {
                    //select,parent doc
                    doc = args[2];
                }
            }
            //selector,parent,doc,cache
            if (args.length == 4) {
                cache = args[3];
            }
        }

        if (parent != null && typeof(parent) === "object") {
            if (!parent.id) {
                parent.id = "sparrow_" + $.random();
            }
            sparrowContainerKey +="_"+parent.id;
        }
        if ($.global(sparrowContainerKey)) {
            return $.global(sparrowContainerKey);
        }
        var beginSelector=["#","!","$","&","*","+","^"];
        if (typeof (selector) !== "object" &&beginSelector.indexOf(selector.substring(0,1))==-1) {
            return doc.getElementById(selector);
        }
        return new Sparrow(selector, parent, doc,cache,sparrowContainerKey);
    }
    var elements = [];
    this.selector = selector;
    this.doc = doc;
    if (typeof (selector) === "object") {
        elements[0] = selector;
        if (!selector.id) {
            selector.id = "sparrow_" + $.random();
        }
        this.selector = "#" + selector.id;
        sparrowContainerKey = this.selector;
    } else if (typeof selector==='string') {
        var switch_char=selector.substring(0,1);
        selector=selector.substring(1);
        var selectorArray = selector.split(".");
        var i=0;
        switch (switch_char) {
            case "#"://id
                elements[0] = doc.getElementById(selector);
                break;
            case "^": //tag
                elements = doc.getElementsByTagName(selector);
                break;
            case "&": //name
                elements = doc.getElementsByName(selector);
                break;
            case "+":
                //+input.id.parentId.type
                //+input&button.id.parentId.type
                elements[0] = doc.createElement(selectorArray[0]);
                if (selectorArray.length >= 2) {
                    elements[0].id = selectorArray[1];
                } else {
                    elements[0].id = "sparrow_" + $.random();
                }
                this.selector = "#" + selectorArray[1];
                sparrowContainerKey = this.selector;
                if (selectorArray.length >= 3) {
                    if (selectorArray[2] === "doc") {
                        this.doc.body.appendChild(elements[0]);
                    } else {
                        this.doc.getElementById(selectorArray[2]).appendChild(
                            elements[0]);
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
                for (i = 0; i < allChilds.length; i ++) {
                    if (allChilds[i].parentNode === parent) {
                        childs[childs.length] = allChilds[i];
                    }
                }
                elements = childs;
                break;
            case "$": //for 4
                var labelList = doc.getElementsByTagName("label");
                for (i = 0; i < labelList.length; i ++) {
                    if (labelList[i].attributes["for"].value === selector) {
                        elements[0] = labelList[i];
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
                for (i = 0; i < tagArray.length; i++) {
                    if (tagArray[i].checked) {
                        if (attribute) {
                            selectedTag[selectedTag.length] = (tagArray[i].attributes[attribute].value);
                        } else {
                            selectedTag[selectedTag.length] = (tagArray[i].value);
                        }
                    }
                }
                elements = selectedTag;
                break;
        }
    }
    if (selector) {
        this.length = 0;
        if (elements.length > 0) {
            if (!this.s) {
                this.s = elements[0];
            }
            if (this.s && this.s.id&&cache) {
                $.global(sparrowContainerKey, this);
            }
        }
        [].push.apply(this, elements);
    }
    this.interval = [];
    return this;
};

window.$ = window.Sparrow = Sparrow;