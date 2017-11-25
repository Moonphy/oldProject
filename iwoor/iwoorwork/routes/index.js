var express = require('express');
var gm = require('gm');
var funController = require('../controllers/FunController');
var findController  = require('../controllers/FindController');

var path = require('path');

var multipart = require('connect-multiparty');
var uploadRoot = path.join('public','upload','fun');

var multipartMiddleware = multipart({uploadDir:uploadRoot});

var router = express.Router();

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


router.get('/about_us.html',function(req,res){
  res.render('about_us');
});

router.get('/bookmark.html',function(req,res){
  res.render('bookmark');
});

router.get('/edit.html',function(req,res){
  res.render('edit');
});

router.get('/find.html',function(req,res){
    res.render('find');
});
//router.get('/find_:pageNo',findController.index);

router.get('/find_folder.html',function(req,res){
  res.render('find_folder');
});

router.get('/find_user.html',function(req,res){
  res.render('find_user');
});

router.get('/folder_detail.html',function(req,res){
  res.render('folder_detail');
});

router.get('/folder_edit.html',function(req,res){
  res.render('folder_edit');
});

router.get('/forget_password.html',function(req,res){
  res.render('forget_password');
});

router.get('/fun.html',funController.index);
router.get('/fun_:pageNo',funController.index);

router.get('/fun/:id',funController.detail);

router.get('/home.html',function(req,res){
  res.render('home');
});

router.get('/home_answer.html',function(req,res){
  res.render('home_answer');
});

router.get('/home_ask.html',function(req,res){
  res.render('home_ask');
});

router.get('/home_attend.html',function(req,res){
  res.render('home_attend');
});

router.get('/home_fans.html',function(req,res){
  res.render('home_fans');
});

router.get('/home_follwers.html',function(req,res){
  res.render('home_follwers');
});

router.get('/home_question.html',function(req,res){
  res.render('home_question');
});

router.get('/home_website.html',function(req,res){
  res.render('home_website');
});

router.get('/',function(req,res){
  res.render('index');
});

router.get('/index.html',function(req,res){
  res.render('index');
});

router.get('/index_base.html',function(req,res){
  res.render('index_base');
});

router.get('/index_login.html',function(req,res){
  res.render('index_login');
});

//router.get('/question.html',iwoor.SaveQA);


router.get('/question_attend.html',function(req,res){
  res.render('question_attend');
});

router.get('/question_detail.html',function(req,res){
  res.render('question_detail');
});

router.get('/question_my.html',function(req,res){
  res.render('question_my');
});

router.get('/register.html',function(req,res){
  res.render('register');
});

router.get('/register_step1.html',function(req,res){
  res.render('register_step1');
});

router.get('/register_step2.html',function(req,res){
  res.render('register_step2');
});

router.get('/search_folder.html',function(req,res){
  res.render('search_folder');
});

router.get('/search_fun.html',function(req,res){
  res.render('search_fun');
});

router.get('/search_question.html',function(req,res){
  res.render('search_question');
});

router.get('/search_user.html',function(req,res){
  res.render('search_user');
});

router.get('/search_website.html',function(req,res){
  res.render('search_website');
});

router.get('/setting.html',function(req,res){
  res.render('setting');
});

router.get('/test.html',function(req,res){
  res.render('test');
});

router.get('/website.html',function(req,res){
  res.render('website');
});

router.get('/website_detail.html',function(req,res){
  res.render('website_detail');
});

router.get('/test',findController.test);

module.exports = router;
