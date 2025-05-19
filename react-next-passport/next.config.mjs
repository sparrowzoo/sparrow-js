import createNextIntlPlugin from "next-intl/plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
    assetPrefix: process.env.NEXT_ASSET_PREFIX,
    images: {
        domains: ['http://img.sparrowzoo.net'],
        unoptimized: true
    },
    // 编译文件的输出目录
    distDir: "dist",
    output: "export",
    webpack: (config, options) => {
        //https://webpack.docschina.org/loaders/html-loader/
        config.module.rules.push(
            // {
            //     test: /\.md$/,
            //     use: 'raw-loader'
            // },
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
            // {
            //     test: /\.txt$/,
            //     use: 'raw-loader'
            // }
        )
        return config
    },
};
const withNextIntl = createNextIntlPlugin({
    requestConfig: './src/common/i18n/request.ts',
    experimental: {
        createMessagesDeclaration: './messages/en.json'
    }
});
export default withNextIntl(nextConfig);
