var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var UserSchema = new Schema({
        phone_number : {
            type : String,
            required : true
        },
        email : {
            type: String,
            required : true
        },
        first_name : {
            type : String,
            required : true
        },
        last_name : {
            type : String,
            required : true
        },
        password : {
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

UserSchema.pre('save' , function (next) {
    currUser = this;
    var currDate = new Date();
    this.updated_at = currDate;
    this.created_at = currDate;

    bcrypt.hash(this.password,10,function (err, hash) {
        currUser.password = hash;
        next();
    })
});

UserSchema.pre('update', function(next) {
    this.updated_at = new Date();
    next();
});

module.exports = mongoose.model('User' , UserSchema);
