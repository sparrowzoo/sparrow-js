//config.treeFrameId与显示列表框无关只有管理时的增删改有关
Sparrow.treeNode = function (id,
                             pid,
                             name,
                             url,
                             title,
                             target,
                             childCount,
                             showCtrl,
                             businessEntity,
                             icon) {

    this.id = id;
    this.pid = pid;
    this.name = name;
    this.url = url;
    this.title = title;
    this.target = target;
    this.showCtrl = showCtrl ? showCtrl : true;
    this.businessEntity = businessEntity;
    this.childCount = childCount ? childCount : 0;
    this.icon = icon;
    this.iconOpen = icon;
    this._isOpened = false;
    this._isSelected = false;
    this._lastOfSameLevel = false;
    this._addressIndex = 0;
    this._parentNode;
    this._hasChild = childCount > 0;
};


Sparrow.tree = function (objName, parentName) {
    this.config = {
        target: "_self",
        useFolderLinks: true,
        useSelection: true,
        useCookies: true,
        useLines: true,
        useIcons: true,
        useRootIcon: true,
        usePlusMinusIcons: true,
        useMouseover: true,
        //class name 包含tree-id
        useTreeIdInNodeClass: false,
        useLevelInNodeClass: false,
        useRadio: false,
        useCheckbox: false,
        treeNodeClass: null,
        //根据旧权构建
        reBuildTree: null,
        //重新查库构建
        loadFloatTree: null,
        floatTreeId: null,
        descHiddenId: null,
        descTextBoxId: null,
        validate: null,
        validateConfig: null,
        isValue: false,
        isdelay: false,
        isclientDelay: false,
        closeSameLevel: false,
        inOrder: false,
        showRootIco: true,
        showOrder: false,
        orderURL: null,
        treeFrameId: null,
        loadingString: "londing .....",
        imageDir: $.url.resource + "/images/treeimg",
        // prompt:"1系统菜单 2系统页面 3控件"
        RESOURCE_TYPE: {
            "1": "[系统菜单]",
            "2": "[系统页面]",
            "3": "[控件事件]"
        }
    };
    this.icon = {
        root: this.config.imageDir + '/base.gif',
        folder: this.config.imageDir + '/folder.gif',
        folderOpen: this.config.imageDir + '/folderopen.gif',
        node: this.config.imageDir + '/page.gif',
        nolineNode: this.config.imageDir + '/nolinepage.gif',
        empty: this.config.imageDir + '/empty.gif',
        line: this.config.imageDir + '/line.gif',
        join: this.config.imageDir + '/join.gif',
        joinBottom: this.config.imageDir + '/joinbottom.gif',
        plus: this.config.imageDir + '/plus.gif',
        plusBottom: this.config.imageDir + '/plusbottom.gif',
        minus: this.config.imageDir + '/minus.gif',
        minusBottom: this.config.imageDir + '/minusbottom.gif',
        nlPlus: this.config.imageDir + '/nolines_plus.gif',
        nlMinus: this.config.imageDir + '/nolines_minus.gif'
    };
    this.interval = null;
    this.currentSelectId = {};
    this.floatTreeFrameId = null;// read only
    this.obj = objName;
    this.parentName = parentName;
    this.fullObjName = parentName ? (parentName + "." + objName) : objName;
    this.aNodes = [];
    this.aIndent = [];
    this.root = new Sparrow.treeNode(-1);
    this.selectedNodeIndex = null;
    this.selectedFound = false;
    this.completed = false;
};
Sparrow.tree.prototype = {
    resetIcon: function () {
        this.icon.root = this.config.imageDir + '/base.gif';
        this.icon.nolineroot = this.config.imageDir + '/nolinebase.gif';
        this.icon.folder = this.config.imageDir + '/folder.gif';
        this.icon.folderOpen = this.config.imageDir + '/folderopen.gif';
        this.icon.node = this.config.imageDir + '/page.gif';
        this.icon.nolineNode = this.config.imageDir + '/nolinepage.gif';
        this.icon.empty = this.config.imageDir + '/empty.gif';
        this.icon.line = this.config.imageDir + '/line.gif';
        this.icon.join = this.config.imageDir + '/join.gif';
        this.icon.joinBottom = this.config.imageDir + '/joinbottom.gif';
        this.icon.plus = this.config.imageDir + '/plus.gif';
        this.icon.plusBottom = this.config.imageDir + '/plusbottom.gif';
        this.icon.minus = this.config.imageDir + '/minus.gif';
        this.icon.minusBottom = this.config.imageDir + '/minusbottom.gif';
        this.icon.nlPlus = this.config.imageDir + '/nolines_plus.gif';
        this.icon.nlMinus = this.config.imageDir + '/nolines_minus.gif';
    },
    addBusinessEntity: function (id, pid, name, url, title, businessEntity) {
        this.aNodes[this.aNodes.length] = new Sparrow.treeNode(id, pid, name, url, title,
            "_self", undefined, true, businessEntity);
    },
    add: function (id, pid, name, url, title, target, childCount,
                   showCtrl, businessEntity, icon) {
        this.aNodes[this.aNodes.length] = new Sparrow.treeNode(id, pid, name, url, title,
            target, childCount, showCtrl, businessEntity, icon);
    },
    openAll: function () {
        this.oAll(true);
    },
    closeAll: function () {
        this.oAll(false);
    },
    toString: function () {
        var str = '<div class="sparrow-tree">';
        if (document.getElementById) {
            if (this.config.useCookies)
                this.selectedNodeIndex = this.getSelectedAi();
            str += this.addNode(this.root);
        } else
            str += 'Browser not supported.</div>';
        if (!this.selectedFound)
            this.selectedNodeIndex = null;
        this.completed = true;
        return str;
    },
    deleteClick: function () {
        alert('deleteClick not defined!');
    },
    removeNode: function (currentNode) {
        if (!currentNode) {
            currentNode = this.aNodes[this.getSelectedAi()];
        }
        this.aNodes.splice(currentNode._addressIndex, 1);
        this.clearSelectedNode();
        $(this.config.treeFrameId).innerHTML = this.toString();
        this.clearFloatFrame();
    },
    appendNode: function (newNode) {
        this.aNodes.push(newNode);
        $(this.config.treeFrameId).innerHTML = this.toString();
    },
    updateNode: function (newNode, currentNode) {
        if (!currentNode) {
            currentNode = this.aNodes[this.getSelectedAi()];
        }
        if (currentNode.pid !== newNode.pid) {
            this.removeNode(currentNode);
            this.appendNode(newNode);
        } else {
            this.aNodes[this.getSelectedAi()] = newNode;
        }
        $(this.config.treeFrameId).innerHTML = this.toString();
    },
    showOrder: function (e) {
        if (!this.config.showOrder) {
            return;
        }
        var orderDiv = $("orderDiv");
        if (orderDiv) {
            document.body.removeChild(orderDiv);
        }
        var srcObject = $.event(e).srcElement;
        //remove old label,because it's in container cache !!important
        //$.remove("#"+srcObject.id);
        var sparrowElement = $(srcObject, false);
        var addressIndex = srcObject.id.substring(this.obj.length + 1);
        var currentNode = this.aNodes[addressIndex];
        if (currentNode.pid == -1) {
            this.clearFloatFrame();
            return;
        }

        orderDiv = $("+div.orderDiv");
        document.body.appendChild(orderDiv.s);
        orderDiv.class("pure-menu pure-order-menu");
        orderDiv.css("position", "absolute");
        orderDiv.html(('<span class="pure-menu-heading pure-menu-link pure-order-menu-heading" onclick="{0}.delete_click({1});{0}.clearFloatFrame();" >删除</span>'
            + '<ul class="pure-menu-list">'
            + '<li class="pure-menu-item"><a href="#" class="pure-menu-link">当前第<span id="currentOrderNo"></span>位</a></li>'
            + '<li class="pure-menu-item pure-menu-has-children">'
            + '<a  id="hyperJump" class="pure-menu-link">你可以跳转至</a>'
            + ' <ul id="ulChildrenList" class="pure-menu-children"></ul></li></ul>').format(this.fullObjName, addressIndex));

        orderDiv.bind("onclick", function (e) {
            $.event(e).cancelBubble();
        });
        $("#hyperJump", false).bind("onmouseover", function () {
            $("#ulChildrenList", false).css("display", "block");
        });
        orderDiv.css("left", (sparrowElement.getAbsoluteLeft() + srcObject.offsetWidth) + "px");
        orderDiv.css("top", (sparrowElement.getAbsoluteTop() + srcObject.offsetHeight) + "px");

        var pNode = currentNode._parentNode;
        var index = 0;
        var currentIndex = 0;
        var listHTML = "";
        for (var i = 0; i < this.aNodes.length; i++) {
            if (this.aNodes[i].pid !== pNode.id) {
                continue;
            }
            if (this.aNodes[i].id === currentNode.id) {
                currentIndex = ++index;
                continue;
            }
            index++;
            listHTML += '<li class="pure-menu-item" onclick="{0}.order({1},{2})"><a href="#" class="pure-menu-link">第<span>{2}</span>位</a></li>'.format(this.fullObjName, addressIndex, index);
            if (this.aNodes[i]._lastOfSameLevel) {
                break;
            }
        }
        //without cache
        $("#ulChildrenList", false).html(listHTML);
        $("#currentOrderNo", false).html(currentIndex);
    },
    order: function (srcAddressIndex, sort) {
        var srcNode = this.aNodes[srcAddressIndex];
        var postString = "id=" + srcNode.id + "&target=" + sort;
        var tree = this;
        var nodes = this.aNodes;
        $.ajax.json(this.config.orderURL, postString, function (json) {
            srcNode = nodes[srcAddressIndex];
            var destNode = null;
            var srcParentNode = srcNode._parentNode;
            var childNo = 0;
            var destIndex = 0;
            //find dest node
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].pid === srcParentNode.id) {
                    childNo++;
                    if (childNo === sort) {
                        destIndex = i;
                        destNode = nodes[i];
                        break;
                    }
                }
            }
            //delete src index
            nodes.splice(srcAddressIndex, 1);
            //insert new at dest insert
            nodes.splice(destIndex, 0, srcNode);
            $("#" + tree.config.treeFrameId).html(tree);
            tree.clearFloatFrame();
        });
    }, addNode: function (pNode) {
        var str = '';
        var n = 0;
        if (this.config.inOrder)
            n = pNode._addressIndex;
        for (n; n < this.aNodes.length; n++) {
            if (this.aNodes[n] != null && this.aNodes[n].pid === pNode.id) {
                var cn = this.aNodes[n];
                cn._parentNode = pNode;
                pNode.childCount++;
                cn._addressIndex = n;
                this.setCS(cn);
                if (!cn.target && this.config.target)
                    cn.target = this.config.target;
                if (cn._hasChild && !cn._io && this.config.useCookies)
                    cn._isOpened = this.isOpen(cn.id);
                if (!this.config.useFolderLinks && cn._hasChild)
                    cn.url = null;
                if (this.config.useSelection && cn.id === this.getSelectedId()) {
                    cn._isSelected = true;
                    this.selectedNodeIndex = n;
                    this.selectedFound = true;
                }
                // 因node中调用addNode()函数则为递归。
                if (this.config.showRootIco) {
                    str += this.node(cn, n);
                } else {
                    this.node(cn, n);
                }
                // 如果当前节点是当前父节点的最后一个儿子节点则退出遁环
                if (cn._lastOfSameLevel)
                    break;
            }
        }
        return str;
    }, select: function (srcElement, className) {
        if (this.current != null) {
            this.current.className = $(this.current).attr("old");
        }
        $(srcElement).attr("old", srcElement.className);
        srcElement.className = "iTreeNodeSelect" + className;
        this.current = srcElement;
    }, node: function (node, nodeId) {
        // 获得缩进字符串
        var classNum = "";
        if (this.config.treeNodeClass)
            classNum += this.config.treeNodeClass;
        else if (this.config.useTreeIdInNodeClass)
            classNum += this.obj.substring(0, 1).toUpperCase()
                + this.obj.substring(1);
        if (this.config.useLevelInNodeClass)
            classNum += (this.aIndent.length > 1 ? 3 : (this.aIndent.length + 1));
        var str = '<div onclick="' + this.fullObjName + '.select(this,\'' + classNum + '\');"';
        if (this.config.useRootIcon || node.pid != this.root.id)
            str += ' class="iTreeNode' + classNum + '"';
        str += 'id="node' + this.obj + nodeId + '"  >' + this.indent(node, nodeId);
        if (this.config.useIcons) {
            if (this.config.useLines) {
                node.icon = (this.root.id == node.pid) ? this.icon.root
                    : ((node._hasChild) ? this.icon.folder : this.icon.node);
                node.iconOpen = (this.root.id == node.pid) ? this.icon.root
                    : (node._hasChild) ? this.icon.folderOpen : this.icon.node;
            } else if (!node.icon) {
                node.iconOpen = node.icon = node._hasChild ? this.icon.nolinefolder
                    : this.icon.nolinenode;
            }
            if (this.config.useRootIcon || node.pid != this.root.id) {
                str += '<img '
                    + (this.config.showOrder ? ' onmouseover="' + this.fullObjName
                        + '.showOrder(event)"' : '') + ' id="i' + this.obj
                    + nodeId + '" src="'
                    + ((node._isOpened) ? node.iconOpen : node.icon)
                    + '" alt="" align="absMiddle"/>';
            }
            if ((node.showCtrl && node.pid != -1)
                || (node.pid == -1 && this.userRootIcon == true)) {
                if (this.config.useRadio) {
                    str += '<input style="line-height:15px;height:15px;border:0;" type="radio" name="iTreerdb" id="r{1}{0}" onclick="{1}.getRadioSelected({0});{1}.s({0});" value="{2}"/>'.format(nodeId, this.fullObjName, node.id);
                }
                if (this.config.useCheckbox == true) {
                    str += '<input style="line-height:15px;height:15px;border:0;" type="checkbox" name="iTreecbx" id="c{1}{0}" onclick="{1}.selectCheckbox({0});" value="{2}"/>'.format(nodeId, this.fullObjName, node.id);
                }
            }
        }
        if (node.url) {
            str += '<a ondblclick="javascript:'
                + this.fullObjName
                + '.dbs('
                + nodeId
                + ');" id="s'
                + this.obj
                + nodeId
                + '" class="'
                + ((this.config.useSelection) ? ((node._isSelected ? 'nodeSel'
                    : 'node')) : 'node') + '" href="' + node.url + '"';

            if (node.title)
                str += ' title="' + node.title + '"';
            if (node.target)
                str += ' target="' + node.target + '"';

            if (this.config.useSelection
                && ((node._hasChild && this.config.useFolderLinks) || !node._hasChild)) {
                str += ' onclick="javascript: ' + this.fullObjName + '.s(' + nodeId + ');';
            }
            str += (!this.config.usePlusMinusIcons ? ''
                : (node._hasChild && node._parentNode.id != -1 ? (this.fullObjName
                    + '.o(' + nodeId + ')') : ''))
                + '">';
        } else if ((!this.config.useFolderLinks || !node.url) && node._hasChild
            && node.pid != this.root.id)

            str += '<a href="javascript: ' + this.fullObjName + '.o(' + nodeId
                + ');" class="node">';

        str += '<span id="ntext' + this.obj + nodeId + '">' + node.name + '</span>';

        if (node.url
            || ((!this.config.useFolderLinks || !node.url) && node._hasChild))
            str += '</a>';
        str += '</div>';
        if (node._hasChild) {

            str += '<div id="d'
                + this.obj
                + nodeId
                + '" class="clip" style="display:'
                + ((this.root.id == node.pid || node._isOpened) ? 'block'
                    : 'none') + ';">';
            // 如果不是动态加载
            if (!this.config.isdelay && !this.config.isclientDelay) {
                str += this.addNode(node);
            }
                // 延迟加载子节点(前一条件针对打开的所有非顶级节点，后一条件针对根节点)
            // 是否打开在缓存中取
            else if ((node._isOpened && node.pid != -1) || (node.pid == -1)) {
                str += this.addNode(node);
            }

            str += '</div>';
        }
        this.aIndent.pop();
        return str;
    },

