
var Like = require('../models/LikeModel');
var async = require('async');

exports.like = function (req, res) {
    var fun_id = req.body.fun_id;
    var name = 'test';

    Like.find({fun: fun_id, name: name}, function (err, result) {
        console.log(result);
        if (result.length == 0) {
            var like = new Like({
                fun: fun_id,
                name: name
            });

            like.save(function (err) {
                if (err) {
                    console.log(err);
                }
            });
        }
    });
};