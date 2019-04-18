/*--------------------------select 控件相关---------------------------------------------*/
Sparrow.prototype.addItem = function (text, value) {
    if (this.s.tagName.toUpperCase() !== "SELECT") {
        return;
    }
    if ($.isNullOrEmpty(value)) {
        value = text;
    }
    var newoption = new Option(text, value);
    if (!this.existItem(newoption))
        this.s.options.add(newoption);
};
Sparrow.prototype.existItem = function (srcOption) {
    var flag = false;
    for (var j = 0; j < this.s.options.length; j++) {
        if (srcOption.value === this.s.options[j].value)
            flag = true;
    }
    return flag;
};
Sparrow.prototype.addItemToSelect = function (descSelect) {
    var sparrowDescSelect = $(descSelect);
    for (var i = 0; i < this.s.options.length; i += 1) {
        if (srcSelect.options[i].selected) {
            var value = this.s.options[i].value;
            var text = this.s.options[i].innerHTML;
            var newoption = new Option(text, value);
            if (!sparrowDescSelect.existItem(this.s.options[i]))
                descSelect.options.add(newoption);
        }
    }
};
Sparrow.prototype.addAllItemToSelect = function (descSelect) {
    var sparrowDescSelect = $(descSelect);
    for (var i = 0; i < srcSelect.options.length; i += 1) {
        var text = srcSelect.options[i].innerHTML;
        var value = srcSelect.options[i].value;
        var newoption = new Option(text, value);
        if (!sparrowDescSelect.existItem(srcSelect.options[i]))
            descSelect.options.add(newoption);
    }
};
Sparrow.prototype.removeItem = function (isSubFirst) {
    if (typeof (srcSelect) === "string") {
        srcSelect = $(srcSelect);
    }
    var hasSelected = false;
    for (var i = this.s.options.length - 1; i >= 0; i -= 1) {
        if (this.s.options[i].selected) {
            this.s.options.remove(i);
            hasSelected = true;
        }
    }
    if (isSubFirst !== false) {
        if (hasSelected === false) {
            this.s.options.remove(0);
        }
    }
};
Sparrow.prototype.removeAll = function () {
    for (var i = this.s.options.length - 1; i >= 0; i -= 1) {
        this.s.options.remove(i);
    }
};
Sparrow.prototype.upDown = function (direction) {
    if (this.s.selectedIndex < 0)
        return;
    if (direction < 0) {
        if (this.s.selectedIndex == 0)
            return;
    } else {
        if (this.s.selectedIndex == this.s.options.length - 1)
            return;
    }
    var srcOption = this.s.options[this.s.selectedIndex];
    var toOption = this.s.options[this.s.selectedIndex + direction];
    var text = srcOption.text;
    var value = srcOption.value;
    srcOption.text = toOption.text;
    srcOption.value = toOption.value;
    toOption.text = text;
    toOption.value = value;
    this.s.selectedIndex += direction;
};
Sparrow.prototype.selectAll = function () {
    for (var i = 0; i < this.s.options.length; i++) {
        this.s.options[i].selected = true;
    }
};
Sparrow.prototype.addJson = function (json, k, v) {
    if (typeof(json) === "string") {
        json = json.json();
    }
    if (json != null && json.length > 0) {
        for (var j in json) {
            this.addItem(json[j][v], json[j][k]);
        }
        return true;
    }
};