const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.(css)$/,
                use: ['style-loader', 'css-loader']
            }
        ],
    },
    devServer: {
        static: {
          directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 3000,
      },
    devtool: 'inline-source-map',
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
        })
    ]
}
