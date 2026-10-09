import Fetcher from "@/common/lib/Fetcher";
import {IDENTITY} from "@/common/lib/protocol/Identity";
import Result, {PagerResult} from "@/common/lib/protocol/Result";
import {Organization} from "@/components/organization/columns";

export default class OrganizationApi {
    public static search(
        query: object,
        translator: (key: string) => string,
        redirectToLogin:()=>void
    ): Promise<Result<PagerResult<Organization>>> {
        const body = JSON.stringify(query);
        return Fetcher.post({
            url: "/organization/search.json",
            body,
            translator,
            redirectToLogin: redirectToLogin
        });
    }

    public static  save(
        params: object,
        translator: (key: string) => string,
        redirectToLogin:()=>void
    ): Promise<Result> {
        const body = JSON.stringify(params);
        return Fetcher.post({
                    url: "/organization/save.json",
                    body,
                    translator,
                    redirectToLogin: redirectToLogin
        });
    }

    public static  batchDelete(
        params: IDENTITY[],
        translator: (key: string) => string,
        redirectToLogin:()=>void
    ): Promise<Result> {
        const body = JSON.stringify(params);
        return Fetcher.post({
                            url: "/organization/delete.json",
                            body,
                            translator,
                            redirectToLogin: redirectToLogin
        });
    }

       public static  delete(
            id: IDENTITY,
            translator: (key: string) => string,
            redirectToLogin:()=>void
        ): Promise<Result> {
            const body = JSON.stringify([id]);
            return Fetcher.post({
                                        url: "/organization/delete.json",
                                        body,
                                        translator,
                                        redirectToLogin: redirectToLogin
                    });
        }


    public static  disable(
        params: IDENTITY[],
        translator: (key: string) => string,
        redirectToLogin:()=>void
    ): Promise<Result> {
        const body = JSON.stringify(params);
        return Fetcher.post({
                                    url: "/organization/disable.json",
                                    body,
                                    translator,
                                    redirectToLogin: redirectToLogin
                });
    }

    public static  enable(
        params: IDENTITY[],
        translator: (key: string) => string,
        redirectToLogin:()=>void
    ): Promise<Result> {
        const body = JSON.stringify(params);
        return Fetcher.post({
                                            url: "/organization/enable.json",
                                            body,
                                            translator,
                                            redirectToLogin: redirectToLogin
                        });
    }
}