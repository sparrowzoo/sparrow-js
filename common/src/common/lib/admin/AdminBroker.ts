import AccessHistoryContainer from "@/common/lib/admin/AccessHistoryContainer";

export default class AdminBroker {
    public accessHistoryContainer: AccessHistoryContainer;
    private listeners = new Set<() => void>();

    public constructor(accessHistoryContainer: AccessHistoryContainer) {
        this.accessHistoryContainer = accessHistoryContainer;
    }

    public subscribe(listener: () => void): () => void {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
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

    public clearHistory() {
        this.accessHistoryContainer.clear();
        this.newMessageSignal();
    }

    public newMessageSignal = () => {
        this.listeners.forEach((listener) => listener());
    };
}
