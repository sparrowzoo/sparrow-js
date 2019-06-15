var editorArray = [];
// 构造函数 objName:对象ID与对象同名；
function SparrowEditor(objName) {
    // 编辑器的对象名称与var SparrowEditor=new SparrowEditor("SparrowEditor");一致.
    this.obj = objName;
    // 编辑器的iframe框架对象
    this.frame = null;
    // config配置
    this.config = {
        cover_key: "Cover",
        // 编辑器显示的样式 由config.tool.style.simple等进行配置
        style: null,
        //是否展示flash缩畧图
        flash_thumbnail: true,
        // iframe的ID
        iframeId: null,
        // 编辑器就对应的标题控件ID
        titleCtrlId: "txtTitle",
        // 要上传的编辑器内容控件ID
        contentCtrlId: "hdnContent",
        // 文字长度
        wordCount: "spanWordCount",
        // 提交按钮ID
        submitButtonId: "btnSubmit",
        // 打开下拉框时的window.setInterval对象
        interval: null,
        // 当前正在下拉的工具条边框ID
        currentHtmlId: null,
        // 创建的临时控件属性值
        tempNodeAttribute: "i_temp_attribute",
        // 编辑器容器 编辑器所要显示的位置，由父控件进行定位
        container: {
            // 父控件ID
            id: null,
            // 编辑器（包括工具条在内的）最大允许宽度
            maxWidth: 900,
            // 编辑器（包括工具条在内的）最小允许宽度
            minWidth: 700
        },
        // 附件功能
        attach: {
            // 上传附件的关键字
            key: "thread",
            // 加载已经上传的附件的json格式列表
            uploadedJson: "",
            // 上传 图片的容器id
            uploadImgContainerId: objName + "_uploadImgContainer",

            localUploadImgTabId: objName + "_localUploadImgTab",
            // 新建上传控件索引
            index: 1,
            // 已经上传的索引
            uploadedIndex: 0,
            // 设置currentUUID则默认执行对应的update.do事件
            currentUUID: null,
            // 事件url默认会根据currentUUID判断
            actionUrl: null,
            // 文件UUID 的控件name 通过tableID.getElementsByName获取
            fileUUID: objName + "_fileUUID",
            // 上传框架 name(上传iframe的id有用立即上传时会使用，保留不必删除)
            iframeName: objName + "_fileUpload",
            // 上传框架ID 创建时生成ID，{0}用format(index)替换
            iframeId: objName + "_fileUpload_{0}",
            // 文件备注的 控件name
            fileRemark: objName + "_fileRemark",
            // 保存附件信息的隐藏控件id post到服务器端之后经过解析后入库保存需要手动在页面上配置
            fileInfoId: objName + "_fileInfo",
            // 编辑附件列表的table ID
            tableId: objName + "_tabAttach",
            // 文章编辑完成，准备要提交的form表单索引
            formIndex: 0,
            // 是否显示图片信息
            showImageInfo: true,
            // 待上传的控件ID数组
            uploadingFileId: [],
            // 最大允许上传文件数
            maxAllowCount: 5
        },
        tool: {
            // 工具条ID
            id: objName + "_HtmlEditorToolBar",
            // 工具条高度
            height: 40,
            // 工具条的位置
            position: "top",
            // 工具栏图标
            icon: {
                // icon背景颜色
                backGroundColor: null,
                // 图标容器ID
                containerId: objName + "_tdEditorToolBar",
                // 编辑器工具栏的icon图标所在路径
                path: $.url.resource + "/images/sparrowEditor/"
            },
            // HTML与所见即所得界面切换配置
            convertHTML: {
                // 是否显示(允许)转换HTML
                isConvert: true,
                // 转换HTML按钮所在的td 的ID
                ctrlId: objName + "_tdConvertHTMLID",
                // 转换HTML按钮的宽度
                ctrlWidth: 50
            },
            // 宽高调节
            adjust: {
                // 宽高是否可调节
                adjustable: false,
                // 调节控件宽度
                width: 120
            },
            style: {
                simple: [2, 3, 4, 13, 14, 15, 16, 21, 22, 23],
                comment: [21, 23, 22],
                list: [21, 22, 23]
            },

            toolBar: [
                /* 1 */{
                    left: -394,
                    top: -8,
                    width: 84,
                    height: 24,
                    title: "字号",
                    cmd: "fontsize",
                    htmlFrameId: "font_size",
                    htmlheight: 315,
                    htmlwidth: 170
                },
                /* 2 */{
                    left: -310,
                    top: -8,
                    width: 82,
                    height: 24,
                    title: "字体",
                    cmd: "fontname",
                    htmlFrameId: "font_family",
                    htmlheight: 360,
                    htmlwidth: 130
                },
                /* 3 */{
                    left: 2,
                    top: -8,
                    width: 26,
                    height: 24,
                    title: "加粗",
                    cmd: "bold"
                },
                /* 4 */{
                    left: -28,
                    top: -7,
                    width: 26,
                    height: 24,
                    title: "斜体",
                    cmd: "italic"
                },
                /* 5 */{
                    left: -56,
                    top: -8,
                    width: 26,
                    height: 24,
                    title: "下划线",
                    cmd: "underline"
                },
                /* 6 */{
                    left: -82,
                    top: -8,
                    width: 26,
                    height: 24,
                    title: "文字颜色",
                    cmd: "forecolor",
                    htmlFrameId: "FColor",
                    htmlheight: 308,
                    htmlwidth: 364
                },
                /* 7 */{
                    left: -114,
                    top: -8,
                    width: 26,
                    height: 24,
                    title: "背景颜色",
                    cmd: "BackColor",
                    firefoxcmd: "hilitecolor",
                    htmlFrameId: "HColor",
                    htmlheight: 308,
                    htmlwidth: 364
                },
                /* 8 */{
                    split: '<img src="{0}icoBack.gif" style="background:url({0}ico.gif) -940px -8px;width:8px;height:24px;"/>'
                },
                /* 9 */{
                    left: -144,
                    top: -8,
                    width: 26,
                    height: 22,
                    title: "左对齐",
                    cmd: "justifyleft"
                },
                /* 10 */{
                    left: -168,
                    top: -8,
                    width: 26,
                    height: 22,
                    title: "居中对齐",
                    cmd: "justifycenter"
                },
                /* 11 */{
                    left: -190,
                    top: -8,
                    width: 26,
                    height: 22,
                    title: "右对齐",
                    cmd: "justifyright"
                },
                /* 12 */{
                    left: -610,
                    top: -8,
                    width: 92,
                    height: 22,
                    title: "自动对齐",
                    cmd: "justifyfull"
                },
                /* 13 */{
                    split: '<img alt="" src="{0}icoBack.gif" style="background:url({0}ico.gif)-940px -8px;width:8px;height:24px;"/>'
                },
                /* 14 */{
                    left: -562,
                    top: -8,
                    width: 26,
                    height: 22,
                    title: "编号",
                    cmd: "InsertOrderedList"
                },
                /* 15 */{
                    left: -588,
                    top: -8,
                    width: 26,
                    height: 22,
                    title: "项目符号",
                    cmd: "InsertUnorderedList"
                },
                /* 16 */{
                    left: -504,
                    top: -8,
                    width: 26,
                    height: 22,
                    title: "减少缩进",
                    cmd: "outdent"
                },
                /* 17 */{
                    left: -476,
                    top: -8,
                    width: 26,
                    height: 22,
                    title: "增加缩进",
                    cmd: "indent"
                },
                /* 18 */
                {
                    split: ''
                },
                /* 19 */{
                    left: -700,
                    top: -7,
                    width: 100,
                    height: 22,
                    title: "清除空格",
                    cmd: "clearSpace"
                },
                /* 20 */
                {
                    left: -536,
                    top: -9,
                    width: 26,
                    height: 20,
                    title: "插入横线",
                    cmd: "inserthorizontalrule"
                },
                /* 21 */{
                    left: -273,
                    top: -3,
                    width: 34,
                    height: 34,
                    title: "插入超链接",
                    cmd: "hyperLink",
                    htmlFrameId: "HyperLink",
                    htmlheight: 60,
                    htmlwidth: 400,
                    keepStatus: false
                },
                /* 22 */{
                    left: -212,
                    top: -3,
                    width: 34,
                    height: 34,
                    title: "插入表情",
                    cmd: "face",
                    htmlFrameId: "face",
                    htmlheight: 280,
                    htmlwidth: 340
                },
                /* 23 */{
                    left: -877,
                    top: -3,
                    width: 32,
                    height: 34,
                    title: "插入视频",
                    cmd: "insertVideo",
                    htmlFrameId: "video",
                    htmlheight: 120,
                    htmlwidth: 350
                },
                /* 24 */{
                    left: -904,
                    top: -3,
                    width: 34,
                    height: 34,
                    title: "插入图片",
                    cmd: "insertImage",
                    htmlFrameId: "image",
                    htmlheight: 260,
                    htmlwidth: 520
                }],
            font_family: ["\u5b8b\u4f53", "\u9ed1\u4f53",
                "\u96b6\u4e66", "\u6977\u4f53", "\u5e7c\u5706",
                "Arial", "Impact", "Georgia", "Verdana",
                "Courier New", "Times New Roman"],
            font_size: [{
                size: 1,
                name: "1|8pt"
            }, {
                size: 2,
                name: "2|10pt"
            }, {
                size: 3,
                name: "3|12pt"
            }, {
                size: 4,
                name: "4|14pt"
            }, {
                size: 5,
                name: "5|18pt"
            }, {
                size: 6,
                name: "6|24pt"
            }, {
                size: 7,
                name: "7|36pt"
            }],
            face: [
                {
                    url: $.url.resource
                    + "/images/sparrowEditor/face/01.gif",
                    name: "呲牙"
                },
                {
                    url: $.url.resource
                    + "/images/sparrowEditor/face/02.gif",
                    name: "不嘛"
                },
                {
                    url: $.url.resource
                    + "/images/sparrowEditor/face/03.gif",
                    name: "哭泣"
                },
                {
                    url: $.url.resource
                    + "/images/sparrowEditor/face/04.gif",
                    name: "嘟嘟"
                },
                {
                    url: $.url.resource
                    + "/images/sparrowEditor/face/05.gif",
                    name: "嗯嗯"
                },
                {
                    url: $.url.resource
                    + "/images/sparrowEditor/face/06.gif",
                    name: "思考下"
                },
                {
                    url: $.url.resource
                    + "/images/sparrowEditor/face/07.gif",
                    name: "翻跟斗"
                },
                {
                    url: $.url.resource
                    + "/images/sparrowEditor/face/08.gif",
                    name: "我靠"
                },
                {
                    url: $.url.resource
                    + "/images/sparrowEditor/face/09.gif",
                    name: "扫射"
                },
                {
                    url: $.url.resource
                    + "/images/sparrowEditor/face/10.gif",
                    name: "嘘!"
                },
                {
                    url: $.url.resource
                    + "/images/sparrowEditor/face/11.gif",
                    name: "害羞"
                },
                {
                    url: $.url.resource
                    + "/images/sparrowEditor/face/12.gif",
                    name: "眯眯"
                },
                {
                    url: $.url.resource
                    + "/images/sparrowEditor/face/13.gif",
                    name: "求保佑"
                },
                {
                    url: $.url.resource
                    + "/images/sparrowEditor/face/14.gif",
                    name: "晕"
                },
                {
                    url: $.url.resource
                    + "/images/sparrowEditor/face/15.gif",
                    name: "来一拳"
                },
                {
                    url: $.url.resource
                    + "/images/sparrowEditor/face/16.gif",
                    name: "胜利"
                },
                {
                    url: $.url.resource
                    + "/images/sparrowEditor/face/17.gif",
                    name: "嚎叫"
                },
                {
                    url: $.url.resource
                    + "/images/sparrowEditor/face/18.gif",
                    name: "BIBI"
                },
                {
                    url: $.url.resource
                    + "/images/sparrowEditor/face/19.gif",
                    name: "哼哼"
                },
                {
                    url: $.url.resource
                    + "/images/sparrowEditor/face/20.gif",
                    name: "冷汗"
                },
                {
                    url: $.url.resource
                    + "/images/sparrowEditor/face/21.gif",
                    name: "泼墨"
                },
                {
                    url: $.url.resource
                    + "/images/sparrowEditor/face/22.gif",
                    name: "吐血"
                },
                {
                    url: $.url.resource
                    + "/images/sparrowEditor/face/23.gif",
                    name: "扣鼻子"
                },
                {
                    url: $.url.resource
                    + "/images/sparrowEditor/face/24.gif",
                    name: "挠挠脸"
                },
                {
                    url: $.url.resource
                    + "/images/sparrowEditor/face/25.gif",
                    name: "舔手指"
                },
                {
                    url: $.url.resource
                    + "/images/sparrowEditor/face/26.gif",
                    name: "吃饭啦"
                },
                {
                    url: $.url.resource
                    + "/images/sparrowEditor/face/27.gif",
                    name: "打哈欠"
                },
                {
                    url: $.url.resource
                    + "/images/sparrowEditor/face/28.gif",
                    name: "拜拜"
                },
                {
                    url: $.url.resource
                    + "/images/sparrowEditor/face/29.gif",
                    name: "抽一口"
                },
                {
                    url: $.url.resource
                    + "/images/sparrowEditor/face/30.gif",
                    name: "杀死"
                }]
        }
    };
    this.attach = {
        parentObject: null,
        setParentObject: function (editor) {
            this.parentObject = editor;
        },
        // 新建文件上传控件
        newAttach: function (srcElement) {
            var editor = this.parentObject;
            table.id = editor.config.attach.tableId;
            if (table.obj().rows.length <= editor.config.attach.maxAllowCount) {
                editor.config.attach.index++;
                var uploadFrameId = editor.config.attach.iframeId
                    .format(editor.config.attach.index);
                var uploadFileInitHtml = [];
                uploadFileInitHtml.push('<iframe name="'
                    + editor.config.attach.iframeName + '" id="'
                    + uploadFrameId + '"');
                uploadFileInitHtml
                    .push('" class="file-frame" frameborder="0"');
                uploadFileInitHtml.push(' src="' + $.url.root
                    + '/FileUpload?pathKey='
                    + editor.config.attach.key + '&editor=' + editor.obj + '&t='
                    + $.random() + '"></iframe>');
                table.id = editor.config.attach.tableId;
                table.tr = [{
                    td: [
                        {
                            innerHTML: uploadFileInitHtml.join(""),
                            align: "left",
                            className: "fileName"
                        },
                        {
                            innerHTML: '<input name="'
                            + editor.config.attach.fileRemark
                            + '" style="width: 120px;" type="text" />',
                            align: "left",
                            className: "fileRemarks"
                        },
                        {
                            innerHTML: '<input type="hidden" name="'
                            + editor.config.attach.fileUUID
                            + '"/>'
                            + '<a href="javascript:void(0);" target="_self" onclick="'
                            + editor.obj
                            + '.attach.deleteRow(this,\''
                            + editor.config.attach.tableId
                            + '\');">删除</a>'
                            + '｜<a href="javascript:void(0);" target="_self" onclick="file.multiFile=-1;file.uploadClick(true,\'\',\''
                            + uploadFrameId
                            + '\','
                            + editor.obj
                            + ',this);">立即上传</a>',

                            align: 'left',
                            className: 'fileOperation'
                        }]
                }];
                table.appendRow();
            } else {
                $.message("最多允许上传{0}个文件!"
                        .format(editor.config.attach.maxAllowCount),
                    srcElement);
            }
        },
        // 加载已经上传的文件信息
        // /
        // /fileKey文件标志键
        // /如多个回复内容时，通过设置fileKey来分辨每个回复的附件
        // /
        loadAttach: function () {
            var editor = this.parentObject;
            //初始化图片的tabs
            $('#tab' + editor.obj).tabs();
            var uploadedFileList = editor.config.attach.uploadedJson
                .json();
            // 如果有已经上传的文件
            if (uploadedFileList != null && uploadedFileList.length > 0) {
                var imgContainer = $(editor.config.attach.uploadImgContainerId);
                // 如果附件还未显示则重新加载
                if (imgContainer == null) {
                    editor.run('tool_' + 23 + '_' + editor.obj);
                } else {
                    if (imgContainer.innerHTML.trim() === "") {
                        for (var i = uploadedFileList.length - 1; i >= 0; i--) {
                            var clientFileName = uploadedFileList[i].clientFileName;
                            var fileUrl = uploadedFileList[i].url;
                            imgContainer.appendChild(getImgContainer(
                                fileUrl, clientFileName, editor));
                        }
                    }

                    // [{ID:'170',Type:'0',Status:'1',FileLength:'879744',FileId:'332',FileType:'image/pjpeg',ClientFileName:'Chrysanthemum.jpg',CreateTime:'2012-05-21
                    // 22:44:06.0',CreateUserId:'47',ServerCode:'0',DownLoadTimes:'0',ReadLevel:'0',Remarks:'',Url=''}]
                    /*
                     * // 附件表行索引 var rowIndex = 0; // 将原有的附件信息清除 for (
                     * var i = 0; i < rowCount - 2; i++) {
                     * table.removeRow(1); } // 文件备注||文件名 //
                     * 由网友：zh_harry于2011年9月10日 13:12:10上传 for ( var i =
                     * uploadedFileList.length - 1; i >= 0; i--) { //
                     * 图片toolip var fileToolip = new Array(); if
                     * (uploadedFileList[i].FileType .indexOf("image") ==
                     * 0) {
                     *  // 如果有备注则显示备份 if
                     * (uploadedFileList[i].Remarks.trim() != "") {
                     * fileToolip .push(uploadedFileList[i].Remarks
                     * .trim()); } // 否则显示文件名 else { fileToolip
                     * .push(uploadedFileList[i].ClientFileName
                     * .split('.')[0]); } } table.tr[rowIndex++] = { td : [ {
                     * innerHTML : '<a target="_blank" href="' +
                     * sparrow.rootPath + '/FileDownLoad?fileUUID=' +
                     * uploadedFileList[i].FileId + '">' +
                     * uploadedFileList[i].ClientFileName + '</a>',
                     * align : "left", className : "fileName" }, {
                     * innerHTML : '<input name="' +
                     * editor.config.attach.fileRemark + '" value="' +
                     * uploadedFileList[i].Remarks + '" style="width:
                     * 120px;" type="text" />', align : "left",
                     * className : "fileRemarks" }, { innerHTML : '<a
                     * href="javascript:void(0);" target="_self"
                     * onclick="' + editor.obj +
                     * '.attach.deleteOnServer(\'' +
                     * uploadedFileList[i].FileId + '\',this);">删除</a>' + '<input
                     * type="hidden" name="' +
                     * editor.config.attach.fileUUID + '" value="' +
                     * uploadedFileList[i].FileId + '"/>' +
                     * (uploadedFileList[i].FileType .indexOf("image") ==
                     * 0 ? '｜<a href="javascript:void(0);"
                     * target="_self" onclick="' + editor.obj +
                     * '.attach.insertEditor(event,\'' + fileToolip
                     * .join("\\n") + '\',\'' +
                     * uploadedFileList[i].FileId + '\',\'' +
                     * uploadedFileList[i].Url + '\');">插入到编辑器</a>' :
                     * ""), align : "left", className : "fileOperation" } ] }; }
                     * table.insertRow(1);
                     */
                }
            }
        },
        // 按一定格式拼写文件http的post请头信息。服务器端接受后会进行解析 以当前编辑对象作为参数
        collectFilePostInfo: function () {
            var editor = this.parentObject;
            // 当前编辑器的附件表格对象
            var attachTable = $(editor.config.attach.tableId);
            if (attachTable) {
                // 获取当前编辑器的文件id
                var fileUuidArray = $("&"
                    + editor.config.attach.fileUUID);
                // 获取当前编辑器的文件备注信息
                var fileRemarkArray = $("&"
                    + editor.config.attach.fileRemark);
                var fileInfo = [];
                for (var i = 0; i < fileUuidArray.length; i++) {
                    if (fileUuidArray[i].value) {
                        fileInfo.push(fileUuidArray[i].value + ":"
                            + fileRemarkArray[i].value);
                    }
                }
                return fileInfo.join();
            } else {
                return "";
            }
        },
        // 验证方法
        validate: function () {
            return true;
        },
        // 提交表单的私有方法
        _submit: function () {

            // 收集需要上传的文件信息
            $(this.parentObject.config.attach.fileInfoId).value = this.parentObject.attach
                .collectFilePostInfo();
            if (this.parentObject.config.attach.actionUrl) {
                $.submit(
                    this.parentObject.config.attach.actionUrl,
                    this.parentObject.config.attach.formIndex);
            } else {
                if (this.parentObject.config.attach.currentUUID) {
                    $
                        .submit(
                            "update.do",
                            this.parentObject.config.attach.formIndex);
                } else {
                    $
                        .submit(
                            null,
                            this.parentObject.config.attach.formIndex);
                }
            }
        },
        // 表单提交的js方法 (需要显示调用)
        submit: function (editorIndex) {
            // 获取当前编辑器
            var editor = this.parentObject;
            $(editor.config.contentCtrlId).value = editor.frame.contentWindow.document.body.innerHTML;

            if (this.validate()) {
                // 初始化还未上传的文件控件数组
                editor.attach.initUploadingFileId();
                // 待上传的文件不为0
                if (editor.config.attach.uploadingFileId.length > 0) {
                    var htmlFrame = $(editor.obj + "_"
                        + editor.config.tool.toolBar[23].htmlFrameId);
                    if (htmlFrame.style.display === "none") {
                        htmlFrame.style.display = "block";
                        editor.config.currentHtmlId = htmlFrame.id;
                    }
                    // 多文件标志
                    file.multiFile = 1;
                    // 先上传文件
                    this.uploadFile();
                } else {
                    // 直接提交
                    this._submit();
                }
            } else {
                $(this.parentObject.config.submitButtonId).disabled = false;
            }
        },
        // 初始化待上传的文件ID数组
        initUploadingFileId: function () {
            var fileUploads = $("&"
                + this.parentObject.config.attach.iframeName);
            for (var i = 0; i < fileUploads.length; i++) {
                file.uploadFrameId = fileUploads[i].id;
                if (file.getUploadFile(fileUploads[i].id).value) {
                    this.parentObject.config.attach.uploadingFileId
                        .push(fileUploads[i].id);
                }
            }
        },// 将图片插入到编辑器
        insertEditor: function (toolip, serverFileName) {
            var editor = this.parentObject;
            var insertHtml = '<img title="' + toolip + '"' + " src=\""
                + serverFileName + "\"/>";
            editor.createTempNode("span");
            var face = editor.getTempNode();
            face.innerHTML = insertHtml;
            editor.removeElementById();
        },
        // 从服务器端删除附件
        deleteOnServer: function (fileUUID, srcElement) {
            var editor = this.parentObject;
            if (window.confirm($.message.deleteFile)) {
                ajax
                    .json($.url.root + "/attach/delete.json", "uuid=" + fileUUID,
                        function (result) {
                            editor.attach
                                .deleteImg(ajax.srcElement);
                            $.message("删除成功！");
                        }, srcElement);
            }
        },
        deleteImg: function (srcElement) {
            $(srcElement.parentNode.parentNode
                .removeChild(srcElement.parentNode));
            if (file.wit) {
                window.clearInterval(file.wit);
            }
            if ($("divState")) {
                document.body.removeChild($("divState"));
            }
        },
        // 客户端删除附件
        deleteRow: function (srcElement, tableId) {
            table.id = tableId;
            var currentRowIndex = srcElement.parentNode.parentNode.rowIndex;
            table.removeRow(currentRowIndex);
            if (file.wit) {
                window.clearInterval(file.wit);
            }
            if ($("divState")) {
                document.body.removeChild($("divState"));
            }
        },
        // 文件批量上传
        uploadFile: function () {
            var editor = this.parentObject;
            file
                .uploadClick(
                    true,
                    "",
                    editor.config.attach.uploadingFileId[editor.config.attach.uploadedIndex],
                    editor);
        }
    }
}
// 获取编辑中的对象通过控件ID
SparrowEditor.prototype.$ = function (id) {
    return this.frame.contentWindow.document.getElementById(id);
};
SparrowEditor.prototype.getTempNode = function (tagName) {
    // document.createElementByTagName() 具有临时ID的标签一定会被清除
    var tempNode = this.$(this.config.tempNodeAttribute);
    if (tempNode) {
        return tempNode;
    }
    // execCommand情况
    else {
        tagName = tagName ? tagName.toLowerCase()
            : (($.browser.ie || $.browser.opera) ? "font"
                : "span");
        var tempAttributeValue = null;
        var nodeArray = this.frame.contentWindow.document
            .getElementsByTagName(tagName);
        for (var i = nodeArray.length - 1; i >= 0; i--) {
            if (tagName === "font" || tagName === "span") {
                tempAttributeValue = ($.browser.ie || $.browser.opera) ? nodeArray[i].face
                    : nodeArray[i].style.fontFamily;
            } else if (tagName === "a") {
                try {
                    tempAttributeValue = nodeArray[i].href;
                } catch (err) {
                }
            }
            if (tempAttributeValue
                && tempAttributeValue
                    .indexOf(this.config.tempNodeAttribute) !== -1) {
                nodeArray[i].id = this.config.tempNodeAttribute;
                return nodeArray[i];
                break;
            }
        }
    }
};
SparrowEditor.prototype.replaceTagWithInnerHTML = function (currentTag) {
    if ($.browser.firefox) {
        var range = this.getRange();
        range.setStartBefore(currentTag);
        var fragment = range.createContextualFragment(currentTag.innerHTML);
        currentTag.parentNode.replaceChild(fragment, currentTag);
    } else {
        currentTag.outerHTML = currentTag.innerHTML;
    }
};
SparrowEditor.prototype.removeElementById = function () {
    var currentCtrl = this.$(this.config.tempNodeAttribute);
    this.replaceTagWithInnerHTML(currentCtrl);
};
SparrowEditor.prototype.getBrief = function () {
    var brief = null;
    if ($.browser.ie) {
        brief = this.frame.contentWindow.document.body.innerText.substring(0,
            300);
    } else {
        brief = this.frame.contentWindow.document.body.textContent.length;
    }
    if (brief.length > 300) {
        brief = brief.substring(0, 300);
    }
    return brief;
};
SparrowEditor.prototype.getEditorContent = function () {
    if (this.config.tool.convertHTML.isConvert) {
        var tdconvertHTML = document.getElementById(this.config.tool.convertHTML.ctrlId);
        if (tdconvertHTML.innerHTML !== "HTML") {
            tdconvertHTML.innerHTML = "HTML";
            document.getElementById(this.config.tool.icon.containerId).style.display = "block";
            if ($.browser.ie) {
                this.frame.contentWindow.document.body.innerHTML = this.frame.contentWindow.document.body.innerText;
            } else {
                this.frame.contentWindow.document.body.innerHTML = this.frame.contentWindow.document.body.textContent;
            }
        }
    }
    this.clear();
    if (this.frame.contentWindow.document.body.innerHTML === "<br>"
        || this.frame.contentWindow.document.body.innerHTML === "<br/>") {
        return "";
    }
    return this.frame.contentWindow.document.body.innerHTML;
};

