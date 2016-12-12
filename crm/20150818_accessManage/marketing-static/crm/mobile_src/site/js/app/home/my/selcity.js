define(function(require, exports, module) {

  var Base = require('../../base/index');
  var $ = Base.$;
  var Nav = require('../../nav/nav');
  //var Storage = require('../../storage/storage');
  var LoadArea = require('../area/load');
  var nav = new Nav({
    prev: {
      text: '<i class="icon iconfont">&#xe61f;</i>我',
      id: 'J_prev'
    },
    op: {
      text: '保存',
      id: 'J_save'
    },
    title: '选择地区'
  });
  nav.init();

  (function() {
    $(function() {

      //auto loading base data
      LoadArea({}, $, Base);

      $('#J_prev').on(Base.events.click, function() {
        history.back();
      });

      $('#J_save').on(Base.events.click, function() {
        var id = $('#J_qu_id').data('id');
        if (id == undefined) {
          Base.msg.info('请选择至区级');
          return;
        }
        if ($.trim(id) == '-1') {
          Base.msg.info('该市级没有区级数据，不能保存！', 1000);
          return;
        }
        $.ajax({
          url: '/wx/user/add/area',
          data: 'areaId=' + Base.utils.encodeHtml(String(id)),
          success: function(data) {
            Base.state.check(data, function() {
              location.href = "my.html";
            });
          }
        });
      });
      Base.pageLoaded();
    });
  })();

});
