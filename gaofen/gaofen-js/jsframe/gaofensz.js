/*!
 * 深圳站
 * 列表方式加载便于开发模式下调试脚本。
 */
(function(list){
	// 是否打开调试模式
	__debug = true;

    var s = [],
		//filePath = 'http://file.gaofen.com/html/v5/jsframe',
		filePath = 'http://dev.myweb.com',
        //加载的js文件列表
        list = [
			'jquery.js',
			'base/util.js',
			'base/ui.base.js',
			'sz/ui.template.js',
			'base/ui.box.js',
			'base/ui.validation.js',
			'base/ui.contextmgr.js',
			'base/ajax.js',
			'base/clickevent.js',
			'base/listener.js',
			'base/jqext.js',
			'sz/component.js',
			'sz/clicker.js',
			'compatible.js',
			'sz/ready.js'
        ];

    var v = '1.0';
    for(var i=0,len=list.length;i<len;i++){
		var path = filePath+'/'+list[i];
        s.push('<script charset="utf-8" type="text/javascript" src="'+path+'?v='+v+'"></script>');
    }
    document.write(s.join(''));
})();

