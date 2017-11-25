define(function(require,exports,module) {
	var Base = require('../../../base/index');
	var $ = Base.$;
	var Nav = require('../../../nav/nav');
  var Moment = require('../../../gallery/moment/main');
  var BillStatus = require('../../bill/state');
	var nav = new Nav({
    prev:{
      id:'J_prev',
      text:'<i class="icon iconfont">&#xe61f;</i>返回'
    },
		title:'订单详情'
	});
	nav.init();

	$(function () {
    
    var J_dtl_list = $('#J_dtl_list').text(),
        J_time = $('.J_time'),
        J_no = $('.J_no'),
        J_state = $('.J_state'),
        J_total = $('.J_total'),
        J_total_money = $('.J_total_money'),
        J_order_list = $('#J_order_list');
    $.ajax({
        url:'/wx/billOfDocument/find/orderMainDetail',
        data:'orderMainID='+ Base.utils.mapQuery(window.location.search).id,
        success: function (data) {
            Base.state.check(data, function (model) {
                if(!model) model=[];
                if(model.length>0){
                    model = model[0];
                    J_time.text(Moment(model.publishTime).format('HH:mm:ss'));
                    J_no.text(model.orderMainNo);
                    J_state.text(BillStatus.order[model.orderStatus]);
                    J_total.text(model.allNum);
                    J_total_money.text(model.money);
                    var dtls = model.partDetailEntityList;
                    if(dtls.length>0){
                        var tmp = '';
                        $.each(dtls,function(idx,dtl){
                            tmp += render(dtl);
                        });
                        J_order_list.append(tmp);
                    }else{
                        Base.msg.info('没有明细');
                    }
                }else{
                    Base.msg.info('没有数据');
                }
            });
        }
    });
    
    $('#J_prev').on("click", function () {
       history.back();
    });

    function render(model){
        return (J_dtl_list+"")
            .replace('{name}',model.PartsName)
            .replace('{num}',model.num)
            .replace('{money}',model.unitPrice);
    }

    Base.pageLoaded();

  });

});