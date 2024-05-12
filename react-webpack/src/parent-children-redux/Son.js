import React, { useEffect, useState } from "react";
import store from "../store/index";

export default function Son(props) {
  //拿到set 值的方法
  const [n, setState] = useState(0);
  const [name, setName] = useState(props.name);
  store.subscribe(() => {
    setState(store.getState);
  });

  const add = () => {
    store.dispatch({ type: "addN", payload: 1 });
    //重置当前组件的状态
    setState(store.getState);
  };

  useEffect(() => {
    console.log("son init 模拟componentDidMount");
  }, []);
  //https://blog.csdn.net/ImagineCode/article/details/12462751 //不加依赖项会导致死循环

  return (
    <div
      className="main"
      style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}
    >
      I.m from parent [子组件的属性会随父组件改变而改变]{props.name}
      <br />
      I.m from parent state [子组件自己的状态不会改变] {name}
      <br />
      I.m son {store.getState()}
      <button onClick={add}>+n</button>
      <input readOnly={true} value={n} />
    </div>
  );
}
