import * as React from 'react';

// Types
type PossibleRef<T> = React.Ref<T> | undefined;

/**
 * Set a given ref to a given value
 * This utility takes care of different types of refs: callback refs and RefObject(s)
 */
function setRef<T>(ref: PossibleRef<T>, value: T) {
    if (typeof ref === 'function') {
        // callback ref
        ref(value);
    } else if (ref !== null && ref !== undefined) {
        // RefObject
        (ref as React.MutableRefObject<T>).current = value;
    }
}

/**
 * A utility to compose multiple refs together
 * Accepts callback refs and RefObject(s)
 */
function composeRefs<T>(...refs: PossibleRef<T>[]) {
    // Return a function that sets the value to all refs
    //RefCallback<T> 返回一个回调函数，该函数将值设置到所有refs
    //https://react.docschina.org/reference/react-dom/components/common#ref-callback
    return (node: T) => refs.forEach((ref) => setRef(ref, node));
}

/**
 * A custom hook that composes multiple refs
 * Accepts callback refs and RefObject(s)
 */
function useComposedRefs<T>(...refs: PossibleRef<T>[]) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return React.useCallback(composeRefs(...refs), refs);
}

export {composeRefs, useComposedRefs};
