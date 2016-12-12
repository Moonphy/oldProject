define(function(require,exports,module) {
	var Base = require('../../base/index');
	var $ = Base.$;
	var Nav = require('../../nav/nav');
	var Footer = require('../../footer/footer');

	var nav = new Nav({
		title:'我'
	});
	var footer = new Footer;
	
	nav.init();
	footer.init();

	$(function () {
    //清空curr_id,防止影响订单/询价单查询
    Base.data.remove('curr_id');
   	var $J_accidentcar_remind = $('#J_accidentcar_remind');
    $.ajax({
        url:'/wx/accidentCarsRemain/remain',
        success: function (data) {
            Base.state.check(data, function (model) {
                if(model==1){
                    $J_accidentcar_remind.find('.my_icon')
                    .attr('class','my_icon clock2');
                }
            });
        }
    });

    $('.content .item').on(Base.events.over,function(e){
      $(this).addClass('highlight');
    }).on(Base.events.out,function(e){
      $(this).removeClass('highlight');
    });
    Base.pageLoaded();
  });

});