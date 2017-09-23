/**
 * Created by Aditya on 02-Sep-17.
 */
var JwtStrategy = require('passport-jwt').Strategy
    ,ExtractJwt = require('passport-jwt').ExtractJwt
    ,config = require('config');

var Response = require('../../config/Response');

var User = require('../models/User/User');

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
opts.secretOrKey = config.auth_secret;


module.exports = function(passport) {
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {

        User.findOne({_id: jwt_payload.id}, function(err, user) {
            if (err) {
                Response.InternalServerError.message.name = "JsonWebTokenError";
                return done(err, false, Response.InternalServerError.message);
            }
            if (user) {
                done(null, user);
            } else {
                Response.ResourceNotFound.message.name = "JsonWebTokenError";
                done(null, false, Response.ResourceNotFound.message);
            }
        });
    }));
};