var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var WebsiteSchema = new Schema({
    name:{type:String},
    url:{type:String},
    introduce:{type:String},
    tags:[String],
    folder:{type:ObjectId,ref:'webfolders'},
    member:{type:ObjectId,ref:'members'}    //populate到member的name和image
});


module.exports = mongoose.model('websites', WebsiteSchema);