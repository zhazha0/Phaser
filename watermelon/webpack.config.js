const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'game.bundle.js'
    },
    plugins: [ // may add to root object beside 'module' property
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            title: "Webpack Output",
        }),
        new CopyPlugin({
            patterns: [
                { from: "src/assets", to: "assets" },
                { from: "lib", to: "assets" }
            ],
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
        open: true
    }
};