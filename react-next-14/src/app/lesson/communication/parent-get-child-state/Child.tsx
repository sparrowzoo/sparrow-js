import {ForwardedRef, forwardRef, useImperativeHandle, useState} from "react";
import {CommunicationApi, CommunicationProps} from "@/app/lesson/communication/parent-get-child-state/CommunicationApi";


const LocationChild = forwardRef<CommunicationApi, CommunicationProps>(
    (props: CommunicationProps, ref: ForwardedRef<CommunicationApi>) => {
        const [state, setState] = useState("i from child")
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
    });

LocationChild.displayName = "LocationChild";
export default LocationChild;