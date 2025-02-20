import { ForwardedRef, forwardRef } from "react";
import { CommunicationProps } from "@/app/lesson/communication/parent-get-child-state/CommunicationApi";

const ForwardChildController = forwardRef<HTMLDivElement, CommunicationProps>(
  (props: CommunicationProps, ref: ForwardedRef<HTMLDivElement>) => {
    return (
      <div>
        <div ref={ref}>{props.data}==hahahah</div>
      </div>
    );
  }
);

ForwardChildController.displayName = "ForwardChildController";
export default ForwardChildController;
