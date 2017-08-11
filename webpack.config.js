const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const ExtraneousFileCleanupPlugin = require('webpack-extraneous-file-cleanup-plugin');

let extractPlugin = new ExtractTextWebpackPlugin({
    filename: "[name].[chunkhash].css",
    allChunks: true
});

module.exports = {
    devtool: 'source-map',
    entry: {
        main: "./src/index.ts",
        styles: "./src/css/expertise.scss"
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
                        use: ["css-loader", "sass-loader"]
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
                loader: "awesome-typescript-loader",
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
        extractPlugin,
/*        new ExtraneousFileCleanupPlugin({
            extensions: ['.js'],
            minBytes: 4084
        })*/
    ]
};