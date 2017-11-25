define(function(require,exports,module) {
	var Base = require('../../../base/index');
	var $ = Base.$;
	var Nav = require('../../../nav/nav');
  var Template = require('../../../gallery/template/main');
  var Icon = require('../../problem/icon');
	var nav = new Nav({
    prev:{
      id:'J_prev',
      text:'<i class="icon iconfont">&#xe61f;</i>返回'
    },
		title:'问题与建议详情'
	});
	nav.init();

	$(function () {

    var id = Base.utils.mapQuery(window.location.href).id;
    if(id==undefined) return;
    $.ajax({
        url:'/wx/marketFeedBack/find',
        data:'feedBackID='+id,
        success: function (data) {
            Base.state.check(data, function (model) {
                if(!model) model=[];
                if(model.length>0){
                    var mode = model[0];
                    $('#type').text(mode.platTypeName);
                    $('.J_icon_type').html(Icon.get(mode.platTypeID));
                    $('#desc').text(mode.content);
                }
            });
        }
    });

    $('#J_prev').on('click', function () {
        history.back();
    });

    Base.pageLoaded();
  });

  

});