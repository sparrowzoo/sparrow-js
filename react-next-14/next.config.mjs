/** @type {import('next').NextConfig} */
const nextConfig = {
     assetPrefix: process.env.NEXT_ASSET_PREFIX,
     // 编译文件的输出目录
     distDir: "dist/pc",
     output: "export"
};

export default nextConfig;
