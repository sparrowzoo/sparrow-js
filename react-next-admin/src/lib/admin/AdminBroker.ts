import AccessHistoryContainer from "@/lib/admin/AccessHistoryContainer";

export default class AdminBroker {
  public accessHistoryContainer: AccessHistoryContainer;

  public constructor(accessHistoryContainer: AccessHistoryContainer) {
    this.accessHistoryContainer = accessHistoryContainer;
  }

  public access(url: string, router: any) {
    this.accessHistoryContainer.access(url);
    router.push(url);
    this.newMessageSignal();
  }

  public deleteHistory(url: string) {
    this.accessHistoryContainer.delete(url);
    this.newMessageSignal();
  }

  public newMessageSignal = () => {};
}
