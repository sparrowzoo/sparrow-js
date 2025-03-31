export class ContactStatus {
  static readonly STATUS: string = "STATUS";
  private _id: string;

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  private _category: number;

  get category(): number {
    return this._category;
  }

  set category(value: number) {
    this._category = value;
  }

  private _online: boolean;

  get online(): boolean {
    return this._online;
  }

  set online(online: boolean) {
    this._online = online;
  }

  private _lastActiveTime: number;

  get lastActiveTime(): number {
    return this._lastActiveTime;
  }

  set lastActiveTime(value: number) {
    this._lastActiveTime = value;
  }
}
