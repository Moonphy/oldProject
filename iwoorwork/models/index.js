var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect(config.db, function (err) {
    if (err) {
        console.error('connect to %s error: ', config.db, err.message);
        process.exit(1);
    }
});

process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through app termination');
        process.exit(0);
    });
});


// models

var WebSite = require('./WebSiteModel');
var WebFolder = require('./WebFolderModel');
var Member = require('./MemberModel');
var ActiveCode = require('./ActiveCodeModel');
var Fun = require('./FunModel');
var Question = require('./QuestionModel');

module.exports = {
    WebSite:WebSite,
    WebFolder:WebFolder,
    Member:Member,
    ActiveCode:ActiveCode,
    Fun: Fun,
    Question: Question
};

