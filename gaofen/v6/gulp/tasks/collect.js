// ==============================
// 任务描述：收集全部页面信息
// ==============================

var fm = require('front-matter'),
    getPath = require('../utilities/getPath');

module.exports = function (gulp, opts, config, $) {
  gulp.task('collect', function() {
    global.collection = [];

    return gulp.src(config.markup.src)
    .pipe($.ignore.exclude(config.markup.excluded))
    .pipe($.data(function (file) {
      var content = fm(String(file.contents));
          page = {};

      file.contents = new Buffer(content.body);

      page.title = content.attributes.page_title;
      page.is_new = content.attributes.is_new;
      page.url = getPath(file);
      global.collection.push(page);

    }));

  });
};