define(function(require,exports,module) {
	var $ = require('zepto');
	var Storage = require('../storage/storage');

	var Nav = function(options){
		this.settings = $.extend(Nav.defaults, options);
	};

	Nav.defaults = {
		//nav会被插入到此选择器选中的目标元素最前面
		selector:'.viewport',
		//自定义样式名
		className:'',
		//nav的id标识符
		id:'navbar',
		title : '页面标题',
		prev : {
			text:'',
			id:'J_prev'
		},
		op : {
			text:'',
			id:'J_op'
		}
	};

	Nav.prototype = {
		init:function(){
			this.render();
		},
		render:function(){
			var templates = '',
					_nav_templates = Storage.getItem('_nav_templates');
			if(_nav_templates!=undefined){
				templates = _nav_templates;
			}else{
				templates = require('text!./nav.tpl');
				Storage.setItem('_nav_templates',templates);	
			}
			templates = templates.replace(/\{prev\}/,this.settings.prev.text)
			.replace(/\{prev_id\}/,this.settings.prev.id)
			.replace(/\{title\}/,this.settings.title)
			.replace(/\{op\}/,this.settings.op.text)
			.replace(/\{op_id\}/,this.settings.op.id)
			.replace(/\{class\}/,this.settings.className)
			.replace(/\{id\}/,this.settings.id);
			var parent = $(this.settings.selector);
			$(templates).prependTo(parent);
		}
	}


	module.exports = Nav;
});