// 生成缩进图片
    indent: function (node, nodeId) {
        var str = '';
        if (this.root.id === node.pid) {
            return str;
        }
        for (var n = 0; n < this.aIndent.length; n++) {
            str += '<img src="'
                + ((this.aIndent[n] === 1 && this.config.useLines) ? this.icon.line
                    : this.icon.empty) + '" alt="" />';
        }
        // 因为是递归填加节点，所以用堆栈。先将节点的缩进状态压入栈，等节点填加完成后再弹出栈。
        // 所以当树的层次为多层时，栈中也同样有相同层次的状态信息。如果为是普通节点则画|如果是同父节点的最小兄弟节点则画空格
        node._lastOfSameLevel ? this.aIndent.push(0) : this.aIndent.push(1);
        if (this.config.usePlusMinusIcons) {
            str += '<img style="width:0;height:0;" id="j' + this.obj
                + nodeId + '"/>';
            return str;
        }
        if (node._hasChild) {
            str += '<a href="javascript: ' + this.fullObjName + '.o(' + nodeId
                + ');"><img id="j' + this.obj + nodeId + '" src="';
            if (!this.config.useLines)
                str += (node._isOpened) ? this.icon.nlMinus
                    : this.icon.nlPlus;
            else
                str += ((node._isOpened) ? ((node._lastOfSameLevel && this.config.useLines) ? this.icon.minusBottom
                    : this.icon.minus)
                    : ((node._lastOfSameLevel && this.config.useLines) ? this.icon.plusBottom
                        : this.icon.plus));
            str += '"/></a>';
        } else {
            str += '<img id="j'
                + this.obj
                + nodeId
                + '" src="'
                + ((this.config.useLines) ? ((node._lastOfSameLevel) ? this.icon.joinBottom
                    : this.icon.join)
                    : this.icon.empty) + '" alt="" />';
        }
        return str;
    },
