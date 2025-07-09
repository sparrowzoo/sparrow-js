import React from "react";

interface Props {
    count: number;
}

export default function UseStateNotUpdate(props: Props) {
    const [count, setCount] = React.useState(props.count);

    const handleClick = () => {
        setCount(count + 1);
    };

    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={handleClick}>Click me</button>
        </div>
    );
}
