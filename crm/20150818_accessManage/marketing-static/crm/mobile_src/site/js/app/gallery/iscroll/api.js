define(function(require,exports,module) {
	var Plus = require('./plus');

	var Scroll = function(options){
		this.settings = $.extend({}, Scroll.defaults, options);
		this.scroll = null;
	}

	Scroll.defaults = {
		id:'#wrapper',
		pullupAction: null,
  	pulldownAction: null
	}

	Scroll.prototype = {
		initialize:function(){
			this.scroll = Plus.newVerScrollForPull(
				this.settings.id,
				this.settings.pulldownAction,
				this.settings.pullupAction
			);
			this.scroll.refresh();
		}
	}

	module.exports = Scroll;

});