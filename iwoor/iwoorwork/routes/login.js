var express = require('express');
var router = express.Router();
var emailjs = require("emailjs");
var uuid = require('uuid');
var member = require('../controllers/MemberController');


router.get('/login',function(req,res){
    res.render('login');
});

router.post('/login',function(req,res){
    console.log(req.params);
    console.log(req.body);

    if(req.body.username=='alan' && req.body.password=='123'){
        req.session.username = req.body.username;
        res.redirect('/welcome');
    }else{
        res.redirect('/login');
    }
});

router.get('/reg/email/active',function(req,res){
    var code = req.query.code;
    MemberController.find_active_code(code,function(err,record){
        if(err){
            res.json({code:1});
        }else{
            if(record.active){
                res.json({code:3,errorMsg:'您的邮箱已激活！'});
            }else{
                res.redirect('http://www.iwoor.com/register.html?code=' + code);
            }
        }
    });
});

router.post('/reg/email',function(req,res){

    var email = req.body.email;
    console.log(email);
    var emailServer = email.replace(/.*?@(.*)/g,'http://mail.$1/');
    console.log(emailServer);
    var code = uuid.v4();

    console.log( code);

    var server = emailjs.server.connect({
        user:"admin@iwoor.com",
        password:"adm@168",
        host:"smtp.exmail.qq.com"
    });

    var url = 'http://www.iwoor.com/reg/email/active?code=' + code;
    var html = "<html>点击链接<a href='{url}'>{url}</a></html>激活的邮件！".replace(/[{]url[}]/g,url);

    MemberController.create_active_code({email:email,code:code,active:false},function(err){
        if(err){
            res.json({code:2});
        }else{
            server.send({
                from:"爱窝网 <admin@iwoor.com>",
                to:email,
                subject:"激活邮箱，来自爱窝网",
                attachment:
                    [
                        {data:html, alternative:true}
                    ]
            },function(err,message){

                if(err){
                    res.json({code:1,errorMsg:'激活邮件发送失败，请稍后再试！'});
                }else{
                    res.json({code:0,email:email,server:emailServer});
                }
            });
        }
    });
});

module.exports = router;
