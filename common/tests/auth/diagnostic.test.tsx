import React, {act} from "react";
import {createRoot, type Root} from "react-dom/client";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import Page from "../../src/app/[locale]/cros/page";
import CrosStorage from "../../src/common/lib/CrosStorage";

vi.mock("@/common/lib/Env", async (importOriginal) => ({
    ...await importOriginal<object>(),
    STORAGE_PROXY: "https://passport.example.test/cros-storage/",
    PASSPORT_ROOT: "https://passport.example.test",
    CROS_DEBUG: false,
}));
vi.mock("next-intl", () => ({useLocale: () => "en", useTranslations: () => (key: string) => key}));
vi.mock("@/common/i18n/navigation", () => ({Link: (props: React.ComponentProps<"a">) => <a {...props}/> }));
vi.mock("lucide-react", () => ({ArrowLeft: () => null, ArrowRight: () => null, Radio: () => null, Trash2: () => null}));
vi.mock("@/components/ui/button", () => ({Button: ({variant: _variant, size: _size, ...props}: React.ComponentProps<"button"> & {variant?:string;size?:string}) => <button {...props}/> }));
vi.mock("@/components/ui/label", () => ({Label: (props: React.ComponentProps<"label">) => <label {...props}/> }));

let root: Root;
let container: HTMLDivElement;
const clients: CrosStorage[] = [];
beforeEach(() => {
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
});
afterEach(async () => {
    await act(async () => { root.unmount(); });
    clients.forEach((client) => client.destroy());
    clients.length = 0;
    document.body.replaceChildren();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});

describe("@S04 @S05 diagnostic page", () => {
    it("starts without an iframe or a false local-mode claim and exposes Cookie", async () => {
        await act(async () => { root.render(<Page/>); });
        expect(document.querySelector("iframe")).toBeNull();
        expect(container.textContent).not.toContain("frameStates.local");
        expect(container.querySelector('option[value="cookie"]')?.textContent).toBe("Cookie");
    });

    it("tracks a lazily created debug frame without taking over the normal frame and renders only value length", async () => {
        const normal = CrosStorage.getCrosStorage();
        clients.push(normal);
        void normal.get("hello").catch(() => {});
        const normalFrame = document.getElementById("cros-storage-iframe") as HTMLIFrameElement;
        const normalUrl = normalFrame.src;
        await act(async () => { root.render(<Page/>); });
        expect(document.getElementById("cros-storage-iframe-debug")).toBeNull();
        const select = container.querySelector("select")!;
        await act(async () => {
            select.value = "cookie";
            select.dispatchEvent(new Event("change", {bubbles: true}));
        });
        const read = [...container.querySelectorAll("button")].find((button) => button.textContent === "read")!;
        await act(async () => { read.click(); });
        const debug = document.getElementById("cros-storage-iframe-debug") as HTMLIFrameElement;
        expect(debug).not.toBeNull();
        expect(debug).not.toBe(normalFrame);
        expect(normalFrame.src).toBe(normalUrl);
        expect(container.querySelector('a[href="#cros-storage-iframe-debug"]')).not.toBeNull();
        expect(container.textContent).toContain(debug.src);
        const send = vi.spyOn(debug.contentWindow!, "postMessage").mockImplementation(() => {});
        await act(async () => {
            window.dispatchEvent(new MessageEvent("message", {
                origin: "https://passport.example.test", source: debug.contentWindow, data: {command: "init"},
            }));
        });
        expect(send).toHaveBeenCalledTimes(1);
        const request = send.mock.calls[0][0] as {requestId:string;command:string;key:string;storage:string};
        expect(request).toMatchObject({command: "get", key: "hello", storage: "cookie"});
        await act(async () => {
            window.dispatchEvent(new MessageEvent("message", {
                origin: "https://passport.example.test", source: debug.contentWindow,
                data: {requestId: request.requestId, value: "diagnostic-secret-value"},
            }));
        });
        expect(container.textContent).toMatch(/valueLength:\s*23/);
        expect(container.textContent).not.toContain("diagnostic-secret-value");
        expect(container.textContent).toContain("operationSuccess");
    });
});
