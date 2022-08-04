//document.domain=$.browser.cookie.root_domain; 解决跨域
Sparrow.file = {
    // 是否显示上传进度
    isShowProgress: false,
    // 等待
    wit: null,
    // 客户端文件名
    clientFileName: null,
    // 上传框架id editorId.path-key 非editor id为null e.g null.forum 表示path-key为forum 的无editor 上传组件
    uploadFrameId: null,
    // 上传回调函数
    uploadCallBack: function (fileInfo, editor, size) {
        console.info(fileInfo);
        console.info(size);
        this.clearStatus();
    },
    // 如果图片很小，不会通过getStatus方法，则在回调时主动清除上传状态
    clearStatus: function () {
        var divStatus = $('divStatus');
        if (this.isShowProgress && divStatus != null) {
            document.body.removeChild(divStatus);
        }
        window.clearInterval(this.wit);
    },
    // 文件序列号
    fileSerialNumber: null,
    // 文件上传前的验证方法由 input file 的onchange响应
    // file控件的onchange方法
    // file.uploadDelegate(this,pathKey);
    // upload frame的id与editorId_pathKey要保持一致
    // path key 对应后台配置的上传策略
    validateUploadFile: function (f, key, editor) {
        if ($.file.checkFileType($.file.getFileName(f.value), ["jpg",
            "jpeg", "gif", "png"], "errorImgForumIco")) {
            $.file.uploadDelegate(key, editor);
        }
    },
    callbackValidate: function (uploadProgress) {
        if ($.isNullOrEmpty(uploadProgress.error)) {
            return true;
        }
        $.alert(uploadProgress.error, "sad");
        $.file.clearStatus();
        return false;
    },
    // 文件上传成功后的重置方法
    // 因为文件上传完毕之后需要重置上传序列号。所以一定要手动设置该方法
    reset: function () {
        var uploadFrame = $(this.uploadFrameId);
        var tempSrc = uploadFrame.src;
        uploadFrame.src = "about:blank";
        uploadFrame.src = tempSrc;
    },
    getUploadFrame: function () {
        return this.uploadFrameId ? $(this.uploadFrameId) : $("fileUpload");
    },
    // 获取上传的input type="file"控件
    getUploadFile: function (frame) {
        if (!frame) {
            frame = this.getUploadFrame();
        }
        return frame.contentWindow.document.getElementById("file_upload");
    },
    getUploadFileInfo: function (frame) {
        if (!frame) {
            frame = this.getUploadFrame();
        }
        return frame.contentWindow.document.getElementById("fileInfo");
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
        if (!obj) {
            return ""
        }
        if ($.browser.ie) {
            obj.select();
            var txt = document.frames[0].document.selection.createRange().text;
            document.frames[0].document.selection.empty();
            return txt;
        }
        if ($.browser.firefox) {
            if (obj.files) {
                return obj.files.item(0).getAsDataURL();
            }
            return obj.value;
        }
        return obj.value;
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
        if (fileName.indexOf("\\") !== -1) {
            return fileName.substring(fileName.lastIndexOf("\\") + 1);
        }
        if (fileName.indexOf('/') !== -1) {
            return fileName.substring(fileName.lastIndexOf("/") + 1);
        }
        return fileName;
    },
    // 验证文件类型
    checkFileType: function (fileName, rightExtension, errorCtrl) {
        //这里封装跨域可以复用，因为
        var fileExtension = this.getExtension(fileName);
        var result = false;
        for (var i = 0; i < rightExtension.length; i += 1) {
            if (rightExtension[i].toLocaleLowerCase() === fileExtension
                || '.' + rightExtension[i].toLocaleLowerCase() === fileExtension) {
                result = true;
                break;
            }
        }

        if (result) {
            $.v.ok(errorCtrl)
            return result;
        }
        var errorLabel = $("#" + errorCtrl);
        if (errorLabel != null && errorLabel.source() != null) {
            errorLabel.class("error");
            errorLabel.html("!只支持:" + rightExtension + "格式");
        }
        $.message("文件格式不正确，只支持以下格式:\n" + rightExtension);
        return result;
    },
    // 如果editor为null则表示非编辑器控件
    uploadDelegate: function(key, editor,
                              srcElement) {
        // 如果显示状态并且状态控件已经显示则说明已经有文件正在上传中...
        if (this.isShowProgress !== false && $("divStatus")) {
            $.alert(this.clientFileName + "正在上传中,请稍侯...", "sad");
            return false;
        }
        this.uploadFrameId = (editor ? editor.obj : "null") + "." + key;
        var uploadFrame = this.getUploadFrame();
        // 客户端文件名
        this.clientFileName = this.getUploadFile(uploadFrame).value;
        // 如果没有选择上传文件
        if (this.clientFileName === "") {
            $.message("请选择上传文件!", srcElement);
            return false;
        }

        var fileInfo = this.getUploadFileInfo(uploadFrame).value;
        var fileInfoArray = fileInfo.split(".");
        // 设置当前文件的序列号
        this.setFileSerialNumber(fileInfoArray[2]);
        // 如果要显示状态
        if ($.file.isShowProgress !== false) {
            // 如果状态控件不存在则创建
            if (!$("divStatus")) {
                var sparrowUploadFrame = $(uploadFrame);
                var divStatus = $("+div");
                divStatus.s.id = "divStatus";
                divStatus.s.style.cssText = "width:260px;height:100px;position:absolute;color:#ffffff;background:#000000;font-size:10pt;border:#ccc 1px solid;text-align:left;";
                divStatus.html("服务器正在加载文件信息...");
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
            if (typeof (editor) === "undefined" || editor === null) {
                // 非编辑器控件
                this.wit = window.setInterval("$.file.getStatus()", 1000);
            } else {
                this.wit = window.setInterval("$.file.getStatus()", 1000);
            }
        }
        // 提交
        uploadFrame.contentWindow.document.forms[0].submit();
    },
    //只负责显示进度
    progressCallback: function (uploadProgress) {
        if (uploadProgress == null) {
            return;
        }
        if (uploadProgress.status === "loading") {
            return;
        }

        if (!this.callbackValidate(uploadProgress)) {
            return;
        }
        // 正常显示状态
        var statusString = [];
        var status = Math
                .ceil(parseFloat(uploadProgress.readLength)
                    / parseFloat(uploadProgress.contentLength)
                    * 1000000)
            / 10000 + "%";


        statusString
            .push("正在上传文件<br/><span class='highlight'>《"
                + $.file
                    .getFileName($.file.clientFileName)
                + "》</span><br/>");
        statusString.push("文件大小:"
            + uploadProgress.humanReadableContentLength
            + "<br/>");
        statusString.push("上传大小:"
            + uploadProgress.humanReadableReadLength
            + "<br/>");
        statusString.push("上传进度:" + status);
        $("#divStatus", false).html(statusString.toString());
        if (status === "100%") {
            window.setTimeout(function () {
                $.file.clearStatus();
            }, 1000);
        }
    },
    getStatus: function () {
        // 根据当前文件的序列号,实时获取当前文件的上传状态
        $("jsonp", $.url.upload + "/file-upload?file-serial-number="
            + this.getFileSerialNumber() + "&t="
            + Math.random() + "&callback=progressCallback", "uploadProgress");
    },
    /**
     *
     * @param upload_path upload.sparrowzoo.com
     * @param key path-key
     * @param pathKeySuffixPair {path-key:suffix}
     */
    initImageUploadEvent: function (upload_path, key, pathKeySuffixPair) {
        var fileFrame = $("null." + key);
        if (fileFrame == null) {
            return;
        }
        document.domain = $.browser.cookie.root_domain;
        if (!pathKeySuffixPair) pathKeySuffixPair = "Cover";
        fileFrame.src = upload_path + "/file-upload?path-key=" + key;
        //第一次加载初始化
        $.file.uploadCallBack = function (fileInfo, editor, size) {
            console.info(size);
        };
        $.file.validateUploadFile = function (f, key, editor) {
            var suffix = pathKeySuffixPair;
            if (typeof (pathKeySuffixPair) === "object") {
                suffix = pathKeySuffixPair[key];
            }
            if (!$.file.checkFileType($.file.getFileName(f.value), ["jpg", "jpeg",
                "gif", "png"], "error" + suffix)) {
                return;
            }
            $.file.uploadCallBack = function (uploadingProgress) {
                $.file.clearStatus();
                if (!uploadingProgress.fileUrl) {
                    return;
                }

                $("#div" + suffix).html("<a href='" + uploadingProgress.fileUrl + "' target='_blank'><img src='" + uploadingProgress.fileUrl
                    + "'/></a>");
                $("#hdn" + suffix).value(uploadingProgress.fileUrl);
                $("#error" + suffix).class("prompt");
                $("#error" + suffix).html("");
            };
            $.file.uploadDelegate(key, editor);
        };
    }
};