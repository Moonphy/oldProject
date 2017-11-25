define(function(require,exports,module) {
  var Base = require('../../base/index');
  var $ = Base.$;
  var Nav = require('../../nav/nav');
  var Datepicker = require('../../gallery/datepicker/api');
  var nav = new Nav({
      prev:{
        id:'J_prev',
        text:'<a href="list.html"><i class="icon iconfont">&#xe61f;</i>任务</a>'
      },
  	title:'新增任务事项',
    op:{
      id:'J_save',
      text:'保存'
    }
  });
  nav.init();

  $(function () {

    Datepicker.init($);

    var J_time = $('#J_time'),
        selFactory = $('#selFactory'),
        J_content = $('#J_content');

    var query = Base.utils.mapQuery(window.location.search);
    if(query.factory!=undefined && query.custID!=undefined && query.id!=undefined){
        selFactory.find('span.text').text(decodeURI(query.factory));
        J_time.val(Base.data.get('page_datas_time'));
        J_content.val(Base.data.get('page_datas_content'));
        Base.data.set('curr_factory_custid',query.custID);
        Base.data.set('curr_factory_id',query.id);
    }

    $('#J_time').scroller('destroy').scroller({
        theme: 'sense-ui',
        lang: 'zh',
        preset: 'datetime',
        stepMinute: 5
    });
    changeSeconds([$('#J_time')]);

    function changeSeconds(selectors) {
        $.each(selectors, function (idx, selector) {
            selector.on('change', function () {
                $(this).val($(this).val() + ':' + new Date().getSeconds());
            });
        });
    }

    function checkForm(){
        var time = $.trim(J_time.val()),
            content = $.trim(J_content.val()),
            factory = selFactory.find('.text').text();

        if(Base.check.null(time)){
            Base.msg.info('请选择时间，亲');
            return;
        }
        if(factory=='请选择汽修厂'){
            Base.msg.info('请选择汽修厂，亲');
            return;
        }
        if(Base.check.null(content)){
            Base.msg.info('请输入内容，亲');
            return;
        }
        if((content+"").length>200){
            Base.msg.info('内容超过了最大长度200，请尽量精简，亲');
            return;
        }
        var params = {
            "planTime":time,
            "taskName":content
        };
        if(Base.data.get('curr_factory_ismain')){
            params.mfctyID = Base.data.get('curr_factory_id');
        }else{
            params.custID = Base.data.get('curr_factory_custid');
        }
        return Base.utils.toQueryString(params);
    }

    $('#J_save').on(Base.events.click, function () {
        var params = checkForm();
        if(params==undefined) return;
        $.ajax({
            url:'/wx/task/create/task',
            data:params,
            type:'POST',
            success: function (data) {
                Base.state.check(data, function () {
                    Base.msg.success('已保存，感谢使用',2000, function () {
                        location.href="list.html";
                    });
                });
            }
        });
    });

    selFactory.on(Base.events.click, function () {
      Base.data.set('page_datas_time',J_time.val());
      Base.data.set('page_datas_content',J_content.val());
      location.href="../factory/select2.html";
    });

    Base.pageLoaded();
  });
});