// iframe onload时执行
SparrowEditor.prototype.initContent = function () {
};
SparrowEditor.prototype.focus = function () {
    this.frame.contentWindow.document.body.focus();
};

SparrowEditor.prototype.setEditorContent = function (contentHtml) {
    $(this.config.contentCtrlId).value = contentHtml;
    this.frame.contentWindow.document.body.innerHTML = contentHtml;
    this.updateWordCount();
};
SparrowEditor.prototype.setEditorText = function (contentText) {
    this.Frame.contentWindow.document.body.innerText = contentText;
    this.updateWordCount();
};
SparrowEditor.prototype.getRange = function () {
    this.frame.contentWindow.document.body.focus();
    return ($.browser.ie ? this.frame.contentWindow.document.selection
            .createRange()
        : this.frame.contentWindow.getSelection().getRangeAt(0));
};
SparrowEditor.prototype.m_over = function (srcObj) {
    this.config.tool.icon.backGroundColor = srcObj.style.backgroundColor;
    srcObj.style.backgroundColor = "#426eb4";
    srcObj.style.cursor = "pointer";
};
SparrowEditor.prototype.m_out = function (srcObj) {
    srcObj.style.backgroundColor = this.config.tool.icon.backGroundColor;
};
SparrowEditor.prototype.m_down = function (srcObj) {
    var key = srcObj.id.split('_')[1];
    srcObj.style.background = "url(" + this.config.tool.icon.path + "ico.gif) "
        + (this.config.tool.toolBar[key].left + 1) + "px "
        + (this.config.tool.toolBar[key].top + 1) + "px";
};
SparrowEditor.prototype.m_up = function (srcObj) {
    var key = srcObj.id.split('_')[1];
    srcObj.style.background = "url(" + this.config.tool.icon.path + "ico.gif) "
        + (this.config.tool.toolBar[key].left) + "px "
        + (this.config.tool.toolBar[key].top) + "px";
    this.run(srcObj.id);
};
SparrowEditor.prototype.clearTag = function (tagName) {
    var tags = this.frame.contentWindow.document.getElementsByTagName(tagName);
    for (var i = tags.length - 1; i >= 0; i--) {
        if (tags[i].innerHTML === "") {
            tags[i].parentNode.removeChild(tags[i]);
        }
    }
};
SparrowEditor.prototype.clear = function () {
    this.clearTag("span");
    this.clearTag("font");
    this.clearTag("div");
    this.clearTag("p");
    try {
        this.frame.contentWindow.document.body.innerHTML = this.frame.contentWindow.document.body.innerHTML
            .replace(/&nbsp;+/g, " ").replace(/(<br>|<br\/>)+/g, "<br/>");
    } catch (err) {
    }
    var tempNode = this.getTempNode() || this.getTempNode("a");
    while (tempNode) {
        if (tempNode.tagName.toLowerCase() == "a") {
            if (tempNode.href.indexOf(this.config.tempNodeAttribute) == -1)
                tempNode.removeAttribute("id");
            else
                this.removeElementById();
        } else {
            this.removeElementById();
        }
        tempNode = this.getTempNode() || this.getTempNode("a");
    }
};
SparrowEditor.prototype.createTempNode = function (newTagName) {
    if (!newTagName) {
        // a or span
        newTagName = "a";
    }
    var range = this.getRange();
    var rangeText = $.browser.ie ? range.text : range;
    if (rangeText == "") {
        var i_temp_node = document.createElement(newTagName);
        if (newTagName == "a") {
            i_temp_node.href = this.config.tempNodeAttribute;
        } else {
            i_temp_node.id = this.config.tempNodeAttribute;
        }

        if ($.browser.ie) {
            i_temp_node.innerHTML = range.text;
            range.pasteHTML(i_temp_node.outerHTML);
        } else {
            range.surroundContents(i_temp_node);
        }
    } else {
        if (!newTagName || (newTagName.toLowerCase() == "a")) {
            this.frame.contentWindow.document.execCommand("createLink", false,
                this.config.tempNodeAttribute);
        } else {
            this.frame.contentWindow.document.execCommand("fontname", false,
                this.config.tempNodeAttribute);
        }
    }
};
SparrowEditor.prototype.findTagNode = function (tagName) {
    tagName = tagName.toLowerCase();
    var tagNode = null;
    var currentSelectedElement = null;
    try {
        var range = this.getRange();

        if ($.browser.ie) {
            if (range.item) {
                currentSelectedElement = range.item(0);
            } else {
                currentSelectedElement = range.parentElement();
            }
        } else {
            if (range.startContainer.getElementsByTagName) {
                var childNodes = range.startContainer
                    .getElementsByTagName(tagName);
                if (childNodes.length > 0) {
                    currentSelectedElement = childNodes[0];
                } else {
                    currentSelectedElement = range.startContainer;
                }
            } else {
                currentSelectedElement = range.startContainer;
            }
        }
    } catch (err) {
    }
    if (currentSelectedElement.nodeName.toLowerCase() == tagName) {
        tagNode = currentSelectedElement;
    } else {
        while (currentSelectedElement.nodeName.toLowerCase() !== "body") {
            if (currentSelectedElement.nodeName.toLowerCase() === tagName) {
                tagNode = currentSelectedElement;
                break;
            } else {
                currentSelectedElement = currentSelectedElement.parentNode;
            }
        }
    }
    if (tagNode) {
        tagNode.id = this.config.tempNodeAttribute;
    }
    return tagNode;
};
SparrowEditor.prototype.run = function (srcElementId) {
    var srcElement = $(srcElementId);
    key = srcElement.id.split('_')[1];
    this.frame.contentWindow.focus();
    if (key == 0 || key == 1 || key == 5 || key == 6 || key == 20 || key == 21
        || key == 22 || key == 23 || key == 24) {
        clearHtmlFrame();
        this.show(srcElement, key, this.config.tool.toolBar[key].htmlwidth,
            this.config.tool.toolBar[key].htmlheight);
    } else if (key == 18) {
        this.frame.contentWindow.document.body.innerHTML = this.frame.contentWindow.document.body.innerHTML
            .replace(/&nbsp;+/g, " ").replace(/(<br>|<br\/>)+/g, "<br/>");
        this.clear();
    } else {
        this.frame.contentWindow.document.execCommand(
            this.config.tool.toolBar[key].cmd, false, undefined);
    }
    this.frame.contentWindow.focus();
};
SparrowEditor.prototype.callBackRun = function (key, e) {
    e = e || window.event;
    var srcObject = e.srcElement || e.target;
    switch (key) {
        case 21:
            this.insertHyperLink();
            break;
        case 22:
            this.insertFace(srcObject);
            break;
        case 23:
            var result = this.insertVideo();
            if (result == false) {
                return;
            }
            break;
        default:
            var commandValue = srcObject.title;
            var CMD = this.config.tool.toolBar[key].cmd;
            if (this.config.tool.toolBar[key].firefoxcmd) {
                CMD = $.browser.ie ? this.config.tool.toolBar[key].cmd
                    : this.config.tool.toolBar[key].firefoxcmd;
            }
            this.frame.contentWindow.document.execCommand(CMD, false, commandValue);
            break;
    }
    var listDiv = document.getElementById(this.config.currentHtmlId);
    document.body.removeChild(listDiv);
    this.config.currentHtmlId = null;
};
SparrowEditor.prototype.show = function (srcObject, key, width, maxHeight) {
    var sparrowObject = $(srcObject);
    // 如果当前div菜单还存在则用样式隐藏
    if (this.config.currentHtmlId) {
        document.getElementById(this.config.currentHtmlId).style.display = "none";
        this.config.currentHtmlId = null;
    }
    var htmlFrameId = this.obj + "_"
        + this.config.tool.toolBar[key].htmlFrameId;
    var listDiv = document.getElementById(htmlFrameId);
    // 如果是第一次显示div菜单则创建DIV
    if (!listDiv) {
        listDiv = document.createElement("DIV");
        listDiv.id = htmlFrameId;
        document.body.appendChild(listDiv);
    }
    listDiv.style.cssText = "display:block;position:absolute;width:"
        + width
        + "px;height:0px;border:#990000 1px solid;background:#ffffff; padding:1px;text-align:center;";
    listDiv.onclick = function (e) {
        $.event(e).cancelBubble();
    };
    var leftPosition = sparrowObject.getAbsoluteLeft()
        - (width - srcObject.offsetWidth) / 2;
    var left = $(srcObject.parentNode).getAbsoluteLeft();
    if (leftPosition < left)
        leftPosition = left;
    listDiv.style.left = leftPosition + "px";
    listDiv.style.top = (sparrowObject.getAbsoluteTop() + srcObject.offsetHeight)
        + "px";
    this.config.interval = window.setInterval(this.obj + ".intervalShow(" + key
        + "," + maxHeight + ")", 10);
};
SparrowEditor.prototype.intervalShow = function (key, maxHeight) {
    var listDiv = document.getElementById(this.obj + "_"
        + this.config.tool.toolBar[key].htmlFrameId);
    // var divWidth = parseInt(listDiv.style.width.replace("px", ""));
    var divHeight = listDiv.clientHeight + 15;
    if (divHeight >= maxHeight) {
        window.clearInterval(this.config.interval);
        // 如果是第一次加载或者第二次以上重复加载并要求不保留状态的
        if (listDiv.innerHTML.trim() == ""
            || this.config.tool.toolBar[key].keepStatus == false) {
            listDiv.innerHTML = this.getHtml(key);
        }
        if (key == 20) {
            $(this.obj + "_txtURL").focus();
        } else if (key == 22) {
            $(this.obj + "_txtVideo").focus();
        } else if (key == 23) {
            // load 原有文件
            this.attach.loadAttach(this.config.attach.fileKey);
        }
        this.config.currentHtmlId = listDiv.id;
    } else {
        listDiv.style.height = divHeight + "px";
    }
};

