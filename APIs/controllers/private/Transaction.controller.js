/**
 * Created by Aditya on 16-Sep-17.
 */
var express = require('express');
var router = express.Router();
var Transaction = require('../../models/Transaction/Transaction');
var utils = require('../../utils/util');
var Category = require('../../models/Category/Category');
var Tags = require('../../models/Tags/Tags');

router.post('/transaction', function (req, res) {
    var i = 0;
    var postData = Object.assign({}, req.body);
    postData.User = req.user.id;

    utils
        .getModel('Transaction')
        .then(function (model) {

            if(utils.validateInputs(model, postData)){
                var promises = [];

                var categoryPromise = Category.findOne({_id  : postData.Category}).exec();

                promises.push(categoryPromise);

                if(postData.Tags){
                    postData.Tags.forEach(function (element) {
                        var tagPromise = Tags.findOne({_id : element}).exec();
                        promises.push(tagPromise);
                    });
                }


                Promise
                    .all(promises)
                    .then(function (value) {
                        var flag = false;
                        value.forEach(function (element) {
                           if(element=== null){
                               flag = true;
                           }
                        });

                      if(flag){
                          res.status(400);
                          res.json({"message" : "invalid parameters"});
                      } else {
                          var new_Transaction = new Transaction(utils.getPostObject(model, postData));

                          new_Transaction.save(function (err , data) {
                              if(err){

                                  res.status(500);
                                  res.json({"message" : "Internal server err"});
                              } else{

                                  res.json({message : "success"})
                              }
                          })
                      }
                    })
                    .catch(function () {

                        res.status(400);
                        res.json({"message" : "invalid parameters"});
                    })

            } else {
                res.status(400);
                res.json({"message" : "invalid parameters"});
            }
        })
});


router.get('/transaction', function (req, res) {
    Transaction
        .find({User : req.user._id})
        .populate('User', '-password -created_at -updated_at')
        .populate('Tags', '-user -created_at -updated_at')
        .populate('Category' , '-user -created_at -updated_at')
        .exec(function (err, data) {
            if(err){
                res.json({err : err})
            }
            res.json(data);
        })

});


module.exports = router;
