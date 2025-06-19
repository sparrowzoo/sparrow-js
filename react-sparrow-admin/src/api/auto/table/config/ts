import Fetcher from "@/common/lib/Fetcher";
import {IDENTITY} from "@/common/lib/table/DataTableProperty";

export default class TableConfigApi {
    public static async search(
        query: {},
        translator: (key: string) => string
    ): Promise<any> {
        const body = JSON.stringify(query);
        await Fetcher.post("/table/config/search.json", body, translator);
    }

    public static async save(
        params: {},
        translator: (key: string) => string
    ): Promise<any> {
        const body = JSON.stringify(params);
        await Fetcher.post("/table/config/save.json", body, translator);
    }

    public static async delete(
        params: IDENTITY[],
        translator: (key: string) => string
    ): Promise<any> {
        const body = JSON.stringify(params);
        await Fetcher.post("/table/config/delete.json", body, translator);
    }

    public static async disable(
        params: IDENTITY[],
        translator: (key: string) => string
    ): Promise<any> {
        const body = JSON.stringify(params);
        await Fetcher.post("/table/config/disable.json", body, translator);
    }

    public static async enable(
        params: IDENTITY[],
        translator: (key: string) => string
    ): Promise<any> {
        const body = JSON.stringify(params);
        await Fetcher.post("/table/config/enable.json", body, translator);
    }
}