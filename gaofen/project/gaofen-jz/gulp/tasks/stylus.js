// ==============================
// 任务描述：编译 stylus 文件
// ==============================

var nib = require("nib"),
    handleErrors = require('../utilities/handleErrors'),
    gutil = require('gulp-util'),
    header = require('gulp-header'),
    browserSync = require("browser-sync");

function getDate(format){
    return  gutil.date( format|| "yyyy-mm-dd HH:MM");
}

module.exports = function (gulp, opts, config, $) {
    gulp.task("stylus", function () {
        if(opts.p) {
            // 生产环境
            return gulp.src(config.stylus.src)
                .pipe($.ignore.exclude(config.stylus.excluded))
                .pipe($.stylus({
                    use: [
                        nib()
                    ]
                }))
                .on("error", handleErrors)
                .pipe($.autoprefixer())
                .pipe(header('/*!  <%= date %>  */\n', {
                    date : getDate()
                }))
                .pipe(gulp.dest(config.stylus.dist))
                .pipe($.csso())
                .pipe($.rename({suffix: '.min'}))
                .pipe(gulp.dest(config.stylus.dist))
        }

        return gulp.src(config.stylus.src)
            .on("error", handleErrors)
            .pipe($.cached("stylus"))
            .pipe($.progeny())
            .pipe($.ignore.exclude(config.stylus.excluded))
            .pipe($.sourcemaps.init({debug: true}))
            .pipe($.stylus({
                use: [
                    nib()
                ],
                sourcemap: true
            }))
            //ipe($.autoprefixer())
            .pipe($.sourcemaps.write(".", {includeContent: true, sourceRoot: '/src'}))
            .pipe(gulp.dest(config.stylus.build))
            .pipe($.filter("**/*.css"))
            .pipe(browserSync.reload({stream: true, once:true}));
    });
};