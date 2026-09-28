import {TOKEN_STORAGE} from "../Env";
import {StorageType} from "../protocol/CrosProtocol";
import type {StorageSaveOptions} from "../protocol/CrosProtocol";
import CookieStorage from "./CookieStorage";
import WebStorage from "./WebStorage";
import {StorageOperationError} from "./types";
import type {ConcreteStorage, StorageStrategy} from "./types";

/** Local storage routing only. Cross-origin transport belongs to CrosStorage. */
export default class StorageManager {
    private readonly strategies = new Map<ConcreteStorage, StorageStrategy>();

    constructor() {
        this.register(StorageType.LOCAL, new WebStorage("localStorage"));
        this.register(StorageType.SESSION, new WebStorage("sessionStorage"));
        this.register(StorageType.COOKIE, new CookieStorage());
    }

    public register(storage: ConcreteStorage, strategy: StorageStrategy): void {
        if (storage === (StorageType.AUTOMATIC as StorageType)) {
            throw new StorageOperationError("CONFIG_INVALID", "A strategy requires a concrete storage type");
        }
        this.strategies.set(storage, strategy);
    }

    public resolve(storage: StorageType = StorageType.AUTOMATIC): ConcreteStorage {
        if (storage !== StorageType.AUTOMATIC) {
            if (this.strategies.has(storage)) return storage;
            throw new StorageOperationError("CONFIG_INVALID", "Unknown storage type");
        }
        const configured = TOKEN_STORAGE?.trim() || "LOCAL";
        const selected = [...this.strategies.keys()].find((type) => type.toUpperCase() === configured);
        if (!selected) throw new StorageOperationError("CONFIG_INVALID", "Unknown configured storage type");
        return selected;
    }

    public get(key: string, storage: StorageType = StorageType.AUTOMATIC): string | null {
        return this.strategies.get(this.resolve(storage))!.get(key);
    }

    public set(key: string, value: string, storage: StorageType = StorageType.AUTOMATIC, options?: StorageSaveOptions): string {
        return this.strategies.get(this.resolve(storage))!.set(key, value, options);
    }

    public remove(key: string, storage: StorageType = StorageType.AUTOMATIC): string | null {
        return this.strategies.get(this.resolve(storage))!.remove(key);
    }

    /** Describes configured scope; document.cookie cannot reveal an existing Cookie's Domain. */
    public sharesCookieScopeWith(authorityOrigin: string): boolean {
        return this.cookieStrategy().sharesCookieScopeWith(authorityOrigin);
    }

    /** Explicit host-only cleanup; never guesses another parent-domain scope. */
    public removeHostOnlyCookie(key: string): string | null {
        return this.cookieStrategy().removeHostOnlyCookie(key);
    }

    private cookieStrategy(): CookieStorage {
        const strategy = this.strategies.get(StorageType.COOKIE);
        if (!(strategy instanceof CookieStorage)) {
            throw new StorageOperationError("CONFIG_INVALID", "The registered Cookie strategy does not expose scope operations");
        }
        return strategy;
    }
}
