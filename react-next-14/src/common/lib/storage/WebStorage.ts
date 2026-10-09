import {StorageOperationError} from "./types";
import type {StorageStrategy} from "./types";

/** Browser storage is acquired on each operation so construction is SSR safe. */
export default class WebStorage implements StorageStrategy {
    constructor(private readonly property: "localStorage" | "sessionStorage") {}

    public get(key: string): string | null {
        return this.storage().getItem(key);
    }

    public set(key: string, value: string): string {
        this.storage().setItem(key, value);
        return value;
    }

    public remove(key: string): string | null {
        const storage = this.storage();
        const value = storage.getItem(key);
        storage.removeItem(key);
        return value;
    }

    private storage(): Storage {
        if (typeof window === "undefined") {
            throw new StorageOperationError("STORAGE_UNAVAILABLE", "Browser storage is unavailable");
        }
        return window[this.property];
    }
}