// 设置当前节点状态_hc和ls
    setCS: function (node) {
        var lastId = null;
        node._hasChild = false;
        node._lastOfSameLevel = false;
        for (var n = 0; n < this.aNodes.length; n++) {
            // 如果不是动态的则判断是否有子节点
            if (this.config.isdelay === false) {
                if (this.aNodes[n] != null && this.aNodes[n].pid == node.id) {
                    node._hasChild = true;
                }
            }
            if (this.aNodes[n] != null && this.aNodes[n].pid == node.pid)
                lastId = this.aNodes[n].id;

        }
        if (lastId === node.id)
            node._lastOfSameLevel = true;

    },
    getAllNameOfNode: function (cn, splitChar) {
        if (!cn) {
            cn = this.aNodes[this.getSelectedAi()];
        }
        var nameArray = [];
        while (cn.id != -1 && !$.isNullOrEmpty(cn.name)) {
            if (cn.name.indexOf(':') != -1) {
                nameArray.push(cn.name.split(':')[1]);
            } else {
                nameArray.push(cn.name);
            }
            if (cn._parentNode) {
                cn = cn._parentNode;// 如果cn_p存在，即是静加载因为是动态加载只有addNode后才有该节点信息
            } else {
                cn = this.aNodes[this.getAiById(cn.pid)];
            }
        }
        splitChar = splitChar ? splitChar : "  ";
        nameArray.reverse();
        return nameArray.join(splitChar);
    },
