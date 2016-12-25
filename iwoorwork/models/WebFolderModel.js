var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var WebFolderSchema = new Schema({
    name:{type:String},
    member:{type:ObjectId,ref:'members'}
});


module.exports = mongoose.model('webfolders', WebFolderSchema);