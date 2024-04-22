const path = require("path");
// 引入自动生成 html 的插件
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  optimization: {
    usedExports: false, // 只使用导出(意思是不使用的脚本不导出)
    sideEffects: false, // 禁用副作用检测（对于 package.json 中的 "sideEffects" 属性）
    minimize: false, // <---- 禁用 uglify. //禁用代码混淆
  },
  mode: "development", //开发模式
  entry: {
    index: path.resolve(__dirname, "src","parentChildren", "index.js"),
    main: path.resolve(__dirname, "src", "pages", "main.js"),
    route: path.resolve(__dirname, "src", "route", "index.js"),

  }, //指定入口文件，程序从这里开始编译,__dirname当前所在目录, ../表示上一级目录, ./同级目录
  output: {
    path: path.resolve(__dirname, "public"), // 输出的路径
    filename: "[name]-wrap.js", // 打包后文件
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.png$/i,
        //,'file-loader' 有文件路径的
        use: {
          loader: "url-loader",
          options: {
            limit: 10 * 1024,
            name: "[name]-[hash].png",
          },
        },
      },
      {
        test: /\.(js|jsx)$/,
        loader: "babel-loader",
        exclude: /node_modules/, //node modules 文件夹下的要排除
      },
      {
        test: /\.html$/,
        use: [
          "html-withimg-loader", //合并html功能
        ],
      },
      // {
      //     test: /\.css$/,
      //     use: [
      //         'style-loader',//后执行
      //         'css-loader',//先执行
      //     ]
      // }
    ],
  },

  plugins: [
    // 提取css成单独文件
    new MiniCssExtractPlugin({
      // 定义输出文件名和目录
      filename: "css/[name]-wrap-[hash].css",
    }),
    //父子状态关系实例
    new HtmlWebpackPlugin({
      template: "./src/parentChildren/index.html",
      title: "parent children demo",
      filename: "index.html",
      chunks: ["index"], //默认是所有chunks
    }),
//html 合并实例
    new HtmlWebpackPlugin({
      title: "webpack merge html",
      template: "./src/pages/index.html", //结合 html-withimg-loader 生成html
      filename: "./marge.html",
      chunks: ["main"], //chunk 即上边entry的key
    }),

    //站内路由实例
    new HtmlWebpackPlugin({
      title: "route demo",
      template: "./src/route/index.html",
      filename: "./route.html",
      chunks: ["route"], //chunk 即上边entry的key
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
