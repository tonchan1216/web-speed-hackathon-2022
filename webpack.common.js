/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

const CopyPlugin = require("copy-webpack-plugin");
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
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
    entry: path.join(SRC_ROOT, "client/index.jsx"),
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
              plugins: ["lodash"],
              presets: [
                [
                  "@babel/preset-env",
                  {
                    corejs: 3,
                    modules: "cjs",
                    spec: true,
                    targets: "last 2 Chrome versions, not dead",
                    useBuiltIns: "usage",
                  },
                ],
                [
                  "@babel/preset-react",
                  {
                    "runtime": "automatic"
                  }
                ]
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
          corejsVendor: {
            chunks: 'all',
            name: 'vendor-corejs',
            test: /[\\/]node_modules[\\/](core-js)[\\/]/,
          },
          reactVendor: {
            chunks: 'all',
            name: 'vendor-react',
            test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
          },
        },
      },
    },
    output: {
      chunkFilename: '[name].bundle.js',
      filename: "[name].bundle.js",
      path: DIST_PUBLIC,
    },
    plugins: [
      new CopyPlugin({
        patterns: [{ from: PUBLIC_ROOT, to: DIST_PUBLIC }],
      }),
      new LodashModuleReplacementPlugin(),
    ],
    resolve: {
      extensions: [".js", ".jsx"],
    },
    target: "web",
  },
  {
    entry: path.join(SRC_ROOT, "server/index.js"),
    externals: [nodeExternals()],
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
