define(function(require,exports,module) {
	var Base = require('../../base/index');
	var $ = Base.$;
    var Nav = require('../../nav/nav');
    var BillStatus = require('../bill/state');

    var nav = new Nav({
        prev:{
            id:'J_prev',
            text:'<i class="icon iconfont">&#xe61f;</i>返回'
        },
        title:'基本情况',
        op:{
            id:'J_edit',
            text:'编辑'
        }
    });
    
    nav.init();

  $(function () {
    var $Nav = $('#J_nav'),
        triggers = $('.J_trigger'),
        pannels = [$('#J_pannel1'),$('#J_pannel2')];

    var id = Base.utils.mapQuery().id;
    if(typeof id=="undefined"){
        return;
    }

    $Nav.on(Base.events.click,'.J_trigger',function(){
      var _self = $(this);
      triggers.removeClass('active');
      _self.addClass('active');
      if(_self.hasClass('J_t1')){
          pannels[0].show();
          pannels[1].hide();
      }else{
          pannels[0].hide();
          if(pannels[1].data('hasData')==undefined){
              loadBussInfo();
          }
          pannels[1].show().data('hasData',true);
      }
    });

    $.ajax({
      url:'/wx/visit/basedMesg',
      data:'ID='+id,
      success:function(data){
        Base.state.check(data,function(model){
          if(!model) model = [];
          if(model.length>0){
            model = model[0];
            $('#J_name').text(model.mfctyName);
            $('#J_type').text(BillStatus.factoryType[String(model.mfctyType)]);
            $('#J_address').text(model.address);
            $('#J_phone').text(model.cactTel);
            $('#J_contact').text(model.cactMan);

            $('#J_crane').text(model.liftingFrame);
            $('#J_kaoqi').text(model.boothRoom);
            $('#J_area').text(model.businessArea);
            Base.data.set('curr_factory_baseinfo_1',model);
          } 
        });
      } 
    });

    function loadBussInfo(){
        $.ajax({
            url:'/wx/visit/busniess',
            data:'ID='+id,
            success:function(data){
                Base.state.check(data,function(model){
                    if(!model) model = [];
                    if(model.length>0){
                        model = model[0];
                        $('#J_purchase_crane').text(BillStatus.monthBuy[model.monthBuy]);
                        $('#J_local_purchase').text(BillStatus.localPurchase[model.localPercent]);
                        $('#J_purchase').text(model.buyUser);
                        $('#J_pay').text(model.payUser);
                        $('#J_have_account').text(model.existAccount?'有':'无');
                        Base.data.set('curr_factory_baseinfo_2',model);
                    }
                });
            }
        });
    }

    $('#J_prev').on("click", function () {
      var url = Base.data.get('curr_factory_url');
      if(url){
        location.href=url;
      }else{
        history.back();
      }
    });
    
    $('#J_edit').on(Base.events.click, function () {
        Base.data.set('curr_factory_baseinfo_url',window.location.href);
        location.href="information-edit.html?id="+id;
    });

    Base.pageLoaded();
  });

});