// 获取当前选中的节点地址索引只有一个
    getSelectedAi: function () {
        return this.getAiById(this.getSelectedId());
    },
// 获取当前选中的节点ID只有一个
    getSelectedId: function () {
        var sn;
        if (this.config.useCookies == true) {
            sn = this.getCookie('currentSelect' + this.obj);
        } else {
            sn = this.currentSelectId["currentSelect" + this.obj];
        }
        return (sn) ? sn : null;
    },
// 清除当前选中节点
    clearSelectedNode: function () {
        var now = new Date();

        var yesterday = new Date(now.getTime() - 1000 * 60 * 60 * 24);

        this.setCookie('cs' + this.obj, 'cookieValue', yesterday);

        this.currentSelectId["currentSelect" + this.obj] = null;
    },
// 设置当前选中的节点
    setCurrentSelectNode: function (cn) {
        if (this.config.useCookies) {
            this.setCookie('currentSelect' + this.obj, cn.id);
        } else {
            this.currentSelectId["currentSelect" + this.obj] = cn.id;
        }
    },
// 选择事件
    s: function (id) {
        if (!this.config.useSelection)
            return;
        var cn = this.aNodes[id];
        if (cn._hasChild && !this.config.useFolderLinks)
            return;
        if (this.selectedNodeIndex != id) {
            if (this.selectedNodeIndex || this.selectedNodeIndex == 0) {
                // 将之前的选中节点置为普通结点状态
                eOld = document.getElementById("s" + this.obj
                    + this.selectedNodeIndex);

                this.aNodes[this.selectedNodeIndex]._isSelected = false;

                if (eOld) {
                    eOld.className = "node";
                }
            }
            eNew = document.getElementById("s" + this.obj + id);
            eNew.className = "nodeSel";
            this.selectedNodeIndex = id;
            cn._isSelected = true;
            this.setCurrentSelectNode(cn);
        }
        if (document.getElementById("r" + this.obj + id)) {
            document.getElementById("r" + this.obj + id).checked = true;
            this.getRadioSelected(id);
        }
        if (document.getElementById("c" + this.obj + id)) {
            var currentcbk = document.getElementById("c" + this.obj + id);
            currentcbk.checked = !currentcbk.checked;
            this.selectCheckbox(id);
        }
        if (this.config.closeSameLevel)
            this.closeLevel(cn);
    },
    /**
     * 把折叠状态节点的子节点加载到子节点面板中<br>
     *
     * @param node
     *            节点对象;
     */
    delayOpen: function (node) {
        var currentTree = this;
        var cn = node;
        var id = node._addressIndex;
        // 延迟加载折叠状态节点的子节点
        if (cn._isOpened === false) {
            // 获取展示子节点的div
            var childrenDIV = document.getElementById('d' + this.obj + id);
            // 该结点从未展开过
            if (childrenDIV != null && childrenDIV.innerHTML == "") {
                var postStr = "ay=true&nodeId=" + cn.id;
                if ($("exceptid").value) {
                    postStr += "&exceptid=" + $("exceptid").value;
                }
                $.ajax.json(this.config.ajaxURL, postStr,
                    function (result) {
                        alert(result);
                        // alert(xmlHttpRequest.responseText);
                        var nodeListJson = xmlHttpRequest.responseText
                            .json();
                        openNodeCallBack(nodeListJson);
                        // 将从当前节点到次级根节点之前所有父节点是否是同级节点的最后一个的标志压栈
                        var nodeTemp = cn;
                        var indentArray = [];
                        // 循环到次级根节点之前
                        while (nodeTemp.pid != -1) {
                            indentArray[indentArray.length] = (nodeTemp._lastOfSameLevel) ? 0
                                : 1;
                            nodeTemp = nodeTemp._parentNode;
                        }
                        // 反向压栈
                        for (var i = indentArray.length - 1; i >= 0; i--) {
                            currentTree.aIndent
                                .push(indentArray[i]);
                        }
                        // 初始化下下级所有结点，并得到所有下一级子节点的html字符串，并将一层孩子写入到页面中
                        childrenDIV.innerHTML = currentTree
                            .addNode(cn);
                        // 清除临时深度
                        for (var i = 0; i < indentArray.length; i++) {
                            currentTree.aIndent.pop();
                        }
                    });
            }
        }
    },
    clientDelayOpen: function (node, isFresh) {
        var cn = node;
        var id = node._addressIndex;
        // 延迟加载折叠状态节点的子节点
        if (cn._isOpened == false || isFresh) {
            // 获取展示子节点的div
            var childrenDIV = document.getElementById('d' + this.obj + id);

            // 该结点从未展开过
            if (childrenDIV != null && childrenDIV.innerHTML == "" || isFresh) {
                // 将从当前节点到次级根节点之前所有父节点是否是同级节点的最后一个的标志压栈
                var nodeTemp = cn;
                var indentArray = [];

                // 循环到次级根节点之前
                while (nodeTemp._parentNode.id != this.root.id) {
                    indentArray[indentArray.length] = (nodeTemp._lastOfSameLevel) ? 0
                        : 1;
                    nodeTemp = nodeTemp._parentNode;
                }
                // 反向压栈
                for (var i = indentArray.length - 1; i >= 0; i--) {
                    this.aIndent.push(indentArray[i]);
                }
                // 初始化下下级所有结点，并得到所有下一级子节点的html字符串，并将一层孩子写入到页面中
                childrenDIV.innerHTML = this.addNode(cn);

                // 清除临时深度
                for (var i = 0; i < indentArray.length; i++) {
                    this.aIndent.pop();
                }
            }
        }
    },
