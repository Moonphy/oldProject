/**
 * Created by Moonphy on 2016/8/25.
 * @box 滑动的ul
 * @playTime 自动滑动的间隔时长
 * @size 每屏显示的item个数
 * @auto 是否自动滑动
 * @loop 是否循环滑动
 * @scrollTime 动画完成的时长
 */
;(function ($) {
  function swipeMobile(box, config){

    this.box = $(box);
    this.child = this.box.children();
    this.parent = this.box.parent();
    this.dotWrap = this.parent.find('.slide-btn');
    this.setting = {
      "playTime": 3000,
      "size": 3,
      "auto": true,
      "loop": true,
      "scrollTime": 1000
    };
    $.extend(this.setting,config);

    this.cNum = this.child.length;
    this.winWidth = 0;
    this.wNum = 1;

    this.init();
    this.events();
  }
  swipeMobile.prototype = {

    init: function () {
      this.wNum = Math.ceil(this.cNum/this.setting.size);
      this.winWidth = this.parent.width();
      this.box.width(this.winWidth * this.wNum);
      this.parent.height(this.box.height() + this.dotWrap.height());
      this.child.width(this.winWidth/this.setting.size);

      if(this.wNum>1){
        for(var i=1;i<this.wNum;i++){
          this.dotWrap.append('<span>')
        }
      }

    },
    events: function () {
      var self = this;
      self.index = 0;
      this.box.on('swipeLeft', function () {
        self.index++;
        if(self.index < 0){
          if(self.setting.loop){
            self.index = self.wNum-1;
            self.go_index(self.index)
          }else{
            self.index = 0
          }
        }else if(self.index > self.wNum-1){
          if(self.setting.loop){
            self.index = 0;
            self.go_index(self.index)
          }else{
            self.index = self.wNum-1
          }
        }else if(self.index > 0 && self.index < self.wNum){
          self.go_index(self.index)
        }
      });
      this.box.on('swipeRight', function () {
        self.index--;
        if(self.index < 0){
          if(self.setting.loop){
            self.index = self.wNum-1;
            self.go_index(self.index)
          }
          else{
            self.index = 0;
          }
        }else if(self.index > self.wNum-1){
          if(self.setting.loop){
            self.index = 0;
            self.go_index(self.index)
          }else{
            self.index = self.wNum-1;
          }
        }else if(self.index > -1 && self.index < self.wNum-1){
          self.go_index(self.index)
        }
      });
      if(self.setting.auto){
        self.autoPlay()
      }
    },
    go_index: function (ind) {
      var self = this;
      clearInterval(this.timer);
      this.box.css('left',-this.winWidth*ind);
      this.box.css(this.getAnimate());

      var dot = this.dotWrap.find('span');
      dot.eq(ind).addClass('active').siblings('.active').removeClass('active');
      if(!!self.setting.auto){
        setTimeout(self.autoPlay(), self.setting.playTime);
      }
    },
    autoPlay: function () {
      var self = this;
      self.timer = setInterval(function () {
        self.box.trigger('swipeLeft')
      },self.setting.playTime);
      return self.timer
    },
    getAnimate: function () {
      return {
        '-webkit-transition':'left'+this.setting.scrollTime+'ms',
        'transition':'left '+this.setting.scrollTime+'ms'
      };
    }
  };
  window['swipeMobile'] = swipeMobile;
})(Zepto);