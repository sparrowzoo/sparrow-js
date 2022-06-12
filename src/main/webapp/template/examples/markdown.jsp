<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri="http://www.sparrowzoo.com/ui" prefix="j" %>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Sparrow Markdown &ndash; Sparrow JS Framework</title>
    <j:style href="$resource/styles/pure-css/pure.css"/>
    <!--[if lte IE 8]>
    <j:style href="$resource/styles/layouts-old-ie.css"/>
    <![endif]-->
    <!--[if gt IE 8]><!-->
    <j:style href="$resource/styles/layouts.css"/>
    <!--<![endif]-->
    <j:script src="$resource/scripts-dev/sparrow.js"/>

    <script language="javascript" type="text/javascript"
            src="/assets/scripts-dev/code-prettify/sparrow-prettify.js?lang=css&skin=sunburst"></script>

    <style type="text/css">
        hr {
            border: none;
            border-bottom: 1px #ccc dashed;
        }

        .bold {
            font-weight: bold;
        }

        .italic {
            font-style: italic;
        }

        .underline {
            text-decoration: none;
            border-bottom: 1px solid gray;
        }

        .erasure {
            text-decoration: line-through
        }

        .tab {
            text-indent: 10px;
            border-left: 1px solid red;
        }

        .highlight {
            color: #c7254e;
            background-color: #f9f2f4;
            border-radius: 4px;
        }

        .quote {
            padding: 20px;
            background-color: #f2f2f2;
            border-left: 6px solid #b3b3b3;
            word-break: break-word;
            font-size: 16px;
            font-weight: 400;
            line-height: 30px;
            margin: 0 0 20px;
        }

        .code {
            background-color: #ccc;
        }

        .image-package {
            margin: 0 -40px 20px;
            width: calc(100% + 80px);
            text-align: center;
            font-size: 0;
        }

         .image-package label {
            min-width: 20%;
            max-width: 80%;
            display: inline-block;
            padding: 10px;
            margin: 0 auto;
            border-bottom: 1px solid #d9d9d9;
            font-size: 13px;
            color: #999;
            line-height: 1.7;
        }
        .image-package img {
            max-width: 100%;
            width: auto;
            height: auto;
            vertical-align: middle;
            border: 0;
        }

        ol{
            list-style-type: decimal;
        }
        .ol_0{
            list-style-type: lower-roman;
        }
        .ol_1{
            list-style-type: lower-alpha;
        }
        .ol_1 ol{
            list-style-type: lower-alpha;
        }
    </style>

    <script type="text/javascript">
        var lastPressTime = new Date().getTime();
        var lastContext = "";

        function preview() {
            lastPressTime = new Date().getTime();
        }

        window.setInterval(function () {
            var currentTime = new Date().getTime();
            if (currentTime - lastPressTime > 500 && lastContext !== $("#txtContent").value()) {
                previewRequest();
            }
        }, 1000);

        //(getOrPost, url, responsef, postStr, srcElement)
        function previewRequest() {
            $.ajax.req("POST", "${root_path}" + "/preview.json", function (responseText) {
                var json = responseText.json();
                if (json.code == 0) {
                    $("#divPreview").html(json.data.html);
                    PR.prettyPrint();
                }
                lastContext = $("#txtContent").value()
            }, "markdown=" + $("#txtContent").value());
        }
        document.ready(function () {
            new $.menu("verticalMenu", $.VERTICAL,"menuLink").init();
            //textarea支持tab缩进
            $("#txtContent").bind(
                'onkeydown',
                function(e) {
                    if (e.keyCode !== 9) {return;}
                        e.preventDefault();
                        var indent = '    ';
                        var start = this.selectionStart;
                        var end = this.selectionEnd;
                        var selected = window.getSelection().toString();
                        selected = indent + selected.replace(/\n/g, '\n' + indent);
                        this.value = this.value.substring(0, start) + selected
                            + this.value.substring(end);
                        this.setSelectionRange(start + indent.length, start
                            + selected.length);
                })
        });
    </script>
</head>
<body>


<div id="layout">
    <jsp:include page="/template/examples/menu.jsp"/>
    <div id="main">
        <div class="header">
            <h1>Sparrow markdown</h1>
            <h2>sparrow markdown</h2>
        </div>

        <div style="max-width: 100%;" class="content">
            <div style="width: 100%;" class="pure-g">
                <textarea id="txtContent" onkeyup="preview(this);" style="max-height: 100%;height:800px;"
                          class="pure-u-11-24"
                          contenteditable="true">
Sparrow markdown
---
正文部分**加粗**

*倾斜*

~~删除~~

++下划线++

==重点==

> 引用，这里是引用文字，回车换行支持

# h1
## h2
### h3
#### h4
##### h5
###### h6
- 这里是标题
    - 子标题
        - 孙子标题
            - 从孙子标题
            - 从孙子标题2
            - 从孙子标题3
        - 孙子标题2
            - 孙子标题2的大儿子
            - 孙子标题2的小儿子
                - 孙子标题2的大儿子
                - 孙子标题2的小儿子
- 第二个标题
- 第三个标题


1. 这里是标题
    1. 子标题
        1. 孙子标题
            1. 从孙子标题
            1. 从孙子标题2
            1. 从孙子标题3
        1. 孙子标题2
            1. 孙子标题2的大儿子
            1. 孙子标题2的小儿子
                1. 孙子标题2的大儿子
                1. 孙子标题2的小儿子
1. 第二个标题
1. 第三个标题
1. **嵌套的加粗文本**==嵌套高亮文本==


表头1 | 表头2
---|---
第一行，第一列|第一行，第二列
第二行，第一列 |第二行，第二列


```
math 数学表达式暂不支持，当做代码处理
E = mc^2

E=MC^5
E=mc-5
```

```
print("代码段")
printf("引号==是红==色 不允许嵌套")

p()有括号认为是方法
class A {}
```
### H3

>引用
引用的内容
引用的内容下一行

引用结束...

# H1
回车结束...


*斜体字 ++下划线++==高亮==**加粗(都支持嵌套哟)***

![图片的标题](http://s3.sinaimg.cn/bmiddle/003aGgFyzy6IXdCe80y52)

- [ ] 复选框![图标](http://note.youdao.com/favicon.ico)
- [x] ==选中复选框==![图标](http://note.youdao.com/favicon.ico)



    TAB 引用 TAB END
回车顶头tab 结束



==引用==这里也是可以==嵌套==使用的

代码引用部分
```
  @Override public MarkEntity validate(MarkContext markContext) {
        String line;
        //-4 represent tab key
        int pointer=markContext.getCurrentPointer()+this.mark().getStart().length()-4;
        int start=pointer;
        while ((line = markContext.readLine(pointer)).startsWith("    ")) {
            pointer += line.length();
        }
        MarkEntity markEntity = MarkEntity.createCurrentMark(this.mark(), pointer);
        markEntity.setContent(markContext.getContent().substring(start, pointer).replaceAll("\n+","<br/>"));
        return markEntity;
    }
```





                </textarea>
                <div id="divPreview" style="max-height: 100%;height:800px;overflow: scroll;" class="pure-u-12-24"></div>
            </div>
        </div>
    </div>
</div>
</body>
</html>