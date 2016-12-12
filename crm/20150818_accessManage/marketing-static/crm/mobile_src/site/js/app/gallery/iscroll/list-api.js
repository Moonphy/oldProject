/**
	提供更加友好的单页加载多页list的封装脚本
**/
define(function(require,exports,module) {
	var Base = require('../../base/index');
  var $ = Base.$;

	var Lister = function(options){
    this.settings = $.extend({},Lister.defaults,options);
    this.defaults = {
      url:'',
      loadDataContainer:'',//成功的数据挂载容器
      buildParam:function(){
        return '';//'?key='+ $.trim($searchIn.val()) 'size='+$Page.size+'&current='+$Page.current
      },
      success:function(){},
      container:'',//列表容器
      loadFirst:false,
      loadedCallback:function(){},
      canDel:false,
      delTpl:'<div class="del">删除</div>',
      search:false,//是否开启搜索
      searchInId:'',//搜索框
      searchClose:'',//关闭按钮
      searchCallback:null,//搜索回调
      delCallback:function(target){
      },
      nomore:false//没有更多数据了，此配置会控制能否能加载下一页
    };//defaults end
    this.initialize = function(){
      this.loadData();
      if(this.settings.search){
        this.listenChange();
      }
    };
    this.appendData = function(data){
      if(this.settings.loadFirst){
        $(this.settings.loadDataContainer).empty();
        this.settings.loadFirst = false;
      }
      $(this.settings.loadDataContainer).append(data);
    };
    this.loadData = function(){
      var self = this;
      if(self.settings.loadFirst){
        self.current=0;
      }
      var ajax = $.ajax({
        url: self.settings.url,
        data: self.settings.buildParam(),
        success:function(data){
          var model = self.settings.success.call(this,data);
          $.isFunction(self.settings.loadedCallback) && self.settings.loadedCallback.call(this);
          //设置总页数
          self.total = Base.utils.getTotalPage(model.total,model.size);
          console.log(self.total-1,self.current);
          if(self.total-1==self.current){
            self.nomore = true;
          }
          if(self.settings.canDel){
            $(self.settings.container).find('.item').off('swipeLeft').on('swipeLeft',function () {
              $(this).parents('ul').find('.del').remove();
              $(this).parents('ul').find('a').css({left:'0%'});
              $(this).append(self.defaults.delTpl);
              $(this).find('a').css({left:'-20%'});
            }).off('swipeRight').on('swipeRight',function () {
              $(this).find('.del').remove();
              $(this).find('a').css({left:'0%'});
            });
            var ts = 0;
            $('.del').die(Base.events.click).live(Base.events.click, function (e) {
              Base.log(e.timeStamp);
              if(ts!=0 && e.timeStamp-ts<10000){
                ts = 0;
              }else{
                ts = e.timeStamp;
                $.isFunction(self.settings.delCallback) && self.settings.delCallback.call(this);
              }
            });
          }
        }
      });//ajax end
    };
    this.loadNext = function(callback){
      if(!this.nomore){
        this.current++;
        this.loadData();
        if($.isFunction(callback)){
          this.settings.loadedCallback = callback;
        }
      }else{
        $('#pullup-label').text('已无更多数据');
        $('#pullup').removeClass('loading');
        $('#pullup').find('.pullup-icon').remove();
      }
    };
    this.refresh = function(){
      window.location.reload();
    };
    this.listenChange = function(){
      var self = this;
        //$(document).off('ajaxStart');//取消加载提示
        function callback(e){
            if(element.value){
                $(self.settings.searchClose).show();
            }else{
                $(self.settings.searchClose).hide();
            }
            $(self.settings.container).empty();
            self.settings.searchCallback.call(this);
        };
        var element = document.getElementById(self.settings.searchInId);
        if("\v"=="v") {
            element.onpropertychange = callback;
        }else{
            element.addEventListener("input",callback,false);
            $(self.settings.searchClose).on(Base.events.click,function(e){
              element.value = '';
              if(self._timeStamp && e.timeStamp - self._timeStamp<50){
                self.settings.searchCallback.call(this);
                $(this).hide();
              }else{
                self._timeStamp = e.timeStamp;
              }
            });
        }
    };
    this.current = 0;
    this.total = 0;
    this.size = 10;
  };
	module.exports = Lister;
});
