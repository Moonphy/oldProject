/***
 * 此文件为quick配置文件
 */
var debug = true;

if(debug){
	module.exports = function(quick){
		var basePath = process.cwd();
		quick.initConfig({
			//日志目录
			logFileFolder:basePath+"/_logs",
			//静态资源配置
			serve:{
				port:2500,
				mine : {//mine类型
					"html": "text/html",
					"tpl": "text/javascript"
				},
				rules : function(pathname,ext){
					return (pathname.indexOf('modules_src/') != -1 || pathname.indexOf('gallery_src/') != -1) && (ext == 'js' || ext == 'tpl');
				},
				transfer:{
					tpl:function(content){
						return this.js("return '"+content.replace(/\s/g,' ')+"'");
					}
				}
			}
		});
	};
}else{
	module.exports = function(quick){
		quick.initConfig({
			//静态资源配置
			serve:{
				port:5000,
				mine : {//mine类型
					"html": "text/html",
					"tpl": "text/plain"
				}
			}
		});
	};
}