import UserCategory from "@/common/lib/UserCategory";
import {resolveAvatar} from "@/common/lib/AvatarUtils";

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

    public getAvatar(): string {
        return resolveAvatar(this.avatar, this.userId);
    }

    public getSmallAvatar(){
        const  avatar=this.getAvatar();
        return avatar.replace("origin","small");
    }
}
