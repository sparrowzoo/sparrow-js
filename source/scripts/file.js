Sparrow.file = {
    // 是否显示上传进度
    showStatus: false,
    // 等待
    wit: null,
    // 客 户端文件名
    clientFileName: null,
    // 上传框架id
    uploadFrameId: null,
    // -1:单个文件上传 (单文件上传不提交)
    // 1:多个文件 （上传完毕后上传下一个文件) 0：多文件上传完毕 （提交表单)
    multiFile: -1,
    // 上传回调函数
    uploadCallBack: function (fileInfo, clientFileName, editor) {
        console.info(fileInfo);
        console.info(clientFileName);
    },
    // 如果图片很小，不会通过getStatus方法，则在回调时主动清除上传状态
    clearStatus: function () {
        if (this.showStatus) {
            document.body.removeChild($('divStatus'));
        }
        window.clearInterval(this.wit);
    },
    // 文件序列号
    fileSerialNumber: null,
    // 文件上传前的验证方法由 input file 的onchange响应
    // file控件的onchange方法
    // file.uploadClick(this,pathKey);
    // upload frame的id与key要保持一致
    validateUploadFile: function (f, key) {
        if (file.checkFileType(file.getFileName(f.value), ["jpg",
            "jpeg", "gif", "png"], "errorImgForumIco")) {
            file.uploadClick(false, "", key);
        }
    },
    // 文件上传成功后的重置方法
    // 因为文件上传完毕之后需要重置上传序列号。所以一定要手动设置该方法
    reset: function () {
        var uploadFrame = $(this.uploadFrameId);
        var tempSrc = uploadFrame.src;
        uploadFrame.src = "about:blank";
        uploadFrame.src = tempSrc;
    },
    // 获取上传的input type="file"控件
    getUploadFile: function () {
        return (this.uploadFrameId ? $(this.uploadFrameId) : $("fileUpload")).contentWindow.document.getElementById("file_upload");
    },
    // 获取文件序列号
    getFileSerialNumber: function () {
        return this.fileSerialNumber;
    },
    setFileSerialNumber: function (serialNumber) {
        this.fileSerialNumber = serialNumber;
    },
    // 获取文件的全路径文件名?
    getFullPath: function (obj) {
        if (obj) {
            if ($.browser.ie) {
                obj.select();
                var txt = document.frames[0].document.selection.createRange().text;
                document.frames[0].document.selection.empty();
                return txt;
            } else if ($.browser.firefox) {
                if (obj.files) {
                    return obj.files.item(0).getAsDataURL();
                }
                return obj.value;
            }
            return obj.value;
        }
    },
    // 获文件扩展名
    getExtension: function (fileName) {
        fileName = $.browser.getUrlWithoutParameter(fileName);
        return fileName.substring(fileName.lastIndexOf("."))
            .toLocaleLowerCase();
    },
    // 获取文件名
    getFileName: function (fileName) {
        fileName = $.browser.getUrlWithoutParameter(fileName);
        if (fileName.indexOf("\\") != -1) {
            return fileName.substring(fileName.lastIndexOf("\\") + 1);
        } else if (fileName.indexOf('/') != -1) {
            return fileName.substring(fileName.lastIndexOf("/") + 1);
        } else {
            return fileName;
        }
    },
    // 验证文件类型
    checkFileType: function (fileName, righty_type, errorCtrl) {
        var fileExtension = this.getExtension(fileName);
        var result = false;
        for (var i = 0; i < righty_type.length; i += 1) {
            if (righty_type[i].toLocaleLowerCase() == fileExtension
                || '.' + righty_type[i].toLocaleLowerCase() == fileExtension) {
                result = true;
                break;
            }
        }
        if (result) {
            if ($(errorCtrl) != null) {
                $(errorCtrl).className = "prompt";
                $(errorCtrl).innerHTML = "";
            }
        } else {
            if ($(errorCtrl) != null) {
                $(errorCtrl).className = "error";
                $(errorCtrl).innerHTML = "!只支持:" + righty_type + "格式";
            }
            $.message("文件格式不正确，只支持以下格式:\n" + righty_type);
        }
        return result;
    },
    // 如果editor为null则表示非编辑器控件
    // 只有回调时oldFileUrl才有意义，如果没有回调方法则此参数可为null
    uploadClick: function (showState, oldFileUrl, uploadingFrameId, editor,
                           srcElement) {
        this.showStatus = showState;
        // 如果显示状态并且状态控件已经显示则说明已经有文件正在上传中...
        if (showState != false && $("divStatus")) {
            $.alert(this.clientFileName + "正在上传中,请稍侯...", "sad");
            return false;
        }
        // 设置正在上传的文件控件ID
        this.uploadFrameId = uploadingFrameId;
        // 如果没有选择上传文件
        if (this.getUploadFile(uploadingFrameId).value == "") {
            var fileInfo = "{fileName:'"
                + (oldFileUrl && oldFileUrl != 'undefined' ? oldFileUrl
                    : "") + "'}";
            // 上传事件回调函数 具体处理方式在uploadCallBack中进行操作
            file.uploadCallBack(fileInfo.json(), "");
            // 自动批量上传不是用事件触发的,所以srcElement可能为null
            if (srcElement)
                $.message("请选择上传文件!", srcElement);
            return false;
        }
        // 客户端文件名
        this.clientFileName = this.getUploadFile().value;
        // 设置上传框架
        var uploadFrame = uploadingFrameId ? $(uploadingFrameId)
            : $("fileUpload");
        // 设置当前文件的序列号
        this.setFileSerialNumber(uploadFrame.contentWindow.document
            .getElementById("fileInfo").value.split('|')[1]);
        // 如果要显示状态
        if (showState != false) {
            // 如果状态控件不存在则创建
            if (!$("divStatus")) {
                var sparrowUploadFrame = $(uploadFrame);
                var divStatus = $("new.div");
                divStatus.s.id = "divStatus";
                divStatus.s.style.cssText = "width:260px;height:100px;position:absolute;color:#ffffff;background:#000000;font-size:10pt;border:#ccc 1px solid;text-align:left;";
                divStatus.s.innerHTML = "服务器正在加载文件信息...";
                document.body.appendChild(divStatus.s);
                divStatus.s.style.top = (sparrowUploadFrame
                        .getAbsoluteTop() - 10)
                    + "px";
                divStatus.s.style.left = (sparrowUploadFrame
                        .getAbsoluteLeft())
                    + "px";
                divStatus.opacity(90);
            }
            // 设置状态跟踪
            if (typeof (editor) == "undefined") {
                // 非编辑器控件
                this.wit = window.setInterval("file.getStatus(" + showState
                    + ")", 1000);
            } else {
                this.wit = window.setInterval("file.getStatus(" + showState
                    + "," + editor.obj + ")", 1000);
            }
        }
        // 提交
        uploadFrame.contentWindow.document.forms[0].submit();
    },
    getStatus: function (showState, editor) {
        // 根据当前文件的序列号,实时获取当前文件的上传状态
        ajax
            .req(
                "GET",
                $.url.root + "/FileUpload?fileSerialNumber="
                + this.getFileSerialNumber() + "&t="
                + Math.random(),
                function (xmlHttpRequest) {
                    if (xmlHttpRequest.responseText) {
                        // 未加载完即获取则继续loading
                        if (xmlHttpRequest.responseText
                            .indexOf("loading") == 0) {
                            return;
                        }
                        var statusJson = xmlHttpRequest.responseText
                            .json();
                        if (!$.isNullOrEmpty(statusJson.uploadingError)) {
                            $.alert(statusJson.uploadingError, "sad");
                            $.file.clearStatus();
                            return;
                        }
                        // 正常显示状态
                        var statusString = [];
                        var status = Math
                                .ceil(parseFloat(statusJson.readedFileLength)
                                    / parseFloat(statusJson.contentLength)
                                    * 1000000)
                            / 10000 + "%";
                        statusString
                            .push("正在上传文件<br/><span class='highlight'>《"
                                + $.file
                                    .getFileName(file.clientFileName)
                                + "》</span><br/>");
                        statusString.push("文件大小:"
                            + statusJson.contentLengthStr
                            + "<br/>");
                        statusString.push("上传大小:"
                            + statusJson.readedFileLengthStr
                            + "<br/>");
                        statusString.push("上传进度:" + status);
                        // 上传完毕
                        if (statusJson.contentLength <= statusJson.readedFileLength) {
                            if ($.file.uploadCallBack) {
                                // 回调上传完毕后要执行的函数
                                $.file
                                    .uploadCallBack(
                                        statusJson,
                                        $.file.clientFileName,
                                        editor);
                            }
                            $.file.clearStatus();
                        }
                    }
                }, "true");
    },
    initCoverImageEvent: function (coverKey) {
        if (!coverKey) coverKey = "Cover";
        $.file.validateUploadFile = function (f, key) {
            if ($.file.checkFileType($.file.getFileName(f.value), ["jpg", "jpeg",
                "gif", "png"], "error" + coverKey)) {
                $.file.uploadCallBack = function (fileInfo, clientFileName) {
                    if (fileInfo.fileName) {
                        var suffix = coverKey;
                        if (typeof(coverKey) == "object") {
                            suffix = coverKey[key];
                        }
                        $("div" + suffix).innerHTML = "<a href='" + fileInfo.fileName + "' target='_blank'><img src='" + fileInfo.fileName
                            + "'/></a>";
                        $("hdn" + suffix).value = fileInfo.fileName;
                        $("error" + suffix).className = "prompt";
                        $("error" + suffix).innerHTML = "";
                    }
                };
                $.file.uploadClick(false, '', key);
            }
        };
    }
};