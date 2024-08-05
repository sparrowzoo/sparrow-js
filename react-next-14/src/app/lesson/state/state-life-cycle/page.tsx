'use client'
import React, {useState} from "react";

function Component({c}: { c: number }) {
    console.log("Component rendered"+c);
    const uncontrolledState = React.useState<number>(c);
    const [value,setValue] = uncontrolledState;
    const prevValueRef = React.useRef(value);
    React.useEffect(() => {
        console.log("Component mounted");
        console.log("Prev value:", prevValueRef.current);
        console.log("Current value:", value);
    }, [value]);
    return <div>Component {c} {value} {prevValueRef.current}
        <input type="button" value="Increment" onClick={() => setValue(value + 1)}/>
    </div>
}

export default function Page() {
    const [count, setCount] = useState(0);
    return <div>
        <Component c={count}/>
        <input type="button" value="Increment" onClick={() => setCount(count + 1)}/>
    </div>
}