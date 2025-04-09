export default class Group {
    private _qunId:string;
    private _qunName:string;
    private _announcement:string;
    private _nationality:string;
    private _remark:string;
    private _ownerId:string;
    private _ownerName:string;

    private _categoryId:number;
    private _categoryName:string;
    private _avatar:string;


    get qunId(): string {
        return this._qunId;
    }

    set qunId(value: string) {
        this._qunId = value;
    }

    get qunName(): string {
        return this._qunName;
    }

    set qunName(value: string) {
        this._qunName = value;
    }

    get announcement(): string {
        return this._announcement;
    }

    set announcement(value: string) {
        this._announcement = value;
    }

    get nationality(): string {
        return this._nationality;
    }

    set nationality(value: string) {
        this._nationality = value;
    }

    get remark(): string {
        return this._remark;
    }

    set remark(value: string) {
        this._remark = value;
    }

    get ownerId(): string {
        return this._ownerId;
    }

    set ownerId(value: string) {
        this._ownerId = value;
    }

    get ownerName(): string {
        return this._ownerName;
    }

    set ownerName(value: string) {
        this._ownerName = value;
    }

    get categoryId(): number {
        return this._categoryId;
    }

    set categoryId(value: number) {
        this._categoryId = value;
    }

    get categoryName(): string {
        return this._categoryName;
    }

    set categoryName(value: string) {
        this._categoryName = value;
    }

    get avatar(): string {
        return this._avatar;
    }

    set avatar(value: string) {
        this._avatar = value;
    }
}