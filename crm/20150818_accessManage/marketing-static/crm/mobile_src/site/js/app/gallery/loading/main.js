define(function(require,exports,module) {
	var $ = require('zepto');
	var Mask = require('../mask/main');
	var win = $(window);

	var Loading = function (options) {
		this.settings = $.extend({}, Loading.defaults, options);
		this.init();
  };

  Loading.defaults = {
  	content: '加载中...',
  	zIndex:9999,
  	clock:true
  }

	Loading.prototype = {
		init: function(){
			this.render();
			this.position();
			this.resize();
			this.show();
		},
		position: function () {
	    var _this = this,
	        winWidth = win.width(),
	        winHeight = win.height(),
	        scrollTop = win.scrollTop();
      this.loading.css({
    		left:(winWidth - _this.loading.width()) / 2,
    		top:(winHeight - _this.loading.height()) / 2 + scrollTop
      });
		},
		resize: function(){
			var self = this;
			win.on('resize',function(){
				self.position();
			});
		},
		render:function(){
			var tpl = require('text!./load.tpl');
			require('css!./style.css');
			var body = document.getElementsByTagName('body');
			var div = document.createElement("div");
			div.style.zIndex = this.settings.zIndex++;
			this.loading = $(div);
			this.loading.addClass('ui-loading');
			this.loading.html(tpl);
			this.loading.prependTo('body');
		},
		show:function(){
			if(this.settings.clock){
				if(!this.mask){
					this.mask = Mask();
				}else{
					this.mask.show();	
				}			
			}
			this.loading.show();
		},
		close: function(){
			if(this.settings.clock){
				this.mask.close();
			}
			this.loading.hide();
		},
		destory:function(){
			if(this.settings.clock){
				this.mask.destory();
			}
			this.loading.remove();
		}
	}
	var _loading  = function (options) {
	  return new Loading(options);
  }
	return _loading;
});