var express = require('express');
var router = express.Router();


router.get('/about_us.html',function(req,res){
  res.render('about_us');
});

router.get('/bookmark.html',function(req,res){
  res.render('bookmark');
});

router.get('/edit.html',function(req,res){
  res.render('edit');
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

router.get('/website.html',function(req,res){
  res.render('website');
});

router.get('/website_detail.html',function(req,res){
  res.render('website_detail');
});


module.exports = router;
