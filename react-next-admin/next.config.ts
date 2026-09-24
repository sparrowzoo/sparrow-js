import type {NextConfig} from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
    output: "export",
    trailingSlash: true,
    // A running dev server must never rewrite the production build cache.
    distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
};

const withNextIntl = createNextIntlPlugin({
    requestConfig: "./src/common/i18n/multi-request.ts",
});
export default withNextIntl(nextConfig);
