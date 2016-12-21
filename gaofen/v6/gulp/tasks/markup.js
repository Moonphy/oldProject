// =============================================
// 任务描述：从_data.json文件和jade文件中取得数据并编译
// =============================================

var browserSync = require("browser-sync"),
    handleErrors = require('../utilities/handleErrors');

module.exports = function (gulp, opts, config, $) {
  var getData = require("../utilities/getData")(opts);
  gulp.task('markup', function() {

    if(opts.p) {
      // 生产环境
      // var data.environment = 'production';
      return gulp.src(config.markup.src)
        .pipe($.ignore.exclude(config.markup.excluded))
        .pipe($.data(getData))
        .pipe($.jade({
          pretty: '    '
        }))
        .on("error", handleErrors)
        .pipe(gulp.dest(config.markup.dist));
    }

    return gulp.src(config.markup.src)
      .pipe($.cached("jade"))
      .pipe($.progeny())
      .pipe($.ignore.exclude(config.markup.excluded))
      .pipe($.data(getData))
      .pipe($.jade())
      .on("error", handleErrors)
      .pipe(gulp.dest(config.markup.build))
      .pipe($.filter("**/*.html"))
      .pipe(browserSync.reload({stream: true, once:true}));

  });
};