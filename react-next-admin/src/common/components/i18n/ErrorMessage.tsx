import {Check} from "lucide-react";

export interface MessageProps {
    message?: string,
    submitted: boolean,
    messageClass?: string,
    rightClass?: string
}

export default function ErrorMessage(messageProps: MessageProps) {
    const {message, messageClass, rightClass, submitted} = messageProps;
    let localMessageClass = messageClass;
    let localRightClass = rightClass;
    if (!messageClass) {
        localMessageClass = "text-red-600";
    }
    if (!rightClass) {
        localRightClass = "text-red-600";
    }
    if (message) {
        return <span className={localMessageClass}>{message}</span>
    }
    if (submitted) {
        return <Check className={localRightClass}/>
    }
    return <></>
}
