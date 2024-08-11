import * as React from "react";
import BubbleInput from "@/app/lesson/valibot/checkbox-shadcn/BubbleInput";
import {useControllableState} from "@/app/lesson/valibot/checkbox-shadcn/useControllableState";
import {useComposedRefs} from "@/app/lesson/valibot/checkbox-shadcn/composeRefs";
import CheckStatusContext, {CheckedState} from "@/app/lesson/valibot/checkbox-shadcn/CheckBoxContext";

const CHECKBOX_NAME = "Checkbox";

type CheckboxElement = React.ElementRef<'button'>;
type Scope<C = any> = { [scopeName: string]: React.Context<C>[] } | undefined;
type ScopedProps<P> = P & { __scopeCheckbox?: Scope };

function isIndeterminate(checked?: CheckedState): checked is 'indeterminate' {
    return checked === 'indeterminate';
}

type PrimitiveButtonProps = React.ComponentPropsWithoutRef<'button'>;
interface CheckboxProps extends Omit<PrimitiveButtonProps, 'checked' | 'defaultChecked'> {
    checked?: CheckedState;
    defaultChecked?: CheckedState;
    required?: boolean;
    onCheckedChange?(checked: CheckedState): void;
}

const RadixCheckBox = React.forwardRef<CheckboxElement, CheckboxProps>(
    (props: ScopedProps<CheckboxProps>, forwardedRef) => {

        const {
            __scopeCheckbox,
            name,
            //属性别名
            checked: checkedProp,
            defaultChecked,
            required,
            disabled,
            value = "on",
            onCheckedChange,
            ...checkboxProps
        } = props;
        const [button, setButton] = React.useState<HTMLButtonElement | null>(null);
        const composedRefs = useComposedRefs(forwardedRef, (node) =>
            setButton(node)
        );
        const hasConsumerStoppedPropagationRef = React.useRef(false);
        // We set this to true by default so that events bubble to forms without JS (SSR)
        const isFormControl = button ? Boolean(button.closest("form")) : true;
        const [checked = false, setChecked] = useControllableState({
            prop: checkedProp,
            defaultProp: defaultChecked,
            onChange: onCheckedChange,
        });
        const initialCheckedStateRef = React.useRef(checked);
        React.useEffect(() => {
            const form = button?.form;
            if (form) {
                const reset = () => setChecked(initialCheckedStateRef.current);
                form.addEventListener("reset", reset);
                return () => form.removeEventListener("reset", reset);
            }
        }, [button, setChecked]);


        return (
            <>
                <CheckStatusContext.Provider value={checked}>
                <button
                    type="button"
                    role="checkbox"
                    aria-checked={isIndeterminate(checked) ? "mixed" : checked}
                    aria-required={required}
                    data-disabled={disabled ? "" : undefined}
                    disabled={disabled}
                    value={value}
                    {...checkboxProps}
                    ref={composedRefs}
                    onClick={(event) => {
                        setChecked((prevChecked) =>
                            isIndeterminate(prevChecked) ? true : !prevChecked
                        );
                        if (isFormControl) {
                            hasConsumerStoppedPropagationRef.current =
                                event.isPropagationStopped();
                            // if checkbox is in a form, stop propagation from the button so that we only propagate
                            // one click event (from the input). We propagate changes from an input so that native
                            // form validation works and form events reflect checkbox updates.
                            if (!hasConsumerStoppedPropagationRef.current)
                                event.stopPropagation();
                        }
                    }}
                ></button>
                {isFormControl && (
                    <BubbleInput
                        control={button}
                        bubbles={!hasConsumerStoppedPropagationRef.current}
                        name={name}
                        value={value}
                        checked={checked}
                        required={required}
                        disabled={disabled}
                        // We transform because the input is absolutely positioned but we have
                        // rendered it **after** the button. This pulls it back to sit on top
                        // of the button.
                        style={{transform: "translateX(-100%)"}}
                    />
                )}
                    </CheckStatusContext.Provider>
            </>
        );
    }
);

RadixCheckBox.displayName = CHECKBOX_NAME;
export default RadixCheckBox;
