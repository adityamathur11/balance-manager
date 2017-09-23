var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('../User/User');
var Category = require('../Category/Category');

var TransactionSchema = new Schema({
        amount : {
            type : Number,
            required : true
        },
        User : {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required : true
        },
        Category : {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required : true
        },
        remarks : {
            type : String,
            required : true
        },
        source_Category : {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required : false
        },
        type : {
            type : String,
            enum: ['CREDIT', 'DEBIT', 'TRANSFER'],
            required : true
        },
        Tags : {
            type : [{type : Schema.Types.ObjectId , ref : 'Tags'}],
            default : []
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


TransactionSchema.pre('save' , function (next) {
    var currDate = new Date();
    this.updated_at = currDate;
    this.created_at = currDate;
    next();
});

TransactionSchema.pre('update', function(next) {
    this.updated_at = new Date();
    next();
});

module.exports = mongoose.model('Transaction' , TransactionSchema);


/*
 ,

 ,
 user : {
 type : {type: Schema.Types.ObjectId, ref: User.schema},
 required : true
 },

 */