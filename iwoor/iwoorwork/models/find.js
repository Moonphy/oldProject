var mongoose = require('mongoose');

var findSchema = new mongoose.Schema({
    name: string,
    head: string,
    tags: string
},{
    collection: 'finds'
});
var findModel = mongoose.model('find',findSchema);

/*function Find(name,head,tags){

}
 module.exports = Find;*/

exports.getPage = function (os) {

};
exports.search = function (keyword,callback) {
    var pattern = new ReExp("^." + keyword + ".*$","i");
    findModel.find({
        "tags": pattern
    }).sort({
        time: -1
    }).toArray(function (err,result) {
        if(err){
            callback(err);
        }else{
            callback(null,result);
        }
    })
};
