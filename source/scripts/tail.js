if ( typeof define === "function" && define.amd ) {
    define( "Sparrow", [], function() {
        return Sparrow;
    });
}


// Expose Sparrow and $ identifiers, even in AMD
// and CommonJS for browser emulators
if ( !noGlobal ) {
    window.Sparrow = window.$ = Sparrow;
}

return Sparrow;
}));