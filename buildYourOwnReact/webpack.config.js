const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  // 指定构建环境
  mode: "development",
  //入口
  entry: {
    app: "./src/index",
  },
  output: {
    path: path.resolve("./dist"),
    filename: "js/[name].js",
    publicPath: "/", //打包后的资源的访问路径前缀
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
    ],
  },
  plugins: [
    // 使用html模版
    new HtmlWebpackPlugin({
      // 模版路径
      template: "./index.html",
      // 压缩
      minify: true,
    }),
  ],
};
