var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var WebUrlSchema = new Schema({
    name:{type:String},
    url:{type:String},
    introduce:{type:String},
    tags:[{type:String}],
    web_site_id:{type:ObjectId,ref:'web_sites'},
    create_time:{type:Date,default:new Date()},
    counter:{
        favor_count:{type:Number,default:0},
        comment_count:{type:Number,default:0},
        gather_count:{type:Number,default:0}
    },
    types:[{type:ObjectId,ref:'web_folder_types'}],
    comments:[{
        type:ObjectId,ref:'comments'
    }]
});


module.exports = mongoose.model('web_urls', WebUrlSchema);