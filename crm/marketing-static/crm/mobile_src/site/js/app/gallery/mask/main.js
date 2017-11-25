define(function(require,exports,module) {
	var $ = require('zepto');
	
	var Mask = function (options) {
		this.settings = $.extend({}, Mask.defaults, options);
		this.init();
  };

  Mask.defaults = {
  	zIndex:8888,
  	className:'ui-mask',
  	opacity:'0.5',
  	background:'#000'
  }

	Mask.prototype = {
		init: function(){
			this.render();
		},
		render:function(){
			require('css!./style.css');
			this.mask = $('<div>').addClass(this.settings.className)
			.css({
				zIndex: this.settings.zIndex,
				opacity: this.settings.opacity,
				background: this.settings.background
			});
      this.mask.appendTo('body');
		},
		show:function(){
			this.mask.show();
		},
		close:function(){
			this.mask.hide();
		},
		destory:function(){
			this.mask.remove();
		}
	}
	var _mask  = function (options) {
	  return new Mask(options);
  }
	return _mask;
});