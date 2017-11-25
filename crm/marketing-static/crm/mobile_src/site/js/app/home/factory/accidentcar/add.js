define(function(require,exports,module) {
	var Base = require('../../../base/index');
	var $ = Base.$;
	var Nav = require('../../../nav/nav');
	var Datepicker = require('../../../gallery/datepicker/api');
	var nav = new Nav({
    prev:{
      text:'<a href="info-list.html"><i class="icon iconfont">&#xe61f;</i>拜访信息</a>'
    },
		title:'添加事故车',
    op:{
    	id:'J_save',
      text:'保存'
    }
	});
	nav.init();

	$(function(){
		
		Datepicker.init($);

		var tpl = $('#tpl').text(),
        J_list = $('#J_list'),
        J_form = $('#J_form');

    var J_add = $('#J_add'),
        num = 1;

    J_add.on(Base.events.click, function () {
        addCar();
    });
    function addCar(){
      J_form.append(tpl.replace(/\{idx\}/g,num++));
      $('.car_'+(num-1)).scroller('destroy').scroller({
          theme: 'sense-ui',
          lang: 'zh',
          preset: 'datetime',
          stepMinute: 5
      });
      changeSeconds([$('.car_'+(num-1)).eq(num-1)]);
    }

    function changeSeconds(selectors) {
        $.each(selectors, function (idx, selector) {
            selector.on('change', function () {
                $(this).val($(this).val() + ':' + new Date().getSeconds());
            });
        });
    }

    addCar();

    function checkForm(){
        var lists = $('.list');
        var params = [];
        $.each(lists,function(idx,list){
            list = $(list);
            var obj = {};
            var inpts = list.find('input');
            $.each(inpts,function(idx,inpt){
                inpt = $(inpt),
                val = inpt.val();
                if(Base.check.null(val)){
                    Base.msg.info(inpt.attr('data-tip'));
                    inpt.focus();
                    return false;
                }
                obj[inpt.attr('data-key')] = val;
            });
            if(count(obj)<3){
                params = [];
                return false;
            }else{
                params.push(obj);
            }
        });
        return params;
    }

    function count(o) {
        var t = typeof o;
        if (t == 'string') {
            return o.length;
        } else if (t == 'object') {
            var n = 0;
            for (var i in o) {
                n++;
            }
            return n;
        }
        return false;
    }

    $('#J_save').on(Base.events.click, function () {
        var params = checkForm();
        if(params==undefined || params.length==0) return;
        var accidentCarJSON = JSON.stringify(params);
        $.ajax({
            url:'/wx/message/createAccidentCar',
            type:'POST',
            data:'taskID='+ Base.data.get('curr_taskid')+'&accidentCarJSON='+accidentCarJSON,
            success:function(data){
                Base.state.check(data, function (model) {
                    Base.msg.success('添加成功，感谢使用',2000, function () {
                        location.href="../visit/list.html";
                    });
                });
            }
        })
    });

    $('#J_form').delegate('.jian',Base.events.click, function (e) {
        var inp = $(e.target).next();
        var t = parseInt(inp.val())-1;
        inp.val(t<=0?1:t);
    });
    $('#J_form').delegate('.jia',Base.events.click, function (e) {
        var inp = $(e.target).prev();
        var t = parseInt(inp.val())+1;
        inp.val(t);
    }).delegate('.num','change',function(e){
        var inp = $(e.target);
        inp.val((inp.val()+"").replace(/-/g,''));
    });

    Base.pageLoaded();
	});
});