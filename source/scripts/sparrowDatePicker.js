function DatePicker(pickerId) {
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
		format : dateFormat,
		srcElement : null,
		currentFMT : "yyyy-MM-dd",
		maxDaysOfMonth :[31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30,
				31],
		weekDay : ['日', '一', '二', '三', '四', '五', '六'],
		month :['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月',
				'10月', '11月', '12月'],
		minDate : null,
		allowNull : false
	};
}
// 判断是否为闰年年
DatePicker.prototype.isLeapYear = function(year) {
	if (0 == year % 4 && ((year % 100 !== 0) || (year % 400 === 0))) {
		return true;
	} else {
		return false;
	}
};
// 闰年二月为29天
DatePicker.prototype.getMaxDaysOfMonth = function(year, month) {
	if (month === -1) {
		month = 11;
	}
	var maxDaysOfMonth = this.config.maxDaysOfMonth[month];
	if ((month == 1) && this.isLeapYear(year)) {
		maxDaysOfMonth += 1;
	}
	return maxDaysOfMonth;
};
DatePicker.prototype.getFormatDate = function(yyyy, MM, dd) {
	if (typeof(MM)=='undefined'||typeof(dd)=='undefined') {
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
				MM = cMM;
			}
			if (!dd) {
				dd = cdd;
			}
		}
	}
	MM = parseInt(MM,10);
	dd = parseInt(dd,10);
	MM = MM + 1;
	if (MM < 10)
		MM = "0" + MM;
	if (dd < 10)
		dd = "0" + dd;
	return this.config.currentFMT.replace("yyyy", yyyy).replace("MM", MM)
			.replace("dd", dd);
};

