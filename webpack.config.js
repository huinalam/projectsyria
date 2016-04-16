var path = require('path');
var webpack = require('webpack');


var config = {
    entry: [
        "./entry.js",
        'webpack/hot/dev-server',
        'webpack-dev-server/client?http://localhost:8000/',
    ],
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    //devServer: {
    //    contentBase: ".",
    //    host: "localhost",
    //    port: 9000
    //},
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: "style!css"
            }, {
                test: /\.styl$/,
                loader: 'style-loader!css-loader!stylus-loader'
            }
        ]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
    ]
};
module.exports = config;