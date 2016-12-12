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
		title:'询价单详情'
	});
	nav.init();

	$(function () {
    
    var J_dtl_list = $('#J_dtl_list').text(),
        J_time = $('.J_time'),
        J_no = $('.J_no'),
        J_state = $('.J_state'),
        J_total = $('.J_total'),
        J_total_money = $('.J_total_money'),
        J_order_list = $('#J_order_list'),
        $showQuoteBtn = false;
    $.ajax({
        url:'/wx/billOfDocument/find/inquirySheetDetail',
        data:'inquiryID='+ Base.utils.mapQuery(window.location.search).id,
        success: function (data) {
            Base.state.check(data, function (model) {
                if(!model) model=[];
                if(model.length>0){
                    model = model[0];
                    J_time.text(Moment(model.publishTime).format('HH:mm:ss'));
                    J_no.text(model.inquiryNo);
                    var state = BillStatus.inquiry[model.status];
                    if(state=='已报价'){
                        $showQuoteBtn = true;
                    }
                    J_state.text(state);
                    var dtls = model.partDetailEntityList;
                    if(dtls.length>0){
                        var tmp = '';
                        $.each(dtls,function(idx,dtl){
                            tmp += render(dtl);
                        });
                        J_order_list.append(tmp);
                        if($showQuoteBtn){
                            $('.J_quote').removeClass('fn-hide');
                        }
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
        var moneyStr = '',quotedetails = model.quotedetailEntityList;
        if(quotedetails){
            $.each(quotedetails, function (idx,detail) {
               moneyStr+= ['<li>',
                   '<span class="money">&yen;'+detail.quotePrice+'</span>',
                    '<span class="remark">'+detail.remark+'</span>',
                '</li>'].join('');
            });
        }
        return (J_dtl_list+"")
            .replace('{name}',model.PartsName)
            .replace('{num}',model.num)
            .replace('{money}',moneyStr);
    }

    $('#J_order_list').on(Base.events.click, '.total_money_btn', function () {
        $(this).parents('.content').next().toggle();
    });

    Base.pageLoaded();

  });

});
