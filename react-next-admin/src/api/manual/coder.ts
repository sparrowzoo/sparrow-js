import Fetcher from "@/common/lib/Fetcher";
import {IDENTITY} from "@/common/lib/protocol/Identity";
import Result from "@/common/lib/protocol/Result";

export default class CoderApi {
    public static initByLocal(
        projectId: IDENTITY,
        fullClassName: string,
        translator: (key: string) => string,
        directToLogin:()=>void
    ): Promise<Result> {
        const query = {
            projectId: projectId,
            fullClassName: fullClassName
        }
        const body = JSON.stringify(query);
        return Fetcher.post({
            url: "/coder/init-by-local.json",
            body: body,
            translator: translator,
            redirectToLogin:directToLogin
        });
        //return Fetcher.post("/coder/init-by-local.json", body, translator);
    }

    public static initByJpa(
        projectId: IDENTITY,
        fullClassName: string,
        sourceCode: string,
        translator: (key: string) => string,
        directToLogin:()=>void
    ): Promise<Result> {
        const query = {
            projectId: projectId,
            fullClassName: fullClassName,
            sourceCode: sourceCode
        };
        const body = JSON.stringify(query);
        return Fetcher.post({
            url: "/coder/init-by-jpa.json",
            body: body,
            translator: translator,
            redirectToLogin:directToLogin
        })
        //return Fetcher.post("/coder/init-by-jpa.json", body, translator);
    }

    public static generate(
        projectId: IDENTITY,
        tableNames: unknown[],
        translator: (key: string) => string,
        directToLogin:()=>void
    ): Promise<Result> {
        const query = {
            projectId: projectId,
            tableNames: tableNames
        };
        const body = JSON.stringify(query);
        return Fetcher.post({
            url: "/coder/generate.json",
            body: body,
            translator: translator,
            redirectToLogin:directToLogin
        });
        //return Fetcher.post("/coder/generate.json", body, translator);
    }

    public static initScaffold(
        projectId: IDENTITY,
        translator: (key: string) => string,
        directToLogin:()=>void
    ): Promise<Result> {
        return Fetcher.post({
            url: "/coder/init-scaffold.json",
            body: JSON.stringify(projectId),
            translator: translator,
            redirectToLogin:directToLogin
        });
        //return Fetcher.post("/coder/init-scaffold.json", projectId, translator);
    }

    public static clearScaffold(
        projectId: IDENTITY,
        translator: (key: string) => string,
        directToLogin:()=>void
    ): Promise<Result> {
        return Fetcher.post({
            url: "/coder/clear-scaffold.json",
            body: JSON.stringify(projectId),
            translator: translator,
            redirectToLogin:directToLogin
        });
        //return Fetcher.post("/coder/clear.json", projectId, translator);
    }
}
