define(function(require,exports,module) {
  var Base = require('../../../base/index');
  var $ = Base.$;
  var Nav = require('../../../nav/nav');
  var nav = new Nav({
      prev:{
        id:'J_prev',
        text:'<i class="icon iconfont">&#xe61f;</i>备忘录'
      },
  	title:'备忘录-详情'
  });
  nav.init();

  $(function () {
    var id = Base.utils.mapQuery(window.location.href).id;
    if(id==undefined) return;
    $.ajax({
        url:'/wx/memorandum/find/detail',
        data:'noteID='+id,
        type:'POST',
        success: function (data) {
            Base.state.check(data, function (model) {
                if(!model) model=[];
                if(model.length>0){
                    var mode = model[0];
                    $('#date').text(mode.planTime);
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