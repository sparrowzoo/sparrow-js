/**
 * 图片裁剪机
 * @param preview 预览图片
 * @param config 裁剪配置
 * @param complete 结束事件
 * @constructor
 */
Sparrow.ImageCropper = function (preview, config, complete) {
  this.preview = typeof preview === "string" ? $(preview) : preview;
  //初始化剪切器尺寸
  this.size = {
    width: this.preview.offsetWidth,
    height: this.preview.offsetHeight,
  };

  this.config = {
    width: 150,
    height: 150,
    left: 30,
    top: 30,
    locked: false,
    lockRate: false,
    rate: 0,
  };
  this.result = {
    x: this.config.left,
    y: this.config.top,
    w: this.config.width,
    h: this.config.height,
  };
  //覆盖默认配置
  if (config) {
    for (var c in config) {
      this.config[c] = config[c];
    }
  }

  //选中尺寸
  this.selectSize = {
    width: this.config.width,
    height: this.config.height,
  };
  //初始化一些参数
  this.offset = {
    x: 0,
    y: 0,
  };

  this.draging = this.moving = false;
  if (complete && typeof complete == "function") {
    this.onComplete = complete;
  } else {
    var that = this;
    this.onComplete = function (x, y, w, h) {
      that.result = {
        x: x,
        y: y,
        w: w,
        h: h,
      };
    };
  }
};

