import { USER_INFO_KEY } from "@/common/lib/Env";
import UserCategory from "@/common/lib/UserCategory";

export default class LoginUser {
  public userId: string;
  public tenantId: string;
  public category: number;
  public nickName: string;
  public userName: string;
  public avatar: string;
  public deviceId: string;
  public days: number;
  public expireAt: number;
  public extensions: Map<string, any>;

  public static getCurrentUser() {
    if (typeof window === "undefined") {
      console.error("This component should not render on server");
      return null;
    }
    let userJson = sessionStorage.getItem(USER_INFO_KEY);
    if (userJson) {
      return LoginUser.parseLoginJSON(userJson);
    }
    return null;
  }

  private static parseLoginJSON(json: string) {
    const loginUserJSON = JSON.parse(json);
    const loginUser = new LoginUser();
    loginUser.userId = loginUserJSON.userId + "";
    loginUser.category = loginUserJSON.category;
    loginUser.nickName = loginUserJSON.nickName;
    loginUser.userName = loginUserJSON.userName;
    loginUser.avatar = loginUserJSON.avatar;
    loginUser.deviceId = loginUserJSON.deviceId;
    loginUser.days = loginUserJSON.days;
    loginUser.expireAt = loginUserJSON.expireAt;
    loginUser.extensions = new Map(Object.entries(loginUserJSON.extensions));
    return loginUser;
  }

  public isVisitor(): boolean {
    return this.category == UserCategory.VISITOR;
  }
}
