// ==============================
// 任务描述：清理文件
// ==============================

var rimraf = require('rimraf');

module.exports = function (gulp, opts, config) {
  gulp.task('clean', function(cb) {
    rimraf(config.paths.build, cb);
  });
};