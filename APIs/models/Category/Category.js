/**
 * Created by Aditya on 04-Sep-17.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
        user : {
            type : String,
            required : true
        },
        name : {
            type: String,
            required : true
        },
        type : {
            type : Number,
            required : true
        },
        resolvable : {
            type : Boolean,
            required : false
        },
        created_at: {
            type : Date
        },
        updated_at: {
            type : Date
        }
    },
    {
        versionKey : false,
        strict : true
    });

CategorySchema.pre('save' , function (next) {
    var currDate = new Date();
    this.updated_at = currDate;
    this.created_at = currDate;
    next();
});

CategorySchema.pre('update', function(next) {
    this.updated_at = new Date();
    next();
});

module.exports = mongoose.model('Category' , CategorySchema);