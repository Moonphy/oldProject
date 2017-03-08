// ==============================
// 任务描述：清理文件
// ==============================
var del = require('del');
var rimraf = require('rimraf');

module.exports = function (gulp, opts, config) {
  gulp.task('clean', function(cb) {
    rimraf(config.paths.build, cb);
    /*del(['public'], function (event) {
      console.log('file' + event.path + 'was' + event.type + 'running tasks!');
    });*/
  });
};