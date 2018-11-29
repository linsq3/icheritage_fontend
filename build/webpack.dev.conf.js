const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const os = require('os');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const portfinder = require('portfinder');
const baseWebpackConfig = require('./webpack.base.conf');
let ip = 'localhost';
const filterIP = (i) => {
    const v = i.findIndex(a => a.family === 'IPv4');
    return i[v].address;
};
if (os.networkInterfaces().en4) {
    ip = filterIP(os.networkInterfaces().en4);
} else if (os.networkInterfaces().en0) {
    ip = filterIP(os.networkInterfaces().en0);
}
const devWebpackConfig = merge(baseWebpackConfig, {
    devServer: {
        contentBase: path.join(__dirname, '../dist'),
        publicPath: '/',
        compress: true,
        host: '0.0.0.0',
        port: 9999,
        hot: true,
        inline: true,
        open: false,
        clientLogLevel: 'warning',
        quiet: true,
        historyApiFallback: true,
        proxy: {
            '/login': {
                target: 'http://beastsclub.cn/icheritage/web/app_dev.php',
                changeOrigin: true
            },
            '/logout': {
              target: 'http://beastsclub.cn/icheritage/web/app_dev.php',
              changeOrigin: true
            },
            '/admin': {
              target: 'http://beastsclub.cn/icheritage/web/app_dev.php',
              changeOrigin: true
            }
        }
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.join(__dirname, '../src/index.html'),
            inject: true,
            minify: true,
            hash: true,
        }),
    ]
});
module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = devWebpackConfig.devServer.port;
    portfinder.getPort((err, port) => {
        if (err) {
            reject(err);
        } else {
            devWebpackConfig.devServer.port = port;
            devWebpackConfig.plugins.push(new FriendlyErrorsWebpackPlugin({
                compilationSuccessInfo: {
                    messages: [`runing here http://${ip}:${port}`]
                },
                onError: '/n'
            }));
            resolve(devWebpackConfig);
        }
    });
});