const path = require("path");
const defaultSettings = require("./src/settings.js");
const webpack = require("webpack");
const CompressionWebpackPlugin = require("compression-webpack-plugin"); //引入插件
const productionGzipExtensions = ["js", "css"]; //压缩js 和css文件
const isProd = process.env.NODE_ENV === "prod";

function resolve(dir) {
  return path.join(__dirname, dir);
}

const name = defaultSettings.title || "sparrow pc"; // page title
const port = process.env.port || process.env.npm_config_port || 9095;

console.log("process.env.CONSUMER_BASE_URL", process.env.CONSUMER_BASE_URL);
console.log("process.env.SPARROW_BASE_URL", process.env.SPARROW_BASE_URL);
const { defineConfig } = require("@vue/cli-service");
const CompressionPlugin = require("compression-webpack-plugin");
const { constants } = require("zlib");
module.exports = defineConfig({
  // dev 必须是/ 生产环境才允许配置
  //publicPath: process.env.NODE_ENV === 'prod' ? '/my-project/' : '/',
  publicPath: process.env.publicPath, //npm run serve 启动后对应的项目子目录
  outputDir: "build-dist", //打包编译后生成的路径 npm run build
  assetsDir: "static", //静态资源生成的路径
  indexPath: "index.html", //编译后的首页
  transpileDependencies: true,
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [path.resolve(__dirname, "src/assets/style/base.less")],
    },
  },

  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    /**
     * 打开会报以下错误
     * Configuration Error: Avoid modifying webpack output.publicPath directly. Use the "publicPath" option instead.
     */
    // output: {
    //   publicPath: process.env.publicPath,
    // },
    resolve: {
      alias: {
        "@": resolve("src"),
      },
    },
    experiments: {
      topLevelAwait: true, // 此处为新增配置
    },
    plugins: [
      // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      // 下面两项配置才是 compression-webpack-plugin 压缩配置
      // 压缩成 .gz 文件
      new CompressionPlugin({
        filename: "[path][base].gz",
        algorithm: "gzip",
        test: new RegExp(/\.js$|\.css$|\.html$/),
        threshold: 10240,
        minRatio: 0.8,
      }),
      // 压缩成 .br 文件，如果 zlib 报错无法解决，可以注释这段使用代码，一般本地没问题，需要注意线上服务器会可能发生找不到 zlib 的情况。
      // new CompressionPlugin({
      //   filename: "[path][base].br",
      //   algorithm: "brotliCompress",
      //   test: /\.(js|css|html|svg)$/,
      //   compressionOptions: {
      //     params: {
      //       [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
      //     },
      //   },
      //   threshold: 10240,
      //   minRatio: 0.8,
      // }),
      // 开启分离 js
    ],
    optimization: {
      runtimeChunk: "single",
      splitChunks: {
        chunks: "all",
        maxInitialRequests: Infinity,
        minSize: 20000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1];
              // npm package names are URL-safe, but some servers don't like @ symbols
              return `npm.${packageName.replace("@", "")}`;
            },
          },
        },
      },
    },
  },

  chainWebpack: (config) => {
    config.plugins.delete("prefetch");
    // 移除 preload 插件
    config.plugins.delete("preload");
    // 压缩代码
    config.optimization.minimize(true);
  },

  devServer: {
    port: port, //端口
    open: true, //是否自动启用浏览器
    //overlay: { //vue3
    /**
     * INFO  Starting development server...
     ERROR  ValidationError: Invalid options object. Dev Server has been initialized using an options object that does not match the API schema.
     - options has an unknown property 'overlay'. These properties are valid:
     object { allowedHosts?, bonjour?, client?, compress?, devMiddleware?, headers?, historyApiFallback?, host?, hot?, http2?, https?, ipc?, liveReload?, magicHtml?, onAfterSetupMiddleware?, onBeforeSetupMiddleware?, onListening?, open?, port?, proxy?, server?, setupExitSignals?, setupMiddlewares?, static?, watchFiles?, webSocketServer? }
     */
    //warnings: false,
    //errors: true
    //},
    proxy: {
      "/api/": {
        target: "http://127.0.0.1:7777",
        changeOrigin: true,
        logLevel: "debug",
        pathRewrite: {
          "^/api/": "",
        },
      },
    },
  },
});
//?输出configureWebpack
console.log(module.exports.configureWebpack.resolve.alias);
debugger;
console.log("publicPath:" + process.env.publicPath);
