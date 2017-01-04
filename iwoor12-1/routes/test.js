var WebFolderType = require('../models/WebFolderTypeModel');
var WebFolder = require('../models/WebFolderModel');
var WebUrl = require('../models/WebUrlModel');
var Member = require('../models/MemberModel');

var async = require('async');

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;


function saveTypes(callback){
    var types = [];
    for(var i=1;i<=68;i++){
        types.push({name:'分类'.concat(i),seq:i});
    }
    WebFolderType.create(types,function(err){
        if(err){
            callback(err);
        }else{
            callback(null,arguments);
        }
    });
}

function saveMembers(callback){
    var members = [];
    for(var i=1;i<=100;i++){
        members.push({name:'会员' + i,image:'/images/example/touxiang.jpg'});
    }
    Member.create(members,function(err){
        if(err){
            callback(err);
        }else{
            callback(null,arguments);
        }
    });
}

function saveUrl(callback){
    var urls = [];
    var tags = ['设计','网银','程序','开发','建设','旅行','旅游','电话','手机','电脑'];
    for(var i=1;i<1000;i++){
        var from = Math.ceil(Math.random()*4);
        var to = Math.ceil(Math.random()*4) + 4;
        urls.push({name:'网站链接' + i,url:'http://www.7090.com/' + i,introduce:'这是一个中国最热的设计社交类网站，很 在这里集合了中国大部分设计师',tags:tags.slice(from,to)});
    }

    WebUrl.create(urls,function(err){
        if(err){
            callback(err);
        }else{
            callback(null,arguments);
        }
    });
}


function savePrev(callback){
    async.parallel([saveTypes,saveMembers,saveUrl],function(err,results){
        if(err){
            callback(err);
        }else{
            callback(null,results[0],results[1],results[2]);
        }
    });
}


function saveFolder(oTypes,oMembers,oUrls,callback){
    var folders  = [];

    var index = 1;
    var urlMap = [];
    for(var i=1;i<oMembers.length;i++){
        var total = Math.ceil(Math.random()*20);

        for(var n=0;n<total;n++){
            var type = oTypes[Math.ceil((Math.random()*(oTypes.length-1)))];
            var member = oMembers[i];
            var name = '文件夹' + total + ':' + member.name + ">" + type.name;
            var urls = [];
            var count = Math.ceil(Math.random()*20);
            for(var c=1;c<=count;c++){
                var urlIndex = Math.ceil((Math.random()*(oUrls.length-1)));
                urls.push(oUrls[urlIndex]._id);
            }
            folders.push({name:name,web_folder_type_id:type._id,member_id:member._id,web_urls:urls});
            urls.forEach(function(url){
                if(!urlMap[url]){
                    urlMap[url] = [type._id];
                }else{
                    urlMap[url] = urlMap[url].concat(type._id);
                }
            });
        }
    }

    async.parallel([
        function(callback){
            WebFolder.create(folders,function(err){
                if(err){
                    callback(err);
                }else{
                    callback(null,arguments);
                }
            });
        },
        function(callback){
            var urls = [];
            for(var url in urlMap){
                urls.push(url);
            }

            async.each(urls,function(url,callback){
                //console.log(url + "=>" + );
                WebUrl.findById(url,function(err,oUrl){
                    oUrl.types = urlMap[url];
                    oUrl.save(function(err,result){
                        callback(err);
                    });
                });
            },function(err){
                callback(err);
            });

        }
    ],function(err,result){
        callback(err);
    });


}


router.get('/data/',function(req,res){
    async.waterfall([savePrev,saveFolder],function(err,result){
        res.send('ok');
        if(err){
            console.log(err);
        }else{
            //console.log(result);
        }
    });
});


router.get('/t',function(req,res){
    WebFolderType.findOne({},function(err,type){
        WebUrl.find({types:type._id}).populate('types').exec(function(err,urls){
            res.json(urls);
        });
    });
});

router.get('/t1',function(req,res){
    Member.find({}).exec(function(err,members){
        async.each(members,function(member,callback){
            var mid = member._id;
            WebFolder.find({member_id:mid},function(err,folders){
                folders.forEach(function(f){
                    var typeId = f.web_folder_type_id;
                    member.web_folder_types.push(typeId);
                    member.save(function (err,member) {
                        console.log(member)
                    });
                });
            });
        },function(err){
            if(err){
                console.log(err);
                res.send('Fail!');
            }else{
                res.send('ok');
            }

        });
    });
});

/*router.get('/t1',function(req,res){
    Member.find({}).exec(function(err,members){
        async.each(members,function(member,callback){
            var mid = member._id;
            WebFolder.find({member_id:mid},function(err,folders){
                //var types = {};
                folders.forEach(function(f){
                    var typeId = f.web_folder_type_id;
                    //types[typeId] = 1;
                    member.web_folder_types.push(typeId);
                    member.save(function (err,member) {
                        console.log(member)
                    });
                });

                //var typeIds = [];
                //for(var key in types){
                //    typeIds.push(key);
                //}

                //member['web_folder_types'] = typeIds;
                //console.log(member);
                //console.log(typeIds);


                //Member.findByIdAndUpdate(member._id,{$set:{web_folder_types:typeIds}},function(err,result){
                //    callback(err);
                //});
                //member.update({web_folder_types:typeIds},function(err,result){
                //
               // });
            });
        },function(err){
            if(err){
                console.log(err);
                res.send('Fail!');
            }else{
                res.send('ok');
            }

        });
    });
});*/

module.exports = router;

