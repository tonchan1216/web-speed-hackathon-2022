/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

const CopyPlugin = require("copy-webpack-plugin");
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const nodeExternals = require("webpack-node-externals");

function abs(...args) {
  return path.join(__dirname, ...args);
}

const SRC_ROOT = abs("./src");
const PUBLIC_ROOT = abs("./public");
const DIST_ROOT = abs("./dist");
const DIST_PUBLIC = abs("./dist/public");

/** @type {Array<import('webpack').Configuration>} */
module.exports = [
  {
    devtool: "inline-source-map",
    entry: {
      main: path.join(SRC_ROOT, "client/index.jsx"),
      polyfill: ['core-js/stable', 'regenerator-runtime/runtime'],
    },
    mode: "development",
    module: {
      rules: [
        {
          resourceQuery: (value) => {
            const query = new URLSearchParams(value);
            return query.has("raw");
          },
          type: "asset/source",
        },
        {
          exclude: /[\\/]esm[\\/]/,
          test: /\.jsx?$/,
          use: {
            loader: "babel-loader",
            options: {
              plugins: ['lodash'],
              presets: [
                [
                  "@babel/preset-env",
                  {
                    modules: "cjs",
                    spec: true,
                    targets: "defaults"
                  },
                ],
                "@babel/preset-react",
              ],
            },
          },
        },
      ],
    },
    name: "client",
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendors: {
            chunks: 'initial',
            name: 'vendors',
            priority: 0,
          },
        },
        chunks: 'initial'
      },
    },
    output: {
      filename: '[name].bundle.js',
      path: DIST_PUBLIC,
    },
    plugins: [
      new CopyPlugin({
        patterns: [{ from: PUBLIC_ROOT, to: DIST_PUBLIC }],
      }),
      new LodashModuleReplacementPlugin()
    ],
    resolve: {
      extensions: [".js", ".jsx"],
    },
    target: "web"  
  },
  {
    devtool: "inline-source-map",
    entry: path.join(SRC_ROOT, "server/index.js"),
    externals: [nodeExternals()],
    mode: "development",
    module: {
      rules: [
        {
          exclude: /node_modules/,
          test: /\.(js|mjs|jsx)$/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    modules: "cjs",
                    spec: true,
                  },
                ],
                "@babel/preset-react",
              ],
            },
          },
        },
      ],
    },
    name: "server",
    output: {
      filename: "server.js",
      path: DIST_ROOT,
    },
    resolve: {
      extensions: [".mjs", ".js", ".jsx"],
    },
    target: "node",
  },
];
