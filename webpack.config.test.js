/**
 * @author Loserfucker<lihx_hit@163.com>
 * @date 2016/12/29
 * @description
 */
/**
 * @author Loserfucker<lihx_hit@163.com>
 * @date 2016/12/29
 * @description
 */
// webpack.config for production
let glob = require('glob');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let ExtractTextPlugin = require("extract-text-webpack-plugin");
let webpack = require('webpack');
let path = require('path');
const fs = require('fs');
let webpackConfig = {
    /* 一些webpack基础配置 */
    entry: {},
    output: {
        publicPath:'/',
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].[chunkhash:8].js'
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.html$/,
                loader: 'html'
            },
            {
                test: /\.ejs$/,
                loaders: ['html','ejs-html']
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel?presets[]=es2015',
            },
            {
                test: /(\.css|\.less)$/,
                loader: ExtractTextPlugin.extract('css?sourceMap!postcss!less')
            },
            {
                test: /\.(jpe?g|png)$/i,
                loader: 'file?name=image/[name].[hash].[ext]'
                // &publicPath=/assets/image/&outputPath=app/images/'
            },
            {
                test: /\.gif$/,
                loader: 'file?name=image/[name].[hash].[ext]'
            },
            {
                test: /\.ico$/,
                loader: 'file?name=image/[name].[hash].[ext]'
            },
            {test: /\.eot(\?v=\d+.\d+.\d+)?$/, loader: 'file?name=fonts/[hash:8].[ext]'},
            {test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file?name=fonts/[hash:8].[ext]'},
            {test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/, loader: 'file?name=fonts/[hash:8].[ext]'},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'file?name=fonts/[hash:8].[ext]'}
        ]
    },
    postcss: ()=> [
        require('postcss-fixes')(),
        require('autoprefixer')(),
        require('cssnano')({
            'safe': true, // I would recommend using cssnano only in safe mode
            'calc': false // calc is no longer necessary, as it is already done by postcss-fixes due to precision rounding reasons
        })],
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin({
            'process.env'  : {
                'NODE_ENV' : JSON.stringify('production')
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "commons",
            filename: 'js/common.[chunkhash:8].js'
        }),
        new ExtractTextPlugin('style/[name].[contenthash:8].css'),
        // Eliminate duplicate packages when generating bundle
        new webpack.optimize.DedupePlugin(),

        // Minify JS
        new webpack.optimize.UglifyJsPlugin()
    ]
};

// 获取指定路径下的入口文件
function getEntries(globPath) {
    let files = glob.sync(globPath),
        entries = {};

    files.forEach(function (filePath) {
        let split = filePath.split('/');
        let name = split[split.length - 2];

        entries[name] = './' + filePath;
    });

    return entries;
}

let entries = getEntries('src/**/index.js');

Object.keys(entries).forEach(function (name) {
    // 每个页面生成一个entry，如果需要HotUpdate，在这里修改entry
    webpackConfig.entry[name] = entries[name];
    try{
        fs.accessSync(`./src/${name}/${name}.ejs`,fs.F_OK);
    }catch(e){
        return false;
    }
    // 每个页面生成一个html
    let plugin = new HtmlWebpackPlugin({
        // 生成出来的html文件名
        filename: name + '.html',
        // 每个html的模版，这里多个页面使用同一个模版
        template: `./src/${name}/${name}.ejs`,
        // 自动将引用插入html
        inject: true,
        // 每个html引用的js模块，也可以在这里加上vendor等公用模块
        chunks: [name, 'commons']
    });
    webpackConfig.plugins.push(plugin);
});
module.exports = webpackConfig;