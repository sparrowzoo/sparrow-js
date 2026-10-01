import type {Metadata} from "next";
import SiteHeader from "../_components/site-header";

export const metadata: Metadata = {
    robots: {index: false, follow: false},
};

/** 构建辅助页：只渲染共享头，供脚本抽取 header 的静态 HTML 与 CSS/JS 资源 URL。 */
export default function ArticleHeaderPage() {
    return <SiteHeader i18n={false} profile={true}/>;
}
