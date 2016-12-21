// ==============================
// 任务描述：监听文件改动
// ==============================

var path = require('path');

module.exports = function (gulp, opts, config, $) {
  // gulp.task('watch', ['serve'], function() {
  gulp.task('watch', ['browserSync'], function() {
    // 监听stylus文件
    gulp.watch(config.stylus.src.map(path.normalize), ['stylus']);

    // 监听jade文件
    gulp.watch(config.markup.src.map(path.normalize), ['markup']);

    // 监听公用数据文件
    gulp.watch(config.data, ['markupAll']);

  });
};