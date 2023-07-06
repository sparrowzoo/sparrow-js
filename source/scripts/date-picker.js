Sparrow.datePicker = function (pickerId) {
    var dateFormat = Object();
    dateFormat["yyyy年MM月dd日"] = new RegExp("^(\\d{4})年(\\d{2})月(\\d{2})日$",
        "ig");
    dateFormat["yyyy-MM-dd"] = new RegExp("^(\\d{4})-(\\d{2})-(\\d{2})$", "ig");
    dateFormat["yyyy年MM月"] = new RegExp("^\\d{4}年\\d{2}月$", "ig");
    dateFormat["yyyy-MM"] = new RegExp("^\\d{4}-\\d{2}$", "ig");
    this.obj = pickerId;
    this.currentDate = new Date();// 上一次验证通过的时间 文本框中则是当前选中的时间
    this.pickerDiv = null;
    this.config = {
        format: dateFormat,
        srcElement: null,
        currentFMT: "yyyy-MM-dd",
        maxDaysOfMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30,
            31],
        weekDay: ['日', '一', '二', '三', '四', '五', '六'],
        month: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月',
            '10月', '11月', '12月'],
        minDate: null,
        allowNull: false
    };
}
// 判断是否为闰年年
Sparrow.datePicker.prototype.isLeapYear = function (year) {
    if (0 === year % 4 && ((year % 100 !== 0) || (year % 400 === 0))) {
        return true;
    }
    return false;
};
// 闰年二月为29天
Sparrow.datePicker.prototype.getMaxDaysOfMonth = function (year, month) {
    if (month === -1) {
        month = 11;
    }
    var maxDaysOfMonth = this.config.maxDaysOfMonth[month];
    if ((month === 1) && this.isLeapYear(year)) {
        maxDaysOfMonth += 1;
    }
    return maxDaysOfMonth;
};
Sparrow.datePicker.prototype.getFormatDate = function (yyyy, MM, dd) {
    if (typeof (MM) == 'undefined' || typeof (dd) == 'undefined') {
        var dateRegExp = this.config.format[this.config.currentFMT];
        // 因为会出现1次错误一次正常情况
        var dateGroup = dateRegExp.exec(this.config.srcElement.value);
        if (dateGroup == null) {
            dateGroup = dateRegExp.exec(this.config.srcElement.value);
        }
        if (dateGroup != null) {
            var cMM = dateGroup[2];
            var cdd = dateGroup[3];

            if (!MM) {
                MM = cMM - 1;
            }
            if (!dd) {
                dd = cdd;
            }
        }
    }
    MM = parseInt(MM, 10);
    dd = parseInt(dd, 10);
    MM = MM + 1;
    if (MM < 10)
        MM = "0" + MM;
    if (dd < 10)
        dd = "0" + dd;
    return this.config.currentFMT.replace("yyyy", yyyy).replace("MM", MM)
        .replace("dd", dd);
};

