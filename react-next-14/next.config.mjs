/** @type {import('next').NextConfig} */
// https://nextjs.org/docs/app/api-reference/next-config-js/webpack
const nextConfig = {
    assetPrefix: process.env.NEXT_ASSET_PREFIX,
    // 编译文件的输出目录
    distDir: "dist/pc",
    output: "export",
    webpack: (config, options) => {
        config.module.rules.push(
            {
                test: /\.md$/,
                use: 'raw-loader'
            },
            {
                test: /\.txt$/,
                use: 'raw-loader'
            }
        )
        return config
    },
};
export default nextConfig;
