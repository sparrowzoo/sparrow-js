import Fetcher from "@/common/lib/Fetcher";
import {IDENTITY} from "@/common/lib/protocol/Identity";

export default class CoderApi {
    public static initByLocal(
        projectId: IDENTITY,
        fullClassName: string,
        translator: (key: string) => string
    ): Promise<any> {
        const query = {
            projectId: projectId,
            fullClassName: fullClassName
        }
        const body = JSON.stringify(query);
        return Fetcher.post("/coder/init-by-local.json", body, translator);
    }

    public static initByJpa(
        projectId: IDENTITY,
        fullClassName: string,
        sourceCode: string,
        translator: (key: string) => string
    ): Promise<any> {
        const query = {
            projectId: projectId,
            fullClassName: fullClassName,
            sourceCode: sourceCode
        };
        const body = JSON.stringify(query);
        return Fetcher.post("/coder/init-by-local.json", body, translator);
    }
}
