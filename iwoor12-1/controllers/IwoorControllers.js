var Fun = require('../models/FunModel');
var Question = require('../models/QuestionModel');

exports.save = function (req, res) {
    var date = new Date();
    var comments = [{
        name: '张燕',
        comment: 'very good',
        time: date
    },
        {name: '哈哈',
        comment: '好好',
        time: date+1}];

    var title = 'git 的初步使用方法 ';
    var time = date;
    var content = '[查看图文]准备纹身的朋友也许用得上，在这个网站里有各种哥特式的英文字体，你可以预览自定义的文字字体，满意后下载下来给纹身师就可以了。。。在输入框里输入你要的文字（英文）设置一下字体大小，点击Create Ta...';
    var tags = ['tags1','tags2','tags3'];
    var like = ['夺震','压根夺','感动天'];
    var img = 'images/examples/fun.jpg';

    var fun = new Fun({
        title: title,
        time: time,
        content: content,
        tags: tags,
        comments: comments,
        like: like,
        img: img
    });

    fun.save(function (err) {
        if(err){
            console.log(err);
        }
        console.log('保存成功');
    });

    Fun.find({}).limit(10).exec(function (err, funweb) {
        if(err){
            console.log(err);
        }else{
            Fun.aggregate([{$unwind:"$like"},{$unwind:"$comments"},{$group:{_id:{content:"$content",title:"$title",time:"$time",img:"$img",tag:"$tags"},count:{$sum:1}}}],function(err,count){
               if(err){
                   console.log(err);
               }else{
                   console.log(count);
                   res.render('fun',{
                   funweb: count
        });
               }
            })
        }

//        console.log(funweb);
//        res.render('fun',{
//            funweb: funweb
//        });
    });

};


exports.SaveQA = function (req,res) {
  var date = new Date();
  var comments = [{
      name: '张燕',
      comment: 'very good',
      time: date
  }];
  var Answer = [{
      name: '哈哈',
      answer: '经典物理学所涉及的物理学领域通常是一些在量子力学与相对论之前发的 是广东省高的分公司该到时发个嘎的该…',
      time: date,
      like: ['财厅','有木有','霜压根'],
      comments: comments
  }];

    var question = new Question({
        name: '张三',
        title: '求几个韩国高清模特素材网站，最好的要免费的哦!谁有求推荐！',
        content: '经典物理学所涉及的物理学领域通常是一些在量子力学与相对论之前发的 是广东省高的分公司该到时发个嘎的该…',
        answer: Answer,
        time: date,
        like: ['在厅','厅天','在别'],
        follow: ['我电压','左励志哥','工奇才'],
        tags: ['物理学','韩国','量子力学']
    });
    question.save(function(err){
        if(err){
            console.log(err);
        }
        console.log('success');
    });
    Question.find({}).limit(10).exec(function (err,question) {
        if(err){
            console.log(err);
        }else{
            console.log(question);
            res.render('question',{
                question: question
            });
        }

    })
};