// 初始化日期
Sparrow.datePicker.prototype.init = function (yyyy, MM, dd) {
    if (!yyyy) {
        var currentDateTime = this.currentDate;
        yyyy = currentDateTime.getFullYear();
        MM = currentDateTime.getMonth();
        dd = currentDateTime.getDate();
    }
    // 第一次加载时 如果yyyy-MM-dd不为空则设置当前时间
    if (!this.pickerDiv) {
        var sparrowElement = $(this.config.srcElement);
        this.currentDate = new Date(yyyy, MM, dd);
        this.pickerDiv = $("+div");
        this.pickerDiv.s.id = this.obj;
        this.pickerDiv.s.style.cssText = "position:absolute;display:none;text-align:center";
        this.pickerDiv.s.style.left = sparrowElement.getAbsoluteLeft() + "px";
        this.pickerDiv.s.style.top = (sparrowElement.getAbsoluteTop()
            + this.config.srcElement.clientHeight) + "px";
        this.pickerDiv.opacity(100);
        document.body.appendChild(this.pickerDiv.s);
        this.pickerDiv.s.onclick = function (e) {
            $.event(e).cancelBubble();
        };
        this.config.srcElement.readOnly = "readonly";
        var events = this.obj
            + ".config.srcElement.onclick=function(e){$.event(e).cancelBubble();"
            + this.obj + ".show();};" + this.obj
            + ".config.srcElement.onchange=function(){" + this.obj
            + ".validate();" + this.obj + ".init();};";

        window.setTimeout(events, 0);
    }

    var maxDaysOfPreMonth = this.getMaxDaysOfMonth(yyyy, MM - 1);
    var maxDaysOfMonth = this.getMaxDaysOfMonth(yyyy, MM);

    var startDayOfMonth = new Date(yyyy, MM, 1).getDay();
    var startDayOfPreMonth = maxDaysOfPreMonth
        - (startDayOfMonth === 0 ? 7 : startDayOfMonth) + 1;
    var datePickerHTML = [];
    datePickerHTML
        .push('<table class="pure-table pure-table-bordered">');
    datePickerHTML.push('<tr>');
    datePickerHTML
        .push('<td><a  href="javascript:void(0);" onclick="{0}.changeMonth(-1)">&lt;<a></td>'
            .format(this.obj));
    datePickerHTML
        .push('<td colspan="3"><a onclick="{0}.initYear({1});" href="javascript:void(0)">{1}</a>年</td>'
            .format(this.obj, yyyy));
    datePickerHTML
        .push('<td colspan="2"><a onclick="{0}.initMonth({2},{3});" href="javascript:void(0);">{1}</a></td>'
            .format(this.obj, this.config.month[MM], yyyy, MM));
    datePickerHTML
        .push('<td><a  href="javascript:void(0);" onclick="{0}.changeMonth(1)">&gt;<a></td>'
            .format(this.obj));
    datePickerHTML.push('</tr>');
    datePickerHTML.push('<tr>');
    for (var i = 0; i < 7; i += 1) {
        datePickerHTML.push('<td>{0}</td>'.format(this.config.weekDay[i]));
    }
    datePickerHTML.push('</tr>');
    var tdIndex = 0;
    datePickerHTML.push('<tr>');
    for (var dayIndexOfPreMonth = startDayOfPreMonth; dayIndexOfPreMonth <= maxDaysOfPreMonth; dayIndexOfPreMonth += 1) {
        datePickerHTML.push('<td><a  style="color:#ccc;">{0}</a></td>'
            .format(dayIndexOfPreMonth));
        tdIndex += 1;
        if (tdIndex % 7 === 0) {
            datePickerHTML.push('</tr>');
            datePickerHTML.push('<tr>');
        }
    }
    for (var dayIndexOfMonth = 1; dayIndexOfMonth <= maxDaysOfMonth; dayIndexOfMonth += 1) {
        datePickerHTML
            .push('<td><a href="javascript:void(0);" onclick="{0}.changeDate({1},{2},{3});">{3}</a></td>'
                .format(this.obj, yyyy, MM, dayIndexOfMonth));
        tdIndex += 1;
        if (tdIndex % 7 === 0) {
            datePickerHTML.push('</tr>');
            datePickerHTML.push('<tr>');
        }
    }
    var daysOfNextMonth = 7 - tdIndex % 7;
    for (var dayIndexOfNextMonth = 1; dayIndexOfNextMonth <= daysOfNextMonth; dayIndexOfNextMonth += 1) {
        datePickerHTML.push('<td><a  style="color:#ccc;">{0}</a></td>'
            .format(dayIndexOfNextMonth));
        tdIndex += 1;
        if (tdIndex % 7 === 0) {
            datePickerHTML.push('</tr>');
            datePickerHTML.push('<tr>');
        }
    }
    datePickerHTML.push('</tr>');
    this.pickerDiv.s.innerHTML = datePickerHTML.join("");
    this.config.srcElement.value = this.getFormatDate(yyyy, MM, dd);
};
Sparrow.datePicker.prototype.show = function () {
    this.pickerDiv.s.style.display = "block";
};
Sparrow.datePicker.prototype.hidden = function () {
    yyyy = this.currentDate.getFullYear();
    MM = this.currentDate.getMonth();
    dd = this.currentDate.getDate();
    if (!this.config.allowNull && this.config.srcElement.value === "") {
        this.config.srcElement.value = this.getFormatDate(yyyy, MM, dd);
    }
    this.pickerDiv.s.style.display = "none";
};
// 初始化 年
Sparrow.datePicker.prototype.initYear = function (yyyy) {
    var startYear = yyyy - yyyy % 10;
    if (startYear < 1900) {
        startYear = 1900;
    }

    var endYear = startYear + 10;
    var datePickerHTML = [];
    datePickerHTML
        .push('<table class="pure-table pure-table-bordered">');
    datePickerHTML.push('<tr>');
    datePickerHTML
        .push('<td><a href="javascript:void(0);" onclick="{0}.initYear({1})">&lt;<a></td>'
            .format(this.obj, yyyy - 10));
    datePickerHTML.push('<td colspan="2">{0}-{1}</td>'.format(startYear,
        endYear - 1));
    datePickerHTML
        .push('<td><a href="javascript:void(0);" onclick="{0}.initYear({1})">&gt;<a></td>'
            .format(this.obj, yyyy < 1900 ? 1910 : yyyy + 10));
    datePickerHTML.push('</tr>');
    datePickerHTML.push('<tr>');
    var index = 0;
    for (var i = startYear - 1; i < endYear; i += 1) {
        if (i === startYear - 1 || i === endYear) {
            datePickerHTML.push('<td style="color:#ccc">{0}</td>'.format(i));
        } else {
            datePickerHTML
                .push('<td><a href="javascript:void(0);" onclick="{0}.initMonth({1})">{1}</a></td>'
                    .format(this.obj, i));
        }
        index++;
        if (index % 4 === 0) {
            datePickerHTML.push("</tr><tr>");
        }
    }
    datePickerHTML.push('<td style="color:#ccc">{0}</td>'.format(endYear));
    datePickerHTML.push('</tr>');
    datePickerHTML.push('</table>');
    this.pickerDiv.s.innerHTML = datePickerHTML.join("");
};
// 初始化月
Sparrow.datePicker.prototype.initMonth = function (yyyy, MM) {
    if (!MM) {
        MM = this.getCurrentDate().getMonth();
    }
    var datePickerHTML = [];
    datePickerHTML
        .push('<table  class="pure-table pure-table-bordered">');
    datePickerHTML.push('<tr>');
    datePickerHTML
        .push('<td><a href="javascript:void(0);" onclick="{0}.initMonth({1},{2})">&lt;<a></td>'
            .format(this.obj, yyyy - 1, MM));
    datePickerHTML
        .push('<td style="text-align:center;" colspan="2"><a href="javascript:void(0);" onclick="{0}.initYear({1})">{1}</a></td>'
            .format(this.obj, yyyy));
    datePickerHTML
        .push('<td><a href="javascript:void(0);" onclick="{0}.initMonth({1},{2})">&gt;<a></td>'
            .format(this.obj, yyyy + 1, MM));
    datePickerHTML.push('</tr>');
    datePickerHTML.push('<tr>');
    var index = 0;
    for (var i = 0; i < 12; i += 1) {
        datePickerHTML
            .push('<td><a href="javascript:void(0);" onclick="{0}.init({1},{2},{3})">{4}</a></td>'
                .format(this.obj, yyyy, i, this.currentDate.getDate(),
                    this.config.month[i]));
        index++;
        if (index % 4 === 0) {
            datePickerHTML.push("</tr><tr>");
        }
    }
    datePickerHTML.push('</tr>');
    datePickerHTML.push('</table>');
    this.pickerDiv.s.innerHTML = datePickerHTML.join("");
    this.config.srcElement.value = this.getFormatDate(yyyy, MM);
};
Sparrow.datePicker.prototype.changeMonth = function (direction) {
    var d = this.getCurrentDate();
    var currentMonth = parseInt(d.getMonth(), 10) + direction;
    var currentYear = parseInt(d.getFullYear(), 10);
    var currentDay = parseInt(d.getDate(), 10);
    if (direction === 1 && currentMonth === 12) {
        currentMonth = 0;
        currentYear = currentYear + 1;
    } else if (direction === -1 && currentMonth === -1) {
        currentMonth = 11;
        currentYear = currentYear - 1;
    }
    this.config.srcElement.value = this.getFormatDate(currentYear, currentMonth, currentDay);
    this.init(currentYear, currentMonth, currentDay);
};
Sparrow.datePicker.prototype.changeDate = function (yyyy, MM, dd) {
    this.config.srcElement.value = this.getFormatDate(yyyy, MM, dd);
    if (this.validate(yyyy, MM, dd)) {
        this.currentDate = new Date(yyyy, MM, dd);
    }
    this.hidden();
};
Sparrow.datePicker.prototype.userValidate = null;

