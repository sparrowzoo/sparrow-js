import React, {useState} from "react";
import store from './store/index';

export default function Son() {
    //拿到set 值的方法
    const [n, setState] = useState(0);
    store.subscribe(() => {
        setState(store.getState);
    })

    const add = () => {
        store.dispatch({type: 'addN', payload: 1});
        //重置当前组件的状态
        setState(store.getState);
    };
    return (
        <div style={{border: '1px solid #ccc', margin: 10, padding: 10}}>
            I.m son {store.getState()}
            <button onClick={add}>+n</button>
            <input readOnly={true} value="1"/>
        </div>
    );
}
