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
    mergeStream = require('merge-stream');


var port = process.env.port || 5000,
    isDeploy = !!0,
    rev_manifest_file_path = './public/rev-manifest.json';


//postcss plugin
var autoprefixer = require('autoprefixer'),
    color_rgba_fallback = require('postcss-color-rgba-fallback'), //rgba IE8降级处理
    pixrem = require('pixrem'), //rem 转换
    opacity = require('postcss-opacity'),// 透明度 IE 降级处理
    pseudoelements = require('postcss-pseudoelements'),//伪元素处理
    csssimple = require('postcss-csssimple'),//IE 部分hack 处理
    clearFix = require('postcss-clearfix'),
    short = require('postcss-short'), //size :10px  => width:10px height:10px;     size :10px 20px  => width:10px height:20px;
    precss = require('precss'),//支持  sass 语法
    cssImport = require('postcss-import'),//支持import css
    sprites = require('postcss-sprites'),//sprites image
    oldie = require('oldie'),//old ie
    scss = require('postcss-scss'),//scss
    cssNext = require('postcss-cssnext');


////webpack plugin
//var PathRewriterPlugin = require('webpack-path-rewriter');


var project_src_root = './src', project_compile_root = './.tmp',project_plublic_root = './public'; //项目根目录  编译临时目录

var compile = {
    src: {
        css: project_src_root + '/asset/css/**/*.css',
        cssAssets: project_src_root + '/asset/css',
        html: project_src_root + '/**/*.jade',
        asset: [
            project_src_root + '/asset/image/**/*',
            project_src_root + '/asset/font/**/*'
        ],
        entry: project_src_root + '/asset/js/*.main.js', //webpack 多页面入口文件
        js: project_src_root + '/asset/js/**/*' //js 文件
    },
    dest: {
        css: project_compile_root + '/asset/css/',
        html: project_compile_root + '/',
        asset: project_compile_root + '/asset/',
        js: project_compile_root + '/asset/js/' //js 文件
    }
};


/**
 * Clean
 */
gulp.task('clean', del.bind(null, [project_compile_root,project_plublic_root]));


var opts = {
    stylesheetPath: compile.src.cssAssets,
    spritePath    : compile.src.cssAssets + 'image/icon/sprite.png',
    retina        : true
    },
    processors = [
        csssimple,
        precss,
        autoprefixer({browsers: ['> 1%', 'IE 8']}),
        color_rgba_fallback,
        opacity,
        pseudoelements,
        pixrem,
        oldie,
        clearFix,
        cssNext,
        short,
        cssImport({
            path: [project_src_root + '/asset/css/']
        }),
        sprites(opts)
    ];
/**
 * Postcss
 */
gulp.task('postcss', function () {
    return gulp.src(compile.src.css)
        .pipe(postcss(processors,{synax:scss}))
        .pipe($.if(isDeploy, $.csso()))
        .pipe($.if('*.css' && isDeploy, $.rename({suffix: '.min'})))
        .pipe(gulp.dest(compile.dest.css))
        .pipe(browserSync.stream());

});

/**
 * Resource copy
 *
 */
gulp.task('assets', function () {
    return mergeStream.apply(null, compile.src.asset.map(function (glob) {
        var path = glob.replace(/\/\*.*$/, '').replace(project_src_root, project_compile_root);
        return gulp.src(glob).pipe(gulp.dest(path)).pipe(browserSync.stream());
    }));
});

/**
 * Webpack
 *
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
    config.addVendor('jquery', 'jquery/dist/jquery.min.js');

    return gulp.src(entrys)
        .pipe(webpack(config))
        .pipe(gulp.dest(compile.dest.js))
        .pipe(browserSync.stream());

});


/**
 * Javascript
 *
 */
gulp.task('scripts', function () {
    return gulp.src(compile.src.js)
        .pipe($.plumber(errrHandler)) //异常处理
        .pipe($.if(isDeploy && '*.js', $.uglify()))
        .pipe(gulp.dest(compile.dest.js))
        .pipe(browserSync.stream());
});

/**
 * Jade
 */
gulp.task('jade', function () {
    return gulp.src(compile.src.html)
        .pipe($.plumber(errrHandler)) //异常处理
        .pipe($.jade({
            pretty: true //不压缩
        }))
        .pipe(gulp.dest(compile.dest.html))
        .pipe(browserSync.stream());
});


/**
 * Reversion
 *
 */
gulp.task('rev',['jade','scripts','assets','postcss'], function () {
    return gulp.src(compile.dest.asset + '**')
        .pipe(rev())
        .pipe(gulp.dest(project_plublic_root + '/asset'))
        .pipe(rev.manifest({base: project_plublic_root,merge: true}))
        .pipe(gulp.dest(project_plublic_root + '/asset'));
});

/**
 * Path replace
 */
gulp.task("revreplace",["rev"], function(){
    return gulp.src(compile.dest.html + '**/*.html')
        .pipe(revReplace({manifest: gulp.src(rev_manifest_file_path)}))
        .pipe(gulp.dest(project_plublic_root))
        .pipe(browserSync.stream());
});

var task = ['jade','scripts','assets','postcss'];
/**
 * Server
 */
gulp.task('server',isDeploy ? ['revreplace'] :task , function () {

    browserSync.init({
        notify: true,
        server: isDeploy ? project_plublic_root : project_compile_root,
        port: port
    });

    /**
     * 编译
     */
    gulp.watch(compile.src.html,['jade']);
    gulp.watch(compile.src.css, ['postcss']);
    gulp.watch(compile.src.js, ['scripts']);

    /**
     * 刷新
     */
    gulp.watch([compile.dest.html, compile.dest.css,compile.dest.js]).on('change', browserSync.reload);

});



/**
 * Main
 */
gulp.task('default', ['server']);











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