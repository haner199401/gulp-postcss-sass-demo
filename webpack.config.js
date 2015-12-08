var glob = require('glob-all'),
    webpackPlugin = require('webpack');





////获取多个模块入口文件
function getEntry(src) {
	 var entry = {};
    glob.sync(src + '/**/*.main.js').forEach(function (name) {
        entry[name] = name;
    });
    return entry;
}
//

module.exports = {
    entry:getEntry('./src/asset/js'),
    output: {
        path:'./public',
        filename: '[name].js'
    },
    resolve: {
        modulesDirectories:["node_modules","./src/asset/js/lib"]
    },
    plugins: [
        new webpackPlugin.optimize.CommonsChunkPlugin("commons.js"),
        new webpackPlugin.ProvidePlugin({
            $: "jquery"
        })
    ]
};