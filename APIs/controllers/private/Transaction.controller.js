/**
 * Created by Aditya on 16-Sep-17.
 */
var express = require('express');
var router = express.Router();
var Transaction = require('../../models/Transaction/Transaction');
var utils = require('../../utils/util');
var Category = require('../../models/Category/Category');
var Tags = require('../../models/Tags/Tags');
var Response = require('../../../config/Response');

router.post('/transaction', function (req, res) {
    var postData = Object.assign({}, req.body);
    postData.User = req.user.id;
    utils
        .getModel('Transaction')
        .then(function (model) {
            if(utils.validateInputs(model, postData)){
                switch(postData.type){
                    case "CREDIT" :
                        console.log("1");
                        Category
                            .findOne({_id : postData.Category ,User : req.user.id})
                            .exec(function (err, category) {
                                if(err){
                                    res.status(Response.InternalServerError.code);
                                    res.json(Response.InternalServerError.message);
                                    return;
                                }
                                if(category){
                                    console.log("2");
                                    if(category.type === "EXPENSE"){
                                        res.status(Response.InvalidParameters.code);
                                        res.json(Response.InvalidParameters.message);
                                        return;
                                    } else{
                                        var newTransaction = new Transaction({
                                            amount : postData.amount,
                                            User : req.user.id,
                                            Category : postData.Category,
                                            type : "CREDIT",
                                            remarks : postData.remarks
                                        });

                                        newTransaction.save(function (err, data) {
                                                if(err) {
                                                    res.status(Response.InternalServerError.code);
                                                    res.json(Response.InternalServerError.message);
                                                    return;
                                                } else {
                                                    res.status(Response.Created.code);
                                                    res.json(Response.Created.message);
                                                    return;
                                                }
                                            })
                                    }
                                } else{
                                    res.status(Response.InvalidParameters.code);
                                    res.json(Response.InvalidParameters.message);
                                    return;
                                }
                            });
                        break;
                    case "DEBIT"  :
                        var promises = [];
                        var sourceCategoryPromise = Category.findOne({_id : postData.source_Category, User : req.user.id}).exec();
                        var transactionCategoryPromise = Category.findOne({_id : postData.Category, User : req.user.id}).exec();
                        promises.push(sourceCategoryPromise);
                        promises.push(transactionCategoryPromise);

                        if(postData.Tags){
                            for(var j = 0 ; j < postData.Tags.length; j++){
                                var tagPromise = Tags.findOne({_id : postData.Tags[j].id, User : req.user.id}).exec();
                                promises.push(tagPromise);
                            }
                        }

                        Promise.all(promises)
                            .then(function (values) {
                            values.forEach(function (value) {
                                if(value === null){
                                    res.status(Response.InvalidParameters.code);
                                    res.json(Response.InvalidParameters.message);
                                    return;
                            }});
                            if(values[0].type !== "SOURCE" || values[1].type !== "EXPENSE"){
                                res.status(Response.InvalidParameters.code);
                                res.json(Response.InvalidParameters.message);
                                return;
                            }

                            var newTransaction = new Transaction({
                                amount : postData.amount,
                                User : req.user.id,
                                Category : postData.Category,
                                Tags : postData.Tags,
                                source_Category : postData.source_Category,
                                type : "DEBIT",
                                remarks : postData.remarks
                            });

                            newTransaction.save(function (err, data) {
                                if(err) {
                                    res.status(Response.InternalServerError.code);
                                    res.json(Response.InternalServerError.message);
                                    return;
                                } else {
                                    res.status(Response.Created.code);
                                    res.json(Response.Created.message);
                                    return;
                                }
                            })

                        });

                        break;
                    case "TRANSFER" :
                        var promises = [];
                        var sourceCategoryPromise = Category.findOne({_id : postData.source_Category, User : req.user.id}).exec();
                        var transactionCategoryPromise = Category.findOne({_id : postData.Category, User : req.user.id}).exec();
                        promises.push(sourceCategoryPromise);
                        promises.push(transactionCategoryPromise);

                        Promise.all(promises)
                            .then(function (values) {
                                values.forEach(function (value) {
                                    if(value === null){
                                        res.status(Response.InvalidParameters.code);
                                        res.json(Response.InvalidParameters.message);
                                        return;
                                    }});
                                if(values[0].type !== "SOURCE" || values[1].type !== "SOURCE"){
                                    res.status(Response.InvalidParameters.code);
                                    res.json(Response.InvalidParameters.message);
                                    return;
                                }
                                if(values[0]._id.toString() === values[1]._id.toString() ){
                                    res.status(Response.InvalidParameters.code);
                                    res.json(Response.InvalidParameters.message);
                                    return;
                                }

                                var newTransaction = new Transaction({
                                    amount : postData.amount,
                                    User : req.user.id,
                                    Category : postData.Category,
                                    source_Category : postData.source_Category,
                                    type : "TRANSFER",
                                    remarks : postData.remarks
                                });

                                newTransaction.save(function (err, data) {
                                    if(err) {
                                        res.status(Response.InternalServerError.code);
                                        res.json(Response.InternalServerError.message);
                                        return;
                                    } else {
                                        res.status(Response.Created.code);
                                        res.json(Response.Created.message);
                                        return;
                                    }
                                })

                            });

                        return;
                        break;
                    default :
                        res.status(Response.InternalServerError.code);
                        res.json(Response.InternalServerError.message);
                        return;
                }


            } else{
                res.status(Response.InvalidParameters.code);
                res.json(Response.InvalidParameters.message);
            }
        }, function () {
            res.status(Response.InternalServerError.code);
            res.json(Response.InternalServerError.message);
        });

})


