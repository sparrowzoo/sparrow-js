function ImageCopper(el, option, complete) {
  this.preview = el;
  this.draging = this.moving = false;
  this.init(option);
  if (complete && typeof complete == "function") {
    this.OnComplete = complete;
  }
}

ImageCopper.prototype = {
  init: function (option) {
    //初始化一些参数
    this.offset = {
      x: 0,
      y: 0,
    };
    var previewPosition = this.getPosition(this.preview);
    this.position = {
      x: previewPosition.left,
      y: previewPosition.top,
    };
    this.size = {
      width: this.preview.offsetwidth,
      height: this.preview.offsetheight,
    };
    this.selectSize = {
      width: 0,
      height: 0,
    };
    this.dragElement = null;
    this.dragIndex = 0;
    var opt = (this.option = {
      width: 150,
      height: 150,
      left: 30,
      top: 60,
      locked: false,
      lockRate: false,
      rate: 0,
    });
    if (option) {
      this.selectSize.width = this.option.width;
      this.selectSize.height = this.option.height;
      for (var c in option) {
        this.option[c] = option[c];
      }
    }
    if (!this.option.rate && this.option.lockRate) {
      this.option.rate = this.option.height / this.option.width;
    }
    this.option.left += this.position.x;
    this.option.top += this.position.y;

    //创建遮罩层
    var master = (this.master = document.createElement("div"));
    master.style.color = "#ca151d";
    master.style.position = "absolute";
    master.style.width = this.size.width + "px";
    master.style.height = this.size.height + "px";
    master.style.left = previewPosition.left + "px";
    master.style.top = previewPosition.top + "px";
    master.style.backgroundColor = "#FFFFFF";
    master.style.filter = "alpha(opacity=50)";
    master.style.opacity = "0.5";
    document.body.appendChild(master);

    //创建拖动显示层.
    var content = (this.content = document.createElement("div"));
    content.style.color = "blue";
    content.style.position = "absolute";
    content.style.width = opt.width + "px";
    content.style.height = opt.height + "px";
    content.style.top = opt.top + "px";
    content.style.left = opt.left + "px";
    content.style.background = "url(" + this.preview.src + ")";
    content.style.backgroundRepeat = "no-repeat";
    content.style.backgroundPosition =
      -(this.option.left - this.position.x) +
      "px" +
      " " +
      (-(this.option.top - this.position.y) + "px");
    //为了防止与父窗口的遮罩层冲突
    content.style.filter = "alpha(opacity=100)";
    content.style.opacity = "1";
    content.style.border = "#000 1px solid";
    document.body.appendChild(content);
    //创建拖动大小的div.
    var dragStyle = [
      {
        top: "0%",
        left: "0%",
        marginLeft: "1",
        marginTop: "1",
        cursor: "nw-resize",
      },
      {
        top: "0%",
        left: "50%",
        marginLeft: "-4",
        marginTop: "1",
        cursor: "s-resize",
      },
      {
        top: "0%",
        left: "100%",
        marginLeft: "-8",
        marginTop: "1",
        cursor: "sw-resize",
      },
      {
        top: "50%",
        left: "0%",
        marginLeft: "1",
        marginTop: "-4",
        cursor: "w-resize",
      },
      {
        top: "50%",
        left: "100%",
        marginLeft: "-8",
        marginTop: "-4",
        cursor: "w-resize",
      },
      {
        top: "100%",
        left: "0%",
        marginLeft: "1",
        marginTop: "-8",
        cursor: "sw-resize",
      },
      {
        top: "100%",
        left: "50%",
        marginLeft: "-4",
        marginTop: "-8",
        cursor: "s-resize",
      },
      {
        top: "100%",
        left: "100%",
        marginLeft: "-20",
        marginTop: "-20",
        cursor: "nw-resize",
      },
    ];
    for (var x = 7; x < dragStyle.length; x++) {
      var drag = document.createElement("div");
      drag.style.height = "20px";
      drag.style.width = "20px";
      drag.style.top = dragStyle[x].top;
      drag.style.left = dragStyle[x].left;
      drag.style.position = "absolute";
      drag.style.marginLeft = dragStyle[x].marginLeft + "px";
      drag.style.marginTop = dragStyle[x].marginTop + "px";
      drag.style.background = "url(" + $.url.resource + "/images/drag.png)";
      drag.style.cursor = dragStyle[x].cursor;
      drag.onmousedown = $.bind(this, "dragStart", {
        element: drag,
        index: x + 1,
      });
      drag.onmousemove = $.bind(this, "dragMoving");
      drag.onmouseout = $.bind(this, "dragStop");
      content.appendChild(drag);
    }

    //创建触发拖动的层
    var d = (this.dragDiv = document.createElement("div"));
    d.style.left = "7px";
    d.style.top = "7px";
    d.style.height = this.option.height - 14 + "px";
    d.style.width = this.option.width - 14 + "px";
    d.style.position = "absolute";
    d.style.cursor = "move";
    content.appendChild(d);
    d.onmousedown = $.bind(this, "moveStart");
    content.onmousemove = $.bind(this, "onMoving");
    content.onmouseup = $.bind(this, "moveStop");
    content.onmouseout = $.bind(this, "moveStop");
  },
  moveStart: function (
    e //拖动位置开始.
  ) {
    console.info("拖动位置开始 moving" + this.moving);
    this.moving = true;
    var offset = this.getPosition(this.content);
    if (offset) {
      this.offset.x =
        (e ? e.pageX : event.clientX + document.body.scrollLeft) - offset.left;
      this.offset.y =
        (e ? e.pageY : event.clientY + document.body.scrollTop) - offset.top;
    }
    if (this.content.setCapture) {
      this.content.setCapture();
    } else {
      this.content.onmouseout = $.bind(this, "moveStop");
    }
  },
  onMoving: function (
    e //拖动改变显示层位置.
  ) {
    console.info("拖动改变显示层位置 moving" + this.moving);
    if (!this.moving) {
      return;
    }
    var newX =
      (e ? e.pageX : event.clientX + document.body.scrollLeft) - this.offset.x;
    var newY =
      (e ? e.pageY : event.clientY + document.body.scrollTop) - this.offset.y;
    var x = this.position.x,
      y = this.position.y,
      h = this.size.height,
      w = this.size.width;
    newX = newX > w + x - this.option.width ? w + x - this.option.width : newX;
    newY =
      newY > h + y - this.option.height ? h + y - this.option.height : newY;
    newX = newX < x ? x : newX;
    newY = newY < y ? y : newY;
    this.option.left = newX;
    this.option.top = newY;
    this.onResize();
  },
  moveStop: function () //拖动位置结束.
  {
    console.info("拖动位置结束 moving" + !this.moving);
    if (!this.moving) {
      return;
    }
    this.moving = false;
    if (this.content.releaseCapture) {
      this.content.releaseCapture();
    }
    this.complete();
  },
  dragStart: function (
    param,
    e //拖动尺寸开始,初始化一些数据.
  ) {
    console.info("拖动尺寸开始,初始化一些数据." + this.option.locked);
    if (this.option.locked) {
      return;
    }
    this.draging = true;
    this.dragElement = param.element;
    this.dragIndex = param.index;
    var offset = this.getPosition(this.dragElement);
    if (offset) {
      this.offset.x =
        (e ? e.pageX : event.clientX + document.body.scrollLeft) - offset.left;
      this.offset.y =
        (e ? e.pageY : event.clientY + document.body.scrollTop) - offset.top;
    }
    if (this.dragElement.setCapture) {
      this.dragElement.setCapture();
    } else {
      this.dragElement.onmouseup = $.bind(this, "dragStop");
    }
  },
  dragStop: function () //拖动尺寸结束.
  {
    console.info("拖动尺寸结束." + !this.draging);
    if (!this.draging) {
      return;
    }
    this.draging = false;
    if (this.dragElement.releaseCapture) {
      this.dragElement.releaseCapture();
    }
    this.Complete();
  },
  onResize: function () //设置拖动时产生的尺寸和位置到dom元素上.
  {
    console.info(
      "设置拖动时产生的尺寸和位置到dom元素上." +
        this.option.left +
        "|" +
        this.option.top
    );
    this.Content.style.left = this.option.left + "px";
    this.Content.style.top = this.option.top + "px";
    this.Content.style.width = this.option.width + "px";
    this.Content.style.height = this.option.height + "px";
    this.DragDiv.style.width = this.option.width - 14 + "px";
    this.DragDiv.style.height = this.option.height - 14 + "px";
    this.Content.style.backgroundPosition =
      -(this.option.left - this.position.x) +
      "px" +
      " " +
      (-(this.option.top - this.position.y) + "px");
  },
  dragMoving: function (
    e //拖动改变显示层尺寸.
  ) {
    //console.info("拖动改变显示层尺寸this.draging"+this.draging);
    //console.info("拖动改变显示层尺寸this.option.Locked"+this.option.Locked);
    if (!this.draging || this.option.locked) {
      return;
    }

    switch (this.dragIndex) {
      case 1: {
        var original = this.getPosition(this.dragElement);
        var newPoint = {
          left: e ? e.pageX : event.clientX + document.body.scrollLeft,
          top: e ? e.pageY : event.clientY + document.body.scrollTop,
        };
        var stepX = original.left - newPoint.left + this.offset.x;
        var stepY = original.top - newPoint.top + this.offset.y;
        if (this.option.lockRate) {
          stepY =
            (this.option.width + stepX) * this.option.rate - this.option.height;
        }
        if (
          this.option.left - stepX < this.position.x ||
          this.option.top - stepY < this.position.y ||
          this.option.width + stepX < this.selectSize.width ||
          this.option.height + stepY < this.selectSize.height
        ) {
          return;
        }

        this.option.left -= stepX;
        this.option.top -= stepY;
        this.option.width += stepX;
        this.option.height += stepY;
        this.onResize();
        break;
      }
      case 2: {
        var original = this.getPosition(this.dragElement);
        console.info(document.body.scrollLeft);
        console.info(document.body.scrollTop);
        var newPoint = {
          Left: e ? e.pageX : event.clientX + document.body.scrollLeft,
          Top: e ? e.pageY : event.clientY + document.body.scrollTop,
        };
        var stepY = original.top - newPoint.top + this.offset.y;
        if (this.option.top - stepY < this.position.y) {
          console.info("2 return ");
          return;
        }
        console.info("stepY" + stepY);
        if (this.option.lockRate) {
          var stepX = this.option.height / this.option.rate - this.option.width;
          if (
            this.option.left - stepX / 2 < this.position.x ||
            this.option.left + stepX / 2 + this.option.width >
              this.position.x + this.size.width ||
            this.option.width + stepX < this.selectSize.width
          ) {
            console.info("2 return LockRate");
            return;
          }
          this.option.width += stepX;
          this.option.left -= stepX / 2;
        }
        if (this.option.height + stepY < this.selectSize.height) {
          return;
        }
        this.option.top -= stepY;
        this.option.height += stepY;
        this.onResize();
        break;
      }
      case 3: {
        var original = this.getPosition(this.dragElement);
        var newPoint = {
          left: e ? e.pageX : event.clientX + document.body.scrollLeft,
          top: e ? e.pageY : event.clientY + document.body.scrollTop,
        };
        var stepY = original.top - newPoint.top + this.offset.y;
        var stepX = newPoint.left - original.left - this.offset.x;
        if (this.option.top - stepY < this.position.y) {
          return;
        }
        if (this.option.lockRate) {
          stepX =
            (this.option.height + stepY) / this.option.rate - this.option.width;
        }
        if (
          this.option.left + stepX + this.option.width >
            this.position.x + this.size.width ||
          this.option.width + stepX < this.selectSize.width ||
          this.option.height + stepY < this.selectSize.height
        ) {
          return;
        }
        this.option.width += stepX;
        this.option.top -= stepY;
        this.option.height += stepY;
        this.onResize();
        break;
      }
      case 4: {
        var original = this.getPosition(this.dragElement);
        var newPoint = {
          left: e ? e.pageX : event.clientX + document.body.scrollLeft,
          top: e ? e.pageY : event.clientY + document.body.scrollTop,
        };
        var stepX = original.left - newPoint.left + this.offset.x;
        if (this.option.left - stepX < this.position.x) {
          return;
        }
        if (this.option.LockRate) {
          var stepY = this.option.width * this.option.rate - this.option.height;
          if (
            this.option.top - stepY / 2 < this.position.y ||
            this.option.height + this.option.top - stepY / 2 >
              this.size.height + this.position.y ||
            this.option.height + stepY < this.selectSize.height
          ) {
            return;
          }
          this.option.height += stepY;
          this.option.top -= stepY / 2;
        }
        if (this.option.width + stepX < this.selectSize.width) {
          return;
        }
        this.option.left -= stepX;
        this.option.width += stepX;
        this.OnResize();
        break;
      }
      case 5: {
        var original = this.getPosition(this.dragElement);
        var newPoint = {
          Left: e ? e.pageX : event.clientX + document.body.scrollLeft,
          Top: e ? e.pageY : event.clientY + document.body.scrollTop,
        };
        var stepX = newPoint.left - original.left - this.offset.x;
        if (
          this.option.left + this.option.width + stepX >
          this.position.x + this.size.width
        ) {
          return;
        }
        if (this.option.LockRate) {
          var stepY =
            (this.option.width + stepX) * this.option.rate - this.option.height;
          if (
            this.option.top - stepY / 2 < this.position.y ||
            this.option.height + this.option.top + stepY / 2 >
              this.position.y + this.size.height ||
            this.option.height + stepY < this.selectSize.height
          ) {
            return;
          }
          this.option.height += stepY;
          this.option.top -= stepY / 2;
        }
        if (this.option.width + stepX < this.selectSize.width) {
          return;
        }
        this.option.width += stepX;
        this.onResize();
        break;
      }
      case 6: {
        var original = this.getPosition(this.dragElement);
        var newPoint = {
          Left: e ? e.pageX : event.clientX + document.body.scrollLeft,
          Top: e ? e.pageY : event.clientY + document.body.scrollTop,
        };
        var stepX = original.left - newPoint.left + this.offset.x;
        var stepY = newPoint.top - original.top - this.offset.y;
        if (this.option.LockRate) {
          stepY =
            (this.option.width + stepX) * this.option.rate - this.option.height;
        }
        if (
          this.option.left - stepX < this.position.x ||
          this.option.top + stepY + this.option.height >
            this.position.y + this.size.height ||
          this.option.width + stepX < this.selectSize.width ||
          this.option.height + stepY < this.selectSize.height
        ) {
          return;
        }
        this.option.left -= stepX;
        this.option.width += stepX;
        this.option.height += stepY;
        this.onResize();
        break;
      }
      case 7: {
        var original = this.getPosition(this.dragElement);
        var newPoint = {
          left: e ? e.pageX : event.clientX + document.body.scrollLeft,
          top: e ? e.pageY : event.clientY + document.body.scrollTop,
        };
        var stepY = newPoint.top - original.top - this.offset.y;
        if (
          this.option.top + stepY + this.option.height >
          this.position.y + this.size.height
        ) {
          return;
        }
        if (this.option.LockRate) {
          var stepX =
            (this.option.height + stepY) / this.option.rate - this.option.width;
          if (
            this.option.left - stepX / 2 < this.position.x ||
            this.option.left + stepX + this.option.width >
              this.position.x + this.size.width ||
            this.option.width + stepX < this.selectSize.width
          ) {
            return;
          }
          this.option.width += stepX;
          this.option.left -= stepX / 2;
        }
        if (this.option.height + stepY < this.selectSize.height) {
          return;
        }
        this.option.height += stepY;
        this.OnResize();
        break;
      }
      case 8: {
        var original = this.getPosition(this.dragElement);
        var newPoint = {
          Left: e ? e.pageX : event.clientX + document.body.scrollLeft,
          Top: e ? e.pageY : event.clientY + document.body.scrollTop,
        };
        var stepX = newPoint.left - original.left - this.offset.x;
        var stepY = newPoint.top - original.top - this.offset.y;
        if (this.option.LockRate) {
          stepY =
            (this.option.width + stepX) * this.option.rate - this.option.height;
        }
        if (
          this.option.left + stepX + this.option.width >
            this.position.x + this.size.width ||
          this.option.top + stepY + this.option.height >
            this.position.y + this.size.height ||
          this.option.width + stepX < this.selectSize.width ||
          this.option.height + stepY < this.selectSize.height
        ) {
          return;
        }
        this.option.width += stepX;
        this.option.height += stepY;
        this.onResize();
        break;
      }
    }
  },
  //取得指定元素的绝对位置.
  getPosition: function (el) {
    var result = {
      top: 0,
      left: 0,
    };
    result.left = el.offsetLeft;
    result.top = el.offsetTop;
    while ((el = el.offsetParent)) {
      result.top += el.offsetTop;
      result.left += el.offsetLeft;
    }
    return result;
  },
  release: function () {
    this.Master.parentNode.removeChild(this.Master);
    this.Content.parentNode.removeChild(this.Content);
    this.DragDiv.parentNode.removeChild(this.DragDiv);
  },
  complete: function () {
    //触发拖动完成的事件,传出当前的状态数据.
    this.onComplete(
      this.option.left - this.position.x,
      this.option.top - this.position.y,
      this.option.width,
      this.option.height
    );
  },
  onComplete: function (Left, Top, width, height) {
    //接收当前状态数据的方法.
  },
};
//***************************************************************************************************//
//保存用户选择的图片位置
var currentImageSize = {
  top: 75,
  left: 75,
  width: 150,
  height: 150,
};
//初始化上传按钮状态
//FileUpload.servlet中会调用该函数  不删除备份使用
var imageCopper = null;
var config = null;
document.ready(function () {
  var hdnImageCooperConfig = $("#.hdnImageCooperConfig");
  if (hdnImageCooperConfig.s == null) {
    return;
  }
  config = {
    preview: hdnImageCooperConfig.attr("preview"),
    current: hdnImageCooperConfig.attr("current"),
    parent_current: hdnImageCooperConfig.attr("parent_current"),
    parent_input: hdnImageCooperConfig.attr("parent_input"),
    post: hdnImageCooperConfig.attr("post"),
    command: hdnImageCooperConfig.attr("command"),
    business_id: hdnImageCooperConfig.attr("business_id"),
  };
  var parentImage = (
    parent.manage ? parent.manage.document : parent.document
  ).getElementById(config.parent_current);
  if (parentImage != null) {
    $(config.current).src = $.randomUrl(parentImage.src);
  }
  $.file.validateUploadFile = function (f) {
    $.file.uploadDelegate(false, "", "fileUpload");
  };
  //设置上传成功后的回调函数
  $.file.uploadCallBack = function (fileInfo, clientFileName) {
    var currentImage = $(config.preview);
    currentImage.src = $.randomUrl(fileInfo.fileName);
    if (imageCopper !== null) {
      imageCopper.release();
    }
    imageCopper = new ImageCopper(
      currentImage,
      {
        lockRate: true,
        left: 75,
        top: 75,
      },
      function (x, y, w, h) {
        currentImageSize.top = x;
        currentImageSize.left = y;
        currentImageSize.width = w;
        currentImageSize.height = h;
      }
    );
    $.file.reset();
  };

  $(config.command).onclick = function () {
    var businessId = $.request(config.business_id);
    var previewImage = $(config.preview);
    var imageUrl = previewImage.src.split("?")[0];
    var postString =
      "parameter=" +
      imageUrl +
      "," +
      currentImageSize.top +
      "," +
      currentImageSize.left +
      "," +
      currentImageSize.width +
      "," +
      currentImageSize.height +
      "," +
      businessId;
    var postUrl = $.url.root + config.post;
    $.ajax.json(postUrl, postString, function (result) {
      //配置文本
      var image_url = imageUrl + "?time=" + new Date();
      var w = parent.manage ? parent.manage.document : parent.document;
      w.getElementById(config.parent_current).src = image_url;
      if ($(config.parent_input)) {
        w.getElementById(config.parent_input).value = image_url;
      }
      $(config.current).src = image_url;
      $.message("operation success!");
    });
  };
});
