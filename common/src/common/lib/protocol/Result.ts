export default interface Result<Data> {
    code: string;
    message: string;
    data: Data;
    key: string;
    instruction: string;
}

export interface PagerResult<T> {
    recordTotal: number;
    list: T[];
    dictionary: Map<String, Object>;
}

