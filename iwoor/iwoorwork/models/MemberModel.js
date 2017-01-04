var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MemberSchema = new Schema({
    name:{type:String},
    image:{type:String},
    summary: {type: String}
});


module.exports = mongoose.model('members', MemberSchema);