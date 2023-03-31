var datePicker = new DatePicker("datePicker");
var nationTree = new iTree("nationTree");
document.ready(function() {
	nationTree.config.floatTreeId = "divNation";
	nationTree.config.descHiddenId = "hdnNationCode";
	nationTree.config.descTextBoxId = "txtNationName";
	nationTree.initCodeToolip('NATION-');
	datePicker.config.srcElement = $("txtBirthday");
	datePicker.init();
	$.user.initLoginBar();
	document.onclick = function() {
		datePicker.hidden();
	};
});