// 当含有子节点的父节点打开
    o: function (id) {
        var cn = this.aNodes[id];
        if (this.config.isdelay) {
            this.delayOpen(cn);
        }
        if (this.config.isclientDelay) {
            this.clientDelayOpen(cn);
        }
        this.nodeStatus(!cn._isOpened, id, cn._lastOfSameLevel);

        cn._isOpened = !cn._isOpened;

        if (this.config.closeSameLevel)
            this.closeLevel(cn);
        if (this.config.useCookies)
            this.updateCookie();
    },
    oAll: function (status) {
        for (var n = 0; n < this.aNodes.length; n++) {
            if (this.aNodes[n] != null && this.aNodes[n]._hasChild
                && this.aNodes[n].pid != this.root.id) {
                this.nodeStatus(status, n, this.aNodes[n]._lastOfSameLevel);
                this.aNodes[n]._isOpened = status;
            }
        }
        if (this.config.useCookies)
            this.updateCookie();
    },
    getAiById: function (id) {
        for (var n = 0; n < this.aNodes.length; n++) {
            if (this.aNodes[n] != null && this.aNodes[n].id == id) {
                return n;
            }
        }
        return null;
    },
// openTo打开到某某节点(只支持静态)
    openTo: function (nId, isAi) {
        if (!isAi) {
            nId = this.getAiById(nId);
        }
        if (nId === null) {
            return;
        }
        var cn = this.aNodes[nId];
        if (this.config.delay) {
            var openNodeArray = [];
            while (cn._parentNode.pid != -1) {
                openNodeArray.push(cn);
                cn = cn._parentNode;
            }
            return;
        }
        if (cn.pid == this.root.id || !cn._parentNode)
            return;
        cn._isOpened = true;
        if (this.completed && cn._hasChild)
            this.nodeStatus(true, cn._addressIndex, cn._lastOfSameLevel);
        this.openTo(cn._parentNode._addressIndex, true);
    },
