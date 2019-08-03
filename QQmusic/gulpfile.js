var gulp = require("gulp");
var htmlClean = require('gulp-htmlclean'); //引入压缩html插件
var imageMin = require('gulp-imagemin'); //引入压缩image插件
var uglify = require('gulp-uglify'); //引入压缩js插件
var debug = require('gulp-strip-debug'); //去掉js的调试语句
var less = require('gulp-less'); //less转换成css
var cssMin = require('gulp-clean-css'); //压缩css
var postCss = require('gulp-postcss'); //css自动加兼容前缀
var autoprefixer = require('autoprefixer'); //css自动加兼容前缀
var connect = require('gulp-connect'); //开启服务器

var folder = {
    //为了防止一改全改 用变量存起来
    src: "src/", //开发路径
    dist: "dist/" //默认打包后的路径
};
var devMod = process.env.NODE_ENV == "development";
gulp.task("html", function() {
    var page = gulp
        .src(folder.src + "html/index.html") // 变为文件流 取到开发路径下的html的所有文件
        .pipe(connect.reload());
    if (!devMod) {
        page.pipe(htmlClean()) //在变为文件流后才能引用
    }
    page.pipe(gulp.dest(folder.dist + "html/"));
    //pipe管道输出  dest 将其写入文件
    return page;
});

gulp.task("js", function() {
    var page = gulp
        .src(folder.src + "js/*")
        .pipe(connect.reload())
    if (!devMod) {
        // page.pipe(debug())
        page.pipe(uglify())
    }
    page.pipe(gulp.dest(folder.dist + "js/"));
    return page;
});

gulp.task('img', function() {
    return gulp.src(folder.src + 'img/*')
        .pipe(connect.reload())
        .pipe(imageMin())
        .pipe(gulp.dest(folder.dist + 'img/'))
})

gulp.task("css", function() {
    var page = gulp
        .src(folder.src + "css/*")
        .pipe(connect.reload())
        .pipe(less())
        .pipe(postCss([autoprefixer()]));
    if (!devMod) {
        page.pipe(cssMin())
    }
    page.pipe(gulp.dest(folder.dist + "css/"));
    return page;
});
gulp.task('server', function() {
        return connect.server({
            port: '8888',
            livereload: true //自动刷新模式 true开启
        })
    })
    // gulp.parallel('watch')
gulp.task('watch', function() {
    gulp.watch(folder.src + 'html/*', gulp.series('html'));
    gulp.watch(folder.src + 'css/*', gulp.series('css'));
    gulp.watch(folder.src + 'js/*', gulp.series('js'));
    gulp.watch(folder.src + 'img/*', gulp.series('img'));
})

gulp.task('default', gulp.series(gulp.parallel('server', 'watch', 'html', 'css', 'js', 'img')));
//less-->自动添加css3前缀-->压缩--->css文件