Sparrow.ImageCropper.prototype = {
  /**
   * 初始化方法
   */
  init: function () {
    //动态计算剪切器初始位置
    var position = this.getPosition(this.preview);
    this.position = {
      x: position.left,
      y: position.top,
    };

    this.dragElement = null;
    this.dragIndex = 0;

    if (!this.config.rate && this.config.lockRate) {
      this.config.rate = this.config.height / this.config.width;
    }
    this.config.left += this.position.x;
    this.config.top += this.position.y;

    //创建遮罩层
    var master = (this.master = document.createElement("div"));
    master.style.color = "#ca151d";
    master.style.position = "absolute";
    master.style.width = this.size.width + "px";
    master.style.height = this.size.height + "px";
    master.style.left = this.position.left + "px";
    master.style.top = this.position.top + "px";
    master.style.backgroundColor = "#FFFFFF";
    master.style.filter = "alpha(opacity=50)";
    master.style.opacity = "0.5";
    document.body.appendChild(master);

    //创建拖动显示层.
    var content = (this.content = document.createElement("div"));
    content.style.color = "blue";
    content.style.position = "absolute";
    content.style.width = this.config.width + "px";
    content.style.height = this.config.height + "px";
    content.style.top = this.config.top + "px";
    content.style.left = this.config.left + "px";
    content.style.background = "url(" + this.preview.src + ")";
    content.style.backgroundRepeat = "no-repeat";
    content.style.backgroundPosition =
      -(this.config.left - this.position.x) +
      "px" +
      " " +
      (-(this.config.top - this.position.y) + "px");
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
    d.style.height = this.config.height - 14 + "px";
    d.style.width = this.config.width - 14 + "px";
    d.style.position = "absolute";
    d.style.cursor = "move";
    content.appendChild(d);
    d.onmousedown = $.bind(this, "moveStart");
    content.onmousemove = $.bind(this, "onMoving");
    content.onmouseup = $.bind(this, "moveStop");
    content.onmouseout = $.bind(this, "moveStop");
  },
  moveStart: function (e) {
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
    newX = newX > w + x - this.config.width ? w + x - this.config.width : newX;
    newY =
      newY > h + y - this.config.height ? h + y - this.config.height : newY;
    newX = newX < x ? x : newX;
    newY = newY < y ? y : newY;
    this.config.left = newX;
    this.config.top = newY;
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
    console.info("拖动尺寸开始,初始化一些数据." + this.config.locked);
    if (this.config.locked) {
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
    this.complete();
  },
  onResize: function () //设置拖动时产生的尺寸和位置到dom元素上.
  {
    console.info(
      "设置拖动时产生的尺寸和位置到dom元素上." +
        this.config.left +
        "|" +
        this.config.top
    );
    this.content.style.left = this.config.left + "px";
    this.content.style.top = this.config.top + "px";
    this.content.style.width = this.config.width + "px";
    this.content.style.height = this.config.height + "px";
    this.dragDiv.style.width = this.config.width - 14 + "px";
    this.dragDiv.style.height = this.config.height - 14 + "px";
    this.content.style.backgroundPosition =
      -(this.config.left - this.position.x) +
      "px" +
      " " +
      (-(this.config.top - this.position.y) + "px");
  },
  dragMoving: function (
    e //拖动改变显示层尺寸.
  ) {
    //console.info("拖动改变显示层尺寸this.draging"+this.draging);
    //console.info("拖动改变显示层尺寸this.config.Locked"+this.config.Locked);
    if (!this.draging || this.config.locked) {
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
        if (this.config.lockRate) {
          stepY =
            (this.config.width + stepX) * this.config.rate - this.config.height;
        }
        if (
          this.config.left - stepX < this.position.x ||
          this.config.top - stepY < this.position.y ||
          this.config.width + stepX < this.selectSize.width ||
          this.config.height + stepY < this.selectSize.height
        ) {
          return;
        }

        this.config.left -= stepX;
        this.config.top -= stepY;
        this.config.width += stepX;
        this.config.height += stepY;
        this.onResize();
        break;
      }
      case 2: {
        var original = this.getPosition(this.dragElement);
        console.info(document.body.scrollLeft);
        console.info(document.body.scrollTop);
        var newPoint = {
          left: e ? e.pageX : event.clientX + document.body.scrollLeft,
          top: e ? e.pageY : event.clientY + document.body.scrollTop,
        };
        var stepY = original.top - newPoint.top + this.offset.y;
        if (this.config.top - stepY < this.position.y) {
          console.info("2 return ");
          return;
        }
        console.info("stepY" + stepY);
        if (this.config.lockRate) {
          var stepX = this.config.height / this.config.rate - this.config.width;
          if (
            this.config.left - stepX / 2 < this.position.x ||
            this.config.left + stepX / 2 + this.config.width >
              this.position.x + this.size.width ||
            this.config.width + stepX < this.selectSize.width
          ) {
            console.info("2 return lockRate");
            return;
          }
          this.config.width += stepX;
          this.config.left -= stepX / 2;
        }
        if (this.config.height + stepY < this.selectSize.height) {
          return;
        }
        this.config.top -= stepY;
        this.config.height += stepY;
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
        if (this.config.top - stepY < this.position.y) {
          return;
        }
        if (this.config.lockRate) {
          stepX =
            (this.config.height + stepY) / this.config.rate - this.config.width;
        }
        if (
          this.config.left + stepX + this.config.width >
            this.position.x + this.size.width ||
          this.config.width + stepX < this.selectSize.width ||
          this.config.height + stepY < this.selectSize.height
        ) {
          return;
        }
        this.config.width += stepX;
        this.config.top -= stepY;
        this.config.height += stepY;
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
        if (this.config.left - stepX < this.position.x) {
          return;
        }
        if (this.config.lockRate) {
          var stepY = this.config.width * this.config.rate - this.config.height;
          if (
            this.config.top - stepY / 2 < this.position.y ||
            this.config.height + this.config.top - stepY / 2 >
              this.size.height + this.position.y ||
            this.config.height + stepY < this.selectSize.height
          ) {
            return;
          }
          this.config.height += stepY;
          this.config.top -= stepY / 2;
        }
        if (this.config.width + stepX < this.selectSize.width) {
          return;
        }
        this.config.left -= stepX;
        this.config.width += stepX;
        this.onResize();
        break;
      }
      case 5: {
        var original = this.getPosition(this.dragElement);
        var newPoint = {
          left: e ? e.pageX : event.clientX + document.body.scrollLeft,
          top: e ? e.pageY : event.clientY + document.body.scrollTop,
        };
        var stepX = newPoint.left - original.left - this.offset.x;
        if (
          this.config.left + this.config.width + stepX >
          this.position.x + this.size.width
        ) {
          return;
        }
        if (this.config.lockRate) {
          var stepY =
            (this.config.width + stepX) * this.config.rate - this.config.height;
          if (
            this.config.top - stepY / 2 < this.position.y ||
            this.config.height + this.config.top + stepY / 2 >
              this.position.y + this.size.height ||
            this.config.height + stepY < this.selectSize.height
          ) {
            return;
          }
          this.config.height += stepY;
          this.config.top -= stepY / 2;
        }
        if (this.config.width + stepX < this.selectSize.width) {
          return;
        }
        this.config.width += stepX;
        this.onResize();
        break;
      }
      case 6: {
        var original = this.getPosition(this.dragElement);
        var newPoint = {
          left: e ? e.pageX : event.clientX + document.body.scrollLeft,
          top: e ? e.pageY : event.clientY + document.body.scrollTop,
        };
        var stepX = original.left - newPoint.left + this.offset.x;
        var stepY = newPoint.top - original.top - this.offset.y;
        if (this.config.lockRate) {
          stepY =
            (this.config.width + stepX) * this.config.rate - this.config.height;
        }
        if (
          this.config.left - stepX < this.position.x ||
          this.config.top + stepY + this.config.height >
            this.position.y + this.size.height ||
          this.config.width + stepX < this.selectSize.width ||
          this.config.height + stepY < this.selectSize.height
        ) {
          return;
        }
        this.config.left -= stepX;
        this.config.width += stepX;
        this.config.height += stepY;
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
          this.config.top + stepY + this.config.height >
          this.position.y + this.size.height
        ) {
          return;
        }
        if (this.config.lockRate) {
          var stepX =
            (this.config.height + stepY) / this.config.rate - this.config.width;
          if (
            this.config.left - stepX / 2 < this.position.x ||
            this.config.left + stepX + this.config.width >
              this.position.x + this.size.width ||
            this.config.width + stepX < this.selectSize.width
          ) {
            return;
          }
          this.config.width += stepX;
          this.config.left -= stepX / 2;
        }
        if (this.config.height + stepY < this.selectSize.height) {
          return;
        }
        this.config.height += stepY;
        this.onResize();
        break;
      }
      case 8: {
        var original = this.getPosition(this.dragElement);
        var newPoint = {
          left: e ? e.pageX : event.clientX + document.body.scrollLeft,
          top: e ? e.pageY : event.clientY + document.body.scrollTop,
        };
        var stepX = newPoint.left - original.left - this.offset.x;
        var stepY = newPoint.top - original.top - this.offset.y;
        if (this.config.lockRate) {
          stepY =
            (this.config.width + stepX) * this.config.rate - this.config.height;
        }
        if (
          this.config.left + stepX + this.config.width >
            this.position.x + this.size.width ||
          this.config.top + stepY + this.config.height >
            this.position.y + this.size.height ||
          this.config.width + stepX < this.selectSize.width ||
          this.config.height + stepY < this.selectSize.height
        ) {
          return;
        }
        this.config.width += stepX;
        this.config.height += stepY;
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
    this.master.parentNode.removeChild(this.master);
    this.content.parentNode.removeChild(this.content);
    this.dragDiv.parentNode.removeChild(this.dragDiv);
  },
  resetImage: function (url) {
    this.preview.src = url;
    this.content.style.background = "url(" + url + ")";
  },
  complete: function () {
    //触发拖动完成的事件,传出当前的状态数据.
    this.onComplete(
      this.config.left - this.position.x,
      this.config.top - this.position.y,
      this.config.width,
      this.config.height
    );
  },
  onComplete: function (Left, Top, width, height) {
    //接收当前状态数据的方法.
  },
};
