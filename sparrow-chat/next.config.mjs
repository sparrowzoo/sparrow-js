import createNextIntlPlugin from "next-intl/plugin";

/** @type {import("next").NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true  // 图片不压缩
    },
    reactStrictMode: false,
    distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
    // Each site publishes its own out/ directory and same-origin framework assets.
    output: "export",
    trailingSlash: true,
    // Next.js 15 requires this flag for locale lookup via next/root-params.
    experimental: {rootParams: true},
    webpack: (config, options) => {
        config.module.rules.push(
            {
                test: /\.md$/,
                use: "raw-loader"
            },
            {
                test: /\.html$/,
                use: "raw-loader"
            },
            {
                test: /\.txt$/,
                use: "raw-loader"
            }
        );
        return config;
    }
};
//const withNextIntl = createNextIntlPlugin('./src/common/i18n/request.ts');

const withNextIntl = createNextIntlPlugin({
    requestConfig: './src/common/i18n/request.ts',
    experimental: {
        createMessagesDeclaration: './messages/en.json'
    }
});
export default withNextIntl(nextConfig);
// export default nextConfig;
