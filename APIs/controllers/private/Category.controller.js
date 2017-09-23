/**
 * Created by Aditya on 04-Sep-17.
 */
var router = require('express').Router();
var Category = require('../../models/Category/Category');
var util = require('../../utils/util');
var Response = require('../../../config/Response');

router.post('/category', function (req, res) {
    var postData = Object.assign({}, req.body);
    postData.User = req.user.id;
    postData.name = postData.name.toString().trim().toLowerCase();
    util.getModel('Category')
        .then(function (model) {
            if(util.validateInputs(model, postData)){
                Category.findOne({
                    name : postData.name,
                    User : req.user._id
                }, function (err, category) {
                    if(category){
                        res.status(Response.ResourceConflict.code);
                        res.json(Response.ResourceConflict.message);
                    }else{

                        var newCategory = new Category(util.getPostObject(model, postData));
                        newCategory.save(function (err , category) {
                            if(err) {
                                res.status(Response.InternalServerError.code);
                                res.json(Response.InternalServerError.message);
                            } else {
                                res.status(Response.Created.code);
                                res.json(Response.Created.message);
                            }
                        })
                    }
                })
            } else{
                res.status(Response.InvalidParameters.code);
                res.json(Response.InvalidParameters.message);
            }
        },function () {
            res.status(Response.InternalServerError.code);
            res.json(Response.InternalServerError.message);
        })
        .catch(function () {
            res.status(Response.InternalServerError.code);
            res.json(Response.InternalServerError.message);
        });
});

router.get('/category',function (req, res) {
    var skip = req.query.skip ? parseInt(req.query.skip) : 0;
    var limit = req.query.limit ? parseInt(req.query.limit) : 10;

    Category.find({User : req.user._id})
        .populate('User', '-password -created_at -updated_at')
        .skip(skip)
        .limit(limit)
        .exec(function (err , categories) {
            if(err){
                res.status(Response.InternalServerError.code)
                res.json(Response.InternalServerError.message);
            }
            res.json(categories);
        })
});


router.get('/category/:id',function (req, res) {
    Category.findOne({User : req.user._id, _id : req.params.id})
        .exec(function (err , category) {
            if(err){
                res.status(Response.InternalServerError.code)
                res.json(Response.InternalServerError.message);
            }
            if(category) {
                res.json(category);
            } else {
                res.status(Response.ResourceNotFound.code);
                res.json(Response.ResourceNotFound.message);
            }
        })
});

module.exports = router;