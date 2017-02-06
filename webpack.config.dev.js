/**
 * @author Loserfucker<lihx_hit@163.com>
 * @date 2016/12/29
 * @description
 */
// webpack.config for development
let glob = require('glob');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let ExtractTextPlugin = require("extract-text-webpack-plugin");
let webpack = require('webpack');
let path = require('path');
const fs = require('fs');
let webpackConfig = {
    /* 一些webpack基础配置 */
    entry: {
        app:['./tools/webpack-public-path','./src/script/app.js','webpack-hot-middleware/client?reload=true']
    },
    output: {
        publicPath:'/',
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].js'
    },
    devtool: 'cheap-module-inline-source-map',
    module: {
        loaders: [
            {
                test: /\.html$/,
                loader: 'html-loader?minimize=false'
            },
            {
                test: /\.ejs$/,
                loaders: ['html-loader?minimize=false','ejs-html-loader']
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: require.resolve('jquery'),  // 此loader配置项的目标是NPM中的jquery
                loader: 'expose-loader?$!expose-loader?jQuery', // 先把jQuery对象声明成为全局变量`jQuery`，再通过管道进一步又声明成为全局变量`$`
            },
            {
                test: /(\.css|\.less)$/,
                loaders: ['style-loader', 'css-loader?sourceMap', 'postcss-loader', 'less-loader?sourceMap']
            },
            {
                test: /\.(jpe?g|png)$/i,
                loader: 'file-loader?name=image/[name].[ext]'
                // &publicPath=/assets/image/&outputPath=app/images/'
            },
            {
                test: /\.gif$/,
                loader: 'file-loader?name=image/[name].[ext]'
            },
            {
                test: /\.ico$/,
                loader: 'file-loader?name=image/[name].[ext]'
            },
            {test: /\.eot(\?v=\d+.\d+.\d+)?$/, loader: 'file-loader?name=fonts/[name].[ext]'},
            {test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader?name=fonts/[name].[ext]'},
            {test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/, loader: 'file-loader?name=fonts/[name].[ext]'},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader?name=fonts/[name].[ext]'}
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery',
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env'  : {
                'NODE_ENV' : JSON.stringify('development')
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "commons",
            filename: 'js/common.js'
        }),
        new ExtractTextPlugin('style/[name].css'),
    ]
};

// 获取指定路径下的入口文件
function getEntries(globPath) {
    let files = glob.sync(globPath),
        entries = {};

    files.forEach(function (filePath) {
        let split = filePath.split('/');
        let name = split[split.length - 2];
        let file ='./' + split.slice(0,split.length-1).join('/')+'index.js';
        try{
            fs.accessSync(file,fs.F_OK);
        }catch(e){
            file = '';
        }
        entries[name] = file?['./tools/webpack-public-path',file,'webpack-hot-middleware/client?reload=true']:['./tools/webpack-public-path','webpack-hot-middleware/client?reload=true'];

    });

    return entries;
}
let entries = getEntries('src/**/index.ejs');

Object.keys(entries).forEach(function (name) {
    // 每个页面生成一个entry，如果需要HotUpdate，在这里修改entry
    webpackConfig.entry[name] = entries[name];
    let chunks = [name,'app','commons'];
    try{
        fs.accessSync(`./src/${name}/index.js`,fs.F_OK);
    }catch(e){
        chunks = [name,'app','commons']
    }
    // 每个页面生成一个html
    let plugin = new HtmlWebpackPlugin({
        // 生成出来的html文件名
        filename: name + '.html',
        // 每个html的模版，这里多个页面使用同一个模版
        template: `./src/${name}/index.ejs`,
        // 自动将引用插入html
        inject: true,
        // 每个html引用的js模块，也可以在这里加上vendor等公用模块
        chunks: chunks,
        chunksSortMode:'dependency'
    });
    webpackConfig.plugins.push(plugin);
});
module.exports = webpackConfig;