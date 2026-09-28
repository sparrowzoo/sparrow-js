import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
const rpc = vi.hoisted(() => ({request:vi.fn(), destroy:vi.fn()}));
vi.mock("@/common/lib/rpc/PostMessageRpc", () => ({default:class {request=rpc.request;destroy=rpc.destroy;}}));
vi.mock("react-hot-toast", () => ({default:{success:vi.fn(), error:vi.fn()}}));
beforeEach(() => {
    vi.resetModules(); localStorage.clear(); sessionStorage.clear();
    vi.stubEnv("NEXT_PUBLIC_STORAGE_PROXY", "https://auth.example.com/cros-storage/");
    vi.stubEnv("NEXT_PUBLIC_TOKEN_KEY", "sso-test-token");
    vi.stubEnv("NEXT_PUBLIC_TOKEN_STORAGE", "LOCAL");
    rpc.request.mockReset().mockImplementation(async r => ({requestId:r.requestId,value:r.value??"remote-old"}));
});
afterEach(() => {vi.unstubAllEnvs();document.body.replaceChildren();});
async function client() {return (await import("@/common/lib/CrosStorage")).default.getCrosStorage();}
describe("S09–S11 login and logout consistency", () => {
    it("clears independent B token only after A successfully saved the new value", async () => {
        localStorage.setItem("sso-test-token", "old-b");
        const c = await client();
        await c.setToken("new", undefined, {remember:true});
        expect(rpc.request.mock.calls[0][0]).toMatchObject({command:"set",value:"new",saveOptions:{remember:true}});
        expect(localStorage.getItem("sso-test-token")).toBeNull();
        c.destroy();
    });
    it("keeps B value and rejects if saving A failed", async () => {
        localStorage.setItem("sso-test-token", "old-b");
        rpc.request.mockRejectedValue(new Error("save rejected"));
        const c=await client();
        await expect(c.setToken("new")).rejects.toThrow();
        expect(localStorage.getItem("sso-test-token")).toBe("old-b");
        c.destroy();
    });
    it("removes B and A and clears display cache on confirmed absence", async () => {
        localStorage.setItem("sso-test-token", "old-b");
        sessionStorage.setItem("sparrow_user_info", '{"userId":1}');
        const c=await client();
        expect(await c.removeToken()).toBe("old-b");
        expect(localStorage.getItem("sso-test-token")).toBeNull();
        expect(rpc.request.mock.calls[0][0]).toMatchObject({command:"remove"});
        rpc.request.mockImplementation(async r=>({requestId:r.requestId,value:null}));
        expect((await c.locateToken())?.isVisitor()).toBe(true);
        expect(sessionStorage.getItem("sparrow_user_info")).toBeNull();
        c.destroy();
    });
    it("does not claim a shared Cookie save succeeded when B has a same-name host Cookie", async () => {
        vi.stubEnv("NEXT_PUBLIC_TOKEN_STORAGE", "COOKIE");
        vi.stubEnv("NEXT_PUBLIC_TOKEN_COOKIE_DOMAIN", "sparrowzoo.com");
        vi.stubEnv("NEXT_PUBLIC_STORAGE_PROXY", "https://auth.sparrowzoo.com/cros-storage/");
        document.cookie="sso-test-token=old-host; Path=/; Secure";
        rpc.request.mockImplementation(async r=>{
            document.cookie="sso-test-token=new; Domain=sparrowzoo.com; Path=/; Secure";
            return {requestId:r.requestId,value:"new"};
        });
        const c=await client();
        await expect(c.setToken("new")).rejects.toThrow("COOKIE_AMBIGUOUS");
        expect(document.cookie).toContain("sso-test-token=new");
        document.cookie="sso-test-token=; Max-Age=0; Path=/; Secure";
        document.cookie="sso-test-token=; Max-Age=0; Domain=sparrowzoo.com; Path=/; Secure";
        c.destroy();
    });
    it("releases the hook-created instance on unmount", async () => {
        const React=await import("react");
        const {createRoot}=await import("react-dom/client");
        const {default:useCrosStorage}=await import("@/common/hook/CrosStorageHook");
        (globalThis as any).IS_REACT_ACT_ENVIRONMENT=true;
        let instance:any;
        function Component() {instance=useCrosStorage();return null;}
        const element=document.createElement("div");document.body.append(element);
        const root=createRoot(element);
        await React.act(async()=>root.render(React.createElement(Component)));
        expect(instance).toBeDefined();
        await React.act(async()=>root.unmount());
        await expect(instance.getToken()).rejects.toThrow("destroyed");
        element.remove();
    });
    it("logout returns a promise and always releases its storage client", async () => {
        const {default:CrosStorage}=await import("@/common/lib/CrosStorage");
        const {default:LoginUser}=await import("@/common/lib/protocol/LoginUser");
        const removeToken=vi.fn().mockRejectedValue(new Error("remote failed"));
        const destroy=vi.fn();
        vi.spyOn(CrosStorage,"getCrosStorage").mockReturnValue({removeToken,destroy} as never);
        const redirect=vi.fn();
        await expect(LoginUser.logout(redirect,"done")).rejects.toThrow("remote failed");
        expect(destroy).toHaveBeenCalledOnce();expect(redirect).not.toHaveBeenCalled();
    });
});
