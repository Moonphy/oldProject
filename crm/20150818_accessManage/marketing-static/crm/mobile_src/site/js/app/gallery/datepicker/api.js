/**
	detepicker
**/
define(function(require,exports,module) {
	module.exports = {
		init:function($){
			require('./core')($);
			require('./scroller')($);
			require('./datetime')($);
			require('./i18n-zh')($);
			require('./select')($);
		}
	}
});