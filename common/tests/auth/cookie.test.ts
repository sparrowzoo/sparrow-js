// @vitest-environment jsdom
// @vitest-environment-options {"url":"https://app.example.com/"}
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";

const envKeys = ["NEXT_PUBLIC_TOKEN_STORAGE", "NEXT_PUBLIC_TOKEN_COOKIE_DOMAIN", "NEXT_PUBLIC_TOKEN_COOKIE_SAME_SITE", "NEXT_PUBLIC_TOKEN_COOKIE_SECURE", "NEXT_PUBLIC_TOKEN_COOKIE_DAYS"];

async function manager(env: Record<string, string> = {}) {
    vi.resetModules();
    envKeys.forEach((key) => vi.stubEnv(key, env[key]));
    const {default: StorageManager} = await import("../../src/common/lib/storage/StorageManager");
    return new StorageManager();
}

beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(";").forEach((part) => {
        const name = part.trim().split("=")[0];
        for (const domain of ["", "; Domain=example.com", "; Domain=app.example.com"]) {
            document.cookie = `${name}=; Max-Age=0; Path=/${domain}`;
        }
    });
});

afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.useRealTimers();
});

describe("S01 storage strategy selection and opaque values", () => {
    it("defaults to LOCAL while explicit SESSION and COOKIE remain isolated", async () => {
        const store = await manager();
        const token = "opaque.%25=你好.token==";
        expect(store.set("Authorization", token)).toBe(token);
        expect(localStorage.getItem("Authorization")).toBe(token);
        expect(store.get("Authorization", "session" as never)).toBeNull();
        store.set("Authorization", "session-value", "session" as never);
        store.set("Authorization", "cookie-value", "cookie" as never);
        expect(store.get("Authorization")).toBe(token);
        expect(store.get("Authorization", "session" as never)).toBe("session-value");
        expect(store.remove("Authorization", "cookie" as never)).toBe("cookie-value");
        expect(store.get("Authorization", "cookie" as never)).toBeNull();
    });

    it("uses the configured default but gives an explicit strategy priority", async () => {
        const store = await manager({NEXT_PUBLIC_TOKEN_STORAGE: "COOKIE"});
        store.set("Authorization", "cookie-default");
        store.set("Authorization", "local-explicit", "local" as never);
        expect(store.get("Authorization")).toBe("cookie-default");
        expect(store.get("Authorization", "local" as never)).toBe("local-explicit");
    });

    it("rejects an invalid configured default without blocking a valid explicit mode", async () => {
        const store = await manager({NEXT_PUBLIC_TOKEN_STORAGE: "COOOKIE"});
        expect(() => store.get("Authorization")).toThrow(/CONFIG_INVALID/);
        store.set("Authorization", "explicit", "session" as never);
        expect(sessionStorage.getItem("Authorization")).toBe("explicit");
    });

    it("re-reads storage instead of retaining a completed token", async () => {
        const store = await manager();
        store.set("Authorization", "first");
        localStorage.setItem("Authorization", "second");
        expect(store.get("Authorization")).toBe("second");
        localStorage.removeItem("Authorization");
        expect(store.get("Authorization")).toBeNull();
    });

    it("dispatches through a registered strategy rather than bypassing it", async () => {
        const store = await manager();
        const values = new Map<string, string>();
        store.register("local" as never, {
            get: (key: string) => values.get(key) ?? null,
            set: (key: string, value: string) => { values.set(key, value); return value; },
            remove: (key: string) => { const value = values.get(key) ?? null; values.delete(key); return value; },
        });
        store.set("Authorization", "registered");
        expect(store.get("Authorization")).toBe("registered");
        expect(localStorage.getItem("Authorization")).toBeNull();
        expect(store.remove("Authorization")).toBe("registered");
        expect(store.get("Authorization")).toBeNull();
    });

    it("constructs without browser globals and reports unavailable storage only on use", async () => {
        vi.stubGlobal("window", undefined);
        vi.stubGlobal("document", undefined);
        const store = await manager();
        expect(() => store.get("Authorization")).toThrow(/STORAGE_UNAVAILABLE/);
    });

    it("round-trips encoded token bytes without parsing claims or matching a name prefix", async () => {
        const store = await manager({NEXT_PUBLIC_TOKEN_STORAGE: "COOKIE"});
        const token = "not-a-jwt.%25=你好; expires=0 ==";
        document.cookie = "AuthorizationExtra=wrong; Path=/";
        store.set("Authorization", token);
        expect(store.get("Authorization")).toBe(token);
        expect(store.remove("Authorization")).toBe(token);
        expect(store.get("Authorization")).toBeNull();
        expect(document.cookie).toContain("AuthorizationExtra=wrong");
    });

    it("ignores a nameless Cookie instead of truncating it into the requested name", async () => {
        const store = await manager({NEXT_PUBLIC_TOKEN_STORAGE: "COOKIE"});
        document.cookie = "AuthorizationX; Path=/";
        try {
            expect(document.cookie).toContain("AuthorizationX");
            expect(store.get("Authorization")).toBeNull();
            store.set("Authorization", "actual");
            expect(store.get("Authorization")).toBe("actual");
            expect(store.remove("Authorization")).toBe("actual");
            expect(document.cookie).toContain("AuthorizationX");
        } finally {
            document.cookie = "AuthorizationX; Max-Age=0; Path=/";
        }
    });

    it("treats an empty Cookie value as absent and can still remove its stored entry", async () => {
        const store = await manager({NEXT_PUBLIC_TOKEN_STORAGE: "COOKIE"});
        store.set("Authorization", "");
        expect(store.get("Authorization")).toBeNull();
        expect(store.remove("Authorization")).toBeNull();
        expect(document.cookie).not.toContain("Authorization=");
    });
});

