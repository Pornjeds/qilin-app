const path = require("path");
const Webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

console.log(`Running in ${process.env.NODE_ENV || "production"} mode`);

const config = {
  entry: "./src/index.js",

  output: {
    path: path.resolve(__dirname, "./qpm/src"),
    filename: "index.min.js",
  },

  resolve: {
    extensions: [".js", ".jsx", ".json"],
  },

  externals: {
    "qilin-manager": "require('../node_modules/qilin-manager')",
  },

  watchOptions: {
    ignored: [
      path.resolve(__dirname, "./node_modules"),
      path.resolve(__dirname, "./demos"),
      path.resolve(__dirname, "./build"),
      path.resolve(__dirname, "./cache"),
      path.resolve(__dirname, "./qpm"),
      path.resolve(__dirname, "./bin"),
    ],
  },

  devtool: "source-map",
  context: __dirname,
  target: "node-webkit",

  module: {
    rules: [
      {
        test: /\.(jpg|jpeg|png)$/,
        use: "url-loader?limit=1000",
      },
      {
        test: /\.(woff|woff2|eot|otf|ttf|svg)$/,
        use: "file-loader",
      },
      {
        test: /\.json$/,
        use: "json-loader",
      },
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: /(node_modules|bower_components)/,
      },
      {
        test: /\.(scss|css)$/,
        use: ExtractTextPlugin.extract({
          use: [
            {loader: "css-loader", options: {sourceMap: true}},
            {loader: "resolve-url-loader", options: {sourceMap: true}},
            {loader: "postcss-loader", options: {sourceMap: true}},
            {loader: "sass-loader", options: {sourceMap: true}},
          ],
        }),
      },
    ],
  },

  plugins: [
    new Webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          require("autoprefixer"),
        ],
        devServer: {
          inline: true,
        },
      },
    }),

    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),

    new ExtractTextPlugin({
      filename: "./index.min.css",
      allChunks: true,
    }),

    new Webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    }),
  ],
};

if (process.env.NODE_ENV === "development") {
  // …
}

if (process.env.NODE_ENV === "production") {
  config.plugins.push(new Webpack.optimize.ModuleConcatenationPlugin());
  config.plugins.push(new Webpack.optimize.AggressiveMergingPlugin());
  config.plugins.push(new UglifyJSPlugin({
    uglifyOptions: {
      ie8: false,

      compress: {
        keep_infinity: true,
        drop_console: true,
        dead_code: true,
        passes: 3,
      },

      output: {
        inline_script: true,
        comments: false,
        beautify: false,
        ecma: 6,
      },
    },
  }));
}

module.exports = config;
