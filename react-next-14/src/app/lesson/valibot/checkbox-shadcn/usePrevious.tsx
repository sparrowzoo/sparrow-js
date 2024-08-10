import * as React from 'react';

function usePrevious<T>(value: T) {
    //previous是value 的别名
    const props = {value, previous: value};
    const ref = React.useRef(props);

    // We compare values before making an update to ensure that
    // a change has been made. This ensures the previous value is
    // persisted correctly between renders.
    return React.useMemo(() => {
        if (ref.current.value !== value) {
            ref.current.previous = ref.current.value;
            ref.current.value = value;
        }
        return ref.current.previous;
    }, [value]);
}

export {usePrevious};
