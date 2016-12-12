var eggsRule;
var common = require('common');
var $ = common.jquery;
var pagination = require('pagination');
var layer = require('layer');

var tpl = require('tpl');
var listtpl = require('./src/list-tpl');
var list = $('#list');

goPage(0);

$('.btn').on('click',function(){
    var ops = getBaseFilterParams();
    goPage(0,ops);
});

function getBaseFilterParams(){
    var t = $(".filter .group input").serialize();
    return t==undefined? '':t;
}

function goPage(page){
    $.ajax({
        url:'/hitEgg/find/list',
        data:'current='+page+'&size=20&'+getBaseFilterParams(),
        errorMsg:'抱歉，拉取数据失败！',
        callback: function (data) {
            pagination.init({
                target:'.pager',
                total:data.total,
                eachCount:data.size,
                currentPage:data.current,
                callback:goPage
            });
            list.empty();
            tpl(listtpl).render(data, function (render) {
                list.append(render.replace(/undefined/g,'').replace(/null/g,''));
            });
        }
    });
}

list.on('change','td select',function(){
  var self = $(this);
  var mfctyName = self.data('name');
  var oldVal = self.data('old');
  var id = self.data('id');
  var newVal = self.val();
  var text = self.find('option:selected').text();
  layer.confirm('你确定要更改<span class="warn">【'+mfctyName+'】</span>汽修厂的砸金蛋规则等级为<span class="warn">【'+text+'】</span>吗？',{icon: 3, title:'提示',shift:6},function(){
    $.ajax({
        url:'/hitEgg/edit/level',
        type:'POST',
        data:'orgID='+encodeURIComponent(id)+'&ruleLevel='+encodeURIComponent(newVal),
        errorMsg:'抱歉，更改失败！',
        callback: function () {
            $.alert('已完成更改！','s');
            oldVal = newVal;
        },
        complate:function(){
          self.val(oldVal);
          self.data('old',oldVal);
        }
    });
  },function(){
    //取消
    self.val(oldVal);
  });
});

module.exports = eggsRule;
