import React from "react";
import {CheckIcon} from "@radix-ui/react-icons";

const INDICATOR_NAME = 'CheckboxIndicator';
type Scope<C = any> = { [scopeName: string]: React.Context<C>[] } | undefined;
type ScopedProps<P> = P & { __scopeCheckbox?: Scope };
type PrimitiveSpanProps = React.ComponentPropsWithoutRef<'span'>;

interface CheckboxIndicatorProps extends PrimitiveSpanProps {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true;
    showIndicator?: boolean;
}

const CheckboxIndicator = React.forwardRef<HTMLSpanElement, CheckboxIndicatorProps>(
    (props: ScopedProps<CheckboxIndicatorProps>, forwardedRef) => {
        const {showIndicator,__scopeCheckbox, forceMount, ...indicatorProps} = props;

        return (
            <div>
                {showIndicator && (
                    <span
                        data-state={"unchecked"}
                        data-disabled={"false"}
                        {...indicatorProps}
                        ref={forwardedRef}
                        style={{pointerEvents: 'none', ...props.style}}
                    >
                     <CheckIcon className="h-4 w-4"/>
                </span>)}
            </div>
        );
    }
);

CheckboxIndicator.displayName = INDICATOR_NAME;
export default CheckboxIndicator;