/**获取联系人类型
    $currType 需要选中的联系人名称
    $selector 需要挂载的选择器，或者是回调函数，如果是回调函数，则会将请求的联系人类型数据传递给这个回调函数
**/
define(function(require,exports,module) {
	var Base = require('../../../base/index');
  var $ = Base.$;
	module.exports = {
    load:function($currType,$selector){
      $.ajax({
        url:'/wx/phone/getContectType',
        success:function(data){
          Base.state.check(data,function(model){
            if(model){
              if($.isFunction($selector)){
                $selector.call(this,model);
              }else if($.type($selector)=='object' || $.type($selector)=='array' || $.type($selector)=='string'){
                if($.type($selector)=='string'){$selector = $($selector);} 
                $selector.empty();
                var tmp = '',
                    sel = '';
                $.each(model,function(idx,mode){
                    if(mode.typeName==$currType){
                        sel = 'selected';
                    }else{
                        sel = '';
                    }
                    tmp += '<option value="{{value}}" {{selected}}>{{type}}</option>'
                        .replace('{{value}}',mode.typeID)
                        .replace('{{type}}',mode.typeName)
                        .replace('{{selected}}',sel);
                });
                $selector.append(tmp);  
              }   
            }
          });
        }
      });
    }
  }
});