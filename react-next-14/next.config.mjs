/** @type {import('next').NextConfig} */
const nextConfig = {
    assetPrefix: process.env.NEXT_ASSET_PREFIX,
    images: {
        domains: ['http://img.sparrowzoo.net']
    },
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
