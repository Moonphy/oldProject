// ==============================
// 任务描述：复制资源文件到目标目录
// ==============================

module.exports = function (gulp, opts, config, $) {
  gulp.task('assets', function () {
    gulp.src(config.assets.src)
      .pipe(gulp.dest(opts.p ? config.assets.dist : config.assets.build));
  });
};