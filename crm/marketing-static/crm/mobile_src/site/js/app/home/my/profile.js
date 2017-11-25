define(function(require,exports,module) {

	var Base = require('../../base/index');
	var $ = Base.$;
	var Nav = require('../../nav/nav');
	var Storage = require('../../storage/storage');

	var nav = new Nav({
		prev:{
            text:'<a href="my.html"><i class="icon iconfont">&#xe61f;</i>我</a>'
        },
		op:{
            text:'<a href="profile-edit.html">修改</a>'
        },
		title:'个人信息'
	});
	nav.init();

	(function(){
    $.ajax({
        url:'/wx/user/find/info',
        success:function(data){
            Base.state.check(data,function(model){
                if(model){
                    $('#J_name').text(model.userName);
                    $('#J_dept').text(model.deptName);
                    $('#J_phone').text(model.mp);
                    $('#J_email').text(model.email);
                    Storage.setItem('J_model',JSON.stringify(model));
                    Base.pageLoaded();
                }
            });
        }
    });
  })();

});