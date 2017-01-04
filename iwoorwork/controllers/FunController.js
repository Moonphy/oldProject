var Models = require('../models');
var Fun = Models.Fun;
var async = require('async');
var funs = require('../fun.json');

Fun.create(funs,function(err,result){
    console.log(result);
});

exports.index = function(req,res){
    var pageSize = 10;
    var pageNo = req.params.pageNo;
    var pageCount;
    var total;
    var funs;

    if(!pageNo){
        pageNo = 1;
    }
    var offset = (pageNo-1)*pageSize;

    async.parallel([
        function(done){
            Fun.count(function(err,c){
                total = c;
                done(err);
            });
        },
        function(done){
            Fun.find({}).skip(offset).limit(pageSize).exec(function(err,list){
                funs = list;
                done(err);
            });
        }
    ],function(err){
        pageCount = Math.ceil(total/pageSize);
        console.log(pageCount);
        res.render('fun',{funs:funs,pager:{pageSize:10,pageNo:pageNo,pageCount:pageCount,pageUrl:'/fun_'}});
    });
};

exports.detail = function(req,res){
    var id = req.params.id;
    console.log('id=' + id);

    Fun.get(id,function(err,fun){
        res.render('fun_detail',{fun:fun});
    });
};