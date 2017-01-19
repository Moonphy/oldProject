'use strict';
/**
 * gulpjs
 *
 */

(function(){

	var gulp = require('gulp'),
		gutil = require('gulp-util'),
		uglify = require('gulp-uglify'),
		//clipboard = require('gulp-clipboard'),
		rename = require('gulp-rename'),
		concat = require('gulp-concat'),
		clean = require('gulp-clean'),
		watch = require('gulp-watch'),
		connect = require('gulp-connect'),
		app = require('./package.json'),
		header = require('gulp-header'),
		
	// ¶¨Òå±äÁ¿	
		appInfo = {    
		  src: './jsframe',
		  base: './jsframe/base',
		  main: './jsframe/main',
		  sz: './jsframe/sz',
		  dist: './js'
		};

	/*
	gulp.task('concat', function () {
		gulp.src('./temp/src/*.js')
			.pipe(uglify())
			.pipe(concat('all.min.js'))
			.pipe(gulp.dest('./temp/dist'));
	});

	gulp.task('default', ['concat']);
	*/
	
	function getDate(format){
		return  gutil.date( format|| "dd-mm-yyyy HH:MM");
	}
	
	
	//Ê¹ÓÃconnectÆô¶¯Ò»¸öWeb·þÎñÆ÷
	gulp.task('serve', function () {
	  connect.server({
		root: './jsframe',
		port: 9000,
		livereload: true
	  });
	});
	
	
	gulp.task('htmlWatch', function () {    // ÕâÀïµÄwatch£¬ÊÇ×Ô¶¨ÒåµÄ£¬Ð´³Élive»òÕß±ðµÄÒ²ÐÐ
		//¼àÌýÄ³ÎÄ¼þÖ´ÐÐºóÃæµÄÈÎÎñ
		gulp.watch(['./jsframe/*.html'], ['html']);	
	});

	gulp.task('pageReload', function () {
	  gulp.src('./*.html')
		.pipe(connect.reload());
	});
	
	
	/*----watchµÄÁ½ÖÖ·½Ê½------*/
	
	gulp.task('csw', function () {    // ÕâÀïµÄwatch£¬ÊÇ×Ô¶¨ÒåµÄ£¬Ð´³Élive»òÕß±ðµÄÒ²ÐÐ
		//¼àÌýÄ³ÎÄ¼þÖ´ÐÐºóÃæµÄÈÎÎñ
		gulp.watch([appInfo.src+'/compatible.js',appInfo.src+'/common-source.js'], ['cs']);	
	});
	
	gulp.task('watch', function(){

	   gulp.src([appInfo.src+'/compatible.js',appInfo.src+'/common-source.js'])
		.pipe(watch(function(files) {
			return gulp.run('cs');
		}));
	
	   //gulp.src('./temp/src/test.js')
		//	.pipe(watch(function(files) {
		//		return gulp.run('clipboardtask');
		//	}));

	});
	/*----watchµÄÁ½ÖÖ·½Ê½½áÊø------*/
	
	
	//Ñ¹ËõºÏ²¢ÎÄ¼þ
	//Ö÷Õ¾js
	gulp.task('main', function(cb){
		return gulp.src([			
				appInfo.dist+'/jquery.js', 
				appInfo.base+'/util.js',
				appInfo.base+'/ui.base.js',
				appInfo.main+'/ui.template.js',
				appInfo.base+'/ui.box.js',
				appInfo.base+'/ui.validation.js',
				appInfo.base+'ui.contextmgr.js',
				appInfo.base+'/ajax.js',
				appInfo.base+'/clickevent.js',
				appInfo.base+'/listener.js',
				appInfo.base+'/jqext.js',
				appInfo.main+'/component.js',
				appInfo.main+'/clicker.js',
				appInfo.src+'/compatible.js',
				appInfo.main+'/ready.js'				
				])
			.pipe(uglify())
			.pipe(concat('gaofen.js'))
			.pipe(header('/*!<%= date %> <%= name %> */\n', {
				name : app.name,
				date : getDate()
			}))
			.pipe(gulp.dest('./js'));
	});
	//ÉîÛÚÕ¾js
	gulp.task('sz', function(cb){
		return gulp.src([			
				appInfo.dist+'/jquery.js', 
				appInfo.base+'/util.js',
				appInfo.base+'/ui.base.js',
				appInfo.sz+'/ui.template.js',
				appInfo.base+'/ui.box.js',
				appInfo.base+'/ui.validation.js',
				appInfo.base+'/ui.contextmgr.js',
				appInfo.base+'/ajax.js',
				appInfo.base+'/clickevent.js',
				appInfo.base+'/listener.js',
				appInfo.base+'/jqext.js',
				appInfo.sz+'/component.js',
				appInfo.sz+'/clicker.js',
				appInfo.src+'/compatible.js',  //Ö»ÓÃµ½¸¡¶¯¹ã¸æ
				appInfo.sz+'/ready.js'				
				])
			.pipe(uglify())
			.pipe(concat('gaofensz.js'))
			.pipe(header('/*!<%= date %> <%= name %> */\n', {
				name : app.name,
				date : getDate()
			}))
			.pipe(gulp.dest('./js'));
	});

	//select_menu
	gulp.task('menu', function () {
		return gulp.src([appInfo.dist+'/select_menu-source.js'])
		//.pipe(rename({basename: '',prefix: 'common', suffix : ''}))
		.pipe(uglify())
		.pipe(concat('select_menu.js'))
		.pipe(header('/*!<%= date %> <%= name %> */\n', {
			name : app.name,
			date : getDate()
		}))
		.pipe(gulp.dest('./js'));			
	});
	
	//Ö÷Õ¾¾É°æjs
	gulp.task('common', function () {
		return gulp.src([appInfo.src+'/common-source.js', appInfo.src+'/compatible.js'])
		//.pipe(rename({basename: '',prefix: 'common', suffix : ''}))
		.pipe(uglify())
		.pipe(concat('common.js'))
		.pipe(header('/*!<%= date %> <%= name %> */\n', {
			name : app.name,
			date : getDate()
		}))
		.pipe(gulp.dest('./js'));			
	});
	
		//Ö÷Õ¾¾É°æjs
	gulp.task('cs', function () {
		return gulp.src([appInfo.src+'/common-source.js', appInfo.src+'/compatible.js'])
		//.pipe(rename({basename: '',prefix: 'common', suffix : ''}))
		//.pipe(uglify())
		.pipe(concat('common-source.js'))
		.pipe(header('/*!<%= date %> <%= name %> */\n', {
			name : app.name,
			date : getDate()
		}))
		.pipe(gulp.dest('./js'));			
	});

	//xuexiao-cz front(初中)
	gulp.task('xuexiaocz', function () {
		app.name = 'xuexiaocz-js';
		gulp.src([appInfo.dist+'/jquery.js','../xuexiao/public/js/base.js','../xuexiao/public/js/frontbase.js', appInfo.src+'/compatible.js', '../xuexiao/public/js/czfront.js'])
		
		.pipe(uglify())
		.pipe(concat('xuexiaocz.js'))
		.pipe(header('/*!<%= date %> <%= name %> */\n', {
			name : app.name,
			date : getDate()
		}))
		.pipe(rename({basename: '',prefix: 'xuexiaocz.min', suffix : ''}))
		.pipe(gulp.dest('./js'))

		//.pipe(rename({basename: '',prefix: 'xuexiao.min', suffix : ''}))
		.pipe(gulp.dest('../xuexiao/public/js/'));
  		//.pipe(copy('../xuexiao/public/js/', ''));		
	});

	//xuexiao-gz front(高中)
	gulp.task('xuexiaogz', function () {
		app.name = 'xuexiaogz-js';
		gulp.src([appInfo.dist+'/jquery.js','../xuexiao/public/js/base.js','../xuexiao/public/js/frontbase.js', appInfo.src+'/compatible.js', '../xuexiao/public/js/gzfront.js'])
		
		.pipe(uglify())
		.pipe(concat('xuexiaogz.js'))
		.pipe(header('/*!<%= date %> <%= name %> */\n', {
			name : app.name,
			date : getDate()
		}))
		.pipe(rename({basename: '',prefix: 'xuexiaogz.min', suffix : ''}))
		.pipe(gulp.dest('./js'))

		//.pipe(rename({basename: '',prefix: 'xuexiao.min', suffix : ''}))
		.pipe(gulp.dest('../xuexiao/public/js/'));
  		//.pipe(copy('../xuexiao/public/js/', ''));		
	});

	gulp.task('xuexiao', function(){
		gulp.run('xuexiaocz');
		gulp.run('xuexiaogz');
	})

	//xuexiao mobile
	gulp.task('xuexiaomobi', function () {
		app.name = 'xuexiaomobile-js';
		gulp.src(['../xuexiao/public/js/gmu/zepto.min.js', '../xuexiao/public/js/xxmobile-source.js'])
		
		.pipe(uglify())
		.pipe(concat('xuexiaomobi.js'))
		.pipe(header('/*!<%= date %> <%= name %> */\n', {
			name : app.name,
			date : getDate()
		}))
		.pipe(rename({basename: '',prefix: 'xuexiaomobi.min', suffix : ''}))
		.pipe(gulp.dest('./js'))
		.pipe(gulp.dest('../xuexiao/public/js/')); 		
	});

	//xuexiao 选师
	gulp.task('teacher', function () {
		app.name = 'teacher-js';
		gulp.src(['../teacher/entrance/student/public/js/gmu/zepto.min.js', '../teacher/entrance/student/public/js/base.js', '../teacher/entrance/student/public/js/teacherfront.js'])
		
		.pipe(uglify())
		.pipe(concat('zy-teacher.js'))
		.pipe(header('/*!<%= date %> <%= name %> */\n', {
			name : app.name,
			date : getDate()
		}))
		.pipe(rename({basename: '',prefix: 'zy-teacher.min', suffix : ''}))
		.pipe(gulp.dest('./js'));	


		app.name = 'workonline-js';
		gulp.src(['../teacher/entrance/student/public/js/gmu/zepto.min.js', '../teacher/entrance/student/public/js/base.js', '../teacher/entrance/student/public/js/workonline-source.js'])
		
		.pipe(uglify())
		.pipe(concat('zy-workonline.js'))
		.pipe(header('/*!<%= date %> <%= name %> */\n', {
			name : app.name,
			date : getDate()
		}))
		.pipe(rename({basename: '',prefix: 'zy-workonline.min', suffix : ''}))
		.pipe(gulp.dest('./js'));		
	});

	//xuexiao 资讯
	gulp.task('mobile', function () {
		app.name = 'mobile-js';
		gulp.src(['../xuexiao/public/js/gmu/zepto.min.js', '../xuexiao/public/js/base.js', '../xuexiao/public/js/mobilefront.js'])
		
		.pipe(uglify())
		.pipe(concat('mobileconcat.js'))
		.pipe(header('/*!<%= date %> <%= name %> */\n', {
			name : app.name,
			date : getDate()
		}))
		.pipe(rename({basename: '',prefix: 'mobile.min', suffix : ''}))
		.pipe(gulp.dest('./js'))
		.pipe(gulp.dest('../xuexiao/public/js/')); 		
	});

	//baike-mobile-js 百科移动版js
	gulp.task('baikemobi', function () {
		app.name = 'baike-mobile-js';
		gulp.src(['../baike/public/js/gmu/gfgmu.min.js', '../baike/public/js/common.js'])
		
		.pipe(uglify())
		.pipe(concat('baikemobi.js'))
		.pipe(header('/*!<%= date %> <%= name %> */\n', {
			name : app.name,
			date : getDate()
		}))
		.pipe(rename({basename: '',prefix: 'baikemobi.min', suffix : ''}))
		.pipe(gulp.dest('./js'))
		.pipe(gulp.dest('../baike/public/js/')); 		
	});


		//huodong-record-js 录音活动js
	gulp.task('huodong-record', function () {
		app.name = 'record-js';
		gulp.src(['../xuexiao/public/js/gmu/zepto.min.js', '../xuexiao/public/js/base.js', '../xuexiao/public/js/weixin/record-source.js'])
		
		.pipe(uglify())
		.pipe(concat('huodong-record.js'))
		.pipe(header('/*!<%= date %> <%= name %> */\n', {
			name : app.name,
			date : getDate()
		}))
		.pipe(rename({basename: '',prefix: 'huodong-record.min', suffix : ''}))
		.pipe(gulp.dest('./js'))
		.pipe(gulp.dest('../xuexiao/public/js/weixin/')); 		
	});


	//huodong-record-js 录音活动js
	gulp.task('match-js', function () {
		app.name = 'matchjs';
		gulp.src(['../xuexiao/public/js/gmu/zepto.min.js', '../xuexiao/public/js/base.js','../xuexiao/public/js/html5upload.js', '../xuexiao/public/js/weixin/fireworks.js', '../xuexiao/public/js/weixin/wxinit.js', '../xuexiao/public/js/weixin/match-source.js'])
		
		.pipe(uglify())
		.pipe(concat('huodong-match.js'))
		.pipe(header('/*!<%= date %> <%= name %> */\n', {
			name : app.name,
			date : getDate()
		}))
		.pipe(rename({basename: '',prefix: 'huodong-match.min', suffix : ''}))
		.pipe(gulp.dest('./js'))
		.pipe(gulp.dest('../xuexiao/public/js/weixin/')); 		
	});


	//weixin-js weixin-init
	gulp.task('weixin-js', function () {
		app.name = 'weixin-config-js';
		gulp.src('../xuexiao/public/js/weixin/wxinit.js')
		
		.pipe(uglify())
		.pipe(concat('weixin-init.js'))
		.pipe(header('/*!<%= date %> <%= name %> */\n', {
			name : app.name,
			date : getDate()
		}))
		.pipe(rename({basename: '',prefix: 'weixin-init.min', suffix : ''}))
		.pipe(gulp.dest('./js')); 		
	});

	//huodong-nycard-js 录音活动js
	gulp.task('huodong-nycard', function () {
		app.name = 'nycard-js';
		gulp.src(['../xuexiao/public/js/gmu/zepto.min.js', '../xuexiao/public/js/base.js', '../xuexiao/public/js/weixin/wxinit.js', '../xuexiao/public/js/weixin/nycard-source.js'])
		.pipe(uglify())
		.pipe(concat('huodong-nycard.js'))
		.pipe(header('/*!<%= date %> <%= name %> */\n', {
			name : app.name,
			date : getDate()
		}))
		.pipe(rename({basename: '',prefix: 'huodong-nycard.min', suffix : ''}))
		.pipe(gulp.dest('./js'))
		// .pipe(gulp.dest('../xuexiao/public/js/weixin/')); 		
	});

	// star outlook 
	gulp.task('staroutlook', function () {
		app.name = 'staroutlook-js';
		gulp.src(['../xuexiao/public/js/gmu/zepto.min.js', '../xuexiao/public/js/base.js', '../xuexiao/public/js/weixin/wxinit.js', '../xuexiao/public/js/weixin/staroutlook-source.js'])
		.pipe(uglify())
		.pipe(concat('huodong-staroutlook.js'))
		.pipe(header('/*!<%= date %> <%= name %> */\n', {
			name : app.name,
			date : getDate()
		}))
		.pipe(rename({basename: '',prefix: 'huodong-staroutlook.min', suffix : ''}))
		.pipe(gulp.dest('./js'))
		// .pipe(gulp.dest('../xuexiao/public/js/weixin/')); 		
	});




	//wxzhongkao-js 中考活动js
	gulp.task('wxzhongkao', function () {
		app.name = 'wxzhongkao-js';
		gulp.src(['../xuexiao/public/js/vue/vue.min.js', '../xuexiao/public/js/vue/vuebase.js', '../xuexiao/public/js/weixin/wxinit.js', '../xuexiao/public/js/weixin/wxzhongkao-source.js'])
		.pipe(uglify())
		.pipe(concat('wxzhongkao.js'))
		.pipe(header('/*!<%= date %> <%= name %> */\n', {
			name : app.name,
			date : getDate()
		}))
		.pipe(rename({basename: '',prefix: 'wxzhongkao.min', suffix : ''}))
		.pipe(gulp.dest('./js'))
		// .pipe(gulp.dest('../xuexiao/public/js/weixin/')); 		
	});

	gulp.task('all', ['common', 'main', 'sz', 'xuexiaocz', 'xuexiaogz']);

})();
