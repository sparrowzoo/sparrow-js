
function ImageSwitch(obj) {
    this.config = {
        containerId: null,
        containerWidth: 0,
        containerHeight: 0,
        summaryHeight: 50,
        numButtonClassName: "count",
        period: 1,
        buttonText: [],
        playInterval: 5000,
        img: {
            show: false,
            /* 控制图片的尺寸 */
            width: 80,
            height: 80,
            url: {
                left: '/images/right.png',
                right: '/images/left.png'
            }
        },
        /* count 的li有8个象素的误差 (可配置)因为ul的宽度需要li计算出来 */
        count: {
            deviation: 8
        }
    };
    this.obj = obj;
    this.container = null;
    this.list = null;
    this.images = null;
    this.numButton = null;
    this.index = 0;
    this.isPlay = true;
}


ImageSwitch.prototype = {
    init: function () {
        if (this.config.containerWidth <= 0) {
            this.config.containerWidth = document.body.scrollWidth;
        }
        this.container = $(this.config.containerId);
        this.container.style.width = this.config.containerWidth + "px";

        var ulArray = this.container.getElementsByTagName("ul");
        this.list = ulArray[0];

        var liArray = this.list.getElementsByTagName("li");
        window
            .eval("{0}.container.onmouseover=function(){{0}.isPlay=false;};{0}.container.onmouseout=function(){{0}.isPlay=true;};"
                .format(this.obj));
        this.images = this.list.getElementsByTagName("img");
        if (this.images.length == 0) {
            this.images = this.list.getElementsByTagName("a");
        }
        for (var i = 0; i < this.images.length; i++) {
            this.images[i].style.width = this.config.containerWidth
                + "px";
            this.images[i].style.height = (this.config.containerHeight - this.config.summaryHeight)
                + "px";
            liArray[i].style.width = this.images[i].style.width;
            liArray[i].style.height = this.config.containerHeight
                + "px";
        }
        this.list.style.width = this.config.containerWidth
            * this.images.length + "px";
        this.list.style.left = "0px";
        this.list.parentNode.style.width = this.config.containerWidth
            + "px";
        this.list.parentNode.style.height = this.config.containerHeight
            + "px";

        if (this.config.img.show) {
            var leftImg = $("new.img");
            var rightImg = $("new.img");
            this.container.appendChild(leftImg.s);
            this.container.appendChild(rightImg.s);
            leftImg.s.src = $.url.resource + this.config.img.url.left;
            rightImg.s.src = $.url.resource + this.config.img.url.right;
            leftImg.s.style.cursor = "pointer";
            rightImg.s.style.cursor = "pointer";
            leftImg.s.style.position = "absolute";
            rightImg.s.style.position = "absolute";
            leftImg.s.style.left = "5px";
            leftImg.s.width = this.config.img.width;
            leftImg.s.height = this.config.img.height;

            rightImg.s.width = this.config.img.width;
            rightImg.s.height = this.config.img.height;

            rightImg.s.style.left = (this.config.containerWidth - 5 - this.config.img.width)
                + "px";
            leftImg.s.style.top = (this.container.offsetHeight - this.config.img.height)
                / 2 + "px";
            rightImg.s.style.top = leftImg.s.style.top;

            leftImg.attr("obj", this.obj);
            rightImg.attr("obj", this.obj);
            leftImg.s.onclick = function () {
                window.eval($(this).attr("obj") + ".left()");
            };
            rightImg.s.onclick = function () {
                window.eval($(this).attr("obj") + ".right()");
            };
        }
        if (ulArray.length > 1) {
            // 初始化count状态
            this.numButton = ulArray[1].getElementsByTagName("li");
            // 初始化第一条为当前图片
            this.numButton[0].className = "current";

            var imgArray = ulArray[1].getElementsByTagName("img");
            if (imgArray.length > 0) {
                for (var i = 0; i < imgArray.length; i++) {
                    imgArray[i].src = $(imgArray[i]).attr("pre");
                }
            }
            var countWidth = (this.numButton[0].offsetWidth + this.config.count.dvalue)
                * this.numButton.length;

            // alert(this.container.offsetWidth);
            ulArray[1].style.width = countWidth + "px";
            // alert(ulArray[1].style.width);
        }
    },
    left: function () {
        this.index++;
        if (this.index >= this.numButton.length) {
            this.index = 0;
        }
        this.numButtonClick(this.index);
    },
    right: function () {
        this.index--;
        if (this.index < 0) {
            this.index = this.numButton.length - 1;
        }
        this.numButtonClick(this.index);
    },
    numButtonClick: function (imageIndex) {
        for (var i = 0; i < this.numButton.length; i++) {
            this.numButton[i].className = "";
        }
        this.numButton[imageIndex].className = "current";
        var targetLeft = -(imageIndex * this.config.containerWidth);
        $(this.list).stop();
        $(this.list).animation("{left:'" + targetLeft + "px'}",
            this.config.period);
    },
    playInterval: function () {
        if (!this.isPlay) {
            return;
        }
        if (this.index === this.numButton.length) {
            this.index = 0;
        }
        this.numButton[this.index].onmouseover();
        this.index++;
    }, play: function () {
        this.playInterval();
        window.setInterval(this.obj + ".playInterval()",
            this.config.playInterval);
    }
};