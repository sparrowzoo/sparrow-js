import {useState} from "react";

export default function Counter() {
    const [number, setNumber] = useState(0);

    // setState 传入的是 值
    const increase = () => {
        // setState 是异步更新视图
        // 传入值，3次会被合并成一次，批处理
        // 类似 Object.assign({count:1},{count:1},{count:1})，执行结果是1
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
        console.log(number); // 因为是异步，所以控制台打印 0, 界面显示 1
    }

    // setState 传入的是 函数
    const cbIncrease = () => {
        // setState 是异步更新视图
        // 传入函数，3次不会合并成一次，
        // 累加
        setNumber((prevState: number) => {
            return prevState + 1;
        });
        setNumber((prevState: number) => {
            return prevState + 1;
        });
        setNumber((prevState: number) => {
            return prevState + 1;
        });
        console.log(number); //  因为是异步，所以控制台打印 0, 界面显示 3
    }

    // setState 在setTimeout内执行
    const increaseSet = () => {
        setTimeout(() => {
            // setState 是异步更新视图
            // 3次会被合并成一次，批处理
            setNumber(number + 1);
            setNumber(number + 1);
            setNumber(number + 1);
            console.log(number); //  因为是异步，所以控制台打印 0, 界面显示 1
        })
    }
    return (
        <>
            <h1>Counter 演示</h1>
            <h1>{number}</h1>
            <button onClick={increase}> + setState传入的是对象</button>
            <br/>
            <button onClick={cbIncrease}> + setState传入的是函数</button>
            <br/>
            <button onClick={increaseSet}> 在 setTimeout函数内累</button>
        </>
    )
}