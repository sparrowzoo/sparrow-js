import {COOKIE_DAYS, COOKIE_DOMAIN, COOKIE_SAME_SITE, COOKIE_SECURE, NODE_ENV} from "../Env";
import type {StorageSaveOptions} from "../protocol/CrosProtocol";
import {StorageOperationError} from "./types";
import type {StorageStrategy} from "./types";

type CookieAttributes = {domain?: string; sameSite: string; secure: boolean};

/** Cookie transport encoding and physical retention; never interprets token claims. */
export default class CookieStorage implements StorageStrategy {
    public get(key: string): string | null {
        return this.readValue(key) || null;
    }

    public set(key: string, value: string, options: StorageSaveOptions = {}): string {
        if (!options || typeof options !== "object" ||
            (options.remember !== undefined && typeof options.remember !== "boolean")) {
            throw new StorageOperationError("CONFIG_INVALID", "Cookie remember must be a boolean");
        }
        if (typeof value !== "string") {
            throw new StorageOperationError("COOKIE_INVALID", "Cookie value must be a string");
        }
        const attributes = this.attributes();
        const daysText = COOKIE_DAYS?.trim() || "14";
        const days = Number(daysText);
        const seconds = (days + 1) * 86400;
        const expiresAt = Date.now() + seconds * 1000;
        if (!/^\d+$/.test(daysText) || !Number.isSafeInteger(days) || days < 1 ||
            !Number.isSafeInteger(expiresAt) || !Number.isFinite(new Date(expiresAt).getTime())) {
            throw new StorageOperationError("CONFIG_INVALID", "Cookie days must produce a valid positive retention period");
        }
        let assignment = `${this.name(key)}=${this.encode(value)}${this.attributeText(attributes)}`;
        if (options.remember === true) {
            assignment += `; Max-Age=${seconds}; Expires=${new Date(expiresAt).toUTCString()}`;
        }
        if (new TextEncoder().encode(assignment).length > 4096) {
            throw new StorageOperationError("COOKIE_TOO_LARGE", "Cookie assignment exceeds 4096 bytes");
        }
        this.readValue(key);
        this.browserDocument().cookie = assignment;
        if (this.readValue(key) !== value) {
            throw new StorageOperationError("COOKIE_WRITE_FAILED", "Cookie write could not be confirmed");
        }
        return value;
    }

    public remove(key: string): string | null {
        return this.removeWithAttributes(key, false);
    }

    public removeHostOnlyCookie(key: string): string | null {
        return this.removeWithAttributes(key, true);
    }

    /** Configuration only: same name and Path=/ are supplied by the token caller. */
    public sharesCookieScopeWith(authorityOrigin: string): boolean {
        const hostname = this.browserHost();
        let authorityHost: string;
        try {
            const authority = new URL(authorityOrigin);
            if (!/^https?:$/.test(authority.protocol)) throw new Error();
            authorityHost = authority.hostname.toLowerCase();
        } catch {
            throw new StorageOperationError("CONFIG_INVALID", "Invalid authority origin");
        }
        const domain = this.domain();
        return domain
            ? this.matchesDomain(hostname, domain) && this.matchesDomain(authorityHost, domain)
            : hostname === authorityHost;
    }

    private readValue(key: string): string | null {
        const name = this.name(key);
        const matches = this.browserDocument().cookie.split(";").map((part) => part.trim())
            .filter((part) => {
                const separator = part.indexOf("=");
                // Browsers can expose nameless Cookies without an equals sign.
                return separator >= 0 && part.slice(0, separator) === name;
            });
        if (matches.length > 1) {
            throw new StorageOperationError("COOKIE_AMBIGUOUS", "Multiple visible Cookies have the requested name");
        }
        if (matches.length === 0) return null;
        try {
            return decodeURIComponent(matches[0].slice(matches[0].indexOf("=") + 1));
        } catch {
            throw new StorageOperationError("COOKIE_INVALID", "Cookie value encoding is invalid");
        }
    }

    private removeWithAttributes(key: string, hostOnly: boolean): string | null {
        const value = this.readValue(key);
        if (value === null) return null;
        const attributes = this.attributes(hostOnly);
        this.browserDocument().cookie = `${this.name(key)}=${this.attributeText(attributes)}; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        if (this.readValue(key) !== null) {
            throw new StorageOperationError("COOKIE_REMOVE_FAILED", "Cookie removal could not be confirmed in the requested scope");
        }
        return value || null;
    }

    private attributes(hostOnly = false): CookieAttributes {
        const hostname = this.browserHost();
        const domain = hostOnly ? undefined : this.domain();
        if (domain && (!this.matchesDomain(hostname, domain) || (!domain.includes(".") && domain !== hostname))) {
            throw new StorageOperationError("CONFIG_INVALID", "Cookie domain does not match the writing host");
        }
        const sameSite = COOKIE_SAME_SITE?.trim() || "Lax";
        const secureText = COOKIE_SECURE?.trim();
        if (!["Lax", "Strict", "None"].includes(sameSite) ||
            (secureText && secureText !== "true" && secureText !== "false")) {
            throw new StorageOperationError("CONFIG_INVALID", "Invalid Cookie attributes");
        }
        const secure = secureText ? secureText === "true" : NODE_ENV === "production" || window.location.protocol === "https:";
        if ((NODE_ENV === "production" || sameSite === "None") && !secure) {
            throw new StorageOperationError("CONFIG_INVALID", "Cookie configuration requires Secure");
        }
        return {domain, sameSite, secure};
    }

    private domain(): string | undefined {
        const domain = COOKIE_DOMAIN?.trim().replace(/^\./, "").toLowerCase();
        if (!domain) return undefined;
        if (domain.length > 253 || domain.split(".").some((label) => !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label))) {
            throw new StorageOperationError("CONFIG_INVALID", "Invalid Cookie domain");
        }
        return domain;
    }

    private matchesDomain(hostname: string, domain: string): boolean {
        return hostname === domain || hostname.endsWith(`.${domain}`);
    }

    private attributeText(attributes: CookieAttributes): string {
        return `; Path=/${attributes.domain ? `; Domain=${attributes.domain}` : ""}; SameSite=${attributes.sameSite}${attributes.secure ? "; Secure" : ""}`;
    }

    private name(key: string): string {
        if (typeof key !== "string" || key.length === 0) {
            throw new StorageOperationError("CONFIG_INVALID", "Cookie key must be a nonempty string");
        }
        return this.encode(key);
    }

    private encode(value: string): string {
        try {
            return encodeURIComponent(value);
        } catch {
            throw new StorageOperationError("COOKIE_INVALID", "Cookie text cannot be encoded");
        }
    }

    private browserDocument(): Document {
        if (typeof document === "undefined") {
            throw new StorageOperationError("STORAGE_UNAVAILABLE", "Cookie storage is unavailable");
        }
        return document;
    }

    private browserHost(): string {
        if (typeof window === "undefined") {
            throw new StorageOperationError("STORAGE_UNAVAILABLE", "Cookie storage is unavailable");
        }
        return window.location.hostname.toLowerCase();
    }
}