Sparrow.datePicker.prototype.getCurrentDate = function () {
    var dateRegExp = this.config.format[this.config.currentFMT];
    // 因为会出现1次错误一次正常情况
    var dateGroup = dateRegExp.exec(this.config.srcElement.value);
    if (dateGroup == null) {
        dateGroup = dateRegExp.exec(this.config.srcElement.value);
    }
    return new Date(dateGroup[1], parseInt(dateGroup[2], 10) - 1, dateGroup[3]);
};

Sparrow.datePicker.prototype.validate = function (yyyy, MM, dd) {
    var result = true;
    var selectedDate = null;

    if (this.config.srcElement.value.trim() === "") {
        if (this.config.allowNull) {
            return true;
        }
        return false;
    }

    if (this.config.srcElement.value
        .search(this.config.format[this.config.currentFMT]) === -1) {
        $.message("请按【" + this.config.currentFMT + "】格式输入", this.config.srcElement);
        return false;
    }

    if (!yyyy) {
        var date = this.getCurrentDate();
        yyyy = date.getFullYear();
        MM = date.getMonth();
        dd = date.getDate();
    }

    if (yyyy < 1900 || yyyy > 2099) {
        $.m.show("年份超出范围！\n正确年份范围1900-2099", this.config.srcElement);
        return false;
    }
    if (MM < 0 || MM > 12) {
        $.m.show("月份超出范围!", this.config.srcElement);
        return false;
    }
    if (dd < 0
        || dd > this.getMaxDaysOfMonth(yyyy, MM)) {
        $.m.show("日期范围超出!", this.config.srcElement);
        return false;
    }
    selectedDate = new Date(yyyy, MM, dd);
    if (this.config.minDate != null) {
        var minDate = new Date(this.config.minDate.getFullYear(),
            this.config.minDate.getMonth(), this.config.minDate
                .getDate());
        if (selectedDate < minDate) {
            m.show("不允许小于"
                + this.getFormatDate(minDate.getFullYear(), minDate
                    .getMonth(), minDate.getDate()), this.config.srcElement);
            return false;
        }
    }
    if (this.userValidate) {
        if (!this.userValidate()) {
            return false;
        }
    }
    this.currentDate = selectedDate;
    return result;
};