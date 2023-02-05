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
        },
        {
            test: /\.(css)$/,
            use: ['style-loader', 'css-loader']
        }
    ]
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin(),
        ],
    },
    plugins: [
        new HTMLWebpackPlugin(
            {
                title: 'Brick breaker'
            }
        ),
        new CopyWebpackPlugin({
                patterns: [
                    { to: 'assets', from: 'assets' }
                ]
            }
        )
    ]
}