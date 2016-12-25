var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var WebFolderTypeSchema = new Schema({
    name:{type:String},
    is_new:{type:Boolean},
    is_hot:{type:Boolean},
    seq:{type:Number}
});


module.exports = mongoose.model('web_folder_types', WebFolderTypeSchema);