SparrowEditor.prototype.getHtml = function (key) {
    var HTML = [];
    switch (key) {
        case 0:
            HTML
                .push('<ul style="list-style-type:none;text-align:left;margin:0;padding:0;">');
            for (var i = 0; i < this.config.tool.font_size.length; i++) {
                HTML
                    .push('<li unselectable="on" onclick="'
                        + this.obj
                        + '.callBackRun('
                        + key
                        + ',event);" style="border-bottom:#ccc 1px dotted;padding:5px;cursor:pointer;font-size:'
                        + this.config.tool.font_size[i].name.split("|")[1]
                        + ';width:auto;" title="'
                        + Math.round(this.config.tool.font_size[i].size)
                        + '">' + this.config.tool.font_size[i].name
                        + '</li>');
            }
            HTML.push("</ul>");
            break;
        case 1:
            HTML
                .push('<ul style="line-height:25px; list-style-type:none;margin:0;padding:0;">');
            for (i = 0; i < this.config.tool.font_family.length; i++) {
                HTML
                    .push('<li unselectable="on" onclick="'
                        + this.obj
                        + '.callBackRun('
                        + key
                        + ',event);" title="'
                        + this.config.tool.font_family[i]
                        + '" style="border:#ccc 1 dotted;padding:3px;cursor:pointer;font-family:'
                        + this.config.tool.font_family[i] + "\">"
                        + this.config.tool.font_family[i] + "</li>");
            }
            HTML.push('</ul>');
            break;
        case 5:
        case 6:
            var color = ["00", "33", "66", "99", "cc", "ff"];
            var index = 0;
            for (var i = 0; i < 6; i += 1) {
                for (var j = 0; j < 6; j += 1) {
                    for (var k = 0; k < 6; k += 1) {
                        var c = "#" + color[i] + color[j] + color[k];
                        HTML.push('<img src="' + this.config.tool.icon.path
                            + 'icoBack.gif" onclick="' + this.obj
                            + '.callBackRun(' + key + ',event); " title="' + c
                            + '" style="background:' + c
                            + ';width:20px;height:20px;cursor:pointer"/>');
                        index += 1;
                        if ((index % 18) === 0) {
                            HTML.push("<br/>");
                        }
                    }
                }
            }
            break;
        case 20:
            var hyperLink = this.findTagNode("a");
            var url = "";
            var hasLink = false;
            if (hyperLink != null) {
                url = hyperLink.href.substring(7);
                hasLink = true;
            } else {
                this.createTempNode("a");
            }
            HTML
                .push('\u94fe\u63a5\u5730\u5740<input onkeyup="if(this.value.substring(0,7)!=\'http://\'){this.value=\'http://\'}" value="http://'
                    + url
                    + '" type="text" id="'
                    + this.obj
                    + '_txtURL" /><br/><input type="button" value="\u786e\u5b9a" id="ok" onclick="if(document.getElementById(\''
                    + this.obj
                    + '_txtURL\').value==\'http://\'&&'
                    + !hasLink
                    + '){alert(\'\u8bf7\u8f93\u5165\u6b63\u786e\u7684url\u5730\u5740\');}else{'
                    + this.obj + '.callBackRun(21,event);}" />');
            break;
        case 21:
            this.createTempNode("span");
            var col = 6;
            var row = Math.ceil(this.config.tool.face.length / col);
            HTML
                .push('<table style="width:'
                    + this.config.tool.toolBar[key].htmlwidth
                    + 'px; border-collapse:collapse;" id="divFace" cellpadding="1" cellspacing="0">');
            var index = 0;
            for (i = 0; i < row; i++) {
                HTML.push('<tr>');
                for (j = 0; j < col; j++) {
                    if (index < this.config.tool.face.length) {
                        HTML.push('<td><img style="cursor: pointer;" title="'
                            + this.config.tool.face[index].name + '" src="'
                            + this.config.tool.face[index].url + '" onclick="'
                            + this.obj + '.callBackRun(22,event);" /></td>');
                    } else {
                        HTML.push('<td></td>');
                    }
                    index++;
                }
                HTML.push('</tr>');
            }
            HTML.push('</table>');
            break;
        case 22:
            this.createTempNode("span");
            HTML.push('FLASH视频URL:<input style="width:300px;" id="' + this.obj
                + '_txtVideo" type="text"/><br/><span id="' + this.obj
                + '_spanVideoErrorMessage"></span><br/>');
            HTML.push('<input value="插入视频" type="button" onclick="' + this.obj
                + '.callBackRun(23,event);"/>');
            break;
        case 23:
            this.createTempNode("span");
            HTML.push('<div  id="tab' + this.obj + '" class="editorAttachFrame">');
            HTML.push('<div class="title">');
            HTML.push('<ul>');
            /*
             * HTML.push('<li class="select">'); HTML .push('<a target="_self"
             * href="javascript:void(0);" onclick="webtab.setTab(\'' + this.obj +
             * '\',0);this.blur();">'); HTML.push('本地文件'); HTML.push('</a>');
             * HTML.push('</li>');
             */

            HTML.push('<li class="select">');
            HTML
                .push('<a target="_self" href="javascript:void(0);">');
            HTML.push('本地图片');
            HTML.push('</a>');
            HTML.push('</li>');

            HTML.push('<li class="noselect">');
            HTML
                .push('<a target="_self" href="javascript:void(0);">');
            HTML.push('网络图片');
            HTML.push('</a>');
            HTML.push('</li>');
            HTML.push('</ul>');
            HTML.push('</div>');
            HTML.push('<div class="content">');
            /*
             * // 插入本地文件 HTML.push('<div class="block">'); HTML.push('');
             * HTML.push('<table class="attach" id="' + this.config.attach.tableId +
             * '">'); HTML.push('<tbody>'); HTML.push('<tr>'); HTML.push('<th class="fileName">');
             * HTML .push('<a style="color:#ff9900;font-weight:bold;"
             * href="javascript:void(0);" target="_self" onclick="' + this.obj +
             * '.attach.newAttach(this);" type="button">新附件</a>');
             *
             * HTML.push('</th>'); HTML.push('<th class="fileRemarks">备注</th>');
             * HTML.push('<th class="fileOperation">操作</th>'); HTML.push('</tr>');
             * for ( var i = 1; i <= 3; i++) { HTML.push('<tr>'); HTML.push('<td class="fileName">');
             * HTML.push('<iframe name="' + this.config.attach.iframeName + '"
             * id="' + this.config.attach.iframeId.format(i) + '" class="file-frame"
             * frameborder="0"'); HTML.push(' src="' + sparrow.rootPath +
             * '/FileUpload?pathKey=' + this.config.attach.key + '"></iframe>');
             * HTML.push('</td>'); HTML.push('<td class="fileRemarks">');
             * HTML.push('<input style="width: 120px" name="' +
             * this.config.attach.fileRemark + '">'); HTML.push('</td>');
             * HTML.push('<td class="fileOperation">'); HTML.push('<input name="' +
             * this.config.attach.fileUUID + '" type="hidden"/>'); HTML.push('<a
             * href="javascript:void(0);" target="_self" onclick="' + this.obj +
             * '.attach.deleteRow(this,\'' + this.config.attach.tableId + '\');">删除</a>');
             * HTML .push('｜<a href="javascript:void(0);" target="_self"
             * onclick="file.multiFile=-1;file.uploadClick(true,\'\',\'' +
             * this.config.attach.iframeId.format(i) + '\',' + this.obj +
             * ',this);">立即上传</a>'); HTML.push('</td>'); HTML.push('</tr>');
             * this.config.attach.index = i; } HTML.push('</tbody>'); HTML.push('</table>');
             * HTML.push('</div>'); // 本地文件插入结束
             */

            // 插入本地图片
            HTML.push('<div id="' + this.config.attach.key
                + this.config.attach.localUploadImgTabId + '" class="block">');
            HTML
                .push('<div style="width:100%;height:auto;overflow:hidden;padding:2px;" id="'
                    + this.config.attach.uploadImgContainerId + '"></div>');
            HTML.push('<iframe name="' + this.config.attach.iframeName + '" id="'
                + this.config.attach.iframeId.format("image")
                + '" class="file-frame" frameborder="0"');
            HTML.push(' src="' + $.url.root + '/FileUpload?pathKey='
                + this.config.attach.key + '&editor=' + this.obj + '"></iframe><br/>');
            HTML.push('</div>');
            // 插入本地图片结束

            // 插入网络图片
            HTML.push('<div class="none">');
            HTML.push('图片URL:<input style="width:300px;" id="' + this.obj
                + '_txtImage" type="text"/><br/><span id="' + this.obj
                + '_spanImageErrorMessage"></span><br/>');
            HTML.push('<input value="插入图片" type="button" onclick="' + this.obj
                + '.insertImage();"/>');
            HTML.push('</div>');
            // 网络图片插入结束

            HTML.push('</div>');
            HTML.push('</div>');
    }
    return HTML.join("");
};
SparrowEditor.prototype.adjust = function (style, obj) {
    try {
        if (style === "width") {
            var objWidth = parseInt(obj.value);
            if (objWidth > this.config.container.maxWidth) {
                alert('\u7f16\u8f91\u5668\u6700\u5927\u5bbd\u5ea6:'
                    + this.config.container.maxWidth + 'px');
                obj.value = this.config.container.maxWidth + "px";
            } else {
                if (objWidth < this.config.container.minWidth) {
                    alert("\u7f16\u8f91\u5668\u6700\u5c0f\u5bbd\u5ea6:"
                        + this.config.container.minWidth + 'px');
                    obj.value = this.config.container.minWidth + "px";
                }
            }
            document.getElementById(this.config.container.id).style.width = obj.value;
            var editorToolBarTDWidth = parseInt(obj.value)
                - this.config.tool.convertHTML.ctrlWidth;
            if (this.config.tool.adjust.adjustable) {
                editorToolBarTDWidth = editorToolBarTDWidth
                    - this.config.tool.adjust.width;
            }
            document.getElementById(this.config.tool.id).style.width = obj.value;
            document.getElementById(this.config.tool.id).style.width = editorToolBarTDWidth;
        } else {
            document.getElementById(this.config.container.id).style.height = obj.value;
        }
    } catch (ex) {
        if (style === "width") {
            obj.value = document.getElementById(this.config.container.id).style.width;
        } else {
            obj.value = document.getElementById(this.config.container.id).style.height;
        }
    }
    this.autoAdjust(document.getElementById(this.config.iframeId));
};
SparrowEditor.prototype.autoAdjust = function (obj) {
    var parentDivHeight = parseInt(document
        .getElementById(this.config.container.id).style.height);
    var toolBarHeight = document.getElementById(this.config.tool.id).clientHeight + 10;
    obj.style.height = parentDivHeight - toolBarHeight;
};
SparrowEditor.prototype.convertHTML = function (obj) {
    this.clear();
    if (obj.innerHTML === "HTML") {
        obj.innerHTML = "\u8fd4\u56de";
        obj.title = "\u8fd4\u56de\u6240\u89c1\u5373\u6240\u5f97\u6a21\u5f0f";
        document.getElementById(this.config.tool.icon.containerId).style.display = "none";
        if ($.browser.ie) {
            this.frame.contentWindow.document.body.innerText = this.frame.contentWindow.document.body.innerHTML;
        } else {
            this.frame.contentWindow.document.body.textContent = this.frame.contentWindow.document.body.innerHTML;
        }
    } else {
        obj.innerHTML = "HTML";
        document.getElementById(this.config.tool.icon.containerId).style.display = "block";
        if ($.browser.ie) {
            this.frame.contentWindow.document.body.innerHTML = this.frame.contentWindow.document.body.innerText;
        } else {
            this.frame.contentWindow.document.body.innerHTML = this.frame.contentWindow.document.body.textContent;
        }
    }
};
SparrowEditor.prototype.insertVideo = function () {
    var result = false;
    var videoURL = document.getElementById(this.obj + "_txtVideo").value;
    var errorMessage = $(this.obj + "_spanVideoErrorMessage");
    if (videoURL.trim() === "") {
        errorMessage.className = "error";
        errorMessage.innerHTML = "请输入视频地址<br/>例:http://player.youku.com/player.php/sid/qxiaoqu/v.swf";
    } else if (videoURL.search(/^[http:\/\/][^<]*\.swf[^<]*/) == -1) {
        errorMessage.className = "error";
        errorMessage.innerHTML = "请输入正确的视频地址。例:http://player.youku.com/player.php/sid/qxiaoqu/v.swf";
    } else {
        var tempNode = this.getTempNode();
        var flashUrl = document.getElementById(this.obj + "_txtVideo").value;
        var editor = this;
        var videoHtml;
        if (this.config.flash_thumbnail) {
            //直接可播放为了预览视频效果 展示时通过正则转换成 image
            ajax
                .json($.url.root + "/attach/getFlashThumbnail.json", "parameter=" + encodeURIComponent(flashUrl),
                    function (result) {
                        videoHtml = result.message;
                        if (tempNode) {
                            tempNode.innerHTML = videoHtml;
                            editor.removeElementById();
                        } else {
                            editor.frame.contentWindow.document.body.innerHTML += videoHtml;
                        }
                    });
        }
        else {
            videoHtml = '<embed src="{0}" quality="high" wmode="opaque" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" width="500" height="500"/>'.format(flashUrl);
            if (tempNode) {
                tempNode.innerHTML = videoHtml;
                this.removeElementById();
            } else {
                this.frame.contentWindow.document.body.innerHTML += videoHtml;
            }
        }
        result = true;
    }
    return result;
};
SparrowEditor.prototype.insertImage = function () {
    var imageURL = document.getElementById(this.obj + "_txtImage").value;
    var errorMessage = $(this.obj + "_spanImageErrorMessage");
    if (imageURL.trim() == "") {
        errorMessage.className = "error";
        errorMessage.innerHTML = "请输入图片地址<br/>例:" + $.url.resource
            + "/img.jpg<br/>格式限制:gif|jpg|png";
    } else if (imageURL.search(/^http:\/\/.*?\.(jpg|gif|png)$/) == -1) {
        errorMessage.className = "error";
        errorMessage.innerHTML = "请输入图片地址<br/>例:" + $.url.resource
            + "/img.jpg<br/>格式限制:gif|jpg|png";
    } else {
        var editor = this;
        ajax.json($.url.root + '/attach/downloadInternetPic.json', "imageUrl=" + imageURL,
            function (result) {
                $(editor.config.attach.uploadImgContainerId).appendChild(
                    getImgContainer(result.message,
                        imageURL, editor));
                editor.attach.insertEditor(file.getFileName(imageURL),
                    result.message);
            });
    }
};
SparrowEditor.prototype.insertFace = function (srcObject) {
    var face = this.getTempNode();
    if (face) {
        face.innerHTML = "<img src=\"" + srcObject.src + "\"/>";
        if ($(this.config.titleCtrlId)
            && $(this.config.titleCtrlId).value == "") {
            $(this.config.titleCtrlId).value = srcObject.title;
        }
        this.removeElementById();
    } else {
        this.frame.contentWindow.document.execCommand("insertImage", false,
            srcObject.src);
    }
};
SparrowEditor.prototype.insertHyperLink = function () {
    var hyperLink = this.getTempNode("a");
    var txtURL = document.getElementById(this.obj + "_txtURL").value;
    if (hyperLink) {
        if (txtURL == "http://") {
            if (window
                    .confirm("\u60a8\u786e\u8ba4\u8981\u53d6\u6d88\u94fe\u63a5\u5417?")) {
                this.removeElementById();
            }
        } else {
            if (hyperLink.innerHTML == "") {
                hyperLink.innerHTML = txtURL;
            }
            hyperLink.removeAttribute("id");
            hyperLink.setAttribute("target", "blank");
            hyperLink.setAttribute("href", txtURL);
        }
    }
};
SparrowEditor.prototype.initialize = function (containerId) {
    $.global(this.obj, this);
    editorArray.push(this);
    this.config.container.id = containerId;
    var iframeId = "iframe" + $.random();
    this.config.iframeId = iframeId;
    document.getElementById(containerId).innerHTML = this.config.tool.position == "top" ? (this
            .initTool() + this.initEditor(iframeId))
        : (this.initEditor(iframeId) + this.initTool());
    this.frame = document.getElementById(iframeId);
    this.frame.contentWindow.document.open();
    this.frame.contentWindow.document
        .write('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">');
    this.frame.contentWindow.document
        .write('<html><body id="' + this.obj + '" style="width:100%;height:{0}px;" contenteditable="true"></body></html>'
                .format($(iframeId).offsetHeight));
    this.frame.contentWindow.document.close();
    // 兼容flash能够正常播放
    // this.Frame.contentWindow.document.designMode = "on";
    if ($.browser.ie) {
        this.frame.contentWindow.document.onclick = clearHtmlFrame;
        this.frame.contentWindow.document.onkeyup = this.updateWordCount;
        return;
    }
    try {
        this.frame.contentWindow.document.addEventListener("click",
            clearHtmlFrame, true);
        this.frame.contentWindow.document.addEventListener("keyup",
            this.updateWordCount, true);
    } catch (e) {
    }
};
SparrowEditor.prototype.initTool = function () {
    var key = 0;
    var toolHTML = [];
    var toolBarList = null;
    // icon图标工具栏的宽度
    var iconContainerWidth = parseInt(document
        .getElementById(this.config.container.id).style.width);
    if (this.config.tool.convertHTML.isConvert) {
        iconContainerWidth = iconContainerWidth
            - this.config.tool.convertHTML.ctrlWidth;
    }
    if (this.config.tool.adjust.adjustable) {
        iconContainerWidth = iconContainerWidth - this.adjust.width;
    }
    toolHTML.push('<div style="border-bottom:1px #ccc solid;" class="pure-g tool-bar">');
    toolHTML.push('<div class="pure-u-18-24" id="' + this.config.tool.icon.containerId + '" style="width:'
        + iconContainerWidth + 'px;text-align:left;">');
    if (this.config.style != null) {
        // 保留以后扩展使用
        if (this.config.style === "simple") {
            toolBarList = this.config.tool.style.simple;
        } else if (this.config.style === "comment") {
            toolBarList = this.config.tool.style.comment;
        } else if (this.config.style === "thread") {
            toolBarList = this.config.tool.style.list;
        }
        for (var i = 0; i < toolBarList.length; i++) {
            key = toolBarList[i];
            if (typeof (this.config.tool.toolBar[key].split) != "undefined") {
                toolHTML.push(this.config.tool.toolBar[key].split
                    .format(this.config.tool.icon.path));
            } else {
                toolHTML.push('<img id="tool_' + key + '_' + this.obj
                    + '" src="' + this.config.tool.icon.path
                    + 'icoBack.gif"');
                toolHTML.push(' title="' + this.config.tool.toolBar[key].title);
                toolHTML.push('" style="background:url(\''
                    + this.config.tool.icon.path + 'ico.gif\') ');
                toolHTML.push(this.config.tool.toolBar[key].left + 'px '
                    + this.config.tool.toolBar[key].top + 'px;width:'
                    + this.config.tool.toolBar[key].width + 'px;height:'
                    + this.config.tool.toolBar[key].height + 'px"');
                toolHTML.push(' onmouseover="' + this.obj
                    + '.m_over(this);" onmouseout="' + this.obj
                    + '.m_out(this);"' + ' onmousedown="' + this.obj
                    + '.m_down(this);" onmouseup="' + this.obj
                    + '.m_up(this);"');
                toolHTML.push('/>');
            }
        }
    } else {
        for (var key in this.config.tool.toolBar) {
            if (typeof (this.config.tool.toolBar[key].split) != "undefined") {
                toolHTML.push(this.config.tool.toolBar[key].split
                    .format(this.config.tool.icon.path));
            } else {
                toolHTML.push('<img id="tool_' + key + '" src="'
                    + this.config.tool.icon.path + 'icoBack.gif"');
                toolHTML.push(' title="' + this.config.tool.toolBar[key].title);
                toolHTML.push('" style="background:url(\''
                    + this.config.tool.icon.path + 'ico.gif\') ');
                toolHTML.push(this.config.tool.toolBar[key].left + 'px '
                    + this.config.tool.toolBar[key].top + 'px;width:'
                    + this.config.tool.toolBar[key].width + 'px;height:'
                    + this.config.tool.toolBar[key].height + 'px"');
                toolHTML.push(' onmouseover="' + this.obj
                    + '.m_over(this);" onmouseout="' + this.obj
                    + '.m_out(this);" onmousedown="' + this.obj
                    + '.m_down(this);" onmouseup="' + this.obj
                    + '.m_up(this);"');
                toolHTML.push('/>');
            }
        }
    }
    toolHTML.push('</div>');
    if (this.config.tool.convertHTML.isConvert) {
        toolHTML
            .push('<div align="center" id="'
                + this.config.tool.convertHTML.ctrlId
                + '" class="pure-u-2-24" " onclick="' + this.obj
                + '.convertHTML(this);">HTML</div>');
    }
    if (this.config.tool.adjust.adjustable) {
        var container = document.getElementById(this.config.container.id);
        toolHTML
            .push('<div align="center" title="\u5728\u6b64\u8c03\u6574\u7f16\u8f91\u5668\u5927\u5c0f\u3002\u9f20\u6807\u79bb\u5f00\u5373\u751f\u6548\u3002" ' +
                'class="pure-u-4-24 pure-form pure-form-aligned" '
                + this.config.tool.adjust.width
                + 'px;"><fieldset class="pure-group"><input onblur="'
                + this.obj
                + '.adjust(\'width\',this);" style="height: 30px;" placeholder="width" class="pure-input-1" type="text" value="'
                + container.style.width
                + '"/><input onblur="'
                + this.obj
                + '.adjust(\'height\',this);" style="height: 30px;" placeholder="height" class="pure-input-rounded pure-input-1" type="text" value="'
                + container.style.height + '"/></fieldset></div>');
    }
    toolHTML.push('</div>');
    return '<div class="tool-bar" id="' + this.config.tool.id + '" style="width:'
        + document.getElementById(this.config.container.id).style.width
        + ';height:auto;">' + toolHTML.join("") + '</div>';
};
SparrowEditor.prototype.initEditor = function (iframeId) {
    return '<iframe onload="'
        + this.obj
        + '.autoAdjust(this);'
        + this.obj
        + '.initContent();" class="'
        + iframeId
        + '" id="'
        + iframeId
        + '" name="'
        + iframeId
        + '" style="background:#ffffff;width: 100%;height:'
        + (document.getElementById(this.config.container.id).offsetHeight - this.config.tool.height)
        + "px"
        + ';scrollbar-face-color: #F7F5F4;" frameborder="0" marginheight="0" marginwidth="0" src="about:blank"></iframe>';
};
SparrowEditor.prototype.updateWordCount = function () {
    var obj = this.obj || this.body.id;
    var editor = $.global(obj);
    if ($(editor.config.wordCount)) {
        $(editor.config.wordCount).innerHTML = editor.frame.contentWindow.document.body.innerHTML.length;
    }
};

