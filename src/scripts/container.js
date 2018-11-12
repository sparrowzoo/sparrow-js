Sparrow.container = {};
Sparrow.global = function (key, obj) {
    if (typeof(obj) === "undefined") {
        return this.container[key];
    }
    this.container[key] = obj;
};