var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    postcss = require('gulp-postcss'),
    connect = require('gulp-connect'),
    webpack = require('webpack-stream'),
    named = require('vinyl-named'),
    del = require('del'),
    rev = require('gulp-rev'),
    revReplace = require('gulp-rev-replace'),
    rev_manifest_file_path = './rev-manifest.json';

var port = 8089, isDeploy = !!0;

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
        js: project_compile_root + '/asset/js/'
    }
};


/**
 * live reload
 */
gulp.task('connect', function () {
    connect.server({
        port: port,
        livereload: true
    })
});

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
        .pipe(gulp.dest(compile.dest.css));
});


/**
 * webpack
 */
gulp.task('webpack', function () {
    return gulp.src(compile.src.entry)
        .pipe(named())
        .pipe(webpack({
            output: {
                filename: 'bundle.js'
            },
            module: {
                loaders: [
                    {
                        test: /\.((png)|(eot)|(woff)|(ttf)|(svg)|(gif))$/,
                        loader: 'file?name=/[hash].[ext]'
                    }
                ]
            },
            resolve: {},
            plugins: []
        }))
        .pipe(gulp.dest(compile.dest.js));
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
});


/**
 * Default task setting
 */
gulp.task('default', ['connect'], function () {
    gulp.watch(compile.src.html, function (event) {
        gulp.run('jade');
    });
    gulp.watch('src/html/**', function (event) {
        gulp.run('html');
    });
    gulp.watch('src/css/**', function (event) {
        gulp.run('postcss');
    });
    gulp.watch('src/js/**', function (event) {
        gulp.run('js');
    });
    gulp.watch('src/images/**/*', batch(function (events, done) {
        gulp.start('images', done);
    }));
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
    isLog ? console.log('[' + dateStr + '] : ' + msg) : ''
}