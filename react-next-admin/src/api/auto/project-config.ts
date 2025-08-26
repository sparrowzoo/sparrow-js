
import Fetcher from "@/common/lib/Fetcher";

export default class ProjectConfigApi {
    public static search(
        query: any,
        translator: (key: string) => string,
        redirectToLogin:()=>void
    ): Promise<any> {
        const body = JSON.stringify(query);
        return Fetcher.post({
            url: "/project/config/search.json",
            body,
            translator,
            redirectToLogin: redirectToLogin
        });
        //return Fetcher.post("/project/config/search.json", body, translator);
    }

    // public static  save(
    //     params: any,
    //     translator: (key: string) => string
    // ): Promise<any> {
    //     const body = JSON.stringify(params);
    //     return Fetcher.post("/project/config/save.json", body, translator);
    // }
    //
    // public static  batchDelete(
    //     params: IDENTITY[],
    //     translator: (key: string) => string
    // ): Promise<any> {
    //     const body = JSON.stringify(params);
    //     return Fetcher.post("/project/config/delete.json", body, translator);
    // }
    //
    //    public static  delete(
    //         id: IDENTITY,
    //         translator: (key: string) => string
    //     ): Promise<any> {
    //         const body = JSON.stringify([id]);
    //         return Fetcher.post("/project/config/delete.json", body, translator);
    //     }
    //
    //
    // public static  disable(
    //     params: IDENTITY[],
    //     translator: (key: string) => string
    // ): Promise<any> {
    //     const body = JSON.stringify(params);
    //     return Fetcher.post("/project/config/disable.json", body, translator);
    // }
    //
    // public static  enable(
    //     params: IDENTITY[],
    //     translator: (key: string) => string
    // ): Promise<any> {
    //     const body = JSON.stringify(params);
    //     return Fetcher.post("/project/config/enable.json", body, translator);
    // }
}