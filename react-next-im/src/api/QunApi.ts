import Fetcher from "@/common/lib/Fetcher";
import Result from "@/common/lib/protocol/Result";
import QunPlaza from "@/lib/protocol/contact/QunPlaza";
import Group from "@/lib/protocol/contact/Group";
import toast from "react-hot-toast";

export default class QunAPI {
  public static async joinQun(qunId: string) {
    Fetcher.post("/audit/join-qun.json", {
      qunId: qunId,
      reason: "",
    }).then((res: Result) => {
      toast.success("申请成功，请等待审核结果！");
    });
  }

  public static async getQunList() {
    return await Fetcher.get("/qun/plaza.json")
      .then((res: Result) => {
        const qunPlaza = new QunPlaza();
        const remoteData = res.data;
        const localCategories = new Map();
        for (const key in remoteData.categoryDicts) {
          const category = remoteData.categoryDicts[key];
          localCategories.set(category.id, category);
        }
        qunPlaza.categoryDicts = localCategories;
        const localQunMap = new Map();
        for (const key in remoteData.qunMap) {
          const quns: Group[] = remoteData.qunMap[key];
          const localQuns: Group[] = [];
          for (const qun of quns) {
            localQuns.push(Group.fromJson(qun));
          }
          localQunMap.set(parseInt(key, 10), localQuns);
        }
        qunPlaza.qunMap = localQunMap;
        return qunPlaza;
      })
      .catch((err) => {
        console.log(err);
        return new QunPlaza();
      });
  }
}
