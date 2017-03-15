##################################################
# 任务描述：编译 stylus 文件
##################################################

nib = require('nib')
bootstrap = require('bootstrap-styl')

handleErrors = require('../utilities/handleErrors')
browserSync = require('browser-sync')

module.exports = (gulp, opts, config, $) ->
  gulp.task 'stylus', ->
    gulp.src config.stylus.src
      .pipe if opts.p then $.util.noop() else $.cached 'stylus', optimizeMemory: true
      .pipe if opts.p then $.util.noop() else $.progeny()
      .pipe $.ignore.exclude config.stylus.excluded
      .pipe $.plumber errorHandler: handleErrors
      .pipe if opts.p then $.util.noop() else $.sourcemaps.init debug: true
      .pipe $.header '/*! Generated at <%= date %> */\n', date: $.util.date("HH:MM dd-mm-yyyy")
      .pipe if opts.p then $.stylus use: [nib(), bootstrap()] else $.stylus use: [nib(), bootstrap()], sourcemap: true
      .pipe $.autoprefixer()
      .pipe if opts.p then $.util.noop() else $.sourcemaps.write '.'
      .pipe gulp.dest if opts.p then config.stylus.dist else config.stylus.public
      .pipe if opts.p then $.util.noop() else $.filter '**/*.css'
      .pipe if opts.p then $.util.noop() else browserSync.reload stream: true, once: true