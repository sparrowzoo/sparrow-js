var dateStartTime = new DatePicker("dateStartTime");
var dateEndTime = new DatePicker("dateEndTime");
var educationStep = new iTree("educationStep");
educationStep.config.floatTreeId = "divEducationStep";
educationStep.config.descHiddenId = "hdnStep";
educationStep.config.descTextBoxId = "txtStepName";
document.ready(function () {
    educationStep.initCodeToolip('EDU-');
    dateStartTime.config.srcElement = $("txtStartTime");
    dateStartTime.init();
    dateEndTime.config.srcElement = $("txtEndTime");
    dateEndTime.init();
});
document.onclick = function () {
    educationStep.clearFloatFrame();
    dateStartTime.hidden();
    dateEndTime.hidden();
};
function ok(option, educationId) {
    win.config.isInFrame = false;
    parent.table.id = "grvEducationList";
    parent.table.tr =
        [
            {
                className: 'dataRow',
                td: [
                    {
                        innerHTML: $("txtSchoolName").value,
                        align: 'center',
                        cssText: 'width:200px;'
                    },
                    {
                        innerHTML: $("txtStepName").value,
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
                        innerHTML: '<input type="button" onclick="editEducation(\'' + educationId + '\',this)"/ value="' +l.command.edit+ '">',
                        align: 'left'
                    },
                    {
                        innerHTML: '<input type="button" onclick="deleteEducation(\'' + educationId + '\',this);" value="' + l.command.del + '"/>',
                        align: 'left'
                    }
                ]
            }
        ];
    win.config.jalert.closeCallBack = function () {
        if (option == "new") {
            parent.table.appendRow("divEducation");
        }
        else {
            parent.table.updateRow(parent.editRowIndex);
        }
        parent.win.closeClick();
    };
    $.alert(option == "new"?l.message.education.new_success:l.message.education.update_success, "smile",l.message.title);
}

