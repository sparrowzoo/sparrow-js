function ImageCopper(el, option, complete) {
    this.preview = el;
    this.draging = this.moving = false;
    this.init(option);
    if (complete && typeof (complete) == "function") {
        this.OnComplete = complete;
    }
}
ImageCopper.prototype = {
    init: function (option) {
        //初始化一些参数
        this.offset = {
            x: 0,
            y: 0
        };
        var previewPosition = this.getPosition(this.preview);
        this.position = {
            X: previewPosition.Left,
            Y: previewPosition.Top
        };
        this.size = {
            Width: this.preview.offsetWidth,
            Height: this.preview.offsetHeight
        };
        this.selectSize = {
            Width: 0,
            Height: 0
        };
        this.dragElement = null;
        this.dragIndex = 0;
        var opt = this.option = {
            Width: 150,
            Height: 150,
            Left: 30,
            Top: 60,
            Locked: false,
            LockRate: false,
            Rate: 0
        };
        if (option) {
            this.selectSize.Width = this.option.Width;
            this.selectSize.Height = this.option.Height;
            for (var c in option) {
                this.option[c] = option[c];
            }
        }
        if (!this.option.Rate && this.option.LockRate) {
            this.option.Rate = this.option.Height / this.option.Width;
        }
        this.option.Left += this.position.X;
        this.option.Top += this.position.Y;

        //创建遮罩层
        var master = this.Master = document.createElement("div");
        master.style.color = "#ca151d";
        master.style.position = "absolute";
        master.style.width = this.size.Width + "px";
        master.style.height = this.size.Height + "px";
        master.style.left = previewPosition.Left + "px";
        master.style.top = previewPosition.Top + "px";
        master.style.backgroundColor = "#FFFFFF";
        master.style.filter = "alpha(opacity=50)";
        master.style.opacity = "0.5";
        document.body.appendChild(master);

        //创建拖动显示层.
        var content = this.Content = document.createElement("div");
        content.style.color = "blue";
        content.style.position = "absolute";
        content.style.width = opt.Width + "px";
        content.style.height = opt.Height + "px";
        content.style.top = opt.Top + "px";
        content.style.left = opt.Left + "px";
        content.style.background = "url(" + this.preview.src + ")";
        content.style.backgroundRepeat = "no-repeat";
        content.style.backgroundPosition = (-(this.option.Left - this.position.X) + "px")
        + " " + (-(this.option.Top - this.position.Y) + "px");
        //为了防止与父窗口的遮罩层冲突
        content.style.filter = "alpha(opacity=100)";
        content.style.opacity = "1";
        content.style.border = "#000 1px solid";
        document.body.appendChild(content);
        //创建拖动大小的div.
        var dragStyle = [{
            top: "0%",
            left: "0%",
            marginLeft: "1",
            marginTop: "1",
            cursor: "nw-resize"
        }, {
            top: "0%",
            left: "50%",
            marginLeft: "-4",
            marginTop: "1",
            cursor: "s-resize"
        }, {
            top: "0%",
            left: "100%",
            marginLeft: "-8",
            marginTop: "1",
            cursor: "sw-resize"
        }, {
            top: "50%",
            left: "0%",
            marginLeft: "1",
            marginTop: "-4",
            cursor: "w-resize"
        }, {
            top: "50%",
            left: "100%",
            marginLeft: "-8",
            marginTop: "-4",
            cursor: "w-resize"
        }, {
            top: "100%",
            left: "0%",
            marginLeft: "1",
            marginTop: "-8",
            cursor: "sw-resize"
        }, {
            top: "100%",
            left: "50%",
            marginLeft: "-4",
            marginTop: "-8",
            cursor: "s-resize"
        }, {
            top: "100%",
            left: "100%",
            marginLeft: "-20",
            marginTop: "-20",
            cursor: "nw-resize"
        }];
        for (var x = 7; x < dragStyle.length; x++) {
            var drag = document.createElement("div");
            drag.style.height = "20px";
            drag.style.width = "20px";
            drag.style.top = dragStyle[x].top;
            drag.style.left = dragStyle[x].left;
            drag.style.position = "absolute";
            drag.style.marginLeft = dragStyle[x].marginLeft + "px";
            drag.style.marginTop = dragStyle[x].marginTop + "px";
            drag.style.background="url("+ $.url.resource+"/images/drag.png)";
            drag.style.cursor = dragStyle[x].cursor;
            drag.onmousedown = $.bind(this, "dragStart", {
                Element: drag,
                Index: x + 1
            });
            drag.onmousemove = $.bind(this, "dragMoving");
            drag.onmouseout = $.bind(this, "dragStop");
            content.appendChild(drag);
        }

        //创建触发拖动的层
        var d = this.DragDiv = document.createElement("div");
        d.style.left = "7px";
        d.style.top = "7px";
        d.style.height = this.option.Height - 14 + "px";
        d.style.width = this.option.Width - 14 + "px";
        d.style.position = "absolute";
        d.style.cursor = "move";
        content.appendChild(d);
        d.onmousedown = $.bind(this, "moveStart");
        content.onmousemove = $.bind(this, "onMoving");
        content.onmouseup = $.bind(this, "moveStop");
        content.onmouseout =$.bind(this, "moveStop");
    },
    moveStart: function (e)//拖动位置开始.
    {
        console.info("拖动位置开始 moving"+this.moving);
        this.moving = true;
        var offset = this.getPosition(this.Content);
        if (offset) {
            this.offset.x = (e ? e.pageX : event.clientX
            + document.body.scrollLeft)
            - offset.Left;
            this.offset.y = (e ? e.pageY : event.clientY
            + document.body.scrollTop)
            - offset.Top;
        }
        if (this.Content.setCapture) {
            this.Content.setCapture();
        } else {
            this.Content.onmouseout =$.bind(this, "moveStop");
        }
    },
    onMoving: function (e)//拖动改变显示层位置.
    {
        console.info("拖动改变显示层位置 moving"+this.moving);
        if (!this.moving) {
            return;
        }
        var NewX = (e ? e.pageX : event.clientX + document.body.scrollLeft)
            - this.offset.x;
        var NewY = (e ? e.pageY : event.clientY + document.body.scrollTop)
            - this.offset.y;
        var x = this.position.X, y = this.position.Y, h = this.size.Height, w = this.size.Width;
        NewX = NewX > (w + x - this.option.Width) ? (w + x - this.option.Width)
            : NewX;
        NewY = NewY > (h + y - this.option.Height) ? (h + y - this.option.Height)
            : NewY;
        NewX = NewX < x ? x : NewX;
        NewY = NewY < y ? y : NewY;
        this.option.Left = NewX;
        this.option.Top = NewY;
        this.OnResize();
    },
    moveStop: function ()//拖动位置结束.
    {
        console.info("拖动位置结束 moving"+!this.moving);
        if (!this.moving) {
            return;
        }
        this.moving = false;
        if (this.Content.releaseCapture) {
            this.Content.releaseCapture();
        }
        this.Complete();
    },
    dragStart: function (param,e)//拖动尺寸开始,初始化一些数据.
    {
        console.info("拖动尺寸开始,初始化一些数据."+this.option.Locked);
        if (this.option.Locked) {
            return;
        }
        this.draging = true;
        this.dragElement = param.Element;
        this.dragIndex = param.Index;
        var offset = this.getPosition(this.dragElement);
        if (offset) {
            this.offset.x = (e ? e.pageX : event.clientX
            + document.body.scrollLeft)
            - offset.Left;
            this.offset.y = (e ? e.pageY : event.clientY
            + document.body.scrollTop)
            - offset.Top;
        }
        if (this.dragElement.setCapture) {
            this.dragElement.setCapture();
        } else {
            this.dragElement.onmouseup =$.bind(this, "dragStop");
        }
    },
    dragStop: function ()//拖动尺寸结束.
    {
        console.info("拖动尺寸结束."+!this.draging);
        if (!this.draging) {
            return;
        }
        this.draging = false;
        if (this.dragElement.releaseCapture) {
            this.dragElement.releaseCapture();
        }
        this.Complete();
    },
    OnResize: function ()//设置拖动时产生的尺寸和位置到dom元素上.
    {
        console.info("设置拖动时产生的尺寸和位置到dom元素上."+this.option.Left+"|"+this.option.Top);
        this.Content.style.left = this.option.Left + "px";
        this.Content.style.top = this.option.Top + "px";
        this.Content.style.width = this.option.Width + "px";
        this.Content.style.height = this.option.Height + "px";
        this.DragDiv.style.width = this.option.Width - 14 + "px";
        this.DragDiv.style.height = this.option.Height - 14 + "px";
        this.Content.style.backgroundPosition = (-(this.option.Left - this.position.X) + "px")
        + " " + (-(this.option.Top - this.position.Y) + "px");
    },
    dragMoving: function (e)//拖动改变显示层尺寸.
    {
        //console.info("拖动改变显示层尺寸this.draging"+this.draging);
        //console.info("拖动改变显示层尺寸this.option.Locked"+this.option.Locked);
        if (!this.draging || this.option.Locked) {
            return;
        }

        switch (this.dragIndex) {
            case 1:
            {

                var Original = this.getPosition(this.dragElement);
                var NewPoint = {
                    Left: (e ? e.pageX : event.clientX + document.body.scrollLeft),
                    Top: (e ? e.pageY : event.clientY + document.body.scrollTop)
                };
                var StepX = Original.Left - NewPoint.Left + this.offset.x;
                var StepY = Original.Top - NewPoint.Top + this.offset.y;
                if (this.option.LockRate) {
                    StepY = (this.option.Width + StepX) * this.option.Rate
                    - this.option.Height;
                }
                if (this.option.Left - StepX < this.position.X
                    || this.option.Top - StepY < this.position.Y
                    || this.option.Width + StepX < this.selectSize.Width
                    || this.option.Height + StepY < this.selectSize.Height) {
                    return;
                }

                this.option.Left -= StepX;
                this.option.Top -= StepY;
                this.option.Width += StepX;
                this.option.Height += StepY;
                this.OnResize();
                break;
            }
            case 2:
            {
                var Original = this.getPosition(this.dragElement);
                console.info(document.body.scrollLeft);
                console.info(document.body.scrollTop);
                var NewPoint = {
                    Left: (e ? e.pageX : event.clientX + document.body.scrollLeft),
                    Top: (e ? e.pageY : event.clientY + document.body.scrollTop)
                };
                var StepY = Original.Top - NewPoint.Top + this.offset.y;
                if (this.option.Top - StepY < this.position.Y) {
                    console.info("2 return ");
                    return;
                }
                console.info("StepY"+StepY);
                if (this.option.LockRate) {
                    var StepX = this.option.Height / this.option.Rate
                        - this.option.Width;
                    if (this.option.Left - StepX / 2 < this.position.X
                        || this.option.Left + StepX / 2 + this.option.Width > this.position.X
                        + this.size.Width
                        || this.option.Width + StepX < this.selectSize.Width) {
                        console.info("2 return LockRate");
                        return;
                    }
                    this.option.Width += StepX;
                    this.option.Left -= StepX / 2;
                }
                if (this.option.Height + StepY < this.selectSize.Height) {
                    return;
                }
                this.option.Top -= StepY;
                this.option.Height += StepY;
                this.OnResize();
                break;
            }
            case 3:
            {
                var Original = this.getPosition(this.dragElement);
                var NewPoint = {
                    Left: (e ? e.pageX : event.clientX + document.body.scrollLeft),
                    Top: (e ? e.pageY : event.clientY + document.body.scrollTop)
                };
                var StepY = Original.Top - NewPoint.Top + this.offset.y;
                var StepX = NewPoint.Left - Original.Left - this.offset.x;
                if (this.option.Top - StepY < this.position.Y) {
                    return;
                }
                if (this.option.LockRate) {
                    StepX = (this.option.Height + StepY) / this.option.Rate
                    - this.option.Width;
                }
                if (this.option.Left + StepX + this.option.Width > this.position.X
                    + this.size.Width
                    || this.option.Width + StepX < this.selectSize.Width
                    || this.option.Height + StepY < this.selectSize.Height) {
                    return;
                }
                this.option.Width += StepX;
                this.option.Top -= StepY;
                this.option.Height += StepY;
                this.OnResize();
                break;
            }
            case 4:
            {
                var Original = this.getPosition(this.dragElement);
                var NewPoint = {
                    Left: (e ? e.pageX : event.clientX + document.body.scrollLeft),
                    Top: (e ? e.pageY : event.clientY + document.body.scrollTop)
                };
                var StepX = Original.Left - NewPoint.Left + this.offset.x;
                if (this.option.Left - StepX < this.position.X) {
                    return;
                }
                if (this.option.LockRate) {
                    var StepY = this.option.Width * this.option.Rate
                        - this.option.Height;
                    if (this.option.Top - StepY / 2 < this.position.Y
                        || this.option.Height + this.option.Top - StepY / 2 > this.size.Height
                        + this.position.Y
                        || this.option.Height + StepY < this.selectSize.Height) {
                        return;
                    }
                    this.option.Height += StepY;
                    this.option.Top -= StepY / 2;
                }
                if (this.option.Width + StepX < this.selectSize.Width) {
                    return;
                }
                this.option.Left -= StepX;
                this.option.Width += StepX;
                this.OnResize();
                break;
            }
            case 5:
            {
                var Original = this.getPosition(this.dragElement);
                var NewPoint = {
                    Left: (e ? e.pageX : event.clientX + document.body.scrollLeft),
                    Top: (e ? e.pageY : event.clientY + document.body.scrollTop)
                };
                var StepX = NewPoint.Left - Original.Left - this.offset.x;
                if (this.option.Left + this.option.Width + StepX > this.position.X
                    + this.size.Width) {
                    return;
                }
                if (this.option.LockRate) {
                    var StepY = (this.option.Width + StepX) * this.option.Rate
                        - this.option.Height;
                    if (this.option.Top - StepY / 2 < this.position.Y
                        || this.option.Height + this.option.Top + StepY / 2 > this.position.Y
                        + this.size.Height
                        || this.option.Height + StepY < this.selectSize.Height) {
                        return;
                    }
                    this.option.Height += StepY;
                    this.option.Top -= StepY / 2;
                }
                if (this.option.Width + StepX < this.selectSize.Width) {
                    return;
                }
                this.option.Width += StepX;
                this.OnResize();
                break;
            }
            case 6:
            {
                var Original = this.getPosition(this.dragElement);
                var NewPoint = {
                    Left: (e ? e.pageX : event.clientX + document.body.scrollLeft),
                    Top: (e ? e.pageY : event.clientY + document.body.scrollTop)
                };
                var StepX = Original.Left - NewPoint.Left + this.offset.x;
                var StepY = NewPoint.Top - Original.Top - this.offset.y;
                if (this.option.LockRate) {
                    StepY = (this.option.Width + StepX) * this.option.Rate
                    - this.option.Height;
                }
                if (this.option.Left - StepX < this.position.X
                    || this.option.Top + StepY + this.option.Height > this.position.Y
                    + this.size.Height
                    || this.option.Width + StepX < this.selectSize.Width
                    || this.option.Height + StepY < this.selectSize.Height) {
                    return;
                }
                this.option.Left -= StepX;
                this.option.Width += StepX;
                this.option.Height += StepY;
                this.OnResize();
                break;
            }
            case 7:
            {
                var Original = this.getPosition(this.dragElement);
                var NewPoint = {
                    Left: (e ? e.pageX : event.clientX + document.body.scrollLeft),
                    Top: (e ? e.pageY : event.clientY + document.body.scrollTop)
                };
                var StepY = NewPoint.Top - Original.Top - this.offset.y;
                if (this.option.Top + StepY + this.option.Height > this.position.Y
                    + this.size.Height) {
                    return;
                }
                if (this.option.LockRate) {
                    var StepX = (this.option.Height + StepY) / this.option.Rate
                        - this.option.Width;
                    if (this.option.Left - StepX / 2 < this.position.X
                        || this.option.Left + StepX + this.option.Width > this.position.X
                        + this.size.Width
                        || this.option.Width + StepX < this.selectSize.Width) {
                        return;
                    }
                    this.option.Width += StepX;
                    this.option.Left -= StepX / 2;
                }
                if (this.option.Height + StepY < this.selectSize.Height) {
                    return;
                }
                this.option.Height += StepY;
                this.OnResize();
                break;
            }
            case 8:
            {
                var Original = this.getPosition(this.dragElement);
                var NewPoint = {
                    Left: (e ? e.pageX : event.clientX + document.body.scrollLeft),
                    Top: (e ? e.pageY : event.clientY + document.body.scrollTop)
                };
                var StepX = NewPoint.Left - Original.Left - this.offset.x;
                var StepY = NewPoint.Top - Original.Top - this.offset.y;
                if (this.option.LockRate) {
                    StepY = (this.option.Width + StepX) * this.option.Rate
                    - this.option.Height;
                }
                if (this.option.Left + StepX + this.option.Width > this.position.X
                    + this.size.Width
                    || this.option.Top + StepY + this.option.Height > this.position.Y
                    + this.size.Height
                    || this.option.Width + StepX < this.selectSize.Width
                    || this.option.Height + StepY < this.selectSize.Height) {
                    return;
                }
                this.option.Width += StepX;
                this.option.Height += StepY;
                this.OnResize();
                break;
            }
        }
    },
    getPosition: function (el)//取得指定元素的绝对位置.
    {
        var result = {
            Top: 0,
            Left: 0
        };
        result.Left = el.offsetLeft;
        result.Top = el.offsetTop;
        while (el = el.offsetParent) {
            result.Top += el.offsetTop;
            result.Left += el.offsetLeft;
        }
        return result;
    },
    Release: function () {
        this.Master.parentNode.removeChild(this.Master);
        this.Content.parentNode.removeChild(this.Content);
        this.DragDiv.parentNode.removeChild(this.DragDiv);
    },
    Complete: function () {
        //触发拖动完成的事件,传出当前的状态数据.
        this.OnComplete(this.option.Left - this.position.X, this.option.Top
        - this.position.Y, this.option.Width, this.option.Height);
    },
    GetFunctionWithEvent: function (Variable, Method, Parameter)//取得指定对象的指定方法,并传递Window.Event事件参数.
    {
        return function (e) {
            if (Method.indexOf("|") > -1) {
                var MethodArray = Method.split("|");
                for (var x = 0; x < MethodArray.length; x++) {
                    Variable[MethodArray[x]](e, Parameter);
                }
            } else {
                Variable[Method](e, Parameter);
            }
        }
    },
    OnComplete: function (Left, Top, Width, Height) {
        //接收当前状态数据的方法.
    }
};
//***************************************************************************************************//
//保存用户选择的图片位置
var currentImageSize = {
    top: 75,
    left: 75,
    width: 150,
    height: 150
};
//初始化上传按钮状态
//FileUpload.servlet中会调用该函数  不删除备份使用
var imageCopper = null;
var config = null;
document.ready(function () {
    var hdnImageCooperConfig = $("#.hdnImageCooperConfig");
    config = {
        preview: hdnImageCooperConfig.attr("preview"),
        current: hdnImageCooperConfig.attr("current"),
        parent_current: hdnImageCooperConfig.attr("parent_current"),
        parent_input: hdnImageCooperConfig.attr("parent_input"),
        post: hdnImageCooperConfig.attr("post"),
        command: hdnImageCooperConfig.attr("command"),
        business_id: hdnImageCooperConfig.attr("business_id")
    };
    var parentImage=(parent.manage ? parent.manage.document : parent.document).getElementById(config.parent_current);
    if(parentImage!=null) {
        $(config.current).src = $.randomUrl(parentImage.src);
    }
    file.validateUploadFile = function (f) {
        file.uploadClick(false, "", "fileUpload");
    };
    //设置上传成功后的回调函数
    file.uploadCallBack = function (fileInfo, clientFileName) {
        var currentImage = $(config.preview);
        currentImage.src = $.randomUrl(fileInfo.fileName);
        if (imageCopper !== null) {
            imageCopper.Release();
        }
        imageCopper = new ImageCopper(currentImage, {
            LockRate: true,
            Left: 75,
            Top: 75
        }, function (x, y, w, h) {
            currentImageSize.top = x;
            currentImageSize.left = y;
            currentImageSize.width = w;
            currentImageSize.height = h;
        });
        file.reset();
    };

    $(config.command).onclick = function () {
        var businessId =$.request(config.business_id);
        var previewImage = $(config.preview);
        var imageUrl=previewImage.src.split('?')[0];
        var postString = "parameter=" + imageUrl+ ","
            + currentImageSize.top + "," + currentImageSize.left + ","
            + currentImageSize.width + "," + currentImageSize.height
            + "," + businessId;
        var postUrl = $.url.root + config.post;
        ajax
            .json(
            postUrl,
            postString,
            function (result) {
                //配置文本
                var image_url =imageUrl
                    + "?time=" + new Date();
                var w = (parent.manage ? parent.manage.document : parent.document);
                w.getElementById(config.parent_current).src = image_url;
                if ($(config.parent_input)) {
                    w.getElementById(config.parent_input).value = image_url;
                }
                $(config.current).src = image_url;
                $.message("operation success!");
            });
    }
});