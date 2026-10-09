import type {StorageSaveOptions, StorageType} from "../protocol/CrosProtocol";

export type ConcreteStorage = Exclude<StorageType, StorageType.AUTOMATIC>;

export interface StorageStrategy {
    get(key: string): string | null;
    set(key: string, value: string, options?: StorageSaveOptions): string;
    remove(key: string): string | null;
}

export class StorageOperationError extends Error {
    constructor(public readonly code: string, message: string) {
        super(`${code}: ${message}`);
        this.name = "StorageOperationError";
    }
}
