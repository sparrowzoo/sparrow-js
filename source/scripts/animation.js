Sparrow.prototype.move = function (s) {
    var status = s.json();
    var _move = function (sparrowElement, start, end, percent, change) {
        if (!$.isNullOrEmpty(end)) {
            var distance = (parseInt(end, 10) - parseInt(start, 10));
            var speed = distance * percent;
            if (percent > 1) {
                speed = distance > 0 ? percent : -percent;
                if (Math.abs(distance) <= 1) {
                    sparrowElement.css(change, status.start, false);
                    return false;
                }
            } else {
                speed = distance * percent;
            }
            if (typeof (change) === "function") {
                change(sparrowElement.s, speed);
            } else {
                sparrowElement.css(change, speed, true);
            }
            if (Math.abs(distance) <= 1) {
                return true;
            }
        }
        return false;
    };
    var percent = status.percent;
    if (!percent) {
        percent = 0.05;
    }
    var end = _move(this, this.s.style.width, status.width, percent, "width");
    if (!end) {
        end = _move(this, this.s.style.height, status.height, percent, "height");
    }
    if (!end) {
        end = _move(this, this.s.style.left, status.left, percent, "left");
    }
    if (!end) {
        end = _move(this, this.s.style.top, status.top, percent, "top");
    }
    if (!end) {
        end = _move(this, this.opacity(), status.opacity, percent, "opacity");
    }
    if (end) {
        if (!$.isNullOrEmpty(status.width)) {
            this.s.style.width = status.width;
        }
        if (!$.isNullOrEmpty(status.height)) {
            this.s.style.height = status.height;
        }
        if (!$.isNullOrEmpty(status.left)) {
            this.s.style.left = status.left;
        }
        if (!$.isNullOrEmpty(status.top)) {
            this.s.style.top = status.top;
        }
        if (!$.isNullOrEmpty(status.opacity)) {
            this.opacity(status.opacity);
        }
        if (parseInt(status.height, 10) == 0) {
            this.s.style.display = "none";
        }
        this.stop();
        this.move_end();
        this.move_end = function () {
        };
    }
};
Sparrow.prototype.move_end = function () {
};


Sparrow.prototype.stop = function () {
    window.clearInterval(this.interval.pop());
};
Sparrow.prototype.animation = function (s, period) {
    if (!period) {
        period = 30;
    }
    this.s.style.display = "block";
    this.stop();
    var command = "$('" + this.selector + "').move(\"" + s + "\");";
    this.interval.push(window.setInterval(command, period));
};



Sparrow.prototype.interlace = function (targetArray) {
    if (!targetArray) {
        targetArray = ["{width:'0px',height:'0px'}",
            "{top:'0px',height:'{0}',width:'{1}',left:'0px'}".format(this.s.style.height, this.s.style.width),
            "{width:'{0}',height:'{1}'}".format(this.s.style.width, this.s.style.height),
            "{top:'{0}',height:'0px',width:'0px',left:'{1}'}".format(this.s.style.height, this.s.style.width)];
    }
    $("!.div." + this.selector.split(".")[1]).each(function (i) {
        this.style.position = "absolute";
        if (i == 0) {
            this.style.width = this.parentNode.style.width;
            this.style.height = this.parentNode.style.height;
        } else {
            this.style.width = "0px";
            this.style.height = "0px";
            this.style.display = "none";
            this.style.left = this.parentNode.style.width;
            this.style.top = this.parentNode.style.height;
        }
    });
    this.s.style.position = "relative";
    this.s.style.overflow = "hidden";
    this.s.onmouseover = function () {
        $("!div." + this.id).each(function (i) {
            $(this).animation(targetArray[i], 1);
        });
    };
    this.s.onmouseout = function () {
        $("!.div." + this.id).each(function (i) {
            $(this).animation(targetArray[i + 2], 1);
        });
    };
};

Sparrow.prototype.show = function () {
    // 设置超出隐藏
    this.s.style.overflow = "hidden";
    // 如果默认是不显示或者第二次高度为0
    if (this.s.style.display == "none"
        || this.s.style.height == "0") {
        // 记录当前被控控件的高度
        if (this.height == undefined) {
            this.s.style.display = "block";
            this.height = this.s.offsetHeight + "px";
            this.s.style.height = "0";
        }
        this.animation("{height:'" + this.height + "'}", 5);
    }
};
Sparrow.prototype.hidden = function () {
    if (this.s) {
        if (this.height == undefined) {
            this.height = this.s.offsetHeight + "px";
            this.s.style.height = this.height;
        }
        if (this.s.offsetHeight > 0) {
            this.animation("{height:'0px'}", 5);
        }
    }
};
Sparrow.prototype.showHidden = function (descElement, config, all) {
    if (!descElement) {
        descElement = $(this.s.id + "_controlled");
    }
    if (!config) {
        config = {
            showText: 'show',
            hiddenText: 'hidden',
            showIco: '',
            hiddenIco: ''
        };
    }
    if (!all) {
        all = {
            show: true,
            hidden: true
        };
    }
    // 设置超出隐藏
    descElement.style.overflow = "hidden";
    // 如果默认是不显示或者第二次高度为0
    if (descElement.style.display == "none"
        || descElement.style.height == "0") {
        if (all.show) {
            // 记录当前被控控件的高度
            if (this.s.tagName.toUpperCase() == "IMG") {
                this.s.src = config.hiddenIco;
                this.s.alt = config.hiddenText;
            } else {
                this.s.innerHTML = config.hiddenText;
            }
            $(descElement).show();
        }
    } else {
        if (all.hidden) {
            $(descElement).hidden();
            if (this.s.tagName == "img") {
                this.s.src = config.showIco;
                this.s.alt = config.showText;
            } else {
                this.s.innerHTML = config.showText;
            }
        }
    }
};

Sparrow.showOrHiddenTag = function (tagArray, show, doc) {
    if (!doc) {
        doc = document;
    }
    for (var i = 0; i < tagArray.length; i++) {
        var tagName = tagArray[i];
        var tags = $("<" + tagName, null, doc);
        tags.each(function () {
            this.zIndex = -1;
            if (!show) {
                this.style.visibility = "hidden";
            } else {
                this.style.visibility = "visible";
            }
        });
    }
};

Sparrow.prototype.marque = function (direction, step, period, deviation) {
    var status = null;
    this.s.parentNode.style.position = "relative";
    this.s.style.position = "absolute";
    var containerHeight = this.s.parentNode.offsetHeight;
    var contentHeight = this.s.offsetHeight;
    switch (direction) {
        case 0:
            if (contentHeight <= containerHeight)
                return;
            this.s.innerHTML += this.s.innerHTML;
            var top = -contentHeight + "px";
            if (!deviation) {
                deviation = -3;
            }
            status = "{top:'" + top + "',start:" + deviation + ",percent:" + step
                + "}";
            break;
    }
    this.animation(status, period);
};