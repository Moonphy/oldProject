var express = require('express');
var router = express.Router();
var mongoClient = require('mongodb').MongoClient;

var empty = {code:1,errorMsg:'no result'};

router.get('/fun',function(req,res){

    mongoClient.connect('mongodb://localhost/iwoor',function(err,db){
        if(err){
            res.json(empty);
        }else{
            var funs = db.collection('funs');

            funs.find().toArray(function(err,results){
                if(err){
                    res.json(empty);
                }else{
                    res.json(results);
                }

            });
        }
    });

});

router.post('/fun',function(req,res){
    console.log(req.body);

    mongoClient.connect('mongodb://localhost/iwoor',function(err,db){
        if(err){
            res.json(empty);
        }else{
            var funs = db.collection('funs');

            var obj = req.body;

            if(obj.id>=0){
                funs.update({id:obj.id},obj,{w:1,upsert:true},function(err){
                    if(err){
                        res.json(empty);
                    }else{
                        res.json(results);
                    }
                    db.close();
                });
            }else{
                fun.remove({id:obj.id},function(err){
                    res.json(empty);
                    db.close();
                });
            }

        }
    });

    var empty = {code:0,errorMsg:''};
    res.json(empty);
});


module.exports = router;