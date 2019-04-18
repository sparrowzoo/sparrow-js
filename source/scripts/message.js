Sparrow.message = function (content, srcElement) {
    var id = "div_sparrow_msg";
    var divmsg = $(id);
    if (divmsg) {
        divmsg.parentNode.removeChild(divmsg);
    }
    divmsg = $("new.div." + id);
    divmsg.s.style.cssText = "position:absolute;background-color:#cccccc;width:auto;padding:10px;text-align:left;";
    divmsg.s.innerHTML = content;
    divmsg.opacity(0);
    document.body.appendChild(divmsg.s);
    // 如果有事件源传递过来说明需要在事件触发源处显示提示信息
    if (srcElement) {
        var sparrowElement = $(srcElement);
        divmsg.s.style.top = sparrowElement.getAbsoluteTop()
            - divmsg.s.offsetHeight + "px";
        divmsg.s.style.left = sparrowElement.getAbsoluteLeft()
            - (divmsg.s.offsetWidth - srcElement.offsetWidth) / 2 + "px";
    } else {
        divmsg.center();
    }
    divmsg.move_end = function () {
        this.s.parentNode.removeChild(this.s);
    };
    divmsg.animation("{opacity:100}", 30);
};