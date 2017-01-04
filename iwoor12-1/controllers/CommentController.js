var Comment = Models.require('../models/CommentModel');


exports.CommentSave = function (req, res) {
    var fun_id = req.body._id;
    var from = 'test';
    var content = req.body.content;

    var comments = new Comment({
        fun: fun_id,
        from: from,
        content: content
    });

    comments.save(function (err,result) {
        if(err){
            console.log(err);
        }
        console.log(result);
    })
}