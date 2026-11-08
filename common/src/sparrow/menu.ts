import {ADMIN_ROOT, BLOG_ROOT, IM_ROOT, PASSPORT_ROOT, WWW_ROOT} from "@/common/lib/Env";
import {MenuRegistry, type BannerMenuItem} from "@/common/lib/MenuRegistry";

/** Sparrow 菜单唯一源；下游副本由统一复制脚本生成。 */
export const sparrowMenus: Readonly<Record<string, BannerMenuItem>> = {
    passport: {
        id: "passport", label: "passport", available: true, entry: {
            landing: `${WWW_ROOT}/lang/products/passport/`,
            live: `${PASSPORT_ROOT}/lang/sign-in/`
        }
    },
    im: {
        id: "im", label: "im", available: true, entry: {
            landing: `${WWW_ROOT}/lang/products/im/`,
            live: `${IM_ROOT}/lang/chat/friends/contact/`
        }
    },
    coder: {
        id: "coder", label: "coder", available: true, entry: {
            landing: `${WWW_ROOT}/lang/products/coder/`,
            live: `${ADMIN_ROOT}/lang/`
        }
    },
    file: {
        id: "file", label: "file", available: true, entry: {
            landing: `${WWW_ROOT}/lang/products/file/`,
            live: `${WWW_ROOT}/lang/upload/`
        }
    },
    ui: {
        id: "ui", label: "ui", available: true, entry: {
            landing: `${WWW_ROOT}/lang/ui/`,
            live: `${WWW_ROOT}/lang/ui/`
        }
    },
    security: {id: "security", label: "security", available: false, entry: null},
    blog: {
        id: "blog", label: "blog", available: true,
        entry: BLOG_ROOT ? {landing: BLOG_ROOT, live: BLOG_ROOT} : null
    },
    study: {
        id: "study", label: "study", available: true,
        entry: {landing: `${WWW_ROOT}/lang/study/`, live: `${WWW_ROOT}/lang/study/`},
        emphasized: true, icon: "graduation-cap", group: "utility"
    },
};


const menuRegistry = new MenuRegistry();
menuRegistry.register(Object.values(sparrowMenus));

export default menuRegistry;
