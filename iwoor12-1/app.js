var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session    = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var config = require('./config');

mongoose.connect(config.db, function (err) {
    if (err) {
        console.error('connect to %s error: ', config.db, err.message);
        process.exit(1);
    }
});


var bodyParser = require('body-parser');

var routes = require('./routes/index');

var threePart = require('./middleware/passport');


var passport = require('passport');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: '__i_love_iwoor__',
    store: new MongoStore({
        db : 'iwoor'
    })
}));

app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use('/css',express.static(path.join(__dirname, 'public','css')));
app.use('/js',express.static(path.join(__dirname, 'public','js')));
app.use('/images',express.static(path.join(__dirname, 'public','images')));
app.use('/upload',express.static(path.join(__dirname, 'public','upload')));
app.use('/admin',express.static(path.join(__dirname, 'public','admin')));

app.use(passport.initialize());

app.use('/',threePart.passport('qq'));
app.use('/',threePart.passport('weibo'));
app.use('/',threePart.passport('douban'));
app.use('/',threePart.passport('renren'));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

process.on('uncaughtException',function(err){
    console.log('uncaughtException:%s',err.stack);
});

process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through app termination');
        process.exit(0);
    });
});


module.exports = app;
