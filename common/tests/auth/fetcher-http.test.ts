// @vitest-environment jsdom
import {beforeEach, afterEach, describe, expect, it, vi} from "vitest";
import Fetcher, {FetchError} from "../../src/common/lib/Fetcher";
import toast from "react-hot-toast";

vi.mock("react-hot-toast", () => ({default: {error: vi.fn()}}));
vi.mock("../../src/common/lib/CrosStorage", () => ({default: {getCrosStorage: () => null}}));

function jsonResponse(status: number, body: unknown) {
    return {
        ok: status >= 200 && status < 300,
        status,
        headers: new Headers({"content-type": "application/json"}),
        json: async () => body,
    };
}

function nonJsonResponse(status: number, contentType = "text/html") {
    return {
        ok: status >= 200 && status < 300,
        status,
        headers: new Headers({"content-type": contentType}),
        json: async () => { throw new SyntaxError("Unexpected token"); },
        blob: async () => new Blob(["error page"]),
    };
}

beforeEach(() => {
    vi.clearAllMocks();
});

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("Fetcher HTTP and Result handling", () => {
    it("returns the original Result from successful GET and POST", async () => {
        const body = {code: "0", data: {id: 7}};
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(200, body)));

        expect(await Fetcher.get({url: "https://api.example.test/read"})).toBe(body);
        expect(await Fetcher.post({url: "https://api.example.test/write", body: {id: 7}})).toBe(body);
        expect(toast.error).not.toHaveBeenCalled();
    });

    it("shows the translated business Result from HTTP 400", async () => {
        const body = {code: "business_error", key: "name_taken", message: "Name taken", data: null};
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(400, body)));
        const translator = vi.fn().mockReturnValue("名称已占用");

        await expect(Fetcher.post({url: "https://api.example.test/write", body: {}, translator})).rejects.toMatchObject({
            name: "FetchError", status: 400, message: "名称已占用",
        });
        expect(translator).toHaveBeenCalledWith("name_taken", undefined);
        expect(toast.error).toHaveBeenCalledExactlyOnceWith("名称已占用");
    });

    it("rejects HTTP 401 and redirects even without a Result body", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(nonJsonResponse(401)));
        const redirectToLogin = vi.fn();

        await expect(Fetcher.get({url: "https://api.example.test/protected", redirectToLogin})).rejects.toMatchObject({
            status: 401, message: "HTTP 401",
        });
        expect(redirectToLogin).toHaveBeenCalledOnce();
        expect(toast.error).toHaveBeenCalledOnce();
    });

    it("uses the supplied translator for an HTTP 401 without a Result", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(nonJsonResponse(401)));
        const translator = vi.fn().mockReturnValue("请先登录");

        await expect(Fetcher.get({url: "https://api.example.test/protected", translator})).rejects.toMatchObject({
            status: 401, message: "请先登录",
        });
        expect(translator).toHaveBeenCalledWith("user_not_login", {status: "401"});
    });

    it("rejects HTTP 403 without redirecting", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(nonJsonResponse(403)));
        const redirectToLogin = vi.fn();

        await expect(Fetcher.get({url: "https://api.example.test/protected", redirectToLogin})).rejects.toMatchObject({
            status: 403, message: "HTTP 403",
        });
        expect(redirectToLogin).not.toHaveBeenCalled();
    });

    it("preserves the HTTP status when its translator has no configured error key", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(nonJsonResponse(403)));
        const translator = vi.fn().mockImplementation(() => { throw new Error("missing translation"); });

        await expect(Fetcher.get({url: "https://api.example.test/protected", translator})).rejects.toMatchObject({
            status: 403, message: "HTTP 403",
        });
        expect(translator).toHaveBeenCalledWith("http_forbidden", {status: "403"});
    });

    it("preserves HTTP 500 when the error body is empty or invalid", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(nonJsonResponse(500)));

        await expect(Fetcher.get({url: "https://api.example.test/read"})).rejects.toMatchObject({
            status: 500, message: "HTTP 500",
        });
    });

    it("rejects a non-success Result even with HTTP 200", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(200, {code: "error", message: "Invalid state"})));

        await expect(Fetcher.get({url: "https://api.example.test/read"})).rejects.toMatchObject({
            status: 200, message: "Invalid state",
        });
    });

    it("does not call a business failure with HTTP 200 an invalid response", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(200, {code: "quota_exceeded", data: null})));

        await expect(Fetcher.get({url: "https://api.example.test/read"})).rejects.toMatchObject({
            status: 200, message: "quota_exceeded",
        });
    });

    it("reports an invalid response only when HTTP succeeds without a usable Result", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(nonJsonResponse(200)));

        await expect(Fetcher.get({url: "https://api.example.test/read"})).rejects.toMatchObject({
            status: 200, message: "HTTP 200",
        });
    });

    it("does not accept a success Result when HTTP status is an error", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(500, {code: "0", data: "ok"})));

        await expect(Fetcher.get({url: "https://api.example.test/read"})).rejects.toBeInstanceOf(FetchError);
    });

    it("rejects a failed download before reading an HTML error page as a file", async () => {
        const response = nonJsonResponse(500);
        const blob = vi.spyOn(response, "blob");
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response));

        await expect(Fetcher.download({url: "https://api.example.test/export", body: {}})).rejects.toMatchObject({status: 500});
        expect(blob).not.toHaveBeenCalled();
    });

    it("uses the business Result from a failed download", async () => {
        const response = jsonResponse(400, {code: "export_denied", message: "Export denied", data: null});
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response));

        await expect(Fetcher.download({url: "https://api.example.test/export", body: {}})).rejects.toMatchObject({
            status: 400, message: "Export denied",
        });
        expect(toast.error).toHaveBeenCalledExactlyOnceWith("Export denied");
    });
});
