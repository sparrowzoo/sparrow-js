//For CommonJS and CommonJS-like
// CMD:Common Module Definition
//Asynchronous Modules Definition
//http://wiki.commonjs.org/wiki/Modules/AsynchronousDefinition
//http://www.commonjs.org/
(function (global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = global.document ?
            factory(global, true) :
            function (w) {
                if (!w.document) {
                    throw new Error("jQuery requires a window with a document");
                }
                return factory(w);
            };
    } else {
        factory(global);
    }
}(typeof window !== "undefined" ? window : this, function (window, noGlobal) {