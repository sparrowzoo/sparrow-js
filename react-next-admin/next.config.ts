import type {NextConfig} from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
    output: "export",
    trailingSlash: true,
};

const withNextIntl = createNextIntlPlugin({
    requestConfig: "./src/common/i18n/multi-request.ts",
});
export default withNextIntl(nextConfig);
