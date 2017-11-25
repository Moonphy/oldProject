var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ActiveCodeSchema = new Schema({
    email   : {type : String},
    code    : {type : String},
    active  : {type : Boolean, default:false}
});


module.exports = mongoose.model('active_codes', ActiveCodeSchema);