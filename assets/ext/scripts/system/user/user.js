v.background_color = false;
var datePicker = new DatePicker("datePicker");
var nationTree = new iTree("nationTree");
nationTree.config.floatTreeId = "divNation";
nationTree.config.descHiddenId = "hdnNationCode";
nationTree.config.descTextBoxId = "txtNationName";
document.ready(function () {
    datePicker.config.srcElement = $("txtBirthday");
    datePicker.init();
    nationTree.initCodeToolip('NATION-');
});
document.onclick = function () {
    nationTree.clearFloatFrame();
    datePicker.hidden();
};

function deleteEducation(educationId, srcElement) {
    if (window.confirm(l.message.education.delete_confirm)) {
        ajax.req("POST", $.url.root + "/user/education/delete.do", function (xmlHttpRequest) {
            $.message(l.message.education.delete_success);
            table.id = "grvEducationList";
            table.initCtrlId = "divEducation";
            table.removeRow(srcElement.parentNode.parentNode.rowIndex);
        }, true, "educationId=" + educationId);
    }
}

function deleteWork(workId, srcElement) {
    if (window.confirm(l.message.work.delete_confirm)) {
        ajax.req("POST", $.url.root + "/system/user/work/delete.do", function (xmlHttpRequest) {
            table.id = "grvWorkList";
            table.initCtrlId = "divWork";
            table.removeRow(srcElement.parentNode.parentNode.rowIndex);
            $.message(l.message.work.delete_success);
        }, true, "workId=" + workId);
    }
}