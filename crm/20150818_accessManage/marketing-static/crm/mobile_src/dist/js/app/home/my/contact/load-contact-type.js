BTR.define(["require","exports","module","../../../base/index"],function(e,t,n){var r=e("../../../base/index"),i=r.$;n.exports={load:function(e,t){i.ajax({url:"/wx/phone/getContectType",success:function(n){r.state.check(n,function(n){if(n)if(i.isFunction(t))t.call(this,n);else if(i.type(t)=="object"||i.type(t)=="array"||i.type(t)=="string"){i.type(t)=="string"&&(t=i(t)),t.empty();var r="",s="";i.each(n,function(t,n){n.typeName==e?s="selected":s="",r+='<option value="{{value}}" {{selected}}>{{type}}</option>'.replace("{{value}}",n.typeID).replace("{{type}}",n.typeName).replace("{{selected}}",s)}),t.append(r)}})}})}}});