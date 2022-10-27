var dateStartTime = new DatePicker("dateStartTime");
var dateEndTime = new DatePicker("dateEndTime");
document.ready(function () {
    dateStartTime.config.srcElement = $("txtStartTime");
    dateStartTime.init();
    dateEndTime.config.srcElement = $("txtEndTime");
    dateEndTime.init();
});
document.onclick = function () {
    dateStartTime.hidden();
    dateEndTime.hidden();
};

function ok(option, workId) {
    win.config.isInFrame = false;
    parent.table.id = "grvWorkList";
    parent.table.tr = [
        {
            className: 'dataRow',
            td: [
                {
                    innerHTML: $("txtUnitName").value,
                    align: 'center',
                    cssText: 'width:200px'
                },
                {
                    innerHTML: $("txtWorkPlace").value,
                    align: 'center',
                    cssText: 'width:160px;'
                },
                {
                    innerHTML: $("txtStartTime").value,
                    align: 'center',
                    cssText: 'width:100px;'
                },
                {
                    innerHTML: $("txtEndTime").value,
                    align: 'center',
                    cssText: 'width:100px;'
                },
                {
                    innerHTML: '<input type="button" onclick="editWork(\''
                    + workId
                    + '\',this)"/ value="'
                    + l.command.edit+ '">',
                    align: 'left'
                },
                {
                    innerHTML: '<input type="button" onclick="deleteWork(\''
                    + workId
                    + '\',this);" value="'
                    + l.command.del + '"/>',
                    align: 'left'
                }]
        }];
    win.config.jalert.closeCallBack = function () {
        if (option == "new") {
            parent.table.appendRow("divWork");
        } else {
            parent.table.updateRow(parent.editRowIndex);
        }
        parent.win.closeClick();
    };
    win.config.showHead = true;
    $.alert(option == "new" ? l.message.work.new_success :l.message.work.update_success, "smile",l.message.title);
}

