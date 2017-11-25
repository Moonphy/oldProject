var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var LikeSchema = new Schema({
    fun:{type:ObjectId,ref:'funs'},
    name: String,
    date:{type:Date,default:new Date()}
});

module.exports = mongoose.model('like',LikeSchema);