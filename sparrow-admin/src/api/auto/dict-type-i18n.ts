import Fetcher from "@/common/lib/Fetcher";
import {IDENTITY} from "@/common/lib/protocol/Identity";
import Result, {PagerResult} from "@/common/lib/protocol/Result";
import {DictTypeI18n} from "@/components/dict-type-i18n/columns";

export default class DictTypeI18nApi {
    public static search(
        query: object,
        translator: (key: string) => string,
        redirectToLogin:()=>void
    ): Promise<Result<PagerResult<DictTypeI18n>>> {
        const body = JSON.stringify(query);
        return Fetcher.post({
            url: "/dict/type/i18n/search.json",
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
                    url: "/dict/type/i18n/save.json",
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
                            url: "/dict/type/i18n/delete.json",
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
                                        url: "/dict/type/i18n/delete.json",
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
                                    url: "/dict/type/i18n/disable.json",
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
                                            url: "/dict/type/i18n/enable.json",
                                            body,
                                            translator,
                                            redirectToLogin: redirectToLogin
                        });
    }
}