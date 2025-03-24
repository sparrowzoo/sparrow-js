import { ForwardedRef, forwardRef, useImperativeHandle, useState } from "react";
import {
  CommunicationApi,
  CommunicationProps,
} from "@/app/lesson/communication/parent-get-child-state/CommunicationApi";

const MethodChild = forwardRef<CommunicationApi, CommunicationProps>(
  (props: CommunicationProps, ref: ForwardedRef<CommunicationApi>) => {
    const [state, setState] = useState("i from child");
    useImperativeHandle(ref, () => ({
      getChildState() {
        return state;
      },
    }));
    return (
      <div>
        <div>{props.data}</div>
      </div>
    );
  }
);

MethodChild.displayName = "LocationChild";
export default MethodChild;
