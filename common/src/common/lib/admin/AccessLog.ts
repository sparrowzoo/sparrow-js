export default class AccessLog {
  public accessTime: number;
  public url: string;
  public title: string;

  constructor(url: string, title: string) {
    this.accessTime = new Date().getTime();
    this.url = url;
    this.title = title;
  }
}
