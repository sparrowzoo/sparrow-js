import Fetcher, {DownloadResult} from "@/common/lib/Fetcher";
import {IDENTITY} from "@/common/lib/protocol/Identity";
import Result from "@/common/lib/protocol/Result";

export interface CreateTableResult {
    tableName: string;
    status: "CREATED" | "SKIPPED" | "FAILED";
    message: string;
}

export default class CoderApi {
    public static initByLocal(
        projectId: IDENTITY,
        fullClassName: string,
        translator: (key: string) => string,
        directToLogin: () => void
    ): Promise<Result> {
        return Fetcher.post({
            url: "/coder/init-by-local.json",
            body: JSON.stringify({projectId, fullClassName}),
            translator: translator,
            redirectToLogin: directToLogin
        });
    }

    public static initByJpa(
        projectId: IDENTITY,
        fullClassName: string,
        sourceCode: string,
        translator: (key: string) => string,
        directToLogin: () => void
    ): Promise<Result> {
        return Fetcher.post({
            url: "/coder/init-by-jpa.json",
            body: JSON.stringify({projectId, fullClassName, sourceCode}),
            translator: translator,
            redirectToLogin: directToLogin
        });
    }

    public static generate(
        projectId: IDENTITY,
        tableNames: unknown[],
        translator: (key: string) => string,
        directToLogin: () => void
    ): Promise<Result> {
        return Fetcher.post({
            url: "/coder/generate.json",
            body: JSON.stringify({projectId, tableNames}),
            translator: translator,
            redirectToLogin: directToLogin
        });
    }

    public static generateDDL(
        projectId: IDENTITY,
        tableNames: unknown[],
        translator: (key: string) => string,
        directToLogin: () => void
    ): Promise<Result> {
        return Fetcher.post({
            url: "/coder/generate-ddl.json",
            body: JSON.stringify({projectId, tableNames}),
            translator,
            redirectToLogin: directToLogin
        });
    }

    public static createTables(
        projectId: IDENTITY,
        tableNames: unknown[],
        translator: (key: string) => string,
        directToLogin: () => void
    ): Promise<Result<CreateTableResult[]>> {
        return Fetcher.post<CreateTableResult[]>({
            url: "/coder/create-tables.json",
            body: JSON.stringify({projectId, tableNames}),
            translator,
            redirectToLogin: directToLogin
        });
    }

    public static zipDownload(
        projectId: IDENTITY,
        tableNames: unknown[],
        translator: (key: string) => string,
        directToLogin: () => void
    ): Promise<DownloadResult> {
        return Fetcher.download({
            url: "/coder/zip-download.json",
            body: JSON.stringify({projectId, tableNames}),
            translator: translator,
            redirectToLogin: directToLogin
        });
    }

    public static initScaffold(
        projectId: IDENTITY,
        translator: (key: string) => string,
        directToLogin: () => void
    ): Promise<Result> {
        return Fetcher.post({
            url: "/coder/init-scaffold.json",
            body: JSON.stringify(projectId),
            translator: translator,
            redirectToLogin: directToLogin
        });
    }

    public static clearScaffold(
        projectId: IDENTITY,
        translator: (key: string) => string,
        directToLogin: () => void
    ): Promise<Result> {
        return Fetcher.post({
            url: "/coder/clear-scaffold.json",
            body: JSON.stringify(projectId),
            translator: translator,
            redirectToLogin: directToLogin
        });
    }
}
