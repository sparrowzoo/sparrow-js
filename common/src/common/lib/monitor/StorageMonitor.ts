import type {CommandType, StorageType} from "../protocol/CrosProtocol";

export type CrosStorageEventType =
    | "iframe-created" | "iframe-reused" | "iframe-load" | "iframe-ready"
    | "request-created" | "request-waiting" | "request-sent" | "response-received"
    | "request-error" | "request-timeout" | "request-cancelled"
    | "storage-operation" | "storage-error" | "destroy";

export interface CrosStorageEvent {
    readonly type: CrosStorageEventType;
    readonly timestamp: number;
    readonly crossOrigin: boolean;
    readonly iframeOrigin: string;
    readonly requestId?: string;
    readonly command?: CommandType;
    readonly storage?: StorageType;
    readonly key?: string;
    /** Kept for source compatibility; monitoring output never contains this field. */
    readonly value?: string | null;
    readonly valueLength?: number;
    readonly loaded?: boolean;
    readonly error?: string;
}

export interface CrosStorageMonitor {
    onEvent(event: CrosStorageEvent): void | Promise<void>;
}

export interface StorageMonitorOptions {
    monitor?: CrosStorageMonitor;
    debug?: boolean;
    crossOrigin: boolean;
    iframeOrigin: string;
}

export type StorageEventInput = Omit<CrosStorageEvent, "timestamp" | "crossOrigin" | "iframeOrigin">;

export class StorageMonitor {
    constructor(private readonly options: StorageMonitorOptions) {}

    emit(event: StorageEventInput): void {
        if (!this.options.monitor && !this.options.debug) return;
        // Explicit fields prevent payloads or future protocol additions leaking via spread.
        const safe: CrosStorageEvent = {
            type: event.type,
            timestamp: Date.now(),
            crossOrigin: this.options.crossOrigin,
            iframeOrigin: this.options.iframeOrigin,
            requestId: event.requestId,
            command: event.command,
            storage: event.storage,
            key: event.key,
            valueLength: typeof event.value === "string" ? event.value.length
                : event.value === null ? 0 : event.valueLength,
            loaded: event.loaded,
            // Browser/remote error messages may themselves contain credentials.
            error: event.error ? "Storage operation failed" : undefined,
        };
        try {
            if (this.options.monitor) {
                const result = this.options.monitor.onEvent(safe);
                if (result) Promise.resolve(result).catch(() => {});
            } else {
                console.log(JSON.stringify(safe));
            }
        } catch {
            // Monitoring must not break the storage operation or create unhandled rejections.
        }
    }
}

export default StorageMonitor;
