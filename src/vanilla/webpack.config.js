const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const commonConfig = (env, argv) => ({
  mode: argv.mode, // 'development' or 'production' from CLI

  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    port: 8080, // Use 8080 to avoid conflict with backend
    hot: true, // Enable HMR
  },

  resolve: {
    fallback: {
      crypto: false,
    }, 
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.(css)$/,
        use: [
          // Use style-loader in development, extract to file in production
          argv.mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
        ]
      }
    ]
  },

  plugins: [
    // This is the definitive fix: embed LIFF_ID, fallback to empty string if not set.
    new webpack.DefinePlugin({
      'process.env.LIFF_ID': JSON.stringify(process.env.LIFF_ID || '')
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
    })
  ].filter(Boolean)
});

const vanillaConfig = (env, argv) => merge(
  commonConfig(env, argv),
  {
    name: "vanilla",
    entry: './index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[contenthash].js',
      publicPath: '', // Use relative paths for all assets
      clean: true, // Clean the dist folder before each build
    },
    plugins: [
      new HtmlWebpackPlugin({template: './index.html', chunks: ['main']}),
      new HtmlWebpackPlugin({template: './dashboard.html', filename: 'dashboard.html', chunks: []}) // dashboard.js があれば chunks に追加
    ]
  }
);

module.exports = (env, argv) => [
  vanillaConfig(env, argv)      
];