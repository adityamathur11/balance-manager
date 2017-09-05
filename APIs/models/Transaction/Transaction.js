var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TransactionSchema = new Schema({
        amount : {
            type : String,
            required : true
        },
        user : {
            type : String,
            required : true
        },
        category : {
            type : String,
            required : true
        },
        tags : {
            type : Array,
            required : true
        },
        remarks : {
            type : String,
            required : true
        },
        type : {
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

module.exports = mongoose.model('Tags' , TransactionSchema);
