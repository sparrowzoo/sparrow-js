import {ChatType} from "@/lib/protocol/Chat";

export default class SessionDetail {
    private _sessionKey: string;
    get sessionKey(): string {
        return this._sessionKey;
    }

    set sessionKey(value: string) {
        this._sessionKey = value;
    }

    private _lastReadTime: number;

    get lastReadTime(): number {
        return this._lastReadTime;
    }

    set lastReadTime(value: number) {
        this._lastReadTime = value;
    }

    private _unread: number;

    get unread(): number {
        return this._unread;
    }

    set unread(value: number) {
        this._unread = value;
    }

    private _sessionUrl: string;

    get sessionUrl(): string {
        return this._sessionUrl;
    }

    set sessionUrl(value: string) {
        this._sessionUrl = value;
    }

    private _name: string;

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    private _avatarUrl: string;

    get avatarUrl(): string {
        return this._avatarUrl;
    }

    set avatarUrl(value: string) {
        this._avatarUrl = value;
    }

    private _chatType: ChatType;

    get chatType(): ChatType {
        return this._chatType;
    }

    set chatType(value: ChatType) {
        this._chatType = value;
    }
}
