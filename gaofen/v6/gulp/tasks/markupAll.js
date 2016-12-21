// ================================
// 任务描述：从_data.json文件和jade文件
// 中重新读取数据并编译全部文件
// ================================

var browserSync = require("browser-sync"),
    handleErrors = require('../utilities/handleErrors'),
    getData = require("../utilities/getData");

module.exports = function (gulp, opts, config, $) {
  gulp.task('markupAll', function() {
    return gulp.src(config.markup.src)
      .pipe($.ignore.exclude(config.markup.excluded))
      .pipe($.data(getData))
      .pipe($.jade())
      .on("error", handleErrors)
      .pipe(gulp.dest(config.markup.build))
      .pipe($.filter("**/*.html"))
      .pipe(browserSync.reload({stream: true, once:true}));
  });
};