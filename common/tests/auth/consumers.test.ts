// @vitest-environment jsdom
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";

const network = vi.hoisted(() => ({upload: vi.fn()}));
vi.mock("axios", () => ({default: {post: network.upload}}));
vi.mock("react-hot-toast", () => ({default: {error: vi.fn(), success: vi.fn()}}));
vi.mock("next-intl", () => ({useTranslations: () => (key: string) => key}));

const tokenKey = "consumer-token";
const originalToken = "opaque.token%25-without-claims";
const cleanups: Array<() => void | Promise<void>> = [];
let priorHandlers: {focus: Window["onfocus"]; blur: Window["onblur"]; click: Window["onclick"]};

function saveCookie(token: string) {
    document.cookie = tokenKey + "=" + encodeURIComponent(token) + "; Path=/; Secure; SameSite=Lax";
}

beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.stubEnv("NEXT_PUBLIC_TOKEN_KEY", tokenKey);
    vi.stubEnv("NEXT_PUBLIC_TOKEN_STORAGE", "COOKIE");
    // A different origin proves consumers use the actual local-first facade.
    vi.stubEnv("NEXT_PUBLIC_STORAGE_PROXY", "https://auth.example.test/cros-storage/");
    vi.stubEnv("NEXT_PUBLIC_API", "https://api.example.test");
    vi.stubEnv("NEXT_PUBLIC_CROS_DEBUG", "false");
    vi.stubEnv("NEXT_PUBLIC_TOKEN_COOKIE_DOMAIN", "");
    vi.stubEnv("NEXT_PUBLIC_TOKEN_COOKIE_SAME_SITE", "Lax");
    vi.stubEnv("NEXT_PUBLIC_TOKEN_COOKIE_SECURE", "true");
    vi.stubEnv("NEXT_PUBLIC_TOKEN_COOKIE_DAYS", "14");
    localStorage.clear();
    sessionStorage.clear();
    document.cookie = tokenKey + "=; Max-Age=0; Path=/";
    document.querySelectorAll("iframe").forEach((element) => element.remove());
    priorHandlers = {focus: window.onfocus, blur: window.onblur, click: window.onclick};
    saveCookie(originalToken);
});

afterEach(async () => {
    for (const cleanup of cleanups.splice(0).reverse()) await cleanup();
    window.onfocus = priorHandlers.focus;
    window.onblur = priorHandlers.blur;
    window.onclick = priorHandlers.click;
    document.cookie = tokenKey + "=; Max-Age=0; Path=/";
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
});

