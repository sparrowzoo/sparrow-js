import {USER_INFO_KEY} from "@/common/lib/Env";
import UserCategory from "@/common/lib/UserCategory";
import CrosStorage from "@/common/lib/CrosStorage";
import toast from "react-hot-toast";

export default class LoginUser {
    public userId: string;
    public tenantId: string;
    public category: number;
    public nickName: string;
    public userName: string;
    public avatar: string;
    public deviceType: number;
    public host: string;
    public days: number;
    public expireAt: number;
    public extensions: Map<string, unknown>;

    public static logout(redirectToLogin: () => void, message) {
        CrosStorage.getCrosStorage()
            .removeToken()
            .then(() => {
                sessionStorage.removeItem(USER_INFO_KEY);
                toast.success(message);
                redirectToLogin();
            });
    }

    public static getCurrentUser() {
        if (typeof window === "undefined") {
            console.error("This component should not render on server");
            return null;
        }
        const userJson = sessionStorage.getItem(USER_INFO_KEY);
        if (userJson) {
            return LoginUser.parseLoginJSON(userJson);
        }
        return LoginUser.visitor();
    }

    public static visitor() {
        const loginUser = new LoginUser();
        loginUser.userId = "visitor";
        loginUser.category = UserCategory.VISITOR;
        loginUser.tenantId = "visitor";
        loginUser.nickName = "访客";
        loginUser.userName = "visitor";
        return loginUser;
    }

    public static localize(token: string) {
        const decodeToken = decodeURIComponent(token);
        const parts: string[] = decodeToken.split(".");
        const body: string = parts[1];
        if (!body) {
            return null;
        }
        const userJson = atob(body);
        const userInfo = JSON.parse(userJson).body;
        sessionStorage.setItem(USER_INFO_KEY, userInfo);
        return LoginUser.parseLoginJSON(userInfo);
    }

    public static parseLoginJSON(json: string) {
        const loginUserJSON = JSON.parse(json);
        const loginUser = new LoginUser();
        loginUser.userId = loginUserJSON.userId + "";
        loginUser.category = loginUserJSON.category;
        loginUser.tenantId = loginUserJSON.tenantId + "";
        loginUser.nickName = loginUserJSON.nickName;
        loginUser.userName = loginUserJSON.userName;
        loginUser.avatar = loginUserJSON.avatar;
        loginUser.host = loginUserJSON.host;
        loginUser.deviceType = loginUserJSON.deviceType;
        loginUser.days = loginUserJSON.days;
        loginUser.expireAt = loginUserJSON.expireAt;
        if (loginUserJSON.extensions) {
            loginUser.extensions = new Map(Object.entries(loginUserJSON.extensions));
        }
        return loginUser;
    }

    public isVisitor(): boolean {
        return this.category == UserCategory.VISITOR;
    }
}
