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
            {
                url: "/audit/join-qun.json",
                body:
                    {
                        qunId: qunId,
                        reason: "",
                    },
                translator: translator
            }
        );
    }

    public static async qunDetail(
        qunId: string,
        translator: null | ((key: string) => string) = null
    ) {
        return Fetcher.get({url: "/qun/detail/" + qunId + ".json", translator: translator}).then(
            (res: Result) => {
                return QunDetailWrap.fromJson(res.data);
            }
        );
    }

    public static async getQunList(translator: (key: string) => string) {
        return await Fetcher.get({url: "/qun/plaza.json", translator: translator})
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
