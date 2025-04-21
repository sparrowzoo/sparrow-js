/** @type {import("next").NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/chat',
                destination: '/chat/friends/contact',
                permanent: true,
            }
        ]
    },
    assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX,
    images: {
        domains: ["http://img.sparrowzoo.net", "http://photo.16pic.com"],
        unoptimized: true  // 图片不压缩
    },
    reactStrictMode: false,
    // 编译文件的输出目录
    distDir: "dist/pc",
    output: "export",

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
export default nextConfig;
