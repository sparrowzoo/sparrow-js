Sparrow.prototype.progressbar = function (callback, config) {
    var bar = $("+div");
    document.body.appendChild(bar.s);
    if (config.style) {
        bar.s.style.cssText = config.style;
    }
    var progress = $("+div");
    bar.s.appendChild(progress.s);
    if (config.progressStyle) {
        progress.s.style.cssText = config.progressStyle;
    }
    progress.s.style.width = "0px";
    progress.it = window.setInterval(function () {
        callback(progress);
    }, 100);
    progress.end = function () {
        window.clearInterval(progress.it);
    };
    progress.remove = function () {
        document.body.removeChild(progress.s.parentNode);
    };

};