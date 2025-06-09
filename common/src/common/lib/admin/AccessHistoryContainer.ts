import AccessLog from "@/common/lib/admin/AccessLog";

export default class AccessHistoryContainer {
    public ALL_MENU_ITEMS: Map<string, string> = new Map();
    public ACCESS_HISTORY_MENU_ITEMS: AccessLog[] = [];

    constructor(ALL_MENU_ITEMS: Map<string, string>) {
        this.ALL_MENU_ITEMS = ALL_MENU_ITEMS;
    }

    public getAccessHistories(): AccessLog[] {
        return this.ACCESS_HISTORY_MENU_ITEMS.sort(
            (a, b) => b.accessTime - a.accessTime
        );
    }

    public access(url: string): void {
        const title = this.ALL_MENU_ITEMS.get(url) as string;
        const existingItem = this.ACCESS_HISTORY_MENU_ITEMS.find(
            (item) => item.url === url
        );
        if (existingItem) {
            existingItem.accessTime = new Date().getTime();
            return;
        }
        this.ACCESS_HISTORY_MENU_ITEMS.push(new AccessLog(url, title));
        if (this.ACCESS_HISTORY_MENU_ITEMS.length > 20) {
            this.ACCESS_HISTORY_MENU_ITEMS.shift();
        }
    }

    public delete(url: string): void {
        const item = this.ACCESS_HISTORY_MENU_ITEMS.findIndex(
            (item) => item.url === url
        );
        this.ACCESS_HISTORY_MENU_ITEMS.splice(item, 1);
    }
}
