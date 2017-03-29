/**
 * Created by Administrator on 2016-3-21.
 * 任务描述：构建雪碧图.
 */
var handleErrors = require('../utilities/handleErrors'),
    gutil = require('gulp-util'),
    spritesmith = require('gulp.spritesmith');

var merge = require('merge-stream');

module.exports = function (gulp, opts, config, $) {
    gulp.task('sprite', function () {

        var spriteData = gulp.src(config.sprite.src)
            .on("error", handleErrors)
            .pipe(spritesmith({
                imgName: '../img/sprite.png',
                cssName: '_sprite.styl',
                cssFormat: 'stylus',
                algorithm: 'binary-tree',
                padding: 20
            }));
        spriteData.img.pipe(gulp.dest(config.sprite.build));
        spriteData.css.pipe(gulp.dest('./src/assets/css/partials'));

        var spriteSet = gulp.src('./src/assets/img/set/**/*')
            .on("error", handleErrors)
            .pipe(spritesmith({
                imgName: '../img/spriteSet.png',
                cssName: '_spriteSet.styl',
                cssFormat: 'stylus',
                algorithm: 'binary-tree',
                cssSpritesheetName :'set',
                padding: 20
            }));
        spriteSet.img.pipe(gulp.dest(config.sprite.build));
        spriteSet.css.pipe(gulp.dest('./src/assets/css/partials'));

        return merge(spriteData, spriteSet)
    });
};