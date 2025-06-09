import Fetcher from "@/common/lib/Fetcher";
import {IDENTITY} from "@/common/lib/table/DataTableProperty";

export default class MenuApi {
    public static async search(
        query: {},
        translator: (key: string) => string
    ): Promise<any> {
        const body = JSON.stringify(query);
        await Fetcher.post("/menu/search.json", body, translator);
    }

    public static async save(
        params: {},
        translator: (key: string) => string
    ): Promise<any> {
        const body = JSON.stringify(params);
        await Fetcher.post("/menu/save.json", body, translator);
    }

    public static async delete(
        params: IDENTITY[],
        translator: (key: string) => string
    ): Promise<any> {
        const body = JSON.stringify(params);
        await Fetcher.post("/menu/delete.json", body, translator);
    }

    public static async disable(
        params: IDENTITY[],
        translator: (key: string) => string
    ): Promise<any> {
        const body = JSON.stringify(params);
        await Fetcher.post("/menu/disable.json", body, translator);
    }

    public static async enable(
        params: IDENTITY[],
        translator: (key: string) => string
    ): Promise<any> {
        const body = JSON.stringify(params);
        await Fetcher.post("/menu/enable.json", body, translator);
    }
}
