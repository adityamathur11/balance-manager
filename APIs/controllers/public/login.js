/**
 * Created by Aditya on 03-Sep-17.
 */
var router =  require('express').Router();
var User = require('../../models/User/User');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require('config');
var util = require('../../utils/util');
var Response = require('../../../config/Response');


router.post('/login',function (req, res) {
    if(req.body.phone_number !== undefined && req.body.password !== undefined){
        User.findOne({phone_number : req.body.phone_number}, function (err, user) {
            if(user){
                bcrypt.compare(req.body.password, user.password, function (err, result) {
                    if(err){
                        res.status(Response.InternalServerError.code);
                        res.json(Response.InternalServerError.message)
                    }
                    if(result === true){
                        var token = jwt.sign({id : user._id}, config.auth_secret ,{expiresIn: config.tokenExpireTime});
                        res.json({token: 'JWT ' + token });
                    } else {
                        res.status(Response.InvalidCredentials.code);
                        res.json(Response.InvalidCredentials.message);
                    }
                })
            } else{
                res.status(Response.ResourceNotFound.code);
                res.json(Response.ResourceNotFound.message);
            }
        })
    } else {
        res.status(Response.InvalidParameters.code);
        res.json(Response.InvalidParameters.message);
    }
});

router.post('/register',function (req, res) {
    util.getModel('User')
        .then(function (model) {
            if(util.validateInputs(model, req.body)){
                User.findOne({
                    phone_number: req.body.phone_number
                },function (err , user) {
                    if(user){
                        res.status(Response.ResourceConflict.code);
                        res.json(Response.ResourceConflict.code)
                    } else{
                        var newUser = new User(util.getPostObject(model, req.body));
                        newUser.save(function (err , user) {
                            if(err) {
                                res.status(Response.InternalServerError.code);
                                res.json(Response.InternalServerError.message);
                            } else {
                                res.json(Response.Success.message);
                            }
                        });
                    }
                })
            }else {
                res.status(Response.InvalidParameters.code);
                res.json(Response.InvalidParameters.message)
            }
        },function () {
            res.status(Response.InternalServerError.code);
            res.json(Response.InternalServerError.message);
        })
        .catch(function () {
            res.status(Response.InternalServerError.code);
            res.json(Response.InternalServerError.message)
        });
});


module.exports = router;


