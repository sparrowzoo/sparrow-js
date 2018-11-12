Sparrow.prototype.mousewheel = function (handle) {
    var eventArray = ('onwheel' in document || document.documentMode >= 9) ?
        ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'], slice = Array.prototype.slice,
        lowestDelta;
    var innerHandle = function (event) {
        if (!handle) {
            return;
        }
        event = $.event(event),
            args = slice.call(arguments, 1),
            delta = 0,
            deltaX = 0,
            deltaY = 0,
            absDelta = 0;
        event.preventDefault();
        // Old school scrollwheel delta
        if ('detail' in event.e) {
            deltaY = event.e.detail * -1;
        }
        if ('wheelDelta' in event.e) {
            deltaY = event.e.wheelDelta;
        }
        if ('wheelDeltaY' in event.e) {
            deltaY = event.e.wheelDeltaY;
        }
        if ('wheelDeltaX' in event.e) {
            deltaX = event.e.wheelDeltaX * -1;
        }

        // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
        if ('axis' in event.e && event.e.axis === event.e.HORIZONTAL_AXIS) {
            deltaX = deltaY * -1;
            deltaY = 0;
        }

        // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
        delta = deltaY === 0 ? deltaX : deltaY;

        // New school wheel delta (wheel event)
        if ('deltaY' in event.e) {
            deltaY = event.e.deltaY * -1;
            delta = deltaY;
        }
        if ('deltaX' in event.e) {
            deltaX = event.e.deltaX;
            if (deltaY === 0) {
                delta = deltaX * -1;
            }
        }

        // No change actually happened, no reason to go any further
        if (deltaY === 0 && deltaX === 0) {
            return;
        }

        // Need to convert lines and pages to pixels if we aren't already in pixels
        // There are three delta modes:
        //   * deltaMode 0 is by pixels, nothing to do
        //   * deltaMode 1 is by lines
        //   * deltaMode 2 is by pages

        // Store lowest absolute delta to normalize the delta values
        absDelta = Math.max(Math.abs(deltaY), Math.abs(deltaX));

        if (!lowestDelta || absDelta < lowestDelta) {
            lowestDelta = absDelta;

            // Adjust older deltas if necessary
            if (absDelta % 120 === 0) {
                lowestDelta /= 40;
            }
        }

        // Adjust older deltas if necessary
        if (absDelta % 120 === 0) {
            // Divide all the things by 40!
            delta /= 40;
            deltaX /= 40;
            deltaY /= 40;
        }

        // Get a whole, normalized value for the deltas
        delta = Math[delta >= 1 ? 'floor' : 'ceil'](delta / lowestDelta);
        deltaX = Math[deltaX >= 1 ? 'floor' : 'ceil'](deltaX / lowestDelta);
        deltaY = Math[deltaY >= 1 ? 'floor' : 'ceil'](deltaY / lowestDelta);

        // Add information to the event object
        event.e.deltaX = deltaX;
        event.e.deltaY = deltaY;
        event.e.deltaFactor = lowestDelta;

        // Go ahead and set deltaMode to 0 since we converted to pixels
        // Although this is a little odd since we overwrite the deltaX/Y
        // properties with normalized deltas.
        event.e.deltaMode = 0;
        // Add event and delta to the front of the arguments
        args.unshift(event.e, delta, deltaX, deltaY);
        handle(args);
    };
    if (this.s.addEventListener) {
        for (var i = eventArray.length; i;) {
            this.s.addEventListener(eventArray[--i], innerHandle, false);
        }
        return;
    }
    this.s.onmousewheel = innerHandle;
};