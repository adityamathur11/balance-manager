/**
 * Created by aditya on 14/10/17.
 */
var express = require('express');
var router = express.Router();
var Utils = require('../../utils/util');
var Budget = require('../../models/Budget/Budget');
var Response = require('../../../config/Response');
var Category = require('../../models/Category/Category');

router.post('/budget', function (req, res) {
    var postData = req.body;
    postData.User = req.user.id;
    Utils
        .getModel('Budget')
        .then(function (model) {
            if(Utils.validateInputs(model, postData)){
                Category
                    .findOne({_id : postData.Category})
                    .exec(function (err, category) {
                        if(err){
                            res.status(Response.InternalServerError.code);
                            res.json(Response.InternalServerError.message);
                            return;
                        }
                        if(category === null){
                            res.status(Response.InternalServerError.code);
                            res.json(Response.InternalServerError.message);
                            return
                        }
                        Budget
                            .findOne({Category : postData.Category})
                            .exec(function (err, budget) {
                                if(err){
                                    res.status(Response.InternalServerError.code);
                                    res.json(Response.InternalServerError.message);
                                    return;
                                }
                                if(budget){
                                    res.status(Response.ResourceConflict.code);
                                    res.json(Response.ResourceConflict.message);
                                    return;
                                }

                                var newBudget = new Budget( Utils.getPostObject(model, postData));
                                newBudget.save(function (err, budget) {
                                    if(err){
                                        res.status(Response.InternalServerError.code);
                                        res.json(Response.InternalServerError.message);
                                        return;
                                    }
                                    else{
                                        res.status(Response.Created.code);
                                        res.json(Response.Created.message);
                                    }
                                })

                            })
                    })
            } else{
                res.status(Response.InvalidParameters.code);
                res.json(Response.InvalidParameters.message);
            }
        })
});

module.exports = router;