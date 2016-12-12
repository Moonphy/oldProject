define(function(require,exports,module){
	var base = require('../base/index');
	var $ = base.$;
	
	
	$(window).scroll( function() {
    var top = $(this).scrollTop();
    if (top >= 25){
        $("#J_nav").css({"position":"fixed","z-index":"10","left":"0",top:"0","padding-left":"25%"});
        $('#J_content').css({"position":"relative","top":"30px"});
    }
    else{
        $("#J_nav").css({"position":"static","padding-left":"0"});
        $('#J_content').css({"position":"static","top":"0px"});
    }
	});

	var J_nav = $('#J_nav'),
			J_left = $('#J_left'),
			J_content = $('#J_content');

	$(J_content).scroll(function(){
		var self = $(this);
		var self_left = $(this).scrollLeft();
		var self_top = $(this).scrollTop();
		J_nav.scrollLeft(self_left);
		J_left.scrollTop(self_top);
		console.log(self_top,J_left.scrollTop());
	});

	$(J_left).scroll(function(){
		var self = $(this);
		var self_top = $(this).scrollTop();
		J_content.scrollTop(self_top);
	});

	$(J_nav).scroll(function(){
		var self = $(this);
		var self_left = $(this).scrollLeft();
		J_content.scrollLeft(self_left);
	});

	var contentVal = $('#contentval');
	for (var i = 100 - 1; i >= 0; i--) {
		var tmp = ['<tr>'
                      ,'<td>中国银行</td>'
                      ,'<td>中国银行</td>'
                      ,'<td>中国银行</td>'
                      ,'<td>中国银行</td>'
                      ,'<td>中国银行</td>'
                  ,'</tr>'].join('');
		contentVal.append(tmp);
	}

	var leftVal = $('#leftval');
	for (var i = 100 - 1; i >= 0; i--) {
		leftVal.append('<li class="item">农业银行</li>');
	}

	base.pageLoaded();

	module.exports = {};
});