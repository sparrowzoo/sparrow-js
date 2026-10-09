import Fetcher from "@/common/lib/Fetcher";
import {IDENTITY} from "@/common/lib/protocol/Identity";
import Result, {PagerResult} from "@/common/lib/protocol/Result";
import {DictType} from "@/components/dict-type/columns";

export default class DictTypeApi {
    public static search(
        query: object,
        translator: (key: string) => string,
        redirectToLogin:()=>void
    ): Promise<Result<PagerResult<DictType>>> {
        const body = JSON.stringify(query);
        return Fetcher.post({
            url: "/dict/type/search.json",
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
                    url: "/dict/type/save.json",
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
                            url: "/dict/type/delete.json",
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
                                        url: "/dict/type/delete.json",
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
                                    url: "/dict/type/disable.json",
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
                                            url: "/dict/type/enable.json",
                                            body,
                                            translator,
                                            redirectToLogin: redirectToLogin
                        });
    }
}