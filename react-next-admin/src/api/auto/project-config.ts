import Fetcher from "@/common/lib/Fetcher";
import {IDENTITY} from "@/common/lib/table/DataTableProperty";

export default class ProjectConfigApi {
    public static search(
        query: {},
        translator: (key: string) => string
    ): Promise<any> {
        const body = JSON.stringify(query);
        return Fetcher.post("/project/config/search.json", body, translator);
    }

    public static  save(
        params: {},
        translator: (key: string) => string
    ): Promise<any> {
        const body = JSON.stringify(params);
        return Fetcher.post("/project/config/save.json", body, translator);
    }

    public static  delete(
        params: IDENTITY[],
        translator: (key: string) => string
    ): Promise<any> {
        const body = JSON.stringify(params);
        return Fetcher.post("/project/config/delete.json", body, translator);
    }

    public static  disable(
        params: IDENTITY[],
        translator: (key: string) => string
    ): Promise<any> {
        const body = JSON.stringify(params);
        return Fetcher.post("/project/config/disable.json", body, translator);
    }

    public static  enable(
        params: IDENTITY[],
        translator: (key: string) => string
    ): Promise<any> {
        const body = JSON.stringify(params);
        return Fetcher.post("/project/config/enable.json", body, translator);
    }
}