describe("S06/S07 existing consumers retain the original token transport", () => {
    it("Fetcher GET and POST re-read the Cookie and preserve the Authorization value", async () => {
        const [{default: Fetcher}, {default: CrosStorage}] = await Promise.all([
            import("../../src/common/lib/Fetcher"),
            import("../../src/common/lib/CrosStorage"),
        ]);
        const storage = CrosStorage.getCrosStorage();
        cleanups.push(() => storage.destroy());
        const fetchRequest = vi.fn().mockResolvedValue({json: async () => ({code: "0", data: "ok"})});
        vi.stubGlobal("fetch", fetchRequest);
        await Fetcher.get({url: "/read.json", crosStorage: storage});
        saveCookie("second.token%25");
        await Fetcher.post({url: "/write.json", body: {name: "sample"}, crosStorage: storage});

        expect(fetchRequest).toHaveBeenCalledTimes(2);
        expect(fetchRequest.mock.calls[0]).toEqual([
            "https://api.example.test/read.json",
            {method: "GET", headers: {Authorization: originalToken}},
        ]);
        expect(fetchRequest.mock.calls[1]).toEqual([
            "https://api.example.test/write.json",
            {method: "POST", headers: {"Content-Type": "application/json", Authorization: "second.token%25"}, body: '{"name":"sample"}'},
        ]);
        expect(document.querySelector("iframe")).toBeNull();
    });

    it("Fetcher download keeps Authorization and the existing explicit credentials option", async () => {
        const {default: Fetcher} = await import("../../src/common/lib/Fetcher");
        const blob = new Blob(["zip-data"], {type: "application/zip"});
        const fetchRequest = vi.fn().mockResolvedValue({
            headers: new Headers({"content-type": "application/zip", "content-disposition": 'attachment; filename="export.zip"'}),
            blob: async () => blob,
        });
        vi.stubGlobal("fetch", fetchRequest);
        const result = await Fetcher.download({url: "/download", body: {id: 7}, withCookie: true});
        expect(result).toEqual({blob, filename: "export.zip"});
        expect(fetchRequest).toHaveBeenCalledTimes(1);
        expect(fetchRequest.mock.calls[0][1]).toEqual({
            method: "POST",
            headers: {"Content-Type": "application/json", Authorization: originalToken},
            body: '{"id":7}',
            credentials: "include",
        });
        expect(document.querySelector("iframe")).toBeNull();
    });

    it("leaves business expiry to the backend and preserves its login rejection path", async () => {
        const {default: Fetcher} = await import("../../src/common/lib/Fetcher");
        const rejected = {code: "1", key: "user_not_login", message: "Please sign in", data: null};
        const fetchRequest = vi.fn().mockResolvedValue({json: async () => rejected});
        const redirectToLogin = vi.fn();
        vi.stubGlobal("fetch", fetchRequest);
        await expect(Fetcher.get({url: "/protected", redirectToLogin})).rejects.toEqual(rejected);
        expect(fetchRequest).toHaveBeenCalledTimes(1);
        expect(fetchRequest.mock.calls[0][1].headers.Authorization).toBe(originalToken);
        expect(redirectToLogin).toHaveBeenCalledTimes(1);
        expect(document.querySelector("iframe")).toBeNull();
    });

    it("FileUploader uses the real facade and sends the original token with its multipart request", async () => {
        const [React, {createRoot}, {default: FileUploader}] = await Promise.all([
            import("react"), import("react-dom/client"),
            import("../../src/common/components/file/FileUploader"),
        ]);
        vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
        const container = document.createElement("div");
        document.body.appendChild(container);
        const root = createRoot(container);
        cleanups.push(async () => {
            await React.act(async () => root.unmount());
            container.remove();
        });
        const uploaded = vi.fn();
        network.upload.mockResolvedValue({data: {code: "0", data: "https://files.example.test/photo.png"}});
        await React.act(async () => {
            root.render(React.createElement(FileUploader, {
                id: "consumer-upload", url: "https://files.example.test/upload",
                uploadIcon: null, uploadCallback: uploaded, pathType: "avatar",
            }));
        });
        const file = new File(["image"], "photo.png", {type: "image/png"});
        const input = container.querySelector("input")!;
        Object.defineProperty(input, "files", {configurable: true, value: [file]});
        await React.act(async () => {
            input.dispatchEvent(new Event("change", {bubbles: true}));
        });

        expect(network.upload).toHaveBeenCalledTimes(1);
        const [url, data, options] = network.upload.mock.calls[0];
        expect(url).toBe("https://files.example.test/upload");
        expect(data).toBeInstanceOf(FormData);
        expect(data.get("file").name).toBe("photo.png");
        expect(data.get("pathType")).toBe("avatar");
        expect(options.headers).toEqual({Authorization: originalToken});
        expect(uploaded).toHaveBeenCalledWith("https://files.example.test/photo.png", "photo.png");
        expect(document.querySelector("iframe")).toBeNull();
    });

    it("SparrowWebSocket passes the unchanged token as its existing subprotocol", async () => {
        const connections: Array<{url: string; protocols: string[]}> = [];
        class NetworkSocket {
            onopen: unknown; onclose: unknown; onerror: unknown; onmessage: unknown;
            constructor(url: string, protocols: string[]) { connections.push({url, protocols}); }
            close() {}
            send() {}
        }
        vi.stubGlobal("WebSocket", NetworkSocket);
        vi.spyOn(console, "log").mockImplementation(() => {});
        const fetchRequest = vi.fn();
        vi.stubGlobal("fetch", fetchRequest);
        const {default: SparrowWebSocket} = await import("../../src/common/lib/SparrowWebSocket");
        const socket = new SparrowWebSocket("wss://im.example.test/socket", (key) => key);
        const redirect = vi.fn();
        socket.redirectLogin = redirect;
        cleanups.push(() => {
            socket.stopHeartBeat();
            socket.stopRetryConnect();
            socket.close();
        });
        socket.connect();
        await vi.waitFor(() => expect(connections).toHaveLength(1));
        expect(connections[0]).toEqual({url: "wss://im.example.test/socket", protocols: [originalToken]});
        expect(fetchRequest).not.toHaveBeenCalled();
        expect(redirect).not.toHaveBeenCalled();
        expect(document.querySelector("iframe")).toBeNull();
    });
});
