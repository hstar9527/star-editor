/// <reference types="./script/global.d.ts" />
import type { Configuration } from "@rspack/cli";
import { default as HtmlPlugin } from "@rspack/plugin-html";
import CopyPlugin from "copy-webpack-plugin";
import path from "path";

const isDev = process.env.NODE_ENV === "development";
const core = path.resolve(__dirname, "../../packages/core/src");
const delta = path.resolve(__dirname, "../../packages/delta/src");
const react = path.resolve(__dirname, "../../packages/react/src");
const utils = path.resolve(__dirname, "../../packages/utils/src");
const plugin = path.resolve(__dirname, "../../packages/plugin/src");
const vue = path.resolve(__dirname, "../../packages/vue/src");
const variable = path.resolve(__dirname, "../../examples/variable/src");
const streaming = path.resolve(__dirname, "../../examples/stream/src");

/**
 * @type {import("@rspack/cli").Configuration}
 * @link https://www.rspack.dev/
 */
const config: Configuration = {
  //基础目录：该选项用于设置 Rspack 构建时所依赖的基础路径。
  context: __dirname,
  entry: {
    index: "./src/react/index.tsx",
    // vue: "./src/vue/index.ts",
    variable: "./src/variable/index.tsx",
    streaming: "./src/stream/index.tsx",
  },
  externals: {
    "react": "React",
    "react-dom": "ReactDOM",
    "vue": "Vue",
  },
  plugins: [
    new CopyPlugin([{ from: "./public", to: "./" }]),
    new HtmlPlugin({
      filename: "index.html",
      template: "./public/index.html",
      chunks: ["index"],
    }),
    // new HtmlPlugin({
    //   filename: "vue.html",
    //   template: "./public/vue.html",
    //   chunks: ["vue"],
    // }),
    new HtmlPlugin({
      filename: "variable.html",
      template: "./public/index.html",
      chunks: ["variable"],
    }),
    new HtmlPlugin({
      filename: "streaming.html",
      template: "./public/index.html",
      chunks: ["streaming"],
    }),
  ],
  resolve: {
    alias: {
      "@block-kit/utils/dist/es": utils,
      "@block-kit/core": core,
      "@block-kit/delta": delta,
      "@block-kit/react": react,
      "@block-kit/utils": utils,
      "@block-kit/plugin": plugin,
      "@block-kit/vue": vue,
      "@block-kit/variable": variable,
      "@block-kit/stream": streaming,
    },
  },
  builtins: {
    define: {
      "__DEV__": JSON.stringify(isDev),
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      "process.env.PUBLIC_URL": JSON.stringify("."),
      "process.env.VERSION": JSON.stringify("1.0.0"),
    },
    pluginImport: [
      {
        libraryName: "@arco-design/web-react",
        customName: "@arco-design/web-react/es/{{ member }}",
        style: true,
      },
      {
        libraryName: "@arco-design/web-react/icon",
        customName: "@arco-design/web-react/icon/react-icon/{{ member }}",
        style: false,
      },
    ],
  },
  module: {
    // https://www.rspack.dev/zh/config/module#rule
    rules: [
      { test: /\.svg$/, type: "asset" },
      {
        test: /.scss$/,
        oneOf: [
          {
            resource: /(module|m)\.scss$/,
            use: "sass-loader",
            type: "css/module",
          },
          {
            use: "sass-loader",
            type: "css",
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                javascriptEnabled: true,
                importLoaders: true,
                localIdentName: "[name]__[hash:base64:5]",
              },
            },
          },
        ],
        type: "css",
      },
    ],
  },
  target: isDev ? undefined : "es5",
  devtool: isDev ? "source-map" : false,
  output: {
    clean: true,
    chunkLoading: "jsonp",
    chunkFormat: "array-push",
    publicPath: isDev ? "" : "./",
    path: path.resolve(__dirname, "build"),
    filename: isDev ? "[name].bundle.js" : "[name].[contenthash].js",
    chunkFilename: isDev ? "[name].chunk.js" : "[name].[contenthash].js",
    assetModuleFilename: isDev ? "[name].[ext]" : "[name].[contenthash].[ext]",
  },
};

export default config;
