const path = require('path');
const webpack= require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const ExtraneousFileCleanupPlugin = require('webpack-extraneous-file-cleanup-plugin');

let extractPlugin = new ExtractTextWebpackPlugin({
    filename: "[name].[chunkhash].css",
    allChunks: true
});

let bootstrapProvide = new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery',
    Popper: ['popper.js', 'default'],
    // In case you imported plugins individually, you must also require them here:
    Util: "exports-loader?Util!bootstrap/js/dist/util",
    Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
});

module.exports = {
    devtool: 'source-map',
    entry: {
        main: "./src/index.ts",
        styles: "./src/css/main.scss"
    },
    resolve: {
        extensions: [
            ".ts",
            ".js"
        ],
        modules: [
            "./node_modules"
        ]
    },
    output: {
        path: path.join(process.cwd(), "dist"),
        filename: "[name].[chunkhash].bundle.js",
        chunkFilename: "[id].chunk.js"
    },
    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader",
                exclude: "/node_modules/"
            },
            {
                test: /\.scss$/,
                loaders: extractPlugin.extract(
                     {
                        fallback:"style-loader",
                         use: [
                             {
                                 loader: "css-loader"
                             },
                             {
                                 loader: "postcss-loader",
                                 options: {
                                     plugins: function () { // post css plugins, can be exported to postcss.config.js
                                         return [
                                             require('precss'),
                                             require('autoprefixer')
                                         ];
                                     },
                                     sourceMap: true
                                 }
                             },
                             {
                                 loader: "resolve-url-loader"
                             },
                             {
                                 loader: "sass-loader"
                             }
                         ]
                    }
                ),
                exclude: ["node_modules"]
            },
            {
                test: /\.(jpg|png|gif|otf|woff|woff2|cur|ani|ttf|ico)$/,
                loader: "file-loader",
                options: {
                    name: "[name].[hash:20].[ext]"
                }
            },
            {
                test: /\.js$/,
                loader: "babel-loader",
                options: {
                    presets: ['es2015']
                },
                exclude: ["node_modules"]
            },
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: ['es2015']
                        }
                    },
                    {
                        loader: "awesome-typescript-loader"
                    }
                ],

                exclude: ["node_modules"]
            }

        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            filename: "./index.html",
            hash: true
        }),
        new HtmlWebpackPlugin({
            template: "./src/test.html",
            filename: "./test.html",
            hash: true
        }),
        extractPlugin,
        bootstrapProvide
/*        new ExtraneousFileCleanupPlugin({
            extensions: ['.js'],
            minBytes: 4084
        })*/
    ]
};