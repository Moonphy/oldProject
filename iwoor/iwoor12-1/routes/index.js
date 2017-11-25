var express = require('express');
var fs = require('fs');
var path = require('path');

var router = express.Router();

var files = fs.readdirSync(__dirname);

files.forEach(function(item){
    var filePath = path.join(__dirname,item);
    if(filePath!=__filename){
        router.use('/',require('./' + item));
    }
});


module.exports = router;