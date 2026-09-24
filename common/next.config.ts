import type {NextConfig} from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
    output: "export",
    distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
    trailingSlash: true,
    images: {unoptimized: true},
};

const withNextIntl = createNextIntlPlugin({
    requestConfig: "./src/common/i18n/multi-request.ts",
});
export default withNextIntl(nextConfig);
