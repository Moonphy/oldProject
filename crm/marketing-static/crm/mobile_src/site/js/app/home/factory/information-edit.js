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
      title:'信息编辑',
      op:{
          id:'J_save',
          text:'保存'
      }
  });
  
  nav.init();

  $(function(){
    var id = Base.utils.mapQuery(window.location.search).id;
    if(id==undefined){
        return;
    }

    var $Nav = $('#J_nav'),
        triggers = $('.J_trigger'),
        pannels = [$('#J_pannel1'),$('#J_pannel2')];
    $Nav.on(Base.events.click,'.J_trigger',function(){
        var _self = $(this);
        triggers.removeClass('active');
        _self.addClass('active');
        if(_self.hasClass('J_t1')){
            pannels[0].show();
            pannels[1].hide();
        }else{
            pannels[0].hide();
            pannels[1].show();
            /*if(pannels[1].data('hasData')==undefined){
            }
            pannels[1].show().data('hasData',true);*/
        }
    });


    var $sub = $('.sub'),
        $add = $('.add');
    $sub.on(Base.events.click, function () {
      var $inp = $(this).next();
      var $val = parseInt($inp.val());
      if($val>0){
        $val--;
        $inp.val($val);
        if($val==0){
          $(this).addClass('disabled');
        }else{
          $(this).removeClass('disabled');
        }
      }else{
        $(this).addClass('disabled');
      }
    });

    $add.on(Base.events.click, function () {
      var $inp = $(this).prev();
      var $val = parseInt($inp.val());
      $val++;
      $inp.val($val);
      if($val>0){
          $(this).prev().prev().removeClass('disabled');
      }
    });

    var J_name = $('#J_name'),
        J_type = $('#J_type'),
        J_address = $('#J_address'),
        J_phone = $('#J_phone'),
        J_contact = $('#J_contact'),
        J_area = $('#J_area'),
        J_crane = $('#J_crane'),
        J_kaoqi = $('#J_kaoqi');

    var J_purchase_crane = $('#J_purchase_crane'),
        J_local_purchase = $('#J_local_purchase'),
        J_purchase = $('#J_purchase'),
        J_pay = $('#J_pay'),
        J_have_account = $('#J_have_account');

    function checkForm(){
        var name = J_name.val(),
            type = J_type.val(),
            address = J_address.val(),
            phone = J_phone.val(),
            contact = J_contact.val(),
            area = J_area.val(),
            crane = J_crane.val(),
            kaoqi = J_kaoqi.val();

        /*if(Base.check.null(name)){
            Base.msg.info(J_name.attr('placeholder'));
            return;
        }*/
        if(type=='-1' || Base.check.null(type)){
          Base.msg.info(J_type.attr('data-tip'));
          return;
        }
        if(Base.check.null(address)){
          Base.msg.info(J_address.attr('placeholder'));
          return;
        }
        if(Base.check.null(phone)){
          Base.msg.info(J_phone.attr('placeholder'));
          return;
        }
        if(Base.check.null(contact)){
          Base.msg.info(J_contact.attr('placeholder'));
          return;
        }
        if(Base.check.null(area)){
          Base.msg.info(J_area.attr('placeholder'));
          return;
        }

        var purchase_crane = J_purchase_crane.val(),
            local_purchase = J_local_purchase.val(),
            purchase = J_purchase.val(),
            pay = J_pay.val(),
            have_account = J_have_account.val();

        if(purchase_crane=='-1' || Base.check.null(purchase_crane)){
          Base.msg.info(J_purchase_crane.attr('data-tip'));
          return;
        }
        if(local_purchase=='-1' || Base.check.null(local_purchase)){
          Base.msg.info(J_local_purchase.attr('data-tip'));
          return;
        }
        if(purchase=='-1' || Base.check.null(purchase)){
          Base.msg.info(J_purchase.attr('data-tip'));
          return;
        }
        if(pay=='-1' || Base.check.null(pay)){
          Base.msg.info(J_pay.attr('data-tip'));
          return;
        }
        if(have_account=='-1' || Base.check.null(have_account)){
          Base.msg.info(J_have_account.attr('data-tip'));
          return;
        }
        var params = {
            /*"mfctyName":name,*/
            "address":address,
            "boothRoom":kaoqi,
            "businessArea":area,
            "buyUser":purchase,
            "cactMan":contact,
            "cactTel":phone,
            "existAccount":have_account,
            "id":id,
            "liftingFrame":crane,
            "localPercent":local_purchase,
            "memo":'',
            "mfctyType":type,
            "monthBuy":purchase_crane,
            "payUser":pay
        };
        return Base.utils.toQueryString(params);
    }

    $('#J_save').on(Base.events.click, function () {
        var params = checkForm();
        if(params==undefined) return;
        $.ajax({
            url:'/wx/basicSituation/modify/message',
            data:params,
            type:'POST',
            success: function (data) {
                Base.state.check(data, function (model) {
                    Base.msg.success('更新成功，感谢使用',2000, function () {
                        Base.data.remove('curr_factory_baseinfo_1');
                        Base.data.remove('curr_factory_baseinfo_2');
                        var url = Base.data.get('curr_factory_baseinfo_url');
                        if(url!=undefined){
                            Base.data.remove('curr_factory_baseinfo_url');
                            location.replace(url);
                        }else{
                            history.back();
                        }
                    });
                });
            }
        })
    });

    var model1 =  Base.data.get('curr_factory_baseinfo_1');
    var model2 =  Base.data.get('curr_factory_baseinfo_2');
    if(model1!=null) {
        J_name.val(filter(model1.mfctyName));
        J_type.val(filter(model1.mfctyType));
        J_address.val(filter(model1.address));
        J_phone.val(filter(model1.cactTel));
        J_contact.val(filter(model1.cactMan));
        J_area.val(filter(model1.businessArea));
        J_crane.val(filter(model1.liftingFrame) || 0);
        J_kaoqi.val(filter(model1.boothRoom) || 0);
    }

    if(model2!=null){
        J_purchase_crane.val(filter(model2.monthBuy));
        J_local_purchase.val(filter(model2.localPercent));
        J_purchase.val(filter(model2.buyUser));
        J_pay.val(filter(model2.payUser));
        J_have_account.val(filter(model2.existAccount)?1:0);
    }

    function filter(o){
        return o?o:'';
    }

    $('#J_prev').on("click", function () {
        history.back();
    });

    Base.pageLoaded();

  });
});