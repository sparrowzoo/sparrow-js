import type {NextConfig} from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
    output: "export",
    distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
    trailingSlash: true,
    images: {unoptimized: true},
    // 生成的静态资源路径前缀，适用于部署在子路径的场景。
    assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX,
    // Next.js 15 requires this flag for locale lookup via next/root-params.
    experimental: {rootParams: true},
};

const withNextIntl = createNextIntlPlugin({
    requestConfig: "./src/common/i18n/multi-request.ts",
});
export default withNextIntl(nextConfig);