router.get('/transaction', function (req, res) {
    Transaction
        .find({User : req.user._id})
        .populate('User', '-password -created_at -updated_at')
        .populate('Tags', '-user -created_at -updated_at')
        .populate('Category' , '-user -created_at -updated_at')
        .populate('source_Category' , '-user -created_at -updated_at')
        .exec(function (err, data) {
            if(err){
                res.json({err : err})
            }
            res.json(data);
        })

});


router.get('/transaction/category/:id', function (req, res) {
    Transaction
        .find({User : req.user._id , Category: req.params.id})
        .exec(function (err, data) {
            if(err){
                res.status(500)
                res.json({message : "Internal server error"});
            } else{
                res.json(data);
            }
        })
});

router.get('/transaction/category', function (req, res) {
    Category
        .find({User  : req.user._id})
        .exec(function (err , categories) {
            var promises = []
            if(err){
                res.statusCode(500)
                res.json({message : err});
            }else{
                categories.forEach(function (category) {
                    var promise = Transaction.find({
                        User : req.user._id,
                        Category : category._id
                    })
                    .populate('User', '-password -created_at -updated_at')
                    .populate('Tags', '-user -created_at -updated_at')
                    .populate('Category' , '-user -created_at -updated_at')
                    .populate('source_Category' , '-user -created_at -updated_at')
                    .exec();

                    promises.push(promise);
                })

                Promise
                    .all(promises)
                    .then(function (values) {
                        var result = [];
                        values.forEach(function (data) {
                            if(data){
                                console.log(data)
                                var item = {};
                                item.category = data[0].Category;
                                item.transactions = data;

                                result.push(item);
                            }
                        });
                        res.json(result);
                    })
            }

        })
});

router.get('/transaction/:id',function (req, res) {
    Transaction.findOne({User : req.user._id, _id : req.params.id})
        .exec(function (err , transaction) {
            if(err){
                res.status(500)
                res.json({message : "Internal server error"});
            }
            if(transaction) {
                res.json(transaction);
            } else {
                res.status(404)
                res.json({message : "Resource not found"});
            }

        })
});


module.exports = router;



