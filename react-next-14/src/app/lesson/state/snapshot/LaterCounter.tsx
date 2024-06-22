import {useState} from "react";

export default function LaterCounter() {
    const [number, setNumber] = useState(0);
    return (
        <>
            <h1>Later Counter 演示</h1>

            <h1>{number}</h1>
            <button onClick={() => {
                setNumber(number + 1);
                alert(number);
                //到提示框运行时，React 中存储的 state 可能已经发生了更改，但它是使用用户与之交互时状态的快照进行调度的！
                setTimeout(()=>{alert(number)},3000);
                //如何拿到3秒后的值
            }}>+3
            </button>
        </>
    )
}