define(function(require,exports,module) {
	var Base = require('../../../../base/index');
	var $ = Base.$;
	var Nav = require('../../../../nav/nav');
    var Icon = require('../../../problem/icon');
	var nav = new Nav({
    prev:{
      id:'J_prev',
      text:'<i class="icon iconfont">&#xe61f;</i>问题反馈'
    },
		title:'问题详情'
	});
	nav.init();

	$(function(){
    var query = Base.utils.mapQuery(window.location.search);
    $.ajax({
        url:'/wx/platFormQuestion/find',
        data:'feedBackID='+ query.id,
        success: function (data) {
            Base.state.check(data, function (model) {
                if(!model) model = [];
                if(model.length>0){
                    model = model[0];
                    $('#type .text').text(model.platTypeName);
                    $('#desc .text').text(model.content);
                    $('.J_icon_type').html(Icon.get(model.platTypeID));
                    Base.pageLoaded();
                }
            })
        }
    });
    $('#J_prev').on("click", function () {
        history.back();
    });
	});
});