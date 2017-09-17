/**
 * Created by Aditya on 04-Sep-17.
 */
var router = require('express').Router();
var Tag = require('../../models/Tags/Tags');
var util = require('../../utils/util');

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
                        res.status(409);
                        res.json({message : "Resource conflict"})
                    }else{

                        var newTag = new Tag(util.getPostObject(model, postData));
                        newTag.save(function (err , tag) {
                            if(err) {
                                res.status(500);
                                res.json({"message" : err})
                            } else {
                                res.json({"message" : "success"});
                            }
                        })
                    }
                })
            } else{
                res.status(400);
                res.json({"message" : "invalid parameters"})
            }
        },function () {
            res.status(500);
            res.json({message : "Internal server error2"});
        })
        .catch(function () {
            res.status(500);
            res.json({message : "Internal server error1"})
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
                res.status(500)
                res.json({message : "Internal server error"});
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