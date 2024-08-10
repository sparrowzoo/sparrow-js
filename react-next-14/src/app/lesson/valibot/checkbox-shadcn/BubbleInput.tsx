import * as React from "react";
import {usePrevious} from "@/app/lesson/valibot/checkbox-shadcn/usePrevious";
import {useSize} from "@/app/lesson/valibot/checkbox-shadcn/useSize";

type CheckedState = boolean | 'indeterminate';
function isIndeterminate(checked?: CheckedState): checked is 'indeterminate' {
    return checked === 'indeterminate';
}

type InputProps = React.ComponentPropsWithoutRef<'input'>;
interface BubbleInputProps extends Omit<InputProps, 'checked'> {
    checked: CheckedState;
    control: HTMLElement | null;
    bubbles: boolean;
}
const BubbleInput = (props: BubbleInputProps) => {
    const { control, checked, bubbles = true, ...inputProps } = props;
    const ref = React.useRef<HTMLInputElement>(null);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);

    // Bubble checked change to parents (e.g form change event)
    React.useEffect(() => {
        const input = ref.current!;
        const inputProto = window.HTMLInputElement.prototype;
        const descriptor = Object.getOwnPropertyDescriptor(inputProto, 'checked') as PropertyDescriptor;
        const setChecked = descriptor.set;

        if (prevChecked !== checked && setChecked) {
            const event = new Event('click', { bubbles });
            input.indeterminate = isIndeterminate(checked);
            setChecked.call(input, isIndeterminate(checked) ? false : checked);
            input.dispatchEvent(event);
        }
    }, [prevChecked, checked, bubbles]);

    return (
        <input
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