/*---------------------------------------------JGridView全选和单选---------------------------------------------*/
Sparrow.gridView = {
    keyType: "string",// int
    id: "grvManageList",
    resultCtrlId: "hdnGridResult",
    getTable: function () {
        return $(this.id);
    },
    init: function () {
        var hdnGridResult = $("#hdnGridResult");
        if (hdnGridResult != null) {
            if (!$.isNullOrEmpty(hdnGridResult.attr("gridViewId"))) {
                this.id = hdnGridResult.attr("gridViewId");
            }
            if (!$.isNullOrEmpty(hdnGridResult.attr("keyType"))) {
                this.keyType = hdnGridResult.attr("keyType");
            }
        }
    },
    getCellIndex: function (checkBox) {
        return checkBox.parentNode.cellIndex;
    },
    allCheckClick: function (allCheckBox) {
        var checkBoxList = $("name." + this.id);
        for (var i = 0; i < checkBoxList.length; i += 1) {
            var checkBox = checkBoxList[i];
            checkBox.checked = allCheckBox.checked;
        }
    },
    recordCheckClick: function (checkBox, allCheckBox) {
        if (checkBox.checked === false) {
            $(allCheckBox).checked = false;
        } else {
            var isAllCheck = true;
            var checkBoxList = $("name." + this.id);
            for (var i = 0; i < checkBoxList.length; i++) {
                if (checkBoxList[i].checked === false)
                    isAllCheck = false;
            }
            if (isAllCheck) {
                $(allCheckBox).checked = true;
            }
        }
    },
    mustSelect: function (message) {
        var selectedId = [];
        // var gridViewRowCount=this.getTable().rows.length;
        var checkBoxList = $("name." + this.id);
        var selectId = null;
        for (var i = 0; i < checkBoxList.length; i += 1) {
            var checkBox = checkBoxList[i];
            if (checkBox.tagName.toLowerCase() === "input"
                && checkBox.checked) {
                selectId = checkBox.id;
                if (this.keyType === "string") {
                    selectedId.push("'" + selectId + "'");
                } else {
                    selectedId.push(selectId);
                }
            }
        }
        if (selectedId.length === 0) {
            if (lang.message.noSelectRecord) {
                $.message(lang.message.noSelectRecord);
            } else {
                $.message("please define the json 'lang.message.noSelectRecord'!");
            }
            return false;
        } else {
            if (selectedId.length === 1) {
                selectedId.pop();
                selectedId.push(selectId);
            }
            if (!message) {
                return selectedId;
            } else {
                if (window.confirm(message)) {
                    return selectedId;
                } else {
                    return false;
                }
            }
        }
    },
    onlyCheckedOne: function (message) {
        var strMessage = null;
        if (message) {
            strMessage = message;
        } else {
            if (system.onlySelectOneRecord) {
                strMessage = system.onlySelectOneRecord;
            } else {
                $.message("please defined system.onlySelectOneRecord");
            }
        }
        // var rowsCount=this.getTable().rows.length;
        var checkCount = 0;
        // var selectedId=null;
        var checkBoxList = $("name." + this.id);
        for (var i = 1; i < checkBoxList.length; i += 1) {
            var checkBox = checkBoxList[i];
            if (checkBox.checked) {
                checkCount += 1;
                selectedId = checkBox.id;
            }
        }

        if (checkCount === 0) {
            if (system.noSelectRecord) {
                $.message(system.noSelectRecord);
            } else {
                $.message("please defined system.noSelectRecord!");
            }
            return false;
        } else if (checkCount !== 1) {
            $.message(strMessage);
            return false;
        } else {
            return true;
        }
    },
    action: function (postUrl, message, isOnlyOne) {
        var result = isOnlyOne ? this.onlyCheckedOne(message) : this
            .mustSelect(message);
        if (result) {
            $(this.resultCtrlId).value = result;
            if (postUrl === "return") {
                return true;
            } else {
                $.submit(postUrl);
            }
        }
    }
};
Sparrow.table = function (id) {
    if (!(this instanceof Sparrow.table)) {
        return new Sparrow.table(src);
    }
    // Event object
    if (id) {
        this.id = id;
        this.t = $(id);
        this.body = t.getElementsByTagName("tbody")[0];
        this.tr = [];
    }
};
Sparrow.table.prototype = {
    _initCell: function (cell, i, j) {
        cell.style.cssText = this.tr[i].td[j].cssText;
        cell.className = this.tr[i].td[j].className;
        cell.align = this.tr[i].td[j].align;
        cell.innerHTML = this.tr[i].td[j].innerHTML;
        if (this.tr[i].td[j].colspan)
            cell.setAttribute("colspan", this.tr[i].td[j].colspan);
    },
    _initRow: function (row, i) {
        row.style.cssText = table.tr[i].cssText;
        if (table.tr[i].className && table.tr[i].className != "")
            row.className = table.tr[i].className;
        for (var j = 0; j < this.tr[i].td.length; j++) {
            var cell = row.insertCell(-1);
            this._initCell(cell, i, j);
        }
    },
    init: function () {
        for (var i = 0; i < this.tr.length; i++) {
            this.body.appendChild(this._initRow(i));
        }
        $(this.containerId).appendChild(this.t);
    },
    appendRow: function () {
        for (var i = 0; i < this.tr.length; i++) {
            var row = this.body.insertRow(-1);
            this._initRow(row, i);
        }
    },
    insertRow: function (rowIndex) {
        for (var i = 0; i < this.tr.length; i++) {
            var row = this.body.insertRow(rowIndex);
            this._initRow(row, i);
        }
    },
    updateRow: function (rowIndex) {
        for (var i = 0; i < this.tr[0].td.length; i++) {
            if (this.tr[0].td[i].innerHTML) {
                this.body.rows[rowIndex].cells[i].innerHTML = this.tr[0].td[i].innerHTML;
            }
        }
    },
    removeRow: function (rowIndex) {
        this.body.deleteRow(rowIndex);
    }
};