// 初始化日期
DatePicker.prototype.init = function(yyyy, MM, dd) {
	if (!yyyy) {
		var currentDateTime = this.currentDate;
		yyyy = currentDateTime.getFullYear();
		MM = currentDateTime.getMonth();
		dd = currentDateTime.getDate();
	}
	// 第一次加载时 如果yyyy-MM-dd不为空则设置当前时间
	if (!this.pickerDiv) {
		var sparrowElement=$(this.config.srcElement);
		this.currentDate = new Date(yyyy, MM, dd);
		this.pickerDiv = $("new.div");
		this.pickerDiv.s.id = this.obj;
		this.pickerDiv.s.style.cssText = "position:absolute;width:180px;height:190px;border:#ccc 1px solid;background:#ffffff;display:none;text-align:center";
		this.pickerDiv.s.style.left =sparrowElement.getAbsoluteLeft()+"px";
		this.pickerDiv.s.style.top =(sparrowElement.getAbsoluteTop()
				+ this.config.srcElement.clientHeight)+"px";
		this.pickerDiv.opacity(100);
		document.body.appendChild(this.pickerDiv.s);
		this.pickerDiv.s.onclick = function(e) {
			$.event(e).cancelBubble();
		};
		this.config.srcElement.readOnly="readonly";
		var events =this.obj
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
	var datePickerHTML =[];
	datePickerHTML
			.push('<table style="width:182px;height:182px;border:#fff 1px solid;">');
	datePickerHTML.push('<tr>');
	datePickerHTML
			.push('<td><a  href="javascript:void(0);" onclick="{0}.changeMonth(-1)">&lt;<a></td>'
					.format(this.obj));
	datePickerHTML
			.push('<td colspan="3"><a onclick="{0}.initYear({1});" href="javascript:void(0)">{1}</a>年</td>'
					.format(this.obj, yyyy));
	datePickerHTML
			.push('<td colspan="2"><a onclick="{0}.initMonth({2});" href="javascript:void(0);">{1}</a></td>'
					.format(this.obj, this.config.month[MM], yyyy));
	datePickerHTML
			.push('<td><a  href="javascript:void(0);" onclick="{0}.changeMonth(1)">&gt;<a></td>'
					.format(this.obj));
	datePickerHTML.push('</tr>');
	datePickerHTML.push('<tr>');
	for ( var i = 0; i < 7; i += 1) {
		datePickerHTML.push('<td>{0}</td>'.format(this.config.weekDay[i]));
	}
	datePickerHTML.push('</tr>');
	var tdIndex = 0;
	datePickerHTML.push('<tr>');
	for ( var dayIndexOfPreMonth = startDayOfPreMonth; dayIndexOfPreMonth <= maxDaysOfPreMonth; dayIndexOfPreMonth += 1) {
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
	for ( var dayIndexOfNextMonth = 1; dayIndexOfNextMonth <= daysOfNextMonth; dayIndexOfNextMonth += 1) {
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
	if (!this.config.allowNull&&this.config.srcElement.value == "") {
		this.config.srcElement.value = this.getFormatDate(yyyy, MM, dd);
	}
};
DatePicker.prototype.show = function() {
	this.pickerDiv.s.style.display = "block";
};
DatePicker.prototype.hidden = function() {
	yyyy = this.currentDate.getFullYear();
	MM = this.currentDate.getMonth();
	dd = this.currentDate.getDate();
	if (!this.config.allowNull&&this.config.srcElement.value == "") {
		this.config.srcElement.value = this.getFormatDate(yyyy, MM, dd);
	}
	this.pickerDiv.s.style.display = "none";
};
// 初始化 年
DatePicker.prototype.initYear = function(yyyy) {
	var startYear = yyyy - yyyy % 10;
	if (startYear < 1900)
		startYear = 1900;
	var endYear = startYear + 10;
	var datePickerHTML =[];
	datePickerHTML
			.push('<table style="width:182px;height:182px;border:#fff 1px solid;">');
	datePickerHTML.push('<tr>');
	datePickerHTML
			.push('<td><a href="javascript:void(0);" onclick="{0}.initYear({1})">&lt;<a></td>'
					.format(this.obj, yyyy - 10));
	datePickerHTML.push('<td colspan="2">{0}-{1}</td>'.format(startYear,
			endYear - 1));
	datePickerHTML
			.push('<td><a href="javascript:void(0);" onclick="{0}.initYear({1})">&gt;<a></td>'
					.format(this.obj, yyyy + 10));
	datePickerHTML.push('</tr>');
	datePickerHTML.push('<tr>');
	var index = 0;
	for ( var i = startYear - 1; i < endYear; i += 1) {
		if (i == startYear - 1 || i == endYear) {
			datePickerHTML.push('<td style="color:#ccc">{0}</td>'.format(i));
		} else {
			datePickerHTML
					.push('<td><a href="javascript:void(0);" onclick="{0}.initMonth({1})">{1}</a></td>'
							.format(this.obj, i));
		}
		index++;
		if (index % 4 == 0) {
			datePickerHTML.push("</tr><tr>");
		}
	}
	datePickerHTML.push('<td style="color:#ccc">{0}</td>'.format(endYear));
	datePickerHTML.push('</tr>');
	datePickerHTML.push('</table>');
	this.pickerDiv.s.innerHTML = datePickerHTML.join("");
};
// 初始化月
DatePicker.prototype.initMonth = function(yyyy) {
	var datePickerHTML =[];
	datePickerHTML
			.push('<table style="width:182px;height:182px;border:#fff 1px solid;">');
	datePickerHTML.push('<tr>');
	datePickerHTML
			.push('<td><a href="javascript:void(0);" onclick="{0}.initMonth({1})">&lt;<a></td>'
					.format(this.obj, yyyy - 1));
	datePickerHTML
			.push('<td style="text-align:center;" colspan="2"><a href="javascript:void(0);" onclick="{0}.initYear({1})">{1}</a></td>'
					.format(this.obj, yyyy));
	datePickerHTML
			.push('<td><a href="javascript:void(0);" onclick="{0}.initMonth({1})">&gt;<a></td>'
					.format(this.obj, yyyy + 1));
	datePickerHTML.push('</tr>');
	datePickerHTML.push('<tr>');
	var index = 0;
	for ( var i = 0; i < 12; i += 1) {
		datePickerHTML
				.push('<td><a href="javascript:void(0);" onclick="{0}.init({1},{2},{3})">{4}</a></td>'
						.format(this.obj, yyyy, i, this.currentDate.getDate(),
								this.config.month[i]));
		index++;
		if (index % 4 == 0) {
			datePickerHTML.push("</tr><tr>");
		}
	}
	datePickerHTML.push('</tr>');
	datePickerHTML.push('</table>');
	this.pickerDiv.s.innerHTML = datePickerHTML.join("");
	this.config.srcElement.value = this.getFormatDate(yyyy);
};
DatePicker.prototype.changeMonth = function(direction) {
	var d=this.config.srcElement.value.split('-');
	var currentMonth =parseInt(d[1],10)+direction-1;
	var currentYear =parseInt(d[0],10);
	var currentDay = parseInt(d[2],10);
	if (direction == 1 && currentMonth == 12) {
		currentMonth = 0;
		currentYear = currentYear + 1;
	} else if (direction == -1 && currentMonth == -1) {
		currentMonth = 11;
		currentYear = currentYear - 1;
	}
	this.init(currentYear, currentMonth, currentDay);
};
DatePicker.prototype.changeDate = function(yyyy, MM, dd) {
	this.config.srcElement.value = this.getFormatDate(yyyy, MM, dd);
	if (this.validate(yyyy, MM, dd)) {
		this.currentDate = new Date(yyyy, MM, dd);
	}
	this.hidden();
};
DatePicker.prototype.userValidate = null;
DatePicker.prototype.validate = function(yyyy, MM, dd) {
	var result = true;
	var selectedDate = null;
	if (this.config.srcElement.value
			.search(this.config.format[this.config.currentFMT]) == -1) {
		if (this.config.srcElement.value.trim() === "") {
			if (this.config.allowNull) {
				return true;
			}
		}
		$.message("请按【" + this.config.currentFMT + "】格式输入",this.config.srcElement);
		result = false;
	} else {
		if (!yyyy) {
			var dateRegExp = this.config.format[this.config.currentFMT];
			// 因为会出现1次错误一次正常情况
			var dateGroup = dateRegExp.exec(this.config.srcElement.value);
			if (dateGroup == null) {
				dateGroup = dateRegExp.exec(this.config.srcElement.value);
			}

			yyyy = dateGroup[1];
			MM = parseInt(dateGroup[2],10) - 1;
			dd = dateGroup[3];
		}

		if (yyyy < 1900 || yyyy > 2099) {
			m.show("年份超出范围！\n正确年份范围1900-2099",this.config.srcElement);
			result = false;
		} else if (MM < 0 || MM > 12) {
			m.show("月份超出范围!",this.config.srcElement);
			result = false;
		} else if (dd < 0
				|| dd > this.getMaxDaysOfMonth(parseInt(yyyy,10), parseInt(MM,10))) {
			m.show("日期范围超出!",this.config.srcElement);
			result = false;
		} else {
			selectedDate = new Date(yyyy, MM, dd);
			if (this.config.minDate != null) {
				var minDate = new Date(this.config.minDate.getFullYear(),
						this.config.minDate.getMonth(), this.config.minDate
								.getDate());
				if (selectedDate < minDate) {
					m.show("不允许小于"
							+ this.getFormatDate(minDate.getFullYear(), minDate
									.getMonth(), minDate.getDate()),this.config.srcElement);
					result = false;
				}
			}
			if (this.userValidate) {
				if (!this.userValidate()) {
					result = false;
				}
			}
		}
	}
	if (result == true) {
		this.currentDate = selectedDate;
	}
	return result;
};