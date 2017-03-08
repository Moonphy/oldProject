// ==============================
// 输出gulp形式的日志
// ==============================

var gutil = require('gulp-util'),
    prettyHrtime = require('pretty-hrtime'),
    startTime = undefined;

module.exports = {
  start: function (filePath, processPoint) {
    startTime = process.hrtime();
    gutil.log(processPoint, gutil.colors.green(filePath), "...");
    return;
  },

  end: function (filePath, processPoint) {
    var taskTime = process.hrtime(startTime);
    var prettyTime = prettyHrtime(taskTime);
    gutil.log(processPoint, gutil.colors.green(filePath), "in", gutil.colors.magenta(prettyTime));
    return;
  }
}