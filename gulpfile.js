var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    postcss = require('gulp-postcss'),
    webpack = require('webpack-stream'),
    browserSync = require('browser-sync').create(),
    webpackPlugin = require('webpack'),
    del = require('del'),
    rev = require('gulp-rev'),
    revReplace = require('gulp-rev-replace'),
    glob = require('glob-all'),
    path = require('path');


var port = process.env.port || 5000,
    isDeploy = !!0,
    node_modules_dir = path.join(__dirname, 'node_modules'),
    rev_manifest_file_path = './rev-manifest.json';


//postcss plugin
var autoprefixer = require('autoprefixer'),
    color_rgba_fallback = require('postcss-color-rgba-fallback'), //rgba IE8降级处理
    opacity = require('postcss-opacity'),// 透明度 IE 降级处理
    pseudoelements = require('postcss-pseudoelements'),//伪元素处理
    pixrem = require('pixrem'),// rem 2 px IE降级
    csssimple = require('postcss-csssimple'),//IE 部分hack 处理
    clearFix = require('postcss-clearfix'),
    short = require('postcss-short'), //size :10px  => width:10px height:10px;     size :10px 20px  => width:10px height:20px;
    precss = require('precss'),//支持  sass 语法
    cssNext = require('postcss-cssnext');


//webpack plugin
var PathRewriterPlugin = require('webpack-path-rewriter');


var project_src_root = './src', project_compile_root = './dest'; //项目根目录  编译目录

var compile = {
    src: {
        css: project_src_root + '/asset/css/**/*.css',
        html: project_src_root + '/**/*.jade',
        asset: project_src_root + '/asset/',
        entry: project_src_root + '/asset/js/*.main.js' //webpack 多页面入口文件
    },
    dest: {
        css: project_compile_root + '/asset/css/',
        html: project_compile_root + '/',
        asset: project_compile_root + '/asset/',
        js: project_compile_root
    }
};




/**
 * del
 */
gulp.task('clean', del.bind(null, ['dest']));

/**
 * postcss
 */
gulp.task('postcss', function () {
    var processors = [
        autoprefixer({browsers: ['> 1%', 'IE 8']}),
        color_rgba_fallback,
        opacity,
        pseudoelements,
        pixrem,
        //csssimple,
        clearFix,
        precss,
        cssNext,
        short
    ];

    return gulp.src(compile.src.css)
        .pipe(postcss(processors))
        .pipe($.if(isDeploy, $.csso()))
        .pipe($.if('*.css' && isDeploy, $.rename({suffix: '.min'})))
        .pipe(gulp.dest(compile.dest.css))
        .pipe(browserSync.stream());

});



gulp.task('asset',function(){
   return gulp.src([''])
       .pipe(gulp.dest())
       .pipe(browserSync.stream());

});


/**
 * webpack
 */
gulp.task('webpack', function () {
    var entrys = compile.src.entry;

    function getEntry() {
        var entry = {};
        glob.sync(entrys).forEach(function (name) {
            var outputfile = name.replace(project_src_root, '.').replace('.js', '');
            entry[outputfile] = name;
        });
        return entry;
    }

    /**
     * webpack config
     * @type {{entry: *, output: {filename: string}, resolve: {modulesDirectories: string[]}, plugins: *[]}}
     */
    var config = {
        addVendor: function (name, path) {
            this.resolve.alias[name] = path;
            this.module.noParse.push(new RegExp(path));
        },
        entry: getEntry(),
        output: {
            filename: '[name].js'
        },
        resolve: {
            modulesDirectories: ["node_modules", "lib"],
            alias: {}
        },
        module: {
            noParse: []
        },
        plugins: [
            new webpackPlugin.optimize.CommonsChunkPlugin("commons.js"),
            new webpackPlugin.ProvidePlugin({
                $: "jquery",
                jquery: "jQuery",
                "windows.jQuery": "jquery"
            })
        ]
    };

    //无需解析文件
    config.addVendor('jquery','jquery/dist/jquery.min.js');

    return gulp.src(entrys)
        .pipe(webpack(config))
        .pipe(gulp.dest(compile.dest.js))
        .pipe(browserSync.stream());

});

/**
 * Jade
 */
gulp.task('jade', function () {
    gulp.src(compile.src.html)
        .pipe($.plumber(errrHandler)) //异常处理
        .pipe($.jade({
            pretty: true //不压缩
        }))
        .pipe(gulp.dest(compile.dest.html))
        .pipe(browserSync.stream());

});


/**
 * live reload
 */
gulp.task('server',['jade'],function() {

    browserSync.init({
        notify:false,
        server: "./dest",
        port: port
    });

    gulp.watch(compile.src.html,['jade']);
    gulp.watch([compile.dest.html]).on('change', browserSync.reload);

});

/**
 * Default task setting
 */
gulp.task('default', ['server'], function () {
    gulp.watch(compile.src.html, function (event) {
        gulp.run('jade');
    });
});


/**
 * error handler
 * @param e
 */
function errrHandler(e) {
    log(e.message);
}

/**
 * Log
 * @param msg
 */
function log(msg) {
    var dateStr = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    console.log('[' + dateStr + '] : ' + msg);
}