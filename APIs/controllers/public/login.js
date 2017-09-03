/**
 * Created by Aditya on 03-Sep-17.
 */
var router =  require('express').Router();
var User = require('../../models/User/User');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require('config');
var util = require('../../utils/util');


router.post('/login',function (req, res) {
    if(req.body.phone_number !== undefined && req.body.password !== undefined){
        User.findOne({phone_number : req.body.phone_number}, function (err, user) {
            if(user){
                bcrypt.compare(req.body.password, user.password, function (err, result) {
                    if(err){
                        res.status(500);
                        res.json({"message" : "Internal server error"})
                    }
                    if(result === true){
                        var token = jwt.sign({id : user._id}, config.auth_secret ,{expiresIn: 10080});
                        res.json({ message: "success", token: 'JWT ' + token });
                    } else {
                        res.status(400);
                        res.json({message : "Validation failure"});
                    }
                })
            } else{
                res.status(404);
                res.json({message : "User not found"});
            }
        })
    } else {
        res.status(400);
        res.json({message : "Invalid parameters"});
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
                        res.status(409);
                        res.json({message : "Resource conflict"})
                    } else{
                        var newUser = new User(util.getPostObject(model, req.body));
                        newUser.save(function (err , user) {
                            if(err) {
                                res.status(500);
                                res.json({"message" : "Internal server error"})
                            } else {
                                res.json({"message" : "success"});
                            }
                        });
                    }
                })
            }else {
                res.status(400);
                res.json({"message" : "invalid parameters"})
            }
        },function () {
            res.status(500);
            res.json({message : "Internal server error"});
        })
        .catch(function () {
            res.status(500);
            res.json({message : "Internal server error"})
        });
});


module.exports = router;


