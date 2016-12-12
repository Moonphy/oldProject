define(function(require,exports,module) {
  var Base = require('../../base/index');
  var $ = Base.$;
  var Nav = require('../../nav/nav');
  var nav = new Nav({
      prev:{
        id:'J_prev',
        text:'<i class="icon iconfont">&#xe61f;</i>返回'
      },
  	title:'任务事项-详情',
    op:{
      id:'J_complete',
      text:'完成'
    }
  });
  nav.init();

  $(function () {
    var query = Base.utils.mapQuery(window.location.search),
        keys = ["planTime","mfctyName","state","taskName"];
    var id = query.taskid;
    if(id==undefined){
        Base.msg.error('TaskId丢失，请返回重试');
        return;
    }

    $.ajax({
      url:'/wx/task/find/specifiTask',
      data:'taskID='+id,
      success: function (data) {
        Base.state.check(data, function (model) {
          if(!model) model = [];
          if(model.length>0){
            model = model[0];
            var vals = $('.value');
            $.each(vals,function(idx,val){
              if(idx==1){
                $(val).html('<a class="factoryurl" href="../factory/index.html?id='+model.custID+'&taskId='+id+'&custID='+model.custID+'&factory='+encodeURI(model.mfctyName)+'">'+model[keys[idx]]+'</a>');
              }else if(idx==2){
                var state = model[keys[idx]];
                $(val).text(state==0?'未完成':state==1?'已取消':state==2?'已过期':state==3?'已完成':'未知'+state);
                if(state==3){
                  $('#J_complete').hide();
                }
              }else{
                $(val).text(model[keys[idx]]);
              }
            });
          }
        });
      }
    });

    $('#J_prev').on("click", function () {
      history.back();
    });
    
    $('#J_complete').on(Base.events.click, function () {
      $.ajax({
        url:'/wx/task/update/taskState',
        data:'tasKID='+ id,
        type:'POST',
        success:function(data){
          Base.state.check(data, function () {
            Base.msg.success('操作成功，感谢使用',2000, function () {
                location.href="list.html";
            });
          })
        }
      });
    });

    Base.pageLoaded();
  });

  

});