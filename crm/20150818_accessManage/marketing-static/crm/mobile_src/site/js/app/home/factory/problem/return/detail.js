define(function(require,exports,module) {
	var Base = require('../../../../base/index');
	var $ = Base.$;
	var Nav = require('../../../../nav/nav');
    var Icon = require('../../../problem/icon');
	var nav = new Nav({
    prev:{
      id:'J_prev',
      text:'<i class="icon iconfont">&#xe61f;</i>退货问题'
    },
		title:'问题详情'
	});
	nav.init();

	$(function(){
    $.ajax({
      url:'/wx/returnGoodsQuestion/find',
      data:'returnGoodsID='+ Base.utils.mapQuery(window.location.search).id,
      success:function(data){
        Base.state.check(data,function(model){
          if(!model) model=[];
          if(model.length>0){
            model = model[0];
            $('#J_date').text(model.returnGoodsTime);
            $('#J_no').text(model.orderNo);
            $('#J_type').text(model.returnTypeName);
            $('#J_desc').text(model.content);
            Base.pageLoaded();
          }
        });
      }
    });
    $('#J_prev').on("click", function () {
        history.back();
    });
	});
});