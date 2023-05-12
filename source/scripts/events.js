Sparrow.event = function (e) {
  if (!(this instanceof Sparrow.event)) {
    return new Sparrow.event(e);
  }
  if (e) {
    this.originalEvent = e;
    this.type = e.type;
    this.e = window.event || this.originalEvent;
    this.srcElement = this.e.srcElement || this.e.target;
    this.toElement = this.e.toElement || this.e.relatedTarget;
  }
};

Sparrow.event.prototype = {
  dragapproved: false,
  srcElement: null,
  eventX: null,
  eventY: null,
  srcLeftPos: null,
  srcRightPos: null,
  cancelBubble: function () {
    window.event
      ? (window.event.cancelBubble = true)
      : this.e.stopPropagation();
  },
  preventDefault: function () {
    if (this.e.preventDefault) {
      this.e.preventDefault();
    }
    if (window.event) window.event.returnValue = false;
  },
  getAbsoluteTop: function () {
    return this.e.pageY
      ? this.e.pageY
      : this.e.clientY
      ? this.e.clientY +
        (document.documentElement.scrollTop
          ? document.documentElement.scrollTop
          : document.body.scrollTop)
      : null;
  },
  getAbsoluteLeft: function () {
    return this.e.pageX
      ? this.e.pageX
      : this.e.clientX
      ? this.e.clientX +
        (document.documentElement.scrollLeft
          ? document.documentElement.scrollLeft
          : document.body.scrollLeft)
      : null;
  },
  move: function () {
    if (this.dragapproved && this.srcElement != null) {
      this.srcElement.style.left = this.srcLeftPos + this.clientX - this.eventX;
      this.srcElement.style.top = this.srcRightPos + this.clientY - this.eventY;
      return;
    }
    return true;
  },
  move_end: function () {
    this.dragapproved = false;
    this.srcElement.onmousemove = null;
  },
  drags: function () {
    try {
      if (this.srcElement.className.indexOf("drag") !== -1) {
        if (this.srcElement.className === "drag-p") {
          this.srcElement = this.srcElement.parentNode;
        } else if (this.srcElement.className === "drag-pp") {
          this.srcElement = this.srcElement.parentNode.parentNode;
        } else {
          this.srcElement = null;
        }
        var sparrowElement = $(this.srcElement);
        this.dragapproved = true;
        this.srcLeftPos = sparrowElement.getAbsoluteLeft();
        this.srcRightPos = sparrowElement.getAbsoluteTop();
        this.eventX = e.clientX;
        this.eventY = e.clientY;
        this.srcElement.onmousemove = this.move;
      } else {
        this.srcElement = null;
        this.dragapproved = false;
        this.srcElement.onmousemove = null;
      }
    } catch (err) {}
  },
};
