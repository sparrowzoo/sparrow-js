export enum ChatType {
    CHAT_1_TO_1 = 0,
    GROUP = 1,
}

export enum MessageType {
    TEXT = 0,
}

export enum EventType {
    MESSAGE = 0
}

export default class Chat {
    public static readonly HORIZON_LINE: string = "-";
}
