var Models = require('../models');
var Question = Models.Question;
var Answer = Models.Answer;
var async = require('async');


exports.index = function(req,res){
    var pageSize = 10;
    var pageNo = req.params.pageNo;
    var pageCount;
    var total;
    var questions;

    if(!pageNo){
        pageNo = 1;
    }
    var offset = (pageNo-1)*pageSize;

    async.parallel([
        function(done){
            Question.count(function(err,c){
                total = c;
                done(err);
            });
        },
        //读取问题列表
        function(done){
            Question.find({}).skip(offset).limit(pageSize).exec(function(err,list){
                questions = list;
                console.log(questions);
                done(err);
            });
        }
    ],function(err){
        pageCount = Math.ceil(total/pageSize);
        console.log(pageCount);
        res.render('question',{questions:questions,pager:{pageSize:10,pageNo:pageNo,pageCount:pageCount,pageUrl:'/question/'}});
    });

};


exports.detail = function (req, res) {
    var id = req.params._id;
    console.log('id=' + id);

//    Question.findOne({_id:id}, function (err, detail) {
//        if (err) {
//            console.log(err);
//        }
//        question = detail;
//        console.log(question);
//        url = question.url;
//        Answer.findOne({url:url}, function (err, detail) {
//            if(err){
//                console.log(err);
//            }
//            answer = detail;
//            console.log(answer);
//        })
//    });
        res.render('question_detail',{question:question,answer:answer});
};