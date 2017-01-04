var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var WebsiteSchema = new Schema({
    name:{type:String},
    url:{type:String},
    introduce:{type:String}
});


module.exports = mongoose.model('web_sites', WebsiteSchema);