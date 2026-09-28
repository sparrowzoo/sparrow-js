import {afterEach, describe, expect, it, vi} from "vitest";
import StorageMonitor, {type CrosStorageEvent} from "../../src/common/lib/monitor/StorageMonitor";
import {CommandType, StorageType} from "../../src/common/lib/protocol/CrosProtocol";

afterEach(() => { vi.restoreAllMocks(); });
const context = {crossOrigin: true, iframeOrigin: "https://passport.example.test"};

describe("@S05 StorageMonitor", () => {
    it("replaces credential values and raw errors with safe diagnostics", () => {
        const events: CrosStorageEvent[] = [];
        const monitor = new StorageMonitor({...context, monitor: {onEvent: (event) => { events.push(event); }}});
        monitor.emit({type: "storage-error", command: CommandType.SET, storage: StorageType.LOCAL,
            key: "Authorization", value: "secret-token-fixture", error: "failed for secret-token-fixture"});
        expect(events).toHaveLength(1);
        expect(events[0]).toMatchObject({type: "storage-error", crossOrigin: true,
            iframeOrigin: "https://passport.example.test", key: "Authorization", valueLength: 20});
        expect(events[0].timestamp).toEqual(expect.any(Number));
        expect(events[0].value).toBeUndefined();
        expect(JSON.stringify(events)).not.toContain("secret-token-fixture");
    });

    it("uses the same redaction for debug output and drops unknown payload fields", () => {
        const log = vi.spyOn(console, "log").mockImplementation(() => {});
        const monitor = new StorageMonitor({...context, debug: true});
        monitor.emit({type: "response-received", value: "response-secret", ...{cookie: "cookie-secret", authorization: "header-secret"}});
        expect(log).toHaveBeenCalledTimes(1);
        const output = log.mock.calls[0][0] as string;
        expect(JSON.parse(output).valueLength).toBe(15);
        expect(output).not.toMatch(/response-secret|cookie-secret|header-secret/);
    });

    it.each(["throw", "reject"])("does not propagate callback %s failures", async (mode) => {
        const monitor = new StorageMonitor({...context, monitor: {onEvent: () => {
            if (mode === "throw") throw new Error("monitor failed");
            return Promise.reject(new Error("monitor failed"));
        }}});
        expect(() => monitor.emit({type: "destroy"})).not.toThrow();
        await Promise.resolve();
    });

    it("is silent when disabled and gives an explicit observer precedence over console", () => {
        const log = vi.spyOn(console, "log").mockImplementation(() => {});
        new StorageMonitor(context).emit({type: "destroy"});
        const onEvent = vi.fn();
        new StorageMonitor({...context, debug: true, monitor: {onEvent}}).emit({type: "destroy"});
        expect(onEvent).toHaveBeenCalledTimes(1);
        expect(log).not.toHaveBeenCalled();
    });
});