function getImgContainer(fileUrl, clientFileName, editor) {
    var imgArray = [];
    var imgDiv = $("+div");
    var fileId = file.getFileName(fileUrl).split('.')[0];
    imgDiv.s.className="";
    imgDiv.s.style.cssText = "width:92px;height:90px;float:left;padding:3px;border:#ccc 2px solid;";
    imgArray
        .push('<a target="_blank" href="{0}" title="{1}"><img style="width:91px;height:67px;" src="{2}"/></a>'
            .format(fileUrl, file.getFileName(clientFileName), fileUrl));
    imgArray.push('<br/><a href="javascript:void(0);" target="_self" onclick="'
        + editor.obj + '.attach.deleteOnServer(\'' + fileId
        + '\',this);">删除</a>'
        + '｜<a href="javascript:void(0);" target="_self" onclick="'
        + editor.obj + '.attach.insertEditor(\''
        + file.getFileName(clientFileName) + '\',\'' + fileUrl
        + '\');">插入</a>' + '<input type="hidden" name="'
        + editor.config.attach.fileUUID + '" value="' + fileId + '"/>');
    imgDiv.s.innerHTML = imgArray.join("");
    return imgDiv.s;
}
function clearHtmlFrame() {
    for (var i = 0; i < editorArray.length; i++) {
        if (editorArray[i].config.currentHtmlId) {
            document.getElementById(editorArray[i].config.currentHtmlId).style.display = "none";
            editorArray[i].config.currentHtmlId = null;
            editorArray[i].clear();
        }
    }
}
$(document).bind("onclick", function () {
    clearHtmlFrame();
});
// 从编辑器上传成功后的回调函数
// 图片上传 成功
SparrowEditor.prototype.initImageUploadEvent = function (coverKey) {
    var contentEditor = this;
    if (!coverKey) {
        coverKey = this.config.cover_key;
    }
    file.validateUploadFile = function (f, key) {
        if (file.checkFileType(file.getFileName(f.value), ["jpg", "jpeg",
                "gif", "png"], "error" + coverKey)) {
            //非编辑器上传
            if (key !== contentEditor.config.attach.key) {
                file.uploadCallBack = function (fileInfo, clientFileName) {
                    if (fileInfo.fileName) {
                        $("div" + coverKey).innerHTML = "<a href='" + fileInfo.fileName + "' target='_blank'><img src='" + fileInfo.fileName
                            + "'/></a>";
                        $("hdn" + coverKey).value = fileInfo.fileName;
                    }
                };
                file.uploadClick(false, '', key);
            } else {
                file.uploadCallBack = function (fileInfo, clientFileName, editor) {
                    if (clientFileName !== "") {
                        $(contentEditor.config.attach.uploadImgContainerId)
                            .appendChild(
                                getImgContainer(fileInfo.fileName,
                                    clientFileName, editor));
                        contentEditor.attach.insertEditor(file
                            .getFileName(clientFileName), fileInfo.fileName);
                    }
                };
                file.multiFile = -1;
                file.uploadClick(true, '', contentEditor.config.attach.iframeId
                    .format("image"), contentEditor);
            }
        }
    };
};
Sparrow.upload = {
    login_callback: function (parameters) {
        //pathKey+editorId=parameters
        var tabAttach = $(parameters + "_localUploadImgTab").getElementsByTagName(
            "iframe");
        for (var i = 0; i < tabAttach.length; i++) {
            tabAttach[i].src = tabAttach[i].src + "&t=" + Math.random();
        }
    }
};
/*
 * file.uploadCallBack = function(fileInfo, clientFileName, editor) { if
 * (clientFileName != "") { editor.config.attach.uploadedIndex++; if
 * (editor.config.attach.uploadedIndex ==
 * editor.config.attach.uploadingFileId.length) { // 多文件上传 所有文件上传完毕
 * file.multiFile = 0; editor.config.attach.uploadedIndex = 0;
 * editor.config.attach.uploadingFileId = new Array(); } table.id =
 * editor.config.attach.tableId; //var uploadFileInitHtml = new Array(); var
 * fileToolip = new Array(); var currentRowIndex =
 * $(file.uploadFrameId).parentNode.parentNode.rowIndex; if
 * (fileInfo.FileType.indexOf("image") == 0) {
 * fileToolip.push("\u6587\u4ef6\u540d :\u300a" +
 * file.getFileName(clientFileName) + "\u300b");
 * fileToolip.push("\u7531\u7f51\u53cb\uff1a" + browser.getUserName() + "\u4e8e" +
 * new Date().toLocaleString() + "\u4e0a\u4f20"); table.tr = [ { td : [ {
 * innerHTML : '<a target="_blank" href="' + fileInfo.FileName + '">' +
 * file.getFileName(clientFileName) + '</a>', align : "left", className :
 * "fileName" }, {}, { innerHTML : '<a href="javascript:void(0);"
 * target="_self" onclick="' + editor.obj + '.attach.deleteOnServer(\'' +
 * fileInfo.FileUUID + '\',this);">删除</a>' + '｜<a href="javascript:void(0);"
 * target="_self" onclick="' + editor.obj + '.attach.insertEditor(event,\'' +
 * fileToolip.join('\\r\\n') + '\',\'' + fileInfo.FileUUID + '\',\'' +
 * fileInfo.FileName + '\');">插入编辑器</a>' + '<input type="hidden" name="' +
 * editor.config.attach.fileUUID + '" value="' + fileInfo.FileUUID + '"/>',
 * align : "left", className : 'fileOperation' } ] } ];
 * editor.attach.insertEditor(currentRowIndex, fileToolip.join("\n"),
 * fileInfo.FileUUID, fileInfo.FileName); } else {
 * fileToolip.push('\u6587\u4ef6\u540d :' + file.getFileName(clientFileName));
 * fileToolip.push('\u6587\u4ef6\u5927\u5c0f:' + fileInfo.ContentLengthStr);
 * fileToolip.push('\u6587\u4ef6\u7c7b\u578b:' + fileInfo.FileType); table.tr = [ {
 * td : [ { innerHTML : '<a target="_blank" href="' + sparrow.rootPath +
 * '/FileDownLoad?fileUUID=' + fileInfo.FileUUID + '">' +
 * file.getFileName(clientFileName) + '</a>', align : 'left', className :
 * 'fileName' }, {}, { innerHTML : '<a href="javascript:void(0);"
 * target="_self" onclick="' + editor.obj + '.attach.deleteOnServer(\'' +
 * fileInfo.FileUUID + '\',this);">删除</a>' + '<input type="hidden" name="' +
 * editor.config.attach.fileUUID + '" value="' + fileInfo.FileUUID + '"/>',
 * align : 'left', className : 'fileOperation' } ] } ]; }
 * table.updateRow(currentRowIndex); if (file.multiFile == 1) {
 * window.setTimeout(editor.obj + ".attach.uploadFile();", 1000); } else if
 * (file.multiFile == 0) { // 文件上传完毕后提交 editor.attach._submit(); } } };
 */