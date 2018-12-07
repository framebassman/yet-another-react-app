const webpack = require('webpack')
const fs = require('fs')
const webpackMerge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

const {resolve} = require('path')

const NODE_ENV = process.env.NODE_ENV || 'development'

const buildPath = resolve(__dirname, './dist')
const nodeModulesPath = resolve(__dirname, './node_modules')
const faviconPath = resolve(__dirname, './src/assets/favicon.ico')
const configPath = resolve(__dirname, './src/set10/config/develop.config.json')

const filesToCopy = [
    {from: faviconPath, to: 'favicon.ico'},
]

if (fs.existsSync(configPath)) {
    filesToCopy.push({from: configPath, to: 'config.json'})
}

const common = {
    // context: resolve(__dirname, './src'),

    entry: {
        index: resolve(__dirname, './src/index.tsx'),
    },

    resolve: {
        extensions: ['.js', '.ts', '.tsx', '.css', '.scss']
    },

    output: {
        path: buildPath,
        // publicPath: 'http://192.168.64.3:8080',
        publicPath: '/',
        filename: 'js/[name].[hash:6].bundle.js',
        chunkFilename: 'js/modules/[name].[chunkhash:6].chunk.js'
    },

    optimization: {
        splitChunks: {
            chunks: 'all'
        }
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
            template: resolve(__dirname, './src/index.html'),
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
                            failOnHint: true
                        },
                    },
                ],
                exclude: [nodeModulesPath, resolve(__dirname, './src/protocol')]
            },
            {
                test: /\.tsx?$/,
                use: ['awesome-typescript-loader'],
                exclude: [nodeModulesPath]
            },
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: '[path][name].[hash:6].[ext]'
                        }
                    },
                ],
                exclude: [nodeModulesPath]
            },
            {
                test: /\.(png|jpg|ico|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[hash:6].[ext]',
                        }
                    },
                ],
                exclude: [nodeModulesPath]
            },
            {
                test: /\.(sa|sc)ss$/,
                use: [
                    NODE_ENV === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            importLoaders: 3,
                            sourceMap: true,
                            localIdentName: '[local]___[hash:base64:5]',
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            plugins: [
                                require('autoprefixer'),
                            ]
                        }
                    },
                    {
                        loader: 'resolve-url-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            plugins: [
                                require('stylelint')
                            ]
                        }
                    },
                ],
            },
        ],
    }
}

const dev = {
    mode: 'development',

    devServer: {
        watchOptions: {
            aggregateTimeout: 100,
            poll: false,
            ignored: /node_modules/
        },
        compress: true,
        publicPath: '/',
    },

    devtool: 'inline-source-map',
}

const prod = {
    mode: 'production',
}

module.exports = NODE_ENV === 'development' 
    ? webpackMerge(common, dev)
    : webpackMerge(common, prod)
