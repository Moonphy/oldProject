/**
 * Created by Administrator on 2016-3-21.
 * 任务描述：构建雪碧图.
 */
var handleErrors = require('../utilities/handleErrors'),
    gutil = require('gulp-util'),
    spritesmith = require('gulp.spritesmith');

function getDate(format){
    return  gutil.date( format|| "yyyy-mm-dd");
}

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
                //cssTemplate: './src/assets/stylus/partials/template-mustache',
                /*cssVarMap: function(sprite) {
                    sprite.name = 's-' + sprite.name
                }*/
            }));
        spriteData.img.pipe(gulp.dest(config.sprite.build));
        spriteData.css.pipe(gulp.dest('./src/assets/css/partials'));
    });
};