// 相同父节点中的所有子节点中，关闭除node节点之外的所有兄弟节点
    closeLevel: function (node) {
        for (var n = 0; n < this.aNodes.length; n++) {
            if (this.aNodes[n] != null && this.aNodes[n].pid == node.pid
                && this.aNodes[n].id != node.id && this.aNodes[n]._hasChild) {
                this.nodeStatus(false, n, this.aNodes[n]._lastOfSameLevel);
                this.aNodes[n]._isOpened = false;
                this.closeAllChildren(this.aNodes[n]);
            }
        }
    },
// 关闭当前node节点的所有子节点
    closeAllChildren: function (node) {
        for (var n = 0; n < this.aNodes.length; n++) {
            if (this.aNodes[n] != null && this.aNodes[n].pid == node.id
                && this.aNodes[n]._hasChild) {
                if (this.aNodes[n]._isOpened)
                    this.nodeStatus(false, n, this.aNodes[n]._lastOfSameLevel);
                this.aNodes[n]._isOpened = false;
                this.closeAllChildren(this.aNodes[n]);
            }
        }
    },
// 设置当前节点状态
// status是否打开
// id当前节点地址索引
// bottom是否为相同父节点的最后一个子节点
    nodeStatus: function (isOpen, nodeIndex, isLastNodeOfSameLevel) {
        eDiv = document.getElementById('d' + this.obj + nodeIndex);
        eJoin = document.getElementById('j' + this.obj + nodeIndex);
        if (this.config.usePlusMinusIcons) {
            eIcon = document.getElementById('i' + this.obj + nodeIndex);
            if (this.config.useIcons) {
                eIcon.src = ((isOpen) ? this.aNodes[nodeIndex].iconOpen
                    : this.aNodes[nodeIndex].icon);
            }
            eJoin.src = (this.config.useLines) ?
                ((isOpen) ? ((isLastNodeOfSameLevel) ? this.icon.minusBottom
                    : this.icon.minus)
                    : ((isLastNodeOfSameLevel) ? this.icon.plusBottom
                        : this.icon.plus)) :

                ((isOpen) ? this.icon.nlMinus : this.icon.nlPlus);
        } else {
            eJoin.src = this.icon.empty;
        }
        eDiv.style.display = (isOpen) ? 'block' : 'none';
    },
    clearCookie: function () {
        var now = new Date();
        var yesterday = new Date(now.getTime() - 1000 * 60 * 60 * 24);
        this.setCookie('co' + this.obj, 'cookieValue', yesterday);
        this.setCookie('cs' + this.obj, 'cookieValue', yesterday);
    },
    setCookie: function (cookieName, cookieValue, expires, path,
                         domain, secure) {
        document.cookie =
            escape(cookieName) + '=' + escape(cookieValue)
            + (expires ? '; expires=' + expires.toGMTString() : '')
            + (path ? '; path=' + path : '')
            + (domain ? '; domain=' + domain : '')
            + (secure ? '; secure' : '');
    },
// iTree有两个cookieName
// 1、co当前打开的currentOpen
// 2、cs当前选择的currentSelected
    getCookie: function (cookieName) {
        var cookieValue = '';
        var posName = document.cookie.indexOf(escape(cookieName) + '=');
        if (posName != -1) {
            var posValue = posName + (escape(cookieName) + '=').length;
            var endPos = document.cookie.indexOf(';', posValue);
            if (endPos != -1)
                cookieValue = unescape(document.cookie.substring(posValue, endPos));
            else
                cookieValue = unescape(document.cookie.substring(posValue));
        }
        return (cookieValue);
    },
    updateCookie: function () {
        var str = '';
        for (var n = 0; n < this.aNodes.length; n++) {
            if (this.aNodes[n] != null && this.aNodes[n]._isOpened
                && this.aNodes[n].pid != this.root.id) {
                if (str)
                    str += '.';
                str += this.aNodes[n].id;
            }
        }
        this.setCookie('currentOpen' + this.obj, str);
    },

