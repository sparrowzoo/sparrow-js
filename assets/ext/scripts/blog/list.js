document.ready(function () {
    $.share.init();
    $.user.initLoginBar();
    $.thread.count.init();
    window.onscroll = $.floating.init;
});