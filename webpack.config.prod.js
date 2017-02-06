/**
 * @author Loserfucker<lihx_hit@163.com>
 * @date 2016/12/29
 * @description
 */
// webpack.config for production
let glob = require('glob');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let ExtractTextPlugin = require("extract-text-webpack-plugin");
let WebpackMd5Hash = require('webpack-md5-hash');
var ManifestPlugin = require('webpack-manifest-plugin');
let webpack = require('webpack');
let path = require('path');
const fs = require('fs');
let webpackConfig = {
    /* 一些webpack基础配置 */
    entry: {
        appThird:'./src/script/app.js'
    },
    output: {
        publicPath:'/',
        path: path.resolve(__dirname, 'dist'),
        filename: 'scripts/third/[name].[chunkhash:8].js'
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.html$/,
                loader: 'html-loader?minimize=false'
            },
            {
                test: /\.ejs$/,
                use: ['html-loader?minimize=false','ejs-html-loader']
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader?presets[]=es2015',
            },
            {
                test: require.resolve('jquery'),  // 此loader配置项的目标是NPM中的jquery
                loader: 'expose-loader?$!expose-loader?jQuery', // 先把jQuery对象声明成为全局变量`jQuery`，再通过管道进一步又声明成为全局变量`$`
            },
            {
                test: /(\.css|\.less)$/,
                loader: ExtractTextPlugin.extract('css-loader?sourceMap!postcss-loader!less-loader')
            },
            {
                test: /\.(jpe?g|png)$/i,
                loader: 'file-loader?name=images/third/[name].[hash:8].[ext]'
                // &publicPath=/assets/image/&outputPath=app/images/'
            },
            {
                test: /\.gif$/,
                loader: 'file-loader?name=images/third/[name].[hash:8].[ext]'
            },
            {
                test: /\.ico$/,
                loader: 'file-loader?name=images/third/[name].[hash:8].[ext]'
            },
            {test: /\.eot(\?v=\d+.\d+.\d+)?$/, loader: 'file-loader?name=fonts/[hash:8].[ext]'},
            {test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader?name=fonts/[hash:8].[ext]'},
            {test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/, loader: 'file-loader?name=fonts/[hash:8].[ext]'},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader?name=fonts/[hash:8].[ext]'}
        ]
    },
    // postcss: ()=> [
    //     require('postcss-fixes')(),
    //     require('autoprefixer')(),
    //     require('cssnano')({
    //     'safe': true, // I would recommend using cssnano only in safe mode
    //     'calc': false // calc is no longer necessary, as it is already done by postcss-fixes due to precision rounding reasons
    // })],
    plugins: [
        new WebpackMd5Hash(),
        new ManifestPlugin({
            fileName: 'manifest.json',
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery',
        }),
        new webpack.DefinePlugin({
            'process.env'  : {
                'NODE_ENV' : JSON.stringify('production')
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "commonThird",
            filename: 'scripts/third/commonThird.[chunkhash:8].js'
        }),
        new ExtractTextPlugin('styles/third/[name].[contenthash:8].css'),
        // Minify JS
        new webpack.optimize.UglifyJsPlugin({
            comments:false,
            sourceMap: true,
            warnings: true,
            minimize: true
        })
    ]
};

// 获取指定路径下的入口文件
function getEntries(globPath) {
    let files = glob.sync(globPath),
        entries = {};

    files.forEach(function (filePath) {
        let split = filePath.split('/');
        let name = split[split.length - 2];
        let file ='./' + split.slice(0,split.length-1).join('/')+'/index.js';
        try{
            fs.accessSync(file,fs.F_OK);
        }catch(e){
            file = '';
        }
        entries[name] = file;
    });

    return entries;
}

let entries = getEntries('src/**/index.ejs');

Object.keys(entries).forEach(function (name) {
    // 每个页面生成一个entry，如果需要HotUpdate，在这里修改entry
    if(entries[name]){
        webpackConfig.entry[name] = entries[name];
    }
    let chunks = [name,'appThird','commonThird'];
    try{
        fs.accessSync(`./src/${name}/index.js`,fs.F_OK);
    }catch(e){
        chunks = ['appThird','commonThird']
    }
    // 每个页面生成一个html
    let plugin = new HtmlWebpackPlugin({
        // 生成出来的html文件名
        filename: name + '.html',
        // 每个html的模版，这里多个页面使用同一个模版
        template: `./src/${name}/index.ejs`,
        minify:false,
        // 自动将引用插入html
        inject: true,
        // 每个html引用的js模块，也可以在这里加上vendor等公用模块
        chunks: chunks,
        chunksSortMode:'dependency',

    });
    webpackConfig.plugins.push(plugin);
});
module.exports = webpackConfig;