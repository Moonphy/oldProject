// ==============================
// 任务描述：复制资源文件到目标目录
// ==============================

module.exports = function (gulp, opts, config, $) {
    gulp.task('script', function () {
        gulp.src(config.script.src)
            .pipe(gulp.dest(opts.p ? config.script.dist : config.script.build))
    })
};