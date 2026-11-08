import {afterEach, describe, expect, it} from "vitest";
import CrosStorage from "@/common/lib/CrosStorage";

describe("current user from the shared token", () => {
    afterEach(() => { localStorage.clear(); });

    it("decodes UTF-8 and base64url JWT claims through getCurrentUser", async () => {
        const user = {userId: "1", category: 1, nickName: "体验用户 🧪", tenantId: "0", deviceType: 1};
        const payload = Buffer.from(JSON.stringify({body: JSON.stringify(user)})).toString("base64url");
        const token = `header.${payload}.signature`;
        const storage = CrosStorage.getCrosStorage();
        try {
            await storage.setToken(encodeURIComponent(token));
            const current = await storage.getCurrentUser();
            expect(current?.userId).toBe("1");
            expect(current?.category).toBe(1);
            expect(current?.nickName).toBe("体验用户 🧪");
            expect(current?.isVisitor()).toBe(false);
        } finally {
            storage.destroy();
        }
    });
});
