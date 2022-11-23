/* eslint-disable @typescript-eslint/no-var-requires */
const TerserPlugin = require('terser-webpack-plugin');
const { merge } = require("webpack-merge");

const common = require("./webpack.common.js");

const clientConfig = common.findIndex((config) => config.name === "client");
const serverConfig = common.findIndex((config) => config.name === "server");

module.exports = [
  merge(common[clientConfig], {
    devtool: "inline-source-map",
    mode: "production",
    optimization: {
      minimizer: [
        new TerserPlugin()
      ]  
    }
  }),
  merge(common[serverConfig], {
    mode: "development",
  }),
];
