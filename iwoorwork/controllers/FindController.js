var Models = require('../models');
var WebSite = Models.WebSite;
var WebFolder = Models.WebFolder;
var Member = Models.Member;

exports.test = function(req,res){
    /*var member = [{name:'member1',image:'http://i0.moihu.com/images/face/big/face_1102_100x100.jpg'},{
        name:'member2',image:'http://i0.moihu.com/images/face/big/face_1102_100x100.jpg'
    }];
    Member.create(member,function(err,result){
        var folder = [{
         name:'folder1',
         member:result._id
        },{
         name:'folder2',
         member:result._id
        },{
         name:'folder3',
         member:result._id
        }];

        WebFolder.create(folder,function(err,result){
            var website = [{
                name:'百度',
                url:'http://www.baidu.com',
                introduce:'百度一下，你就知道',
                tags:['搜索引擎','搜索','引擎'],
                folder:result._id
            },{
                name:'美乎',
                url:'http://www.moihu.com',
                introduce:'发现美，分享生活',
                tags:['装修','家居','家具'],
                folder:result._id
            },{
                name:'优酷',
                url:'http://www.youku.com',
                introduce:'shipin知道',
                tags:['视频','电影','电视'],
                folder:result._id
            }];
            WebSite.create(website,function(){
                console.log(result);
                res.send('ok');
            });

        });

    });*/
    WebFolder.findOne(function (err,folder) {
        console.log(folder);
        WebSite.findOne({}).populate('folder').exec(function(err,website){
            console.log(website);
            res.render('test',{folder:folder,website:{name:website.name,url:website.url}});
        });
    });

    /*WebSite.findOne({}).populate('folder').exec(function(err,website){
        res.render('test',{name:website.name,url:website.url,introduce:website.introduce,tags:website.tags,folder:website.folder.name});
    });*/
};


