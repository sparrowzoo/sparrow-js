export default class Contact {
  /**
   * 国籍
   */
  private _nationality: string;

  get nationality(): string {
    return this._nationality;
  }

  set nationality(value: string) {
    this._nationality = value;
  }

  /**
   * 国旗url
   */
  private _flagUrl: string;

  get flagUrl(): string {
    return this._flagUrl;
  }

  set flagUrl(value: string) {
    this._flagUrl = value;
  }

  /**
   * 用户id
   */
  private _userId: string;

  get userId(): string {
    return this._userId;
  }

  set userId(value: string) {
    //保证userId为字符串
    this._userId = value + "";
  }

  /**
   * 用户名
   */
  private _userName: string;

  get userName(): string {
    return this._userName;
  }

  set userName(value: string) {
    this._userName = value;
  }

  /**
   * 头象
   */
  private _avatar: string;

  get avatar(): string {
    return this._avatar;
  }

  set avatar(value: string) {
    this._avatar = value;
  }
}
