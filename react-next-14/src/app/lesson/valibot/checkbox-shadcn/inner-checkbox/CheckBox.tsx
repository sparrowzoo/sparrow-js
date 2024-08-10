'use client'
import * as React from "react";
import {usePrevious} from "@/app/lesson/valibot/checkbox-shadcn/usePrevious";
import {useSize} from "@/app/lesson/valibot/checkbox-shadcn/useSize";

type CheckedState = boolean | 'indeterminate';

function isIndeterminate(checked?: CheckedState): checked is 'indeterminate' {
    return checked === 'indeterminate';
}

//todo 分析两个API的区别
type InputProps = React.ComponentPropsWithoutRef<'input'>;
type InputHTMLAttributes = React.InputHTMLAttributes<HTMLInputElement>;

interface BubbleInputProps extends Omit<InputHTMLAttributes, 'checked'> {
    checked: CheckedState;
    control: HTMLElement | null;
    bubbles: boolean;
}

const CheckBox = (props: BubbleInputProps) => {
    const {control, checked, bubbles = true, ...inputProps} = props;
    const ref = React.useRef<HTMLInputElement>(null);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);

    // Bubble checked change to parents (e.g form change event)
    React.useEffect(() => {
        const input = ref.current!;
        const inputProto = window.HTMLInputElement.prototype;

        const descriptor = Object.getOwnPropertyDescriptor(
            inputProto,
            "checked"
        ) as PropertyDescriptor;
        const setChecked = descriptor.set;
        input.indeterminate = isIndeterminate(checked);
        //设置checked 属性
        setChecked.call(input, isIndeterminate(checked) ? false : checked);


        if (prevChecked !== checked && setChecked) {

            //设置indeterminate 属性
            input.indeterminate = isIndeterminate(checked);
            //设置checked 属性
            setChecked.call(input, isIndeterminate(checked) ? false : checked);

            //触发click事件 但未阻止冒泡
            const event = new Event("click", {bubbles});
            input.dispatchEvent(event);
        }
    }, [prevChecked, checked, bubbles]);

    return (
        <input
            type="checkbox"
            aria-hidden
            defaultChecked={isIndeterminate(checked) ? false : checked}
            {...inputProps}
            // tabIndex={-1}
            ref={ref}
            onClick={(e) => {
                e.stopPropagation();
            }}
            style={{
                ...props.style,
                ...controlSize,
                // pointerEvents: "none",//禁止鼠标点击
                // position: "absolute",//绝对定位
                // margin: 0,
                // opacity: 0,//透明
            }}
        />
    );
};
export default CheckBox;