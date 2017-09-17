/**
 * Created by Aditya on 04-Sep-17.
 */
var router = require('express').Router();
var Category = require('../../models/Category/Category');
var util = require('../../utils/util');

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
                        res.status(409);
                        res.json({message : "Resource conflict"})
                    }else{

                        var newCategory = new Category(util.getPostObject(model, postData));
                        newCategory.save(function (err , category) {
                            if(err) {
                                res.status(500);
                                res.json({"message" : err})
                            } else {
                                res.json({"message" : category});
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

router.get('/category',function (req, res) {
    var skip = req.query.skip ? parseInt(req.query.skip) : 0;
    var limit = req.query.limit ? parseInt(req.query.limit) : 10;

    Category.find({User : req.user._id})
        .skip(skip)
        .limit(limit)
        .exec(function (err , categories) {
            if(err){
                res.status(500)
                res.json({message : "Internal server error"});
            }
            res.json(categories);
        })
});


router.get('/category/:id',function (req, res) {
    Category.findOne({User : req.user._id, _id : req.params.id})
        .exec(function (err , category) {
            if(err){
                res.status(500)
                res.json({message : "Internal server error"});
            }
            if(category) {
                res.json(category);
            } else {
                res.status(404)
                res.json({message : "Resource not found"});
            }

        })
});

module.exports = router;