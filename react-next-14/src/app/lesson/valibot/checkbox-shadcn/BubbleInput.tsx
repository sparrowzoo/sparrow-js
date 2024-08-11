import * as React from "react";
import {usePrevious} from "@/app/lesson/valibot/checkbox-shadcn/usePrevious";
import {useSize} from "@/app/lesson/valibot/checkbox-shadcn/useSize";
//新的类型CheckedState
type CheckedState = boolean | 'indeterminate';

//判断是否为indeterminate
function isIndeterminate(checked?: CheckedState): checked is 'indeterminate' {
    return checked === 'indeterminate';
}

//Omits the 'ref' attribute from the given props object.
type InputProps = React.ComponentPropsWithoutRef<'input'>;
//重定义checked属性的类型为CheckedState
//新增control属性，用于获取父元素的尺寸
//新增bubbles属性，const event = new Event("click", {bubbles});
interface BubbleInputProps extends Omit<InputProps, 'checked'> {
    checked: CheckedState;
    control: HTMLElement | null;
    bubbles: boolean;
}

const BubbleInput = (props: BubbleInputProps) => {
    const {control, checked, bubbles = true, ...inputProps} = props;
    const ref = React.useRef<HTMLInputElement>(null);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);

    // Bubble checked change to parents (e.g form change event)
    React.useEffect(() => {
        const input = ref.current!;
        const inputProto = window.HTMLInputElement.prototype;
        const descriptor = Object.getOwnPropertyDescriptor(inputProto, 'checked') as PropertyDescriptor;
        const setChecked = descriptor.set;

        debugger;
        if (prevChecked !== checked && setChecked) {
            debugger;
            const event = new Event('click', {bubbles:false});
            input.indeterminate = isIndeterminate(checked);
            setChecked.call(input, isIndeterminate(checked) ? false : checked);
            input.dispatchEvent(event);
        }
    }, [prevChecked, checked, bubbles]);

    function handleClick(event: React.MouseEvent<HTMLInputElement>) {
        alert(event.bubbles);
    }

    return (
        <input
            // onClick={handleClick}
            type="checkbox"
            aria-hidden
            defaultChecked={isIndeterminate(checked) ? false : checked}
            {...inputProps}
            tabIndex={-1}
            ref={ref}
            style={{
                ...props.style,
                ...controlSize,
                position: 'absolute',
                pointerEvents: 'none',
                opacity: 0,
                margin: 0,
            }}
        />
    );
};
export default BubbleInput;