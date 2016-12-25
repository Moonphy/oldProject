var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var MemberSchema = new Schema({
    name:{type:String},
    image:{type:String},
    web_folder_types:[{type:ObjectId,ref:'web_folder_types'}]
});


module.exports = mongoose.model('members', MemberSchema);