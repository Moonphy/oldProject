var express = require('express');
var router = express.Router();

var path = require('path');
var gm = require('gm');
var multipart = require('connect-multiparty');
var uploadRoot = path.join('public','upload','fun');

var multipartMiddleware = multipart({uploadDir:uploadRoot});

router.post('/upload', multipartMiddleware, function(req, res) {
    var filePath = req.files.file.path;
    var fileName = req.files.file.path.substr(uploadRoot.length+1);
    var middle = filePath.replace(/[.]jpg$/g,'_200x140.jpg');
    console.log('middle image:' + path.join('/','study','iwoor',middle));

    gm(filePath).resize(200,140,"^").gravity("center").extent(200,140).write(path.join('/','study','iwoor',middle),function(err){
        if(err){
            console.log(err);
        }
        var image = {code:0,
            image:{
                url:'/upload/fun/' + fileName,
                middle_url:'/upload/fun/' + middle,
                small_url:'/upload/fun/' + fileName
            }
        };

        res.json(image);
    });


});


module.exports = router;