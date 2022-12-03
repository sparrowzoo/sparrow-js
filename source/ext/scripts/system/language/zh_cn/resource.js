var lang = {
    command: {
        save: "保存",
        cancel: "取消",
        update: "更新",
        add: "新建"
    },
    message: {
        save: "资源[{0}]新建成功",
        update: "资源{0}更新成功",
        delete_hash_child: "该资源下有子资源，故不能删除！",
        delete_confirm: "资源删除后将无法恢复，您确认将该资源删除？",
        del: "删除成功！",
        list_url_not_set: "未设置列表链接",
        accessDenied:"访问被拒绝"
    }
};
var resourceInfo =
{
    txtParentResourceName: {
        errorCtrlId: "errorParentResourceName",
        prompt: "请选择的所属资源",
        nullError: "请选择的所属资源"
    },
    txtAppName: {
        errorCtrlId: "errorAppName",
        prompt: "请选择所属应用",
        nullError: "请选择所属应用"
    },
    hdnAppId:{},
    txtUrl: {
        errorCtrlId: "errorUrl",
        prompt: "请输入资源请求的url",
        nullError: "请输入资源请求的url"
    },
    txtMethod: {
        errorCtrlId: "errorMethod",
        prompt: "请输入资源请求的Method get post put【三选一,默认为post】",
        nullError: "请输入资源请求的Method",
        options:['get','post','put'],
        defaultValue:'post'
    },
    hdnParentId:{},
    txtPermission: {
        errorCtrlId: "errorPermission",
        prompt: "请输入权限标识",
        allowNull:true
    },
    txtResourceName: {
        errorCtrlId: "errorResourceName",
        prompt: "资源名称",
        nullError: "资源名称不能为空"
    },
    txtAccessUrl: {
        errorCtrlId: "errorAccessUrl",
        prompt: "请输入访问该资源的url路径<br/>例如:JAVA资源的url为java",
        allowNull:true
    },
    txtResourceType: {
        errorCtrlId: "errorResourceType",
        prompt: "1系统菜单 2系统页面 3事件",
        options:[1, 2, 3],
        defaultValue:2
    },
    txtMaxRecordCount: {
        errorCtrlId: "errorMaxRecordCount",
        prompt: "资源下允许新建的最大记录数<br/>-1为不限制(默认)",
        defaultValue: -1
    },
    txtManager: {
        errorCtrlId: "errorManager",
        prompt: "资源的管理员 默认为admin",
        defaultValue:"admin"
    },
    txtManageUrl: {
        errorCtrlId: "errorManageUrl",
        prompt: "资源后台管理地址<br/> CMS 版块示例 /cms/manage/$access，类型为系统菜单时与编码一致",
        nullError: "资源后台管理地址<br/> CMS 版块示例 /cms/manage/$access，类型为系统菜单时与编码一致"
    },
    txtNewUrl: {
        errorCtrlId: "errorNewUrl",
        prompt: "资源发帖时的地址 CMS 版块示例 /cms/article",
        defaultValue:""
    },
    txtListUrl: {
        errorCtrlId: "errorListUrl",
        prompt: "资源列表显示地址<br/> CMS 版块示例 /list/$access,类型为系统菜单时与编码一致",
        nullError:"资源列表显示地址<br/> CMS 版块示例 /list/$access,类型为系统菜单时与编码一致"
    },
    txtDetailUrl: {
        errorCtrlId: "errorDetailUrl",
        prompt: "资源下内容显示地址 CMS 版块示例  /detail",
        defaultValue:""
    },
    txtUploadKey: {
        errorCtrlId: "errorUploadKey",
        prompt: "请输入文件上传的AttachKey,与system_config.properties中配置的一致。",
        allowNull:true
    },
    txtOpenType: {
        errorCtrlId: "errorOpenType",
        prompt: "打开方式 _blank _self _parent 默认为manage",
        options:["_blank","_self","_parent","manage"],
        defaultValue:"manage"
    },
    txtStatus: {
        errorCtrlId: "errorStatus",
        prompt: "0无效 1 有效",
        options: [0, 1],
        defaultValue:1
    },
    hdnCover: {
        allowNull:true
    },
    hdnIco: {
        allowNull:true
    },
    txtRemark: {
        errorCtrlId: "errorRemark",
        prompt: "资源简介，不超过500 字",
        allowNull:true
    }
};