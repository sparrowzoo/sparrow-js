import Fetcher from "@/common/lib/Fetcher";
import Result from "@/common/lib/protocol/Result";
import QunPlaza from "@/lib/protocol/contact/QunPlaza";
import Group from "@/lib/protocol/contact/Group";
import QunDetailWrap from "@/lib/protocol/contact/QunDetailWrap";

export default class QunAPI {
  public static async joinQun(
    qunId: string,
    translator: (key: string) => string
  ) {
    return Fetcher.post(
      "/audit/join-qun.json",
      {
        qunId: qunId,
        reason: "",
      },
      translator
    );
  }

  public static async qunDetail(
    qunId: string,
    translator: null | ((key: string) => string) = null
  ) {
    return Fetcher.get("/qun/detail/" + qunId + ".json", translator).then(
      (res: Result) => {
        return QunDetailWrap.fromJson(res.data);
      }
    );
  }

  public static async getQunList(translator: (key: string) => string) {
    return await Fetcher.get("/qun/plaza.json", translator)
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
