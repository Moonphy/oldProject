// ==============================
// 任务描述：自动刷新浏览器
// ==============================

var browserSync = require('browser-sync')

module.exports = function (gulp, opts, config, $) {
  gulp.task('browserSync', function() {
    browserSync(config.browserSync);
  });
};