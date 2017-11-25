var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var WebFolderSchema = new Schema({
    name:{type:String},
    member_id:{type:ObjectId,ref:'members'},
    web_folder_type_id:{type:ObjectId,ref:'web_folder_types'},
    web_urls:[{type:ObjectId,ref:'web_urls'}],
    seq:{type:Number,default:99}
});


module.exports = mongoose.model('web_folders', WebFolderSchema);