// [Cookie] Checks if a node id is in a cookie
// 判断节点是否为打开状态
    isOpen: function (id) {
        var aOpen = this.getCookie('currentOpen' + this.obj).split('.');
        for (var n = 0; n < aOpen.length; n++)
            if (aOpen[n] == id)
                return true;
        return false;
    },
    getAllId: function () {
        var idArray = [];
        for (var i = 0; i < this.aNodes.length; i++) {
            idArray.push(this.aNodes[i].id);
        }
        return idArray;
    },
    getAllParentNode: function () {
        var cn = this.aNodes[this.getSelectedAi()];
        var parentNodeIdArray = [];
        if (cn) {
            while (cn.id != -1) {
                parentNodeIdArray.push(cn.id);
                cn = cn._parentNode;
            }
        } else {
            parentNodeIdArray.push(0);
        }
        return parentNodeIdArray;
    },
    selectChilds: function (parentIds, currentSelected, length) {
        pids = [];
        for (var n = 0; n < length; n++) {
            if (parentIds.indexOf(this.aNodes[n].pid) != -1) {
                if (this.aNodes[n].showCtrl != false) {
                    document.getElementById("c" + this.obj + n).checked = currentSelected;
                    pids.push(this.aNodes[n].id);
                }
            }
        }
        if (pids.length != 0) {
            this.selectChilds(pids, currentSelected, length);
        }
    },
    getRadioSelected: function () {
        return null;
    },
    selectCheckbox: function (nodeId) {
        var node = this.aNodes[nodeId];
        var currentSelected = null;
        if (node.selectChild == undefined || node.selectChild == true) {
            currentSelected = document.getElementById("c" + this.obj + nodeId).checked;
            if (currentSelected) {
                var cn = node;
                var c;
                while (cn.id != -1) {
                    c = document.getElementById("c" + this.obj + cn._addressIndex);
                    if (c)
                        c.checked = true;
                    cn = cn._parentNode;
                }
            }
            var len = this.aNodes.length;
            var parentIds = [];
            for (var n = 0; n < len; n++) {
                if ((n != nodeId)
                    && (this.aNodes[n] != null && this.aNodes[n].pid == node.id)) {
                    if (this.aNodes[n].showCtrl != false) {
                        document.getElementById("c" + this.obj + n).checked = currentSelected;
                        parentIds.push(this.aNodes[n].id);
                    }
                }
            }
            if (parentIds.length != 0) {
                this.selectChilds(parentIds, currentSelected, len);
            }
        }

        if (this.checkBoxClick) {
            this.checkBoxClick(node.id, currentSelected);
        }
    },
