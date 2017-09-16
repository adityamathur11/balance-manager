/**
 * Created by Aditya on 04-Sep-17.
 */
var router = require('express').Router();
var Category = require('../../models/Category/Category');
var util = require('../../utils/util');

router.post('/category', function (req, res) {
    var postData = Object.assign({}, req.body);
    postData.user = req.user.id;
    postData.name = postData.name.toString().trim().toLowerCase();
    util.getModel('Category')
        .then(function (model) {
            if(util.validateInputs(model, postData)){
                Category.findOne({
                    name : postData.name,
                    user : req.user._id
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

router.get('/category',function (req, res) {
    var skip = req.query.skip ? parseInt(req.query.skip) : 0;
    var limit = req.query.limit ? parseInt(req.query.limit) : 10;

    Category.find({user : req.user._id})
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

module.exports = router;