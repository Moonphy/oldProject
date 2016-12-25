var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    name: String,
    comment: String,
    time: Date
});

var AnswerSchema = new Schema({
    name: String,
    answer: String,
    time: Date,
    like: [],
    comments: [CommentSchema]
});


var QuestionSchema = new Schema({
    name: String,
    title: String,
    content: String,
    answer: [AnswerSchema],
    time: Date,
    like: [],
    follow: [],
    tags: []
});

module.exports = mongoose.model('question',QuestionSchema);