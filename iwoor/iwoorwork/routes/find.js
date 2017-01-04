var Find = require('../models/find.js'),
    fs = require('fs'),
    member = require('../data/member.js');

var express = require('express');
var router = express.Router();

module.exports = router;

router.get('find.html', function (req,res) {
    var page = req.query.p ? parseInt(req.query.p) : 1;
    Find.getPage(null,page, function (err) {
        if(err){

        }
        res.render('find',{});
    });
});