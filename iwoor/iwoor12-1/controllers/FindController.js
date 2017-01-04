var WebUrl = require('../models/WebUrlModel');
var WebFolder = require('../models/WebFolderModel');
var WebFolderType = require('../models/WebFolderTypeModel');
var Member = require('../models/MemberModel');
var async = require('async');


exports.FolderType = function(req,res){
    var id = req.query.typeId;
    var page = parseInt(req.query.p, 10) || 0;
    var count = 18;
    var index = page*count;

    if(id){
        WebFolderType.find({},function(err,web_folder_types){
            WebFolderType.findById(id, function (err, web_folder_type) {
                WebUrl.find({types:web_folder_type}).exec(function (err,web_urls) {
                    var _web_urls = web_urls.slice(index, index + count);
                    res.render('find',{
                        web_folder_types: web_folder_types,
                        web_folder_type: web_folder_type,
                        query: 'typeId=' + id,
                        web_urls: _web_urls,
                        currentPage: page+1,
                        totalPage: Math.ceil(web_urls.length/count)
                    })
                })
            })
        })
    }
    else{
        WebFolderType.find({},function(err,web_folder_types){
            WebUrl.find({}).exec(function (err,web_urls) {
                var _web_urls = web_urls.slice(index, index + count);
                res.render('find',{
                    web_folder_types: web_folder_types,
                    web_urls: _web_urls,
                    currentPage: page+1,
                    query: 'typeId=' ,
                    totalPage: Math.ceil(web_urls.length/count)
                })
            })
        })
    }
};

exports.find_folder = function (req,res) {
    var id = req.query.typeId;
    var page = parseInt(req.query.p, 10) || 0;
    var count = 5;
    var index = page*count;

    if(id){
        WebFolderType.find({},function(err,web_folder_types){
            WebFolderType.findById(id, function (err, web_folder_type) {
                WebFolder
                    .find({web_folder_type_id:id})
                    .populate('web_urls')
                    .exec(function (err,web_folders) {
                        var _web_folders = web_folders.slice(index, index + count);

                        res.render('find_folder',{
                            web_folder_types: web_folder_types,
                            web_folder_type: web_folder_type,
                            web_folders: _web_folders,
                            query: 'typeId=' + id,
                            currentPage: page+1,
                            totalPage: Math.ceil(web_folders.length/count)
                        })
                    })
            })
        })
    }
    else{
        WebFolderType.find({},function(err,web_folder_types){
            WebFolder
                .find({})
                .populate('web_urls')
                .exec(function (err,web_folders) {
                    var _web_folders = web_folders.slice(index, index + count);
                    res.render('find_folder',{
                        web_folder_types: web_folder_types,
                        web_folders: _web_folders,
                        query: 'typeId=' + id,
                        currentPage: page+1,
                        totalPage: Math.ceil(web_folders.length/count)
                    })
                })
        })
    }

};


exports.folder_user = function (req,res) {
    var id = req.query.typeId;
    var page = parseInt(req.query.p, 10) || 0;
    var count = 10;
    var index = page*count;

    if(id){
        WebFolderType.find({},function(err,web_folder_types) {
            WebFolderType.findById(id, function (err, web_folder_type) {
                Member.find({web_folder_types:id}).exec(function (err, members) {        //.exclude('web_folder_type')
                    //console.log(members);
                    var result = [];
                    async.each(members, function (member, callback) {
                        var _id = member._id;
                        //console.log('mid=' + id);
                        WebFolder.find({member_id: _id,web_folder_type_id: id}).populate('web_urls').limit(3).exec(function (err, web_folders) {
                            if (err) {
                                callback(err);
                            } else {
                                var o = {};
                                o._id = member._id;
                                o.name = member.name;
                                o.image = member.image;
                                o.web_folders = web_folders;
                                result.push(o);
                                callback(null);
                            }
                        });
                    }, function (err) {
                        var _results = result.slice(index, index + count);
                        res.render('find_user',{
                            web_folder_types: web_folder_types,
                            web_folder_type: web_folder_type,
                            members: _results,
                            query: 'typeId=' + id,
                            currentPage: page+1,
                            totalPage: Math.ceil(members.length/count)
                        });
                    });
                })
            })
        })
    }
    else{
        WebFolderType.find({},function(err,web_folder_types) {
            Member.find({}).exec(function (err, members) {
                var result = [];
                async.each(members, function (member, callback) {
                    var id = member._id;
                    //console.log('mid=' + id);
                    WebFolder.find({member_id: id}).limit(3).populate('web_urls').exec(function (err, web_folders) {
                        if (err) {
                            callback(err);
                        } else {
                            var o = {};
                            o._id = member._id;
                            o.name = member.name;
                            o.image = member.image;
                            o.web_folders = web_folders;
                            result.push(o);
                            callback(null);
                        }
                    });
                }, function (err) {
                    var _results = result.slice(index, index + count);
                    res.render('find_user',{
                        web_folder_types: web_folder_types,
                        members: _results,
                        query: 'typeId=' + id,
                        currentPage: page+1,
                        totalPage: Math.ceil(members.length/count)
                    });
                });
            })
        })
    }

};


/*
exports.folder_user = function (req,res) {
    var id = req.params.id;
    WebFolderType.find({},function(err,web_folder_types) {
        WebFolderType.findById(id, function (err, web_folder_type) {
            Member.find({}).limit(10).exec(function (err, members) {        //.exclude('web_folder_type')
                var result = [];
                async.each(members, function (member, callback) {
                    var _id = member._id;
                    //console.log('mid=' + id);
                    WebFolder.find({member_id: _id,web_folder_type_id: id}).populate({path:'web_urls',options:{limit:7}}).limit(3).exec(function (err, web_folders) {
                        if(web_folders.length<3){
                            WebFolder.find({}).limit(3-web_folders.length).exec(function (err,web_folders) {
                                if (err) {
                                    callback(err);
                                } else {
                                    var o = {};
                                    o._id = member._id;
                                    o.name = member.name;
                                    o.image = member.image;
                                    o.web_folders = web_folders;
                                    result.push(o);
                                    callback(null);
                                }
                            })
                        }else{
                            if (err) {
                                callback(err);
                            } else {
                                var o = {};
                                o._id = member._id;
                                o.name = member.name;
                                o.image = member.image;
                                o.web_folders = web_folders;
                                result.push(o);
                                callback(null);
                            }
                        }
                    });
                }, function (err) {
                    res.render('find_user',{
                        web_folder_types: web_folder_types,
                        web_folder_type: web_folder_type,
                        members: result
                    });
                    //res.json(result)
                });
            })
        })
    })
};
*/


