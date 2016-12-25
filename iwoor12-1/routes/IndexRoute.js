var express = require('express');
var router = express.Router();
var indexController  = require('../controllers/IndexController');


router.get('/',indexController.indexFolder);

router.get('/index.html',function(req,res){
    res.render('index');
});

router.get('/index_base.html',function(req,res){
    res.render('index_base');
});

router.get('/index_login.html',function(req,res){
    res.render('index_login');
});


module.exports = router;
