var express = require('express');
var router = express.Router();

router.get('/question.html',function(req,res){
    console.log('question is render.....');
    res.render('question');
});


router.get('/question_attend.html',function(req,res){
    res.render('question_attend');
});

router.get('/question_detail.html',function(req,res){
    res.render('question_detail');
});

router.get('/question_my.html',function(req,res){
    res.render('question_my');
});

module.exports = router;