export default interface Result {
    code: string;
    message?: string;
    data: any;
    key?: string;
    instruction?: string;
}


export interface PagerResult {
    recordTotal: number;
    list: any[];
    dictionary: Map<String, Object>;
}
