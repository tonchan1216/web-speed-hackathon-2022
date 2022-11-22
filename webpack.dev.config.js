/* eslint-disable @typescript-eslint/no-var-requires */
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { merge } = require("webpack-merge");

const common = require("./webpack.common.js");

const clientConfig = common.findIndex(config => config.name === "client");
const serverConfig = common.findIndex(config => config.name === "server");

module.exports = [
  merge(common[clientConfig], {
    devtool: "inline-source-map",
    mode: "development",
    plugins: [
      new BundleAnalyzerPlugin()
    ]
  }), 
  merge(common[serverConfig], {
    devtool: "inline-source-map",
    mode: "development",
  })
];