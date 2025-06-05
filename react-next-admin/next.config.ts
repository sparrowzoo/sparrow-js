import type {NextConfig} from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
    /* config options here */
};

const withNextIntl = createNextIntlPlugin({
    requestConfig: "./src/common/i18n/manual-auto-split-request.ts",
});
export default withNextIntl(nextConfig);
