// ==============================
// ����������ѹ��ͼƬ�ļ�
// ==============================

var browserSync = require("browser-sync"),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cached'),
    handleErrors = require('../utilities/handleErrors');

module.exports = function (gulp, opts, config, $) {
    gulp.task('images', function () {

        if(opts.p){
            return gulp.src(config.images.src)
                .pipe(cache(imagemin({optimizationLevel: 5, progressive: true, interlaced: true})))
                .on("error", handleErrors)
                .pipe(gulp.dest(config.images.dist));
                //.pipe($.notify({message: 'images task complete'}));
        }

        return gulp.src(config.images.src)
            .pipe(cache(imagemin({optimizationLevel: 5, progressive: true, interlaced: true})))
            .on("error", handleErrors)
            .pipe(gulp.dest(config.images.build));
            //.pipe($.notify({message: 'images task complete'}));
    });
};