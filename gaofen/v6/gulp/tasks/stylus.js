// ==============================
// 任务描述：编译stylus文件
// ==============================

var nib = require("nib"),
    handleErrors = require('../utilities/handleErrors'),
    browserSync = require("browser-sync");

module.exports = function (gulp, opts, config, $) {
  gulp.task("stylus", function () {
    if(opts.p) {
      // 生产环境
      return gulp.src(config.stylus.src)
      .pipe($.ignore.exclude(config.stylus.excluded))
      .pipe($.stylus({
        use: [
          nib()
        ]
      }))
      .on("error", handleErrors)
      .pipe($.autoprefixer())
      .pipe(gulp.dest(config.stylus.dist))
      .pipe($.csso())
      .pipe($.rename({suffix: '.min'}))
      .pipe(gulp.dest(config.stylus.dist))
    }

    return gulp.src(config.stylus.src)
      .pipe($.cached("stylus"))
      .pipe($.progeny())
      .pipe($.ignore.exclude(config.stylus.excluded))
      .pipe($.sourcemaps.init({debug: true}))
      .pipe($.stylus({
        use: [
          nib()
        ],
        sourcemap: true
      }))
      .on("error", handleErrors)
      .pipe($.autoprefixer())
      .pipe($.sourcemaps.write("."))
      .pipe(gulp.dest(config.stylus.build))
      .pipe($.filter("**/*.css"))
      .pipe(browserSync.reload({stream: true, once:true}));
  });
};