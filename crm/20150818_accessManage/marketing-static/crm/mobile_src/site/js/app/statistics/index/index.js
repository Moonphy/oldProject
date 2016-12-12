define(function(require, exports, module) {
  var Base = require('../../base/index');
  var $ = Base.$;
  var Nav = require('../../nav/nav');
  var Footer = require('../../footer/footer');
  var nav = new Nav({
    title: '指标',
    op: {
      text: '<a href="target.html">统计<i class="icon iconfont">&#xe61e;</i></a>'
    }
  });
  var footer = new Footer;
  nav.init();
  footer.init();
  $(function() {
    var bfs = $('#bfs'),
      zcs = $('#zcs'),
      jhs = $('#jhs'),
      ddzs = $('#ddzs'),
      ddze = $('#ddze');

    $.ajax({
      url:'/wx/orderStatistics/find/statisticsToday',
      success:function(data){
        Base.state.check(data,function(model){
          if(model && model.length>0){
            model = model[0];
          } 
          bfs.text('#');
          zcs.text(model.dateRangeRegisterNum);
          jhs.text(model.sensitizeNum);
          ddzs.text(model.orderNum);
          ddze.text(model.totalOrder);
          Base.pageLoaded();
        });
      }
    });
  });
});
