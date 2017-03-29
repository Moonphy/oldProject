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
    gulp.task('spriteSet', function () {

        var spriteSet = gulp.src('./src/assets/img/set/**/*')
            .on("error", handleErrors)
            .pipe(spritesmith({
                imgName: '../img/spriteSet.png',
                cssName: '_spriteSet.styl',
                cssFormat: 'stylus',
                algorithm: 'binary-tree',
                padding: 20
                //cssTemplate: './src/assets/stylus/partials/template-mustache',
                /*cssVarMap: function(sprite) {
                 sprite.name = 's-' + sprite.name
                 }*/
            }));
        spriteSet.img.pipe(gulp.dest(config.sprite.build));
        spriteSet.css.pipe(gulp.dest('./src/assets/css/partials'));
    });
};