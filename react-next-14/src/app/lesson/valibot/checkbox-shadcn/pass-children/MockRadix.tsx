import * as React from "react";
import BubbleInput from "@/app/lesson/valibot/checkbox-shadcn/BubbleInput";
import {useControllableState} from "@/app/lesson/valibot/checkbox-shadcn/useControllableState";
import {useComposedRefs} from "@/app/lesson/valibot/checkbox-shadcn/composeRefs";

const CHECKBOX_NAME = "Checkbox";
type CheckedState = boolean | "indeterminate";

type CheckboxElement = React.ElementRef<'button'>;
type Scope<C = any> = { [scopeName: string]: React.Context<C>[] } | undefined;
type ScopedProps<P> = P & { __scopeCheckbox?: Scope };


type PrimitiveButtonProps = React.ComponentPropsWithoutRef<'button'>;
interface CheckboxProps extends Omit<PrimitiveButtonProps, 'checked' | 'defaultChecked'> {
    checked?: CheckedState;
    defaultChecked?: CheckedState;
    required?: boolean;
    onCheckedChange?(checked: CheckedState): void;
}

const MockRadix = React.forwardRef<CheckboxElement, CheckboxProps>(
    (props: ScopedProps<CheckboxProps>, forwardedRef) => {
        const {

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
        return (
            <>
                <button
                    type="button"
                    role="checkbox"
                    value={value}
                    {...checkboxProps}
                >
                </button>
            </>
        );
    }
);

MockRadix.displayName = CHECKBOX_NAME;
export default MockRadix;
