import createNextIntlPlugin from "next-intl/plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true
    },
    // Each application exports its own HTML and /_next assets to out/.
    distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
    output: "export",
    trailingSlash: true,
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