// 字符串格式1,2,3
// Array
    setChecked: function (checkedId) {
        if (typeof (checkedId) == "string") {
            checkedId = checkedId.split(",");
        }
        var checkBoxList = document.getElementsByName("iTreecbx");
        for (var n = 0; n < checkBoxList.length; n++) {
            if (checkedId.indexOf(checkBoxList[n].value) != -1) {
                checkBoxList[n].checked = true;
            }
        }
    },
    getAllCheckedTitle: function () {
        var nodes = [];
        var checkBoxList = document.getElementsByName("iTreecbx");
        for (var i = 0; i < checkBoxList.length; i++) {
            if (checkBoxList[i].checked == true) {
                arrayIndex = checkBoxList[i].id.replace('c' + this.obj, '');
                nodes.push(this.aNodes[arrayIndex].title);
            }
        }
        return nodes;
    },
    getAllChecked: function () {
        var nodes = [];
        var checkBoxList = document.getElementsByName("iTreecbx");
        for (var i = 0; i < checkBoxList.length; i++) {
            if (checkBoxList[i].checked == true) {
                arrayIndex = checkBoxList[i].id.replace('c' + this.obj, '');
                nodes.push(this.aNodes[arrayIndex]);
            }
        }
        return nodes;
    },
    getAllCheckedId: function () {
        var nodes = [];
        var checkBoxList = document.getElementsByName("iTreecbx");
        for (var i = 0; i < checkBoxList.length; i++) {
            if (checkBoxList[i].checked == true) {
                nodes.push(checkBoxList[i].value);
            }
        }
        return nodes.join();
    },
    show: function (e, width, maxHeight) {
        if (this.floatTreeFrameId) {
            return;
        }
        // 根据主树重建用户选择树，未访问数据库
        if (this.config.reBuildTree)
            this.config.reBuildTree();
        // 通过方法loadFloatTree方法建新树
        if ($(this.config.floatTreeId).innerHTML.trim() == ""
            && typeof (this.config.loadFloatTree) != "undefined") {
            this.config.loadFloatTree();
        }
        var srcObject = $.event(e).srcElement;
        var sparrowElement = $(srcObject);
        var HTMLObject = document.createElement("DIV");
        HTMLObject.id = this.config.floatTreeId + "Frame";
        HTMLObject.style.cssText = "position:absolute;width:"
            + width
            + "px;height:0px;border:#ccc 1px solid;background:#ffffff; padding:1px;text-align:left;overflow:auto;";
        HTMLObject.innerHTML = this.config.loadingString;
        document.body.appendChild(HTMLObject);
        HTMLObject.onclick = function (e) {
            $.event(e).cancelBubble();
        };
        HTMLObject.style.left = (sparrowElement.getAbsoluteLeft() + 1)
            + "px";
        HTMLObject.style.top = (sparrowElement.getAbsoluteTop() + srcObject.offsetHeight)
            + "px";
        this.interval = window.setInterval(this.fullObjName + ".intervalShow("
            + maxHeight + ")", 10);
    },
    intervalShow: function (maxHeight) {
        var FrameId = this.config.floatTreeId + "Frame";
        // var divWidth=parseInt($(FrameId).style.width.replace("px",""));
        var divHeight = $(FrameId).clientHeight + 15;
        if (divHeight >= maxHeight) {
            this.floatTreeFrameId = FrameId;
            if ($(this.config.floatTreeId)
                && $(this.config.floatTreeId).innerHTML != "") {
                var treeDiv = $(this.config.floatTreeId);
                $(FrameId).innerHTML = "";
                treeDiv.style.display = "block";
                $(FrameId).appendChild(treeDiv);
                window.clearInterval(this.interval);
            }
        } else {
            $(FrameId).style.height = (divHeight) + "px";
        }
    },
    clearFloatFrame: function () {
        if (this.floatTreeFrameId) {
            var TreeFrame = $(this.floatTreeFrameId);
            // reBuildTree is a function to build floatTree from loaded tree
            if (!this.config.reBuildTree) {
                var tree = $(this.config.floatTreeId);
                tree.style.display = "none";
                document.body.appendChild(tree);
            }
            document.body.removeChild(TreeFrame);
            this.floatTreeFrameId = null;
            window.clearInterval(this.interval);
        }
        if ($("orderDiv")) {
            document.body.removeChild($("orderDiv"));
        }
    },
    //定义 config.loadFloatTree  树初始化方法
    initResourceTree: function (resourcePrefix, ajaxUrl) {
        if (!ajaxUrl) ajaxUrl = $.url.root + "/resource/load-all";
        this.initCodeToolip(resourcePrefix, ajaxUrl);
        var treeObject = this;
        this.config.loadFloatTree = function () {
            $.ajax.json(ajaxUrl, resourcePrefix, function (result) {
                var jsonList = result.data || result.message;
                treeObject.aNodes = [];
                treeObject.resetIcon();
                treeObject.config.usePlusMinusIcons = false;
                treeObject.config.useRootIcon = false;
                treeObject.add(jsonList[0].parentId, -1, "");
                treeObject.resetIcon();
                for (var i = 0; i < jsonList.length; i++) {
                    if ($.isNullOrEmpty(jsonList[i].icoUrl)) {
                        jsonList[i].icoUrl = $.DEFAULT_RESOURCE_ICO_URL;
                    }
                    treeObject.add(jsonList[i].id,
                        jsonList[i].parentId,
                        jsonList[i].name,
                        "javascript:" + treeObject.fullObjName
                        + ".codeNodeClick(" + (i + 1) + ");",
                        jsonList[i].name,
                        undefined,
                        undefined,
                        undefined,
                        jsonList[i],
                        jsonList[i].icoUrl);
                }
                $(treeObject.config.floatTreeId).innerHTML = treeObject;
            });
        };
    },
    // 定义this.config.loadFloatTree 码表初始化方法
    initCodeToolip: function (codePrefix, ajaxUrl) {
        var htmlEvents = ("$('#'+{0}.config.descTextBoxId).bind('onchange',function(){" +
            "if($({0}.config.descTextBoxId).value==''){" +
            "$({0}.config.descHiddenId).value='';" +
            "if(typeof({0}.config.valueTextBoxId)!='undefined')" +
            "{$({0}.config.valueTextBoxId).value='';$({0}.config.valueTextBoxId).readOnly='readonly';}}});").format(this.fullObjName);
        eval(htmlEvents);
        var treeObject = this;
        if ($(treeObject.config.floatTreeId) == null) {
            var floatTree = $("+div").s;
            floatTree.id = treeObject.config.floatTreeId;
            floatTree.className = "floatTree";
            document.body.appendChild(floatTree);
        }
        if (!ajaxUrl)
            ajaxUrl = $.url.root + "/code/load";
        this.dbs = function (nodeIndex) {
            var businessEntity = this.aNodes[nodeIndex].businessEntity;
            if (this.config.descHiddenId != null) {
                $(this.config.descHiddenId).value = businessEntity.code;
            }
            if (this.config.descTextBoxId != null) {
                var descCtrl = $(this.config.descTextBoxId);
                if (descCtrl.type === "text") {
                    descCtrl.value = this.getAllNameOfNode(this.aNodes[nodeIndex], "/");
                } else {
                    descCtrl.innerHTML = this.getAllNameOfNode(this.aNodes[nodeIndex], "/");
                }
            }
            if (this.config.valueTextBoxId != null) {
                $(this.config.valueTextBoxId).value = businessEntity.value;
            }
            if (this.codeNodeCallBack) {
                this.codeNodeCallBack(this.aNodes[nodeIndex]);
            }
            this.clearFloatFrame();
            if (this.config.validate) {
                this.config.validate();
            } else if (this.config.validateConfig) {
                $.v.isNull(this.config.validateConfig, descCtrl);
            }
        };
        treeObject.config.loadFloatTree = function () {
            ajax.json(ajaxUrl, "loadOption=" + codePrefix, function (result) {
                var jsonList = result.data || result.message;
                treeObject.aNodes = [];
                treeObject.resetIcon();
                treeObject.config.usePlusMinusIcons = false;
                treeObject.config.useRootIcon = false;
                treeObject.add(jsonList[0].parentId, -1, "");
                for (var i = 0; i < jsonList.length; i++) {
                    treeObject.add(jsonList[i].id,
                        jsonList[i].parentId, jsonList[i].name,
                        "javascript:" + treeObject.fullObjName
                        + ".codeNodeClick(" + (i + 1) + ");",
                        jsonList[i].code + "|" + jsonList[i].name,
                        undefined, undefined, undefined, jsonList[i]);
                }
                $(treeObject.config.floatTreeId).innerHTML = treeObject;
            });
        };
    },
    //codeNodeClient--> dbs -->codeNodeCallBack
    codeNodeClick: function (nodeIndex) {
        if (this.aNodes[nodeIndex].childCount === 0) {
            this.dbs(nodeIndex);
        }
    }
};