import AccessLog from "@/lib/admin/AccessLog";

export default class AccessHistoryContainer {
    public ALL_MENU_ITEMS: Map<string, string> = new Map();
    public ACCESS_HISTORY_MENU_ITEMS: AccessLog[]=[]
    constructor() {
      this.init();
    }
    private async init() {
        return await new Promise((resolve, reject) => {
            fetch("/api/access-history");
        });
    }

    public getAccessHistories(): AccessLog[] {
        return this.ACCESS_HISTORY_MENU_ITEMS.sort((a, b) => b.accessTime - a.accessTime)
    }

    public access(url:string): void {
        const title = this.ALL_MENU_ITEMS.get(url) as string;
        this.ACCESS_HISTORY_MENU_ITEMS.push(new AccessLog(url, title));
    }
}