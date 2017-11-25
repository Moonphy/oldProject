var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var CommentSchema = new Schema({
    member_id:{type:ObjectId,ref:'members'},
    content: String,
    create_time:{type:Date,default:new Date()},
    reference:{type:ObjectId,ref:'comments'}
});

module.exports = mongoose.model('comments',CommentSchema);