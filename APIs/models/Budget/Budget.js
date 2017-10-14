/**
 * Created by aditya on 14/10/17.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BudgetSchema = new Schema({
        Category : {
            type : Schema.Types.ObjectId,
            ref : 'Category',
            required : true
        },
        User : {
            type : Schema.Types.ObjectId,
            ref : 'User',
            required : true
        },
        amount : {
            type : Number,
            required : true
        },
        created_at: {
            type : Date,
            required : false
        },
        updated_at: {
            type : Date,
            required : false
        }
    },
    {
        versionKey : false,
        strict : true
    });


BudgetSchema.pre('save' , function (next) {
    var currDate = new Date();
    this.updated_at = currDate;
    this.created_at = currDate;
    next();
});

BudgetSchema.pre('update', function(next) {
    this.updated_at = new Date();
    next();
});

module.exports = mongoose.model('Budget' , BudgetSchema);
