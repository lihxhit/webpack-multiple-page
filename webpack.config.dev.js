/**
 * @author Loserfucker<lihx_hit@163.com>
 * @date 2016/12/29
 * @description
 */
// webpack.config.js
let glob = require('glob');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let webpack = require('webpack');
let webpackConfig = {
    /* 一些webpack基础配置 */
    entry:{

    },
    output:{
        path: './dist/',
        filename: '[name].[chunkhash:8].js'
    },
    plugins:[new webpack.optimize.CommonsChunkPlugin({
        name: "commons",
        filename:'common.[chunkhash:8].js'
    })]
};

// 获取指定路径下的入口文件
function getEntries(globPath) {
    let files = glob.sync(globPath),
        entries = {};

    files.forEach(function(filePath) {
        let split = filePath.split('/');
        let name = split[split.length - 2];

        entries[name] = './' + filePath;
    });

    return entries;
}

let entries = getEntries('src/**/index.js');

Object.keys(entries).forEach(function(name) {
    // 每个页面生成一个entry，如果需要HotUpdate，在这里修改entry
    webpackConfig.entry[name] = entries[name];

    // 每个页面生成一个html
    let plugin = new HtmlWebpackPlugin({
        // 生成出来的html文件名
        filename: name + '.html',
        // 每个html的模版，这里多个页面使用同一个模版
        template: `./src/${name}/${name}.html`,
        // 自动将引用插入html
        inject: true,
        // 每个html引用的js模块，也可以在这里加上vendor等公用模块
        chunks: [name,'commons']
    });
    webpackConfig.plugins.push(plugin);
});
module.exports = webpackConfig;