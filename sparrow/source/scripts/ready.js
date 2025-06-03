/* document.ready(function()) */
(function () {
    var ie = !!(window.attachEvent && !window.opera);
    var wk = /webkit\/(\d+)/i.test(navigator.userAgent) && (RegExp.$1 < 525);
    var fn = [];
    var run = function () {
        for (var i = 0; i < fn.length; i++)
            fn[i]();
    };
    document.ready = function (f) {
        if (!ie && !wk && document.addEventListener) {
            return document.addEventListener('DOMContentLoaded', f, false);
        }
        if (fn.push(f) > 1)
            return;
        if (ie) {
            (function () {
                try {
                    document.documentElement.doScroll('left');
                    run();
                } catch (err) {
                    //当前函数本身再次执行
                    setTimeout(arguments.callee, 0);
                }
            })();
        } else if (wk) {
            var t = null;
            t = setInterval(function () {
                if (/^(loaded|complete)$/.test(document.readyState))
                    clearInterval(t), run();
            }, 0);
        }
    };
})();