// ==============================
// 任务描述：生成集合页面
// ==============================

var browserSync = require("browser-sync"),
    handleErrors = require('../utilities/handleErrors');

module.exports = function (gulp, opts, config, $) {
  gulp.task('generate', ['collect'], function() {

    if(opts.p) {
      gulp.src(config.collection.src)
        .pipe($.jade({
          data: global.collection,
          pretty: true
        }))
        .on("error", handleErrors)
        .pipe(gulp.dest(config.collection.dist));
    }

    gulp.src(config.paths.src + '/index.jade')
      .pipe($.jade({
        data: global.collection
      }))
      .on("error", handleErrors)
      .pipe(gulp.dest(config.collection.build))
      .pipe($.filter("**/*.html"))
      .pipe(browserSync.reload({stream: true, once:true}));
  });
};