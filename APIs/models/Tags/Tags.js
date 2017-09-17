var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TagsSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    User : {
        type : String,
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


TagsSchema.pre('save' , function (next) {
    var currDate = new Date();
    this.updated_at = currDate;
    this.created_at = currDate;
    next();
    });

TagsSchema.pre('update', function(next) {
    this.updated_at = new Date();
    next();
});

module.exports = mongoose.model('Tags' , TagsSchema);
