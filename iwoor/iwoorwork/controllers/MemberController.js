var Models = require('../models/index');
var activeCode = Models.ActiveCode;

exports.create_active_code = function (obj,callback) {
    activeCode.insert(obj,function(err){
        callback(err);
    });
};

exports.find_active_code = function(code,callback){
    activeCode.findOne({code:code},function(err,result){
        if(err){
            callback(err);
        }else{
            callback(null,result);
        }
    });
};