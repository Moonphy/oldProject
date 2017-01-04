var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FunSchema = new Schema({
    name:String,
    introduce:String,
    url:String,
    create_time: Date,
    tags: [String]
});

module.exports = mongoose.model('funs',FunSchema);