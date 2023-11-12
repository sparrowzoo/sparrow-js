const path = require("path");
// 引入自动生成 html 的插件
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const MiddlewarePlugin = require("next/dist/build/webpack/plugins/middleware-plugin");
module.exports = {
    mode: "development", //开发模式
    entry: {
        index: path.resolve(__dirname, "src", "index.js"),
        main: path.resolve(__dirname, "src", "pages", "main.js"),

    }, //指定入口文件，程序从这里开始编译,__dirname当前所在目录, ../表示上一级目录, ./同级目录
    output: {
        path: path.resolve(__dirname, "public"), // 输出的路径
        filename: "[name]-bundle.js", // 打包后文件
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: "babel-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.html$/,
                use: [
                    'html-withimg-loader'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',//后执行
                    'css-loader',//先执行
                ]
            }
        ],
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            title: "Webpack App",
            filename: "index.html",
        }),
        new HtmlWebpackPlugin({
            title: "Webpack App 2",
            template: "./src/pages/index.html",
            filename: "./marge.html",
            chunks: ["index", "main"]
        }),
        new CleanWebpackPlugin({
            path: path.join(__dirname, "public"),
        }),
    ],
    devServer: {
        historyApiFallback: true,
        static: {
            directory: path.join(__dirname, "src"),
        },
        compress: true,
        port: 8000, //3000,3001,3002开头则会报错//
        //1.localhost:3000?q=345678清除缓存后可以访问
        //2. 换其他端口也可访问
        open: true,
    },
};
