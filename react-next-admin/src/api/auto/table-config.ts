import Fetcher from "@/common/lib/Fetcher";
import {IDENTITY} from "@/common/lib/table/DataTableProperty";

export default class TableConfigApi {
    public static search(
        query: {},
        translator: (key: string) => string
    ): Promise<any> {
        const body = JSON.stringify(query);
        return Fetcher.post("/table/config/search.json", body, translator);
    }

    public static  save(
        params: {},
        translator: (key: string) => string
    ): Promise<any> {
        const body = JSON.stringify(params);
        return Fetcher.post("/table/config/save.json", body, translator);
    }

    public static  batchDelete(
        params: IDENTITY[],
        translator: (key: string) => string
    ): Promise<any> {
        const body = JSON.stringify(params);
        return Fetcher.post("/table/config/delete.json", body, translator);
    }

       public static  delete(
            id: IDENTITY,
            translator: (key: string) => string
        ): Promise<any> {
            const body = JSON.stringify([id]);
            return Fetcher.post("/table/config/delete.json", body, translator);
        }


    public static  disable(
        params: IDENTITY[],
        translator: (key: string) => string
    ): Promise<any> {
        const body = JSON.stringify(params);
        return Fetcher.post("/table/config/disable.json", body, translator);
    }

    public static  enable(
        params: IDENTITY[],
        translator: (key: string) => string
    ): Promise<any> {
        const body = JSON.stringify(params);
        return Fetcher.post("/table/config/enable.json", body, translator);
    }
}