<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri="http://www.sparrowzoo.com/ui" prefix="j" %>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Sparrow Markdown &ndash; Sparrow JS Framework</title>
    <j:style href="$resource/assets/styles/pure-css/pure.css"/>
    <!--[if lte IE 8]>
    <j:style href="$resource/assets/styles/layouts-old-ie.css"/>
    <![endif]-->
    <!--[if gt IE 8]><!-->
    <j:style href="$resource/assets/styles/layouts.css"/>
    <!--<![endif]-->
    <j:script src="$resource/assets/scripts-dev/sparrow.js"/>

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
            border-left: 3px solid #ccc;
            margin-left: 10px;
            padding: 10px;
        }

        .highlight {
            background-color: red;
        }

        .quote {
            text-indent: 10px;
            border-left: 1px solid red;
        }

        .code {
            background-color: #ccc;
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
        });
    </script>
</head>
<body>


<div id="layout">
    <jsp:include page="menu.jsp"/>
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
横线支持
---
正文部分**加粗**

*倾斜*

~~删除~~

++下划线++

==重点==

> 引用

# h1
## h2
### h3
#### h4
##### h5
###### h6
- 1
   - 1.1
      - 1.1.1
         - 1.1.1.1
         - 1.1.1.1.1
         - 1.1.1.1.2
      - 1.1.2
         - 1.1.2.1
         - 1.1.2.2
   - 1.2
   - 1.3
- 2
- 3
1. 1
2. 2
3. 3
   1. 3.1
       1. 3.1.1
       2. 3.1.2
       3. 3.1.3
   2. 3.2
       1. 3.2.1
这时是3.2.1内容**嵌套的加粗文本**==嵌套高亮文本==
4. 4
5. 5
5的列表内容

表头1 | 表头2
---|---
内容自定义<br/>回车行吗？| 2222
row 2 col 1 | row 2 col 2


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

![image](http://s3.sinaimg.cn/bmiddle/003aGgFyzy6IXdCe80y52)

- [ ] 这里![图标](http://note.youdao.com/favicon.ico)是*复选框*
- [x] 这里![图标](http://note.youdao.com/favicon.ico)==是复选框==



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