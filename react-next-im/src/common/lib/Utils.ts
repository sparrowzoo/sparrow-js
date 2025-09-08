import {format} from "date-fns";
import KeyValue from "@/common/lib/protocol/KeyValue";

export class Utils {
    public static randomUUID() {
        const hex = "0123456789abcdef";
        let uuid = "";
        for (let i = 0; i < 36; i++) {
            if ([8, 13, 18, 23].includes(i)) uuid += "-";
            else uuid += hex[Math.floor(Math.random() * 16)];
        }
        return uuid;
    }

    public static dateFormat(timestamp: number): string {
        const date = new Date(timestamp);
        const today = new Date();
        if (date.getDate() == today.getDate()) {
            return format(timestamp, "HH:mm");
        }
        return format(timestamp, "MM/dd HH:mm");
    }

    public static isImage(url: string): boolean {
        const imageTypes = ["jpg", "jpeg", "png", "gif"];
        const extension = url.split(".").pop();
        return imageTypes.includes(extension as string);
    }

    public static getValue(dictionary: KeyValue[] | undefined, key: string): KeyValue | undefined {
        if (!dictionary) {
            return undefined;
        }
        return dictionary.find((e) => {
            return e.key == key;
        })
    }
}
