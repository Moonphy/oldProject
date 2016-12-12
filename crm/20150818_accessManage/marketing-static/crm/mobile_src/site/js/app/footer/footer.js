define(function(require,exports,module) {
	var $ = require('zepto');
	var Storage = require('../storage/storage');

	var Footer = function(options){
		this.settings = $.extend({}, Footer.defaults, options);
	};

	Footer.defaults = {
		//nav会被插入到此选择器选中的目标元素最后面
		selector:'.viewport',
		//自定义样式名
		className:'',
		//列表样式
		listClassName:'menu',
		//nav的id标识符
		id:'navbar',
		//强制选中图标的下标，从0开始计算
		activeIdx:null,
		//超链接host
		get host(){
			var origin = window.location.origin;
			if(origin.indexOf('crm.qipeipu.com')!='-1' || origin.indexOf('test.crm.qipeipu.net')!='-1'){
				return origin+'/mobile';	
			}else if(origin.indexOf('crm.com')!='-1'){
				if(origin.indexOf(':8000')!='-1')
					return origin+'/site';
				else if(origin.indexOf(':2222')!='-1' || origin.indexOf(':1111')!='-1')
					return origin;
			}
		}
	};

	Footer.prototype = {
		init:function(){
			this.render();
		},
		render:function(){
			var templates = require('text!./footer.tpl');
			templates = templates.replace(/\{host\}/g,this.settings.host)
			.replace(/\{class\}/,this.settings.className)
			.replace(/\{listClass\}/,this.settings.listClassName)
			.replace(/\{id\}/,this.settings.id);
			var parent = $(this.settings.selector);
			templates = $(templates);
			var activeIdx = this.settings.activeIdx;
			$.each(templates.find('.item'),function(idx,item){
				var self = $(item);
				if(activeIdx!=undefined && activeIdx!='' && activeIdx!=null){
					if(idx==activeIdx){
						self.addClass('active');
					}else{
						self.addClass('wd');
					}
				}else{
					var link = self.find('a');
					if(link.attr('href')==location.href){
						self.addClass('active');
					}else{
						self.addClass('wd');
					}
				}
			});
			templates.appendTo(parent);
		}
	}

	module.exports = Footer;
});
