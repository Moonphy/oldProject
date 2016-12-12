define(function(require, exports, module) {
  var Base = require('../../base/index');
  var $ = Base.$;
  var Nav = require('../../nav/nav');
  var nav = new Nav({
    prev: {
      id:'J_prev',
      text: '<i class="icon iconfont">&#xe61f;</i>统计'
    },
    title: '客户汇总'
  });
  nav.init();
  $(function() {
    var ljzcs = $('#ljzcs'),
      ljjhs = $('#ljjhs'),
      ljjys = $('#ljjys');

    $.ajax({
      url:'/wx/orderStatistics/find/all',
      success:function(data){
        Base.state.check(data,function(model){
          ljzcs.text(model.registerNum);
          ljjhs.text(model.sensitizeNum);
          ljjys.text(model.transactionNum);
          Base.pageLoaded();
        });
      }
    });

    $('#J_prev').on(Base.events.click,function(){
      history.back();
    });
    
  });
});
