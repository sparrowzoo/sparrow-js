
import Fetcher from "@/common/lib/Fetcher";
import {IDENTITY} from "@/common/lib/protocol/Identity";

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
    }

    public static  save(
        params: any,
        translator: (key: string) => string,
        redirectToLogin:()=>void
    ): Promise<any> {
        const body = JSON.stringify(params);
        return Fetcher.post({
                    url: "/project/config/save.json",
                    body,
                    translator,
                    redirectToLogin: redirectToLogin
        });
    }

    public static  batchDelete(
        params: IDENTITY[],
        translator: (key: string) => string,
        redirectToLogin:()=>void
    ): Promise<any> {
        const body = JSON.stringify(params);
        return Fetcher.post({
                            url: "/project/config/delete.json",
                            body,
                            translator,
                            redirectToLogin: redirectToLogin
        });
    }

       public static  delete(
            id: IDENTITY,
            translator: (key: string) => string,
            redirectToLogin:()=>void
        ): Promise<any> {
            const body = JSON.stringify([id]);
            return Fetcher.post({
                                        url: "/project/config/delete.json",
                                        body,
                                        translator,
                                        redirectToLogin: redirectToLogin
                    });
        }


    public static  disable(
        params: IDENTITY[],
        translator: (key: string) => string,
        redirectToLogin:()=>void
    ): Promise<any> {
        const body = JSON.stringify(params);
        return Fetcher.post({
                                    url: "/project/config/disable.json",
                                    body,
                                    translator,
                                    redirectToLogin: redirectToLogin
                });
    }

    public static  enable(
        params: IDENTITY[],
        translator: (key: string) => string,
        redirectToLogin:()=>void
    ): Promise<any> {
        const body = JSON.stringify(params);
        return Fetcher.post({
                                            url: "/project/config/enable.json",
                                            body,
                                            translator,
                                            redirectToLogin: redirectToLogin
                        });
    }
}