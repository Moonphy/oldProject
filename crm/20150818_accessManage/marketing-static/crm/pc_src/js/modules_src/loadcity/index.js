var $ = require('jquery');
var loadcity = function(){
    var exports = {};
    exports.loadProvince = function(target,id){
        $.ajax({
            url:'/base/province/find/all',
            errorMsg:'抱歉，拉取省份信息失败',
            callback:function(models){
                if (models.length == 0) return;
                var tmp = '';
                $.each(models, function (idx, mode) {
                    if (mode.proId == id)
                        tmp += '<option value="' + mode.proId + '" selected="selected">' + mode.proName + '</option>';
                    else
                        tmp += '<option value="' + mode.proId + '">' + mode.proName + '</option>';
                });
                target.append(tmp);
            }
        });
    }
    exports.loadCity = function(target,proId,id){
        if(!proId || proId==-1){return;}
        $.ajax({
            url:'/base/city/find/{proId}'.replace('{proId}',proId),
            errorMsg:'抱歉，拉取城市信息失败',
            callback:function(models){
                if(models.length==0) return;
                var tmp = '';
                $.each(models,function(idx,mode){
                    if (mode.cityId == id) {
                        tmp += '<option value="' + mode.cityId + '" selected="selected">' + mode.cityName + '</option>';
                    }else
                        tmp+='<option value="'+mode.cityId+'">'+mode.cityName+'</option>';
                });
                target.append(tmp);
            }
        });
    }
    exports.loadArea = function(target,cityId,id,callback){
        if(!cityId || cityId==-1){return;}
        $.ajax({
            url:'/base/area/find/{cityId}'.replace('{cityId}',cityId),
            errorMsg:'抱歉，拉取省份信息失败',
            callback:function(models){
                if(models.length==0) return;
                var tmp = '';
                $.each(models,function(idx,mode){
                    if (mode.areaId == id){
                        tmp+='<option value="'+mode.areaId+'" selected="selected">'+mode.areaName+'</option>';
                        callback && callback(mode.cityId);
                    }else
                        tmp+='<option value="'+mode.areaId+'">'+mode.areaName+'</option>';
                });
                target.append(tmp);
            }
        });
    }
    exports.loadAreaFull = function(callback){
        $.ajax({
            url:'/wx/user/find/fullArea',
            errorMsg:'抱歉，拉取省份信息失败',
            callback:function(model){
                callback(model);
            }
        });
    }
    return exports;
}();
module.exports = loadcity;
