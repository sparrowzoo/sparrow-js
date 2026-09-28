import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";

const rpc = vi.hoisted(() => ({request: vi.fn(), destroy: vi.fn()}));
vi.mock("@/common/lib/rpc/PostMessageRpc", () => ({default: class {
    request = rpc.request;
    destroy = rpc.destroy;
}}));
const clients: {destroy(): void}[] = [];
async function client() {
    const {default: CrosStorage} = await import("@/common/lib/CrosStorage");
    const value = CrosStorage.getCrosStorage();
    clients.push(value);
    return value;
}
beforeEach(() => {
    vi.resetModules();
    localStorage.clear(); sessionStorage.clear();
    vi.stubEnv("NEXT_PUBLIC_TOKEN_KEY", "sso-test-token");
    vi.stubEnv("NEXT_PUBLIC_TOKEN_STORAGE", "LOCAL");
    vi.stubEnv("NEXT_PUBLIC_STORAGE_PROXY", "https://auth.example.com/cros-storage/");
    rpc.request.mockReset().mockImplementation(async request => ({requestId: request.requestId, value: "remote"}));
});
afterEach(() => {
    clients.splice(0).forEach(c => c.destroy());
    vi.unstubAllEnvs();
    document.body.replaceChildren();
});

describe("S06–S08 local-first token routing", () => {
    it("returns an opaque local token without creating or calling an iframe", async () => {
        localStorage.setItem("sso-test-token", "opaque-expired-business.%25==");
        expect(await (await client()).getToken()).toBe("opaque-expired-business.%25==");
        expect(rpc.request).not.toHaveBeenCalled();
        expect(document.querySelector("iframe")).toBeNull();
    });
    it("allows a local hit even with missing proxy configuration", async () => {
        vi.stubEnv("NEXT_PUBLIC_STORAGE_PROXY", "");
        localStorage.setItem("sso-test-token", "local");
        expect(await (await client()).getToken()).toBe("local");
    });
    it("reads A each time without persisting the returned token at B", async () => {
        const c = await client();
        expect(await c.getToken()).toBe("remote");
        rpc.request.mockImplementation(async r => ({requestId:r.requestId, value:null}));
        expect(await c.getToken()).toBeNull();
        expect(localStorage.getItem("sso-test-token")).toBeNull();
        expect(sessionStorage.getItem("sso-test-token")).toBeNull();
        expect(rpc.request).toHaveBeenCalledTimes(2);
    });
    it("uses explicit SESSION for the local lookup instead of configured LOCAL", async () => {
        const {StorageType} = await import("@/common/lib/protocol/CrosProtocol");
        localStorage.setItem("sso-test-token", "wrong");
        sessionStorage.setItem("sso-test-token", "session");
        expect(await (await client()).getToken(StorageType.SESSION)).toBe("session");
        expect(rpc.request).not.toHaveBeenCalled();
    });
    it("preserves visitor generation and the explicit storage strategy", async () => {
        const {StorageType} = await import("@/common/lib/protocol/CrosProtocol");
        rpc.request.mockImplementation(async r => ({requestId:r.requestId, value:r.command === "get" ? null : r.value}));
        const generator = vi.fn(async () => "visitor");
        expect(await (await client()).getToken(StorageType.SESSION, generator)).toBe("visitor");
        expect(generator).toHaveBeenCalledOnce();
        expect(rpc.request.mock.calls.map(([r]) => [r.command,r.storage])).toEqual([["get","session"],["set","session"]]);
        expect(sessionStorage.getItem("sso-test-token")).toBeNull();
    });
    it("normalizes an empty remote value to no token", async () => {
        rpc.request.mockImplementation(async r => ({requestId:r.requestId, value:""}));
        expect(await (await client()).getToken()).toBeNull();
    });
    it("still permits the existing visitor fallback after an empty remote value", async () => {
        rpc.request.mockImplementation(async r => ({requestId:r.requestId, value:r.command === "get" ? "" : r.value}));
        const generator=vi.fn(async()=>"visitor");
        expect(await (await client()).getToken(undefined,generator)).toBe("visitor");
        expect(generator).toHaveBeenCalledOnce();
    });
    it("does not generate a visitor after an RPC failure", async () => {
        rpc.request.mockRejectedValue(new Error("timeout"));
        const generator = vi.fn(async () => "visitor");
        await expect((await client()).getToken(undefined, generator)).rejects.toThrow();
        expect(generator).not.toHaveBeenCalled();
    });
    it("surfaces proxy errors rather than converting them to absence", async () => {
        rpc.request.mockImplementation(async r => ({requestId:r.requestId, value:null, error:"STORAGE_UNAVAILABLE"}));
        await expect((await client()).getToken()).rejects.toThrow("STORAGE_UNAVAILABLE");
    });
});
