// ==============================
// 任务描述：生成静态网页
// ==============================

module.exports = function (gulp, opts, $) {
  gulp.task('compile', [
    'generate',
    'stylus',
    'images',
    'markup',
    'assets'
  ]);
};