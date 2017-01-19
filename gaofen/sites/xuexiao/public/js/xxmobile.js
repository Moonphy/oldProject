/*!
 * xuexiao 学校初中库mobile
 * 列表方式加载便于开发模式下调试脚本。
 */
(function(list){
	// 是否打开调试模式
	__debug = true;

    var s = [],
		 filePath = 'http://dev.xuexiao.gaofen.com/public/js',
		//filePath = '/public/xuexiao/js',
        //加载的js文件列表
        list = [
			'gmu/zepto.min.js',
			//'gmu/gmu.min.js',  //暂时没有用到
			'xxmobile-source.js'
        ];

    var v = '1.0';
	//异步模式加载脚本需要
    for(var i=0,len=list.length;i<len;i++){
		var path = filePath+'/'+list[i];
        var oScript = document.createElement("script");
		oScript.type = "text/javascript";
        oScript.src = path+'?v='+v;
        s.push('<script charset="utf-8" type="text/javascript" src="'+path+'?v='+v+'"></script>');
    }

	document.write(s.join(''));
    
})();

