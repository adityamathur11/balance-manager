/**
 * Created by aditya on 23/9/17.
 */
var express = require('express');
var router = express.Router();

var Transaction = require('../../models/Transaction/Transaction');
var Tag = require('../../models/Tags/Tags');
var Category = require('../../models/Category/Category');
var User = require('../../models/User/User');

router.get('/miniStatement', function (req, res) {

    var payload = {};
    var UserData = Object.assign({}, req.user._doc);
    delete UserData.password;
    delete UserData.created_at;
    delete UserData.updated_at;
    payload.User = UserData; // User added

    var categoryList = {};
    var expenseCategoryList = {};
    var tagList ={};
    var TransactionList = [];
    Transaction
        .find({User : req.user.id})
        .populate('Tags', '-User -created_at -updated_at')
        .populate('Category' , '-User -created_at -updated_at')
        .populate('source_Category' , '-User -created_at -updated_at')
        .exec(function (err, transactions) {
            var totalBalance = 0;
            var i = 1;
            transactions.forEach(function (transaction) {
                if(i >= 10){
                }
                if(transaction.type === "CREDIT"){
                    totalBalance = totalBalance + transaction.amount;
                    if(categoryList[transaction.Category.id]){
                        categoryList[transaction.Category.id].amount = categoryList[transaction.Category.id].amount + transaction.amount
                    } else{
                        categoryList[transaction.Category.id] = {}
                        categoryList[transaction.Category.id].id = transaction.Category.id;
                        categoryList[transaction.Category.id].name = transaction.Category.name;
                        categoryList[transaction.Category.id].amount = transaction.amount;
                    }
                } else if(transaction.type === "DEBIT"){
                    totalBalance = totalBalance - transaction.amount;
                    if(expenseCategoryList[transaction.Category.id]){
                        expenseCategoryList[transaction.Category.id].amount = expenseCategoryList[transaction.Category.id].amount + transaction.amount;
                        expenseCategoryList[transaction.Category.id].count = expenseCategoryList[transaction.Category.id].count + 1;
                    } else{
                        expenseCategoryList[transaction.Category.id] = {};
                        expenseCategoryList[transaction.Category.id].id = transaction.Category.id;
                        expenseCategoryList[transaction.Category.id].name = transaction.Category.name;
                        expenseCategoryList[transaction.Category.id].amount = transaction.amount;
                        expenseCategoryList[transaction.Category.id].count = 1;
                    }
                    if(categoryList[transaction.source_Category.id]){
                        categoryList[transaction.source_Category.id].amount = categoryList[transaction.source_Category.id].amount - transaction.amount;
                    } else{
                        categoryList[transaction.source_Category.id] = {};
                        categoryList[transaction.source_Category.id].id = transaction.source_Category.id;
                        categoryList[transaction.source_Category.id].name = transaction.source_Category.name;
                        categoryList[transaction.source_Category.id].amount = 0 - transaction.amount;
                    }
                    if(transaction.Tags){
                        transaction.Tags.forEach(function (tag) {
                            if(tagList[tag.id]){
                                tagList[tag.id].amount = tagList[tag.id].amount + transaction.amount;
                            } else{
                                tagList[tag.id] = {};
                                tagList[tag.id].id = tag.id;
                                tagList[tag.id].name = tag.name;
                                tagList[tag.id].amount = transaction.amount;
                            }
                        })
                    }
                } else if(transaction.type === "TRANSFER"){
                    if(categoryList[transaction.Category.id]){
                        categoryList[transaction.Category.id].amount = categoryList[transaction.Category.id].amount + transaction.amount
                    } else{
                        categoryList[transaction.Category.id] = {}
                        categoryList[transaction.Category.id].id = transaction.Category.id;
                        categoryList[transaction.Category.id].name = transaction.Category.name;
                        categoryList[transaction.Category.id].amount = transaction.amount;
                    }
                    if(categoryList[transaction.source_Category.id]){
                        categoryList[transaction.source_Category.id].amount = categoryList[transaction.source_Category.id].amount - transaction.amount
                    } else{
                        categoryList[transaction.source_Category.id] = {};
                        categoryList[transaction.source_Category.id].id = transaction.source_Category.id;
                        categoryList[transaction.source_Category.id].name = transaction.source_Category.name;
                        categoryList[transaction.source_Category.id].amount = 0 - transaction.amount;
                    }
                }
                var temp = Object.assign({},transaction._doc);
                delete temp.Category;
                delete temp.Tags;
                delete temp.User;
                delete temp.source_Category;
                TransactionList.push(temp);

            });
            payload.Transactions = TransactionList;
            var finaSourceList = [];
            for(key in categoryList){
                finaSourceList.push(categoryList[key]);
            }
            var finalCategoryExpenseList = [];
            for(key in expenseCategoryList){
                finalCategoryExpenseList.push(expenseCategoryList[key]);
            }
            var finalTagList = [];
            for(key in tagList){
                finalTagList.push(tagList[key]);
            }
            payload.balance = {
                collective : totalBalance,
                sources : finaSourceList
            };
            payload.category_wise_expenses = finalCategoryExpenseList;
            payload.tag_wise_expenses = finalTagList;
            res.json(payload);
        });

});

module.exports = router;