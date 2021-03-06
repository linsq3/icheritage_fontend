const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const os = require('os');
const HappyPack = require('happypack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const chalk = require('chalk');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const devMode = !/production/.test(process.env.npm_lifecycle_script);
const happyThreadPool = HappyPack.ThreadPool({
    size: os.cpus().length
});

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}
module.exports = {
    entry: {
        app: path.join(__dirname, '../src/index.js')
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'js/[name].[hash:8].js',
        chunkFilename: 'js/[name].[hash:8].js',
        // publicPath: '/',
        publicPath: '/icheritage_fontend/'
    },
    module: {
        rules: [{
                test: /\.vue$/,
                use: [
                    // 'thread-loader',
                    'vue-loader'
                ]
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'happypack/loader?id=happyBabel'
                },
                exclude: [
                    path.join(__dirname, '../node_modules')
                ]
            },
            {
                test: /\.(sc|c)ss$/,
                use: [
                    devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.sass$/,
                use: [
                    devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            indentedSyntax: true
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpeg|jpg|gif)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 5 * 1024, // 图片大小 > limit 使用file-loader, 反之使用url-loader
                        outputPath: 'images',
                        // publicPath: '../images/'
                    }
                }
            },
            {
                test: /\.(svg|bmp|eot|woff|woff2|ttf)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 5 * 1024, // 图片大小 > limit 使用file-loader, 反之使用url-loader
                        outputPath: 'assets',
                        publicPath: '../assets/'
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            // 'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src'),
            'layout': resolve('src/layout'),
            'components': resolve('src/components'),
            'apis': resolve('src/apis'),
            'helper': resolve('src/helper'),
            'store': resolve('src/store'),
            'views': resolve('src/views')
        }
    },
    stats: {
        children: false,
        modules: false,
        warnings: false
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: devMode ? 'css/[name].css' : 'css/[name].[hash:8].css',
            chunkFilename: devMode ? 'css/[id].css' : 'css/[id].[hash:8].css'
        }),
        new HappyPack({
            id: 'happyBabel',
            loaders: [{
                loader: 'babel-loader?cacheDirectory=true'
            }],
            threadPool: happyThreadPool,
            verbose: true
        }),
        new ProgressBarPlugin({
            format: `build [:bar] ${chalk.green.bold(':percent')} (:elapsed seconds)`,
            clear: false
        }),
        new VueLoaderPlugin()
    ]
};