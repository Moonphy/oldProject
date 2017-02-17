// ==============================
// 任务描述：监听文件改动
// ==============================

var path = require('path');

module.exports = function (gulp, opts, config, $) {
  // gulp.task('watch', ['serve'], function() {
  gulp.task('watch', ['serve'], function() {
    // 监听stylus文件
    gulp.watch(config.stylus.src, ['stylus']);

    // 监听jade文件
    gulp.watch(config.markup.src, ['markup']);

    // 监听js文件
    gulp.watch(config.script.src, ['script']);

    // 监听图片文件
    gulp.watch(config.images.src, ['images']);

    // 监听公用数据文件
    gulp.watch(config.data, ['markupAll','generate']);

    // 监听公用数据文件
    gulp.watch(config.collection.src, ['generate']);

  });
};