/*
 * 不同livereload端口设置
 * connect livereload端口设置不同的值
 * watch 下的livrereload 与其一一对应
 *
 */
module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);//自动加载grunt任务
    //初始化配置
    grunt.initConfig({

        bower: {
            dev: {
                options:{
                    targetDir:'site/js/lib'
                }
            },
            env:{
                options:{
                    targetDir:'dist/js/lib'
                }
            }
        },
        //grunt-contrib-watch配置
        watch: {
            //demo为定义监测任务的名字
            dev: {
                files: ['site/**/*.*'],
                options: {
                    livereload: 5000
                }
            },
            env: {
                files: ['dist/**/*.*'],
                options: {
                    livereload: 5000
                }
            }
        },
        //grunt-contrib-connect配置
        connect: {
            dev: {
                options: {
                    base: "site",
                    port: 1111,
                    hostname: '*',
                    livereload: 5000,
                    open: {
                        target: 'http://crm.com:1111/login.html'
                    }
                }
            },
            env: {
                options: {
                    base: "dist",
                    port: 2222,
                    hostname: '*',
                    livereload: 5000,
                    open: {
                        target: 'http://crm.com:2222/login.html'
                    }
                }
            }
        }
    });
    grunt.registerTask('default', ['bower:dev']);//注册任务到grunt
    grunt.registerTask('env', ['bower:env','connect:env', 'watch:env']);//注册任务到grunt
    grunt.registerTask('dev', ['bower:dev','connect:dev', 'watch:dev']);//注册任务到grunt
};
