/**
 * Created by Aditya on 03-Sep-17.
 */
var route = require('express').Router();
var User = require('../../models/User/User');

route.get('/users/:id', function (req, res) {
    User.findOne({_id : req.params.id}, function (err , user1) {
        var user = Object.assign({}, user1._doc);
        if(err) {
            res.status(500);
            res.json({message : "Internal server err"})
        }
        if(user._id.toString() === req.user._id.toString()) {
            delete user.password;
            res.json({
                message: "success",
                data: user
            });
        } else{
            delete user.password;
            delete user.phone_number;
            res.json({
                message : "success",
                data : user
            })
        }
    })
});

route.get('/users',function (req, res) {
    var skip = req.query.skip ? parseInt(req.query.skip) : 0;
    var limit = req.query.limit ? parseInt(req.query.limit) : 10;

    User.find()
        .select(["first_name", "last_name" , "email", "phone_number"])
        .skip(skip)
        .limit(limit)
        .exec(function (err , users) {
            res.json(users);
        })
});

module.exports = route;