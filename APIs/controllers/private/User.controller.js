/**
 * Created by Aditya on 03-Sep-17.
 */
var route = require('express').Router();
var User = require('../../models/User/User');

route.get('/user/:id', function (req, res) {
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

module.exports = route;