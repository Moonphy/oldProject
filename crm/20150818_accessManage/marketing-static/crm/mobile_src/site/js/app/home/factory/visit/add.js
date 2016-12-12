define(function(require, exports, module) {
  var Base = require('../../../base/index');
  var $ = Base.$;
  var Nav = require('../../../nav/nav');
  var Datepicker = require('../../../gallery/datepicker/api');
  var nav = new Nav({
    prev: {
      text: '<a href="list.html"><i class="icon iconfont">&#xe61f;</i>拜访信息</a>'
    },
    title: '增加拜访信息',
    op: {
      id: 'J_save',
      text: '保存'
    }
  });
  nav.init();

  $(function() {

    Datepicker.init($);

    var currTaskId = Base.data.get('curr_taskid');
    if (Base.check.null(currTaskId)) {
      Base.msg.error('未检测到当前TASKID，请返回！', 2000);
    }
    var datepickercfg = {
      theme: 'sense-ui',
      lang: 'zh',
      preset: 'datetime',
      stepMinute: 5
    };
    $('#J_ddsj').scroller('destroy').scroller(datepickercfg);
    $('#J_ldsj').scroller('destroy').scroller(datepickercfg);
    changeSeconds([$('#J_ddsj'), $('#J_ldsj')]);

    function changeSeconds(selectors) {
      $.each(selectors, function(idx, selector) {
        selector.on('change', function() {
          $(this).val($(this).val() + ':' + new Date().getSeconds());
        });
      });
    }

    var $bfrother = $('#J_bfr_other');
    $('#J_bfr').on('change', function() {
      var val = $(this).val();
      if (val != '-1') {
        if (val == '0') {
          $bfrother.show().focus();
        } else {
          $bfrother.hide();
        }
      }
    });

    $('#J_save').on(Base.events.click, function() {
      var params = checkForm();
      if (params == undefined) {
        return;
      }
      $.ajax({
        url: '/wx/message/createMsgDetail',
        data: params,
        type: 'POST',
        success: function(data) {
          Base.state.check(data, function() {
            Base.msg.success('拜访信息已保存', 2000, function() {
              location.href = "list.html";
            });
          });
        }
      })
    });


    function checkForm() {
      var bfpl = $('#J_bfpl').val();
      var ddsj = $('#J_ddsj').val();
      var bfr = $('#J_bfr').val();
      var gtnr = $('#J_gtnr').val();
      var ldsj = $('#J_ldsj').val();
      if (Base.check.null(bfpl)) {
        Base.msg.info('拜访频率不能为空啊，亲');
        return;
      }
      if (!Base.check.isPositiveNum(bfpl)) {
        Base.msg.info('拜访频率必须为正整数啊，亲');
        return;
      }
      if (Base.check.null(ddsj)) {
        Base.msg.info('到店时间不能为空啊，亲');
        return;
      }
      if (Base.check.null(bfr) || bfr == '-1') {
        Base.msg.info('拜访人不能为空啊，亲');
        return;
      }
      if (bfr == '0' && Base.check.null($bfrother.val())) {
        Base.msg.info('请填写拜访人啊，亲');
        return;
      }
      if (Base.check.null(gtnr)) {
        Base.msg.info('沟通内容不能为空啊，亲');
        return;
      }
      if (Base.check.null(ldsj)) {
        Base.msg.info('离店时间不能为空啊，亲');
        return;
      }
      var params = {
        "visitFrequency": bfpl,
        "enterTime": ddsj,
        "leaveTime": ldsj,
        "people": (bfr == '0') ? $bfrother.val() : bfr,
        "content": gtnr,
        "taskID": currTaskId
      };
      return Base.utils.toQueryString(params);
    }

    Base.pageLoaded();
  });
});
