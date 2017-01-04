var express = require('express');
var config = require('./passport_config');


function init(tag){
    var router = express.Router();

    var passport = require('passport');
    var PassportStrategy = require('passport-' + tag).Strategy;

    var info = config[tag];

    passport.use(new PassportStrategy({
            clientID: info.clientID,
            clientSecret: info.clientSecret,
            callbackURL: info.callbackURL
        },
        function(accessToken, refreshToken, profile, done) {
            //User.findOrCreate({ qqId: profile.id }, function (err, user) {
            //    return done(err, user);
            //});

            console.log(profile._json);

            done(null,profile);
        }
    ));


    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        //User.findById(id, function (err, user) {
        //    done(err, user);
        //});

        done(null,{id:1,name:'alan'});
    });


    router.get('/auth/' + tag,
        passport.authenticate(tag),
        function(req, res){
            // The request will be redirected to qq for authentication, so this
            // function will not be called.
        });

    router.get('/auth/' + tag + '/callback',
        passport.authenticate(tag, { failureRedirect: '/login' }),
        function(req, res) {
            // Successful authentication, redirect home.
            res.redirect('/');
        });

    return router;
}

exports.passport = init;