describe("S02 Cookie preservation policy", () => {
    it("defaults to a session Cookie and writes secure, path and SameSite attributes", async () => {
        const store = await manager({NEXT_PUBLIC_TOKEN_STORAGE: "COOKIE"});
        const writes = vi.spyOn(document, "cookie", "set");
        store.set("Authorization", "session");
        const assignment = writes.mock.calls.at(-1)![0];
        expect(assignment).toContain("Path=/");
        expect(assignment).toContain("SameSite=Lax");
        expect(assignment).toContain("Secure");
        expect(assignment).not.toMatch(/Max-Age|Expires/i);
    });

    it.each([
        [undefined, "Max-Age=1296000", "Expires=Fri, 16 Oct 2026 00:00:00 GMT"],
        ["2", "Max-Age=259200", "Expires=Sun, 04 Oct 2026 00:00:00 GMT"],
    ])("uses configured days plus one only for an explicit remembered write (%s)", async (days, maxAge, expires) => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-10-01T00:00:00Z"));
        const store = await manager({NEXT_PUBLIC_TOKEN_STORAGE: "COOKIE", ...(days ? {NEXT_PUBLIC_TOKEN_COOKIE_DAYS: days} : {})});
        const writes = vi.spyOn(document, "cookie", "set");
        store.set("Authorization", "expired-business-token", undefined, {remember: true});
        expect(writes.mock.calls.at(-1)![0]).toContain(maxAge);
        expect(writes.mock.calls.at(-1)![0]).toContain(expires);
        writes.mockClear();
        expect(store.get("Authorization")).toBe("expired-business-token");
        expect(store.get("Authorization")).toBe("expired-business-token");
        expect(writes).not.toHaveBeenCalled();
    });

    it("returns the same token in the extra physical day without rewriting it", async () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-10-01T00:00:00Z"));
        const store = await manager({NEXT_PUBLIC_TOKEN_STORAGE: "COOKIE"});
        store.set("Authorization", "opaque-expired", undefined, {remember: true});
        vi.setSystemTime(new Date("2026-10-15T12:00:00Z"));
        const writes = vi.spyOn(document, "cookie", "set");
        expect(store.get("Authorization")).toBe("opaque-expired");
        expect(writes).not.toHaveBeenCalled();
    });

    it("replaces a persistent Cookie with a session Cookie when remember is false", async () => {
        const store = await manager({NEXT_PUBLIC_TOKEN_STORAGE: "COOKIE"});
        store.set("Authorization", "first", undefined, {remember: true});
        const writes = vi.spyOn(document, "cookie", "set");
        store.set("Authorization", "second", undefined, {remember: false});
        expect(store.get("Authorization")).toBe("second");
        expect(writes.mock.calls.at(-1)![0]).not.toMatch(/Max-Age|Expires/i);
    });
});

