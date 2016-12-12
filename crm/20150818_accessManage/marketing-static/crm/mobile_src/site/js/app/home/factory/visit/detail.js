define(function(require,exports,module) {
  var Base = require('../../../base/index');
  var $ = Base.$;
  var Nav = require('../../../nav/nav');
  var nav = new Nav({
    prev:{
      text:'<a href="list.html"><i class="icon iconfont">&#xe61f;</i>拜访信息</a>'
    },
    title:'信息详情'
  });
  nav.init();

  $(function(){
    var query = Base.utils.mapQuery(window.location.search),
        keys = ["visitFrequency","enterTime","people","leaveTime","content","accidentCarEntityList"],
        carKeys = ["carType","num","preBuyTime"],
        $list = $('#list'),
        $carList = $('.J_carList');
    var id = query.id;
    if(id!=undefined){
      $.ajax({
        url:'/wx/message/find',
        data:'visitID='+id,
        success:function(data){
          Base.state.check(data, function (model) {
            if(!model) model =[];
            if(model.length>0){
              model = model[0];
              $.each(keys,function(idx,key){
                if(idx==5){
                  var cars = model[key];
                  $.each(cars,function(idx,car){
                      var carUI = $carList.clone();
                      carUI.find('.idx').text(idx+1);
                      var vals = carUI.find('.car-value');
                      $.each(vals,function(i,obj){
                          $(obj).text(car[carKeys[i]]);
                      });
                      $carList.before(carUI);
                  });
                }else{
                  $($('.value')[idx]).text(model[key]);
                }
              });
              $carList.remove();
            }
          });
        }
      });
    }
    Base.pageLoaded();
  });
});