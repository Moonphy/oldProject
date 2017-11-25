/**定义一套获取问题类型的图标api**/
define(function(require,exports,module) {

	var $icon = {
	    "1":"&#xe63c;",//pc
	    "2":"&#xe903;",//ios
	    "3":"&#xe902;",//android
	    "4":"&#xe680;",//微信
	    "5":"&#xe63e;"//other
	};

	module.exports = {
		get : function (id) {
	    return $icon[''+id+''];
		}
	};

});