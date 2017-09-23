/**
 * Created by Aditya on 04-Sep-17.
 */
var router = require('express').Router();
var Tag = require('../../models/Tags/Tags');
var util = require('../../utils/util');
var Response = require('../../../config/Response');

router.post('/tag', function (req, res) {
    var postData = Object.assign({}, req.body);
    postData.User = req.user.id;
    postData.name = postData.name.toString().trim().toLowerCase();
    util.getModel('Tags')
        .then(function (model) {
            if(util.validateInputs(model, postData)){
                Tag.findOne({
                    name : postData.name,
                    User : req.user._id
                }, function (err, tag) {
                    if(tag){
                        res.status(Response.ResourceConflict.code);
                        res.json(Response.ResourceConflict.message);
                    }else{

                        var newTag = new Tag(util.getPostObject(model, postData));
                        newTag.save(function (err , tag) {
                            if(err) {
                                res.status(Response.InternalServerError.code);
                                res.json(Response.InternalServerError.message);
                            } else {
                                res.status(Response.Created.code)
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

router.get('/tag',function (req, res) {
    var skip = req.query.skip ? parseInt(req.query.skip) : 0;
    var limit = req.query.limit ? parseInt(req.query.limit) : 10;

    Tag.find()
        .skip(skip)
        .limit(limit)
        .exec(function (err , tags) {
            if(err){
                res.status(Response.InternalServerError.code);
                res.json(Response.InternalServerError.message);
            }
            res.json(tags);
        })
});


router.get('/tag/:id',function (req, res) {
    Tag.findOne({User : req.user._id, _id : req.params.id})
        .exec(function (err , tag) {
            if(err){
                res.status(500)
                res.json({message : "Internal server error"});
            }
            if(tag) {
                res.json(tag);
            } else {
                res.status(404)
                res.json({message : "Resource not found"});
            }

        })
});

module.exports = router;