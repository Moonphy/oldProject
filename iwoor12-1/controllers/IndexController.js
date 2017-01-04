var WebUrl = require('../models/WebUrlModel');
var WebFolder = require('../models/WebFolderModel');
var WebFolderType = require('../models/WebFolderTypeModel');
var Member = require('../models/MemberModel');
var async = require('async');

exports.indexFolder = function (req,res) {
    var id = req.body.id;
    if(id){
        Member.findById(id, function (err, member) {
            WebFolder.find({member_id: id}).limit(5).exec(function (err, web_folders) {
                if (err) {
                    callback(err);
                } else {
                    var user = {};
                    user._id = member._id;
                    user.name = member.name;
                    user.image = member.image;
                    user.web_folders = web_folders;
                    user.save(function (err) {
                        console.log(user);
                        res.render('index',{
                            member: user
                        })
                    })
                }

            });
        })
    }else{
        WebFolder.find({}).limit(5).exec(function (err, web_folders) {
            console.log(web_folders);
            res.render('index',{
                web_folders: web_folders
            })
        })
    }
};
