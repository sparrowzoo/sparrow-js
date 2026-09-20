import KeyValue from "@/common/lib/protocol/KeyValue";

export default interface Result<T = unknown> {
    code: string;
    message?: string;
    data: T;
    key?: string;
    instruction?: string;
}

export interface PagerResult<T = unknown> {
    recordTotal: number;
    list: T[];
    dictionary: Record<string, KeyValue[]>;
}
