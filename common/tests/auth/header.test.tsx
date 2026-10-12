import React, {act} from "react";
import {createRoot, type Root} from "react-dom/client";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";

vi.mock("next-intl", () => ({useLocale: () => "en", useTranslations: () => (key: string) => key}));
vi.mock("react-hot-toast", () => ({default: {success: vi.fn(), error: vi.fn()}}));

const authority = "https://auth.example.test";
let root: Root | undefined;
let container: HTMLDivElement;
let UserProfile: React.ComponentType;
let LoginUserProvider: React.ComponentType<{ children: React.ReactNode }>;

async function mount() {
    root = createRoot(container);
    await act(async () => root!.render(
        React.createElement(LoginUserProvider, null, React.createElement(UserProfile))
    ));
}

function transport() {
    const frame = document.querySelector<HTMLIFrameElement>("#cros-storage-iframe")!;
    // Keep the actual facade, hook and RPC; intercept only the remote window boundary.
    const send = vi.spyOn(frame.contentWindow!, "postMessage").mockImplementation(() => {});
    const message = (data: unknown) => window.dispatchEvent(new MessageEvent("message", {
        data, source: frame.contentWindow, origin: authority,
    }));
    return {send, message};
}

function userToken(id: string) {
    return "header." + btoa(JSON.stringify({body: JSON.stringify({userId: id, category: 1})})) + ".signature";
}

beforeEach(async () => {
    vi.resetModules();
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    vi.stubEnv("NEXT_PUBLIC_TOKEN_KEY", "header-token");
    vi.stubEnv("NEXT_PUBLIC_TOKEN_STORAGE", "LOCAL");
    vi.stubEnv("NEXT_PUBLIC_STORAGE_PROXY", authority + "/cros-storage/");
    vi.stubEnv("NEXT_PUBLIC_PASSPORT_ROOT", authority);
    vi.stubEnv("NEXT_PUBLIC_CROS_DEBUG", "false");
    localStorage.clear();
    sessionStorage.clear();
    container = document.createElement("div");
    document.body.append(container);
    LoginUserProvider = (await import("../../src/common/lib/LoginUserProvider")).LoginUserProvider;
    UserProfile = (await import("../../src/common/components/header/user-profile")).default;
});

afterEach(async () => {
    if (root) await act(async () => root!.unmount());
    root = undefined;
    document.body.replaceChildren();
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
});

describe("S11 Header distinguishes unknown credentials from confirmed absence", () => {
    it("shows a retryable RPC error and recovers from a fresh read", async () => {
        await mount();
        const {send, message} = transport();
        await act(async () => {
            message({command: "init"});
            const request = send.mock.calls.at(-1)![0];
            message({requestId: request.requestId, value: null, error: "STORAGE_FAILED"});
        });
        const alert = container.querySelector('[role="alert"]');
        expect(alert).not.toBeNull();
        expect(container.querySelector("a")).toBeNull();

        await act(async () => (alert!.querySelector("button") as HTMLButtonElement).click());
        expect(container.querySelector('[role="status"]')).not.toBeNull();
        await act(async () => {
            const request = send.mock.calls.at(-1)![0];
            message({requestId: request.requestId, value: userToken("current")});
        });
        expect(container.querySelector('[role="alert"]')).toBeNull();
        expect(container.textContent).toContain("user account menu");
    });

    it("treats a local storage refusal as an error without creating an iframe", async () => {
        const getItem = Storage.prototype.getItem;
        vi.spyOn(Storage.prototype, "getItem").mockImplementation(function (key) {
            if (this === localStorage && key === "header-token") throw new Error("Storage refused");
            return getItem.call(this, key);
        });
        await mount();
        expect(container.querySelector('[role="alert"]')).not.toBeNull();
        expect(container.querySelector("a")).toBeNull();
        expect(document.querySelector("iframe")).toBeNull();
    });

    it("treats an unreadable account as an error distinct from an absent token", async () => {
        localStorage.setItem("header-token", "opaque-without-display-body");
        await mount();
        expect(container.querySelector('[role="alert"]')).not.toBeNull();
        expect(container.querySelector("a")).toBeNull();
        expect(localStorage.getItem("header-token")).toBe("opaque-without-display-body");
    });

    it("shows sign-in when both sources confirm absence", async () => {
        await mount();
        const {send, message} = transport();
        await act(async () => {
            message({command: "init"});
            const request = send.mock.calls.at(-1)![0];
            message({requestId: request.requestId, value: null});
        });
        expect(container.querySelector('[role="alert"]')).toBeNull();
        expect(container.querySelector("a")?.textContent).toBe("sign-in");
    });

    it("ignores a stale remote result after remount and keeps the fresh local read", async () => {
        await mount();
        const {send, message} = transport();
        await act(async () => message({command: "init"}));
        const abandoned = send.mock.calls.at(-1)![0];
        await act(async () => root!.unmount());
        root = undefined;
        localStorage.setItem("header-token", userToken("new-mount"));
        await mount();
        await act(async () => message({requestId: abandoned.requestId, value: null, error: "STORAGE_FAILED"}));
        expect(container.querySelector('[role="alert"]')).toBeNull();
        expect(container.textContent).toContain("user account menu");
    });
});
