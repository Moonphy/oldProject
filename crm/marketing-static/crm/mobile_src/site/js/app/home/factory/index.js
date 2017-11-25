define(function(require,exports,module) {
	var Base = require('../../base/index');
	var $ = Base.$;
    var Nav = require('../../nav/nav');
    var Footer = require('../../footer/footer');

    var nav = new Nav({
        prev:{
            text:'<i class="icon iconfont">&#xe61f;</i>拜访'
        },
        title:'拜访'
    });
    var footer = new Footer({activeIdx:2});
    nav.init();
    footer.init();

	$(function () {
    var query = Base.utils.mapQuery(window.location.search);
    if(query.taskId){
      //存储当前的taskId
      Base.data.set('curr_taskid', query.taskId);
    }
    if(query.factory){
        $('#J_name').text(query.factory);
    }
    if(query.id){
        //存储当前的客户Id
        Base.data.set('curr_id', query.id);
        $('#baseInfo').attr('href','information.html?id='+query.id);
        $('#J_inquiry_order').attr('href','bill/inquiry.html');
    }
    $('#J_back').on(Base.events.click, function () {
        location.href="../visit/list.html";
    });
    
    $('.content .item').on(Base.events.over,function(e){
      $(this).addClass('highlight');
    }).on(Base.events.out,function(e){
      $(this).removeClass('highlight');
    });

    //存储当前汽修厂的主页地址
    Base.data.set('curr_factory_url',window.location.href);
    Base.pageLoaded();
  });

});