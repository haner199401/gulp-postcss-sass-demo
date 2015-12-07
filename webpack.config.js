var glob = require('glob-all'),
	webpackConfig;





////获取多个模块入口文件
//function getEntry(src) {
//	 var entry = {};
//    glob.sync(src + '/**/*.main.js').forEach(function (name) {
//        entry[HTools.randomStr(8)] = name;
//    });
//    return entry;
//}
//

module.exports = {
    //entry:getEntry(),
    module: {
        loaders: [
        ]
    },
    postcss:[
        autoprefixer({ browsers: ['> index%', 'IE 8']}),
        opacity,
        pseudoelements,
        pixrem
    ]
};