define(function(require,exports,module) {
	var Base = require('../../../base/index');
	var $ = Base.$;
	var Nav = require('../../../nav/nav');
  var Template = require('../../../gallery/template/main');
	var nav = new Nav({
    prev:{
      id:'J_prev',
      text:'<i class="icon iconfont">&#xe61f;</i>通讯录'
    },
		title:'通讯录-详情',
    op:{
      id:'J_edit',
      text:'修改'
    }
	});
	nav.init();

	$(function () {
    
    var _cache = {};// 缓存数据

    $('#J_prev').on("click",function(){
        history.back();
    });
    $('#J_edit').on(Base.events.click,function(){
        Base.data.set('dt_model',_cache['model']);
        location.href = 'edit.html';
    });
    var query = Base.utils.mapQuery(window.location.search),
        url = '/wx/phone/find/own';
    if(typeof query.id == "undefined"){
        return;
    }
    if(typeof query.pub != "undefined" && $.trim(query.pub) == '1'){
        url = '/wx/phone/find/pub';
        $('#J_edit').css({
            'visibility':'hidden'
        });
    }
    $.ajax({
        url:url,
        type:'POST',
        data:'contactID={{id}}'.replace('{{id}}',query.id),
        success:function(data){
            Base.state.check(data,function(model){
                if(!model) model = [];
                if(model.length>0){
                    model = _cache['model'] = model[0];
                    $('#J_name').text(model.contactMan);
                    $('#J_type').text(model.contactTypeName);
                    $('#J_memo').text(model.memo);
                    var p = $('#J_phone'),
                        no = model.phoneNo;
                    p.find('span').text(no);
                    p.find('a').attr('href','tel:'+no);
                }
            });
        }
    });
    Base.pageLoaded();
  });

  

});