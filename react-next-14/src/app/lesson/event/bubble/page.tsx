'use client'
import React, {useEffect} from "react";
import {CheckboxIcon} from "@radix-ui/react-icons";

export default function Page() {
    console.log('page amount');
    const ref = React.createRef<HTMLInputElement>();
    const [checked, setChecked] = React.useState(false);
    useEffect(() => {

        document.body.addEventListener('click', function () {
           console.log('body click');
        });
        const input:any = ref.current;
        // 监听该事件。
        input.addEventListener(
            "click",
            checkboxClick
        );
        input.dispatchEvent(new Event('click', {bubbles: false}));
    }, [])

    function checkboxClick(event: Event) {
        // if(!ref.current){
        //     return;
        // }
        const target = event.target as HTMLInputElement;
        console.log('checkbox click  '+ target.checked+", event.bubbles="+event.bubbles);
        // 检查事件是否冒泡阶段传播
        if (!event.bubbles) {
            return;
        }
        //冒泡
        console.log("bubble event");
    }


    function setCheckedByInput(checked: boolean){
        const input = ref.current!;
        const inputProto = window.HTMLInputElement.prototype;
        const descriptor = Object.getOwnPropertyDescriptor(inputProto, 'checked') as PropertyDescriptor;
        const setChecked:any = descriptor.set;
        setChecked.call(input, checked);
    }

    function handleClick(event: React.MouseEvent) {
        event.stopPropagation();
        console.log('handleClick 是否阻止冒泡'+ event.isPropagationStopped());
        setCheckedByInput(!checked);
        setChecked(!checked);


        //触发click事件 但未阻止冒泡
        //通过自定义事件来继承button的click事件的冒泡
        //用来控制组件是否支持冒泡，而不是故意阻止冒泡Radix checkbox的click事件
        const input = ref.current!;
        const checkBoxEvent = new Event("click", {bubbles: !event.isPropagationStopped()});
        input.dispatchEvent(checkBoxEvent);
    }

    return (
        <div>
            <h1>Bubble Event</h1>
            <div>
                <div onClick={(event) => { console.log('checkbox parent click '+event.bubbles)}}>
                <input type="checkbox" ref={ref}/>
                </div>
                <button className={"w-4 h-4 border border-red-700"} onClick={handleClick}>
                    {checked? <CheckboxIcon/> : ""}
                </button>
            </div>
        </div>
    )
}
