const CopyWebpackPlugin = require('copy-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
//const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const TerserPlugin = require("terser-webpack-plugin");


module.exports = {
    mode: 'production',
    module: {
        rules: [{
            test: /\.(js)$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        }]
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin(),
        ],
    },
    plugins: [
        new CopyWebpackPlugin({
                patterns: [
                    { to: 'assets', from: 'assets' }
                ]
            }
        ),
        new HTMLWebpackPlugin(
            /*
            {
            template: 'build/index.html',
            filename: 'index.html',
            hash: true,
            minify: false
            }
            */
        )
    ]
}