describe("S03 invalid and rejected Cookie operations", () => {
    it.each(["0", "-1", "1.5", "NaN", "1e40"])("rejects invalid Cookie days %s", async (days) => {
        const store = await manager({NEXT_PUBLIC_TOKEN_STORAGE: "COOKIE", NEXT_PUBLIC_TOKEN_COOKIE_DAYS: days});
        expect(() => store.set("Authorization", "value", undefined, {remember: true})).toThrow(/CONFIG_INVALID/);
        expect(document.cookie).not.toContain("Authorization=");
    });

    it.each([
        {NEXT_PUBLIC_TOKEN_COOKIE_DOMAIN: "https://example.com"},
        {NEXT_PUBLIC_TOKEN_COOKIE_DOMAIN: "unrelated.test"},
        {NEXT_PUBLIC_TOKEN_COOKIE_SAME_SITE: "Other"},
        {NEXT_PUBLIC_TOKEN_COOKIE_SAME_SITE: "None", NEXT_PUBLIC_TOKEN_COOKIE_SECURE: "false"},
        {NEXT_PUBLIC_TOKEN_COOKIE_SECURE: "maybe"},
    ])("rejects invalid Cookie domain or attributes %j", async (config) => {
        const store = await manager({NEXT_PUBLIC_TOKEN_STORAGE: "COOKIE", ...config});
        expect(() => store.set("Authorization", "value")).toThrow(/CONFIG_INVALID/);
    });

    it("refuses insecure production Cookie configuration", async () => {
        vi.stubEnv("NODE_ENV", "production");
        const store = await manager({NEXT_PUBLIC_TOKEN_STORAGE: "COOKIE", NEXT_PUBLIC_TOKEN_COOKIE_SECURE: "false"});
        expect(() => store.set("Authorization", "value")).toThrow(/CONFIG_INVALID/);
    });

    it("allows B to read missing Cookie even when configured A domain cannot be written at B", async () => {
        const store = await manager({NEXT_PUBLIC_TOKEN_STORAGE: "COOKIE", NEXT_PUBLIC_TOKEN_COOKIE_DOMAIN: "auth.other.test"});
        expect(store.get("Authorization")).toBeNull();
        expect(() => store.set("Authorization", "value")).toThrow(/CONFIG_INVALID/);
    });

    it("rejects an invalid runtime remember field", async () => {
        const store = await manager({NEXT_PUBLIC_TOKEN_STORAGE: "COOKIE"});
        expect(() => store.set("Authorization", "value", undefined, {remember: "false"} as never)).toThrow(/CONFIG_INVALID/);
    });

    it("rejects duplicate visible names even if values are equal", async () => {
        const store = await manager({NEXT_PUBLIC_TOKEN_STORAGE: "COOKIE"});
        document.cookie = "Authorization=same; Path=/";
        document.cookie = "Authorization=same; Domain=example.com; Path=/";
        expect(() => store.get("Authorization")).toThrow(/COOKIE_AMBIGUOUS/);
    });

    it("reports malformed value encoding without attempting token parsing", async () => {
        const store = await manager({NEXT_PUBLIC_TOKEN_STORAGE: "COOKIE"});
        document.cookie = "Authorization=%E0%A4%A; Path=/";
        expect(() => store.get("Authorization")).toThrow(/COOKIE_INVALID/);
    });

    it("rejects an oversized encoded assignment without replacing the old token", async () => {
        const store = await manager({NEXT_PUBLIC_TOKEN_STORAGE: "COOKIE"});
        store.set("Authorization", "original");
        expect(() => store.set("Authorization", "界".repeat(500))).toThrow(/COOKIE_TOO_LARGE/);
        expect(store.get("Authorization")).toBe("original");
    });

    it("reports silent write rejection and does not claim persistence", async () => {
        const store = await manager({NEXT_PUBLIC_TOKEN_STORAGE: "COOKIE"});
        vi.spyOn(document, "cookie", "set").mockImplementation(() => {});
        expect(() => store.set("Authorization", "value")).toThrow(/COOKIE_WRITE_FAILED/);
    });

    it("does not turn denied Cookie access into a normal missing value", async () => {
        const store = await manager({NEXT_PUBLIC_TOKEN_STORAGE: "COOKIE"});
        vi.spyOn(document, "cookie", "get").mockImplementation(() => { throw new DOMException("Denied", "SecurityError"); });
        expect(() => store.get("Authorization")).toThrow();
    });

    it("reports silent deletion rejection while preserving the observable value", async () => {
        const store = await manager({NEXT_PUBLIC_TOKEN_STORAGE: "COOKIE"});
        store.set("Authorization", "value");
        vi.spyOn(document, "cookie", "set").mockImplementation(() => {});
        expect(() => store.remove("Authorization")).toThrow(/COOKIE_REMOVE_FAILED/);
        expect(store.get("Authorization")).toBe("value");
    });

    it("deletes the configured parent-domain Cookie and treats absence as success", async () => {
        const store = await manager({NEXT_PUBLIC_TOKEN_STORAGE: "COOKIE", NEXT_PUBLIC_TOKEN_COOKIE_DOMAIN: "example.com"});
        store.set("Authorization", "value");
        expect(store.remove("Authorization")).toBe("value");
        expect(store.remove("Authorization")).toBeNull();
    });

    it("identifies only configured shared scope and explicitly removes an independent host-only Cookie", async () => {
        const shared = await manager({NEXT_PUBLIC_TOKEN_COOKIE_DOMAIN: ".example.com"});
        expect(shared.sharesCookieScopeWith("https://auth.example.com")).toBe(true);
        expect(shared.sharesCookieScopeWith("https://auth.other.test")).toBe(false);
        const remote = await manager({NEXT_PUBLIC_TOKEN_COOKIE_DOMAIN: "other.test"});
        document.cookie = "Authorization=independent; Path=/";
        expect(remote.removeHostOnlyCookie("Authorization")).toBe("independent");
        expect(document.cookie).not.toContain("Authorization=");
    });

    it("will not silently delete an unknown parent Cookie as if it were host-only", async () => {
        const store = await manager({NEXT_PUBLIC_TOKEN_COOKIE_DOMAIN: "other.test"});
        document.cookie = "Authorization=parent; Domain=example.com; Path=/";
        expect(() => store.removeHostOnlyCookie("Authorization")).toThrow(/COOKIE_REMOVE_FAILED/);
        expect(document.cookie).toContain("Authorization=parent");
    });
});
