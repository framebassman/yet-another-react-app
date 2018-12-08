import {resolve} from 'path';
import * as fs from 'fs';
import * as webpack from 'webpack';
import * as webpackMerge from 'webpack-merge';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as CopyWebpackPlugin from 'copy-webpack-plugin';
import * as CleanWebpackPlugin from 'clean-webpack-plugin';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';

const NODE_ENV = process.env.NODE_ENV || 'development';
const buildPath = resolve(__dirname, '../public');
const nodeModulesPath = resolve(__dirname, './node_modules');
const faviconPath = resolve(__dirname, './assets/favicon.ico');
const configPath = resolve(__dirname, './config/develop.config.json');

const filesToCopy = [
  {from: faviconPath, to: 'favicon.ico'},
];

if (fs.existsSync(configPath)) {
  filesToCopy.push({from: configPath, to: 'config.json'});
}

const common: webpack.Configuration = {
  entry: {
      index: resolve(__dirname, './index.tsx'),
  },

  resolve: {
      extensions: ['.js', '.ts', '.tsx', '.css', '.scss'],
  },

  output: {
      path: buildPath,
      // publicPath: 'http://192.168.64.3:8080',
      publicPath: '/',
      filename: 'js/[name].[hash:6].bundle.js',
      chunkFilename: 'js/modules/[name].[chunkhash:6].chunk.js',
  },

  optimization: {
      splitChunks: {
          chunks: 'all',
      },
  },

  plugins: [
      new CleanWebpackPlugin(buildPath),
      new webpack.NoEmitOnErrorsPlugin(),
      new MiniCssExtractPlugin({
          filename: NODE_ENV === 'production' ? 'css/style.[contenthash:6].css' : 'css/style.css',
          chunkFilename: NODE_ENV === 'production' ? 'css/[id].[chunkhash:6].css' :  'css/[id].css',
      }),
      new HtmlWebpackPlugin({
          filename: 'index.html',
          favicon: faviconPath,
          template: resolve(__dirname, './index.html'),
      }),
      new CopyWebpackPlugin(filesToCopy),
  ],

  module: {
      rules: [
          {
              test: /\.tsx?$/,
              enforce: 'pre',
              use: [
                  {
                      loader: 'tslint-loader',
                      options: {
                          emitErrors: true,
                          failOnHint: true,
                      },
                  },
              ],
              exclude: [nodeModulesPath, resolve(__dirname, './protocol')],
          },
          {
              test: /\.tsx?$/,
              use: [
                  {
                      loader: 'awesome-typescript-loader',
                      options: {
                        configFileName: resolve(__dirname, './tsconfig.json'),
                      },
                  },
              ],
              exclude: [nodeModulesPath],
          },
          {
              test: /\.(ttf|eot|woff|woff2)$/,
              use: [
                  {
                      loader: 'url-loader',
                      options: {
                          name: '[path][name].[hash:6].[ext]',
                      },
                  },
              ],
              exclude: [nodeModulesPath],
          },
          {
              test: /\.(png|jpg|ico|svg)$/,
              use: [
                  {
                      loader: 'file-loader',
                      options: {
                          name: '[path][name].[hash:6].[ext]',
                      },
                  },
              ],
              exclude: [nodeModulesPath],
          },
          {
              test: /\.(sa|sc)ss$/,
              use: [
                  NODE_ENV === 'development'
                  ? 'style-loader'
                  : MiniCssExtractPlugin.loader,
                  {
                      loader: 'css-loader',
                      options: {
                          modules: true,
                          importLoaders: 3,
                          sourceMap: true,
                          localIdentName: '[local]___[hash:base64:5]',
                      },
                  },
                  {
                      loader: 'postcss-loader',
                      options: {
                          sourceMap: true,
                          plugins: [
                              require('autoprefixer'),
                          ],
                      },
                  },
                  {
                      loader: 'resolve-url-loader',
                      options: {
                          sourceMap: true,
                      },
                  },
                  {
                      loader: 'sass-loader',
                      options: {
                          sourceMap: true,
                      },
                  },
                  {
                      loader: 'postcss-loader',
                      options: {
                          sourceMap: true,
                          plugins: [
                              require('stylelint'),
                          ],
                      },
                  },
              ],
          },
      ],
  },
};

const dev: webpack.Configuration = {
  mode: 'development',

  devServer: {
      watchOptions: {
          aggregateTimeout: 100,
          poll: false,
          ignored: /node_modules/,
      },
      compress: true,
      publicPath: '/',
  },

  devtool: 'inline-source-map',
};

const prod: webpack.Configuration = {
  mode: 'production',
};

const config: webpack.Configuration = NODE_ENV !== 'development'
    ? webpackMerge(common, prod)
    : webpackMerge(common, dev);

export default config;
