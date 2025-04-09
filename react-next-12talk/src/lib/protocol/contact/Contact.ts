export default class Contact {
    get nationality(): string {
        return this._nationality;
    }

    set nationality(value: string) {
        this._nationality = value;
    }

    get flagUrl(): string {
        return this._flagUrl;
    }

    set flagUrl(value: string) {
        this._flagUrl = value;
    }

    get userId(): number {
        return this._userId;
    }

    set userId(value: number) {
        this._userId = value;
    }

    get userName(): string {
        return this._userName;
    }

    set userName(value: string) {
        this._userName = value;
    }

    get avatar(): string {
        return this._avatar;
    }

    set avatar(value: string) {
        this._avatar = value;
    }
    /**
     * 国籍
     */
    private _nationality:string;
    /**
     * 国旗url
     */
    private _flagUrl:string;
    /**
     * 用户id
     */
    private _userId:number;
    /**
     * 用户名
     */
    private _userName:string;
    /**
     * 头象
     */
    private _avatar:string;
}