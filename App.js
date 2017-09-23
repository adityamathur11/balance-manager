/**
 * Created by Aditya on 31-Aug-17.
 */
var express = require('express')
    ,mongoose = require('mongoose')
    ,config = require('config')
    ,bodyParser = require('body-parser')
    ,passport = require('passport')
    ,morgan = require('morgan');
mongoose.Promise = global.Promise;

var Response = require('./config/Response');
var loginAPIs = require('./APIs/controllers/public/login');
var privateUserAPIs = require('./APIs/controllers/private/User.controller');
var privateCategoryAPIs = require('./APIs/controllers/private/Category.controller');
var privateTagAPIs = require('./APIs/controllers/private/Tag.controller');
var privateTransactionAPIs = require('./APIs/controllers/private/Transaction.controller');
var privateMiniStatementAPIs = require('./APIs/controllers/private/MiniStatement.controller');

var privateRouter = express.Router();
privateRouter.use('/private', privateUserAPIs);
privateRouter.use('/private', privateCategoryAPIs);
privateRouter.use('/private', privateTagAPIs);
privateRouter.use('/private', privateTransactionAPIs);
privateRouter.use('/private', privateMiniStatementAPIs);

var publicRouter = express.Router();

var app = express();
app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(passport.initialize());
require('./APIs/authentication/Passport')(passport);

app.use('/API', publicRouter);

app.use('/API/private', function (req, res, next) {
    if(req.header("Authorization")){
        if(req.header("Authorization").indexOf("JWT ") === 0){
            next();
        } else{
            res.status(Response.InvalidTokenn.code);
            res.json(Response.InvalidTokenn.message);
        }
    } else{
        res.status(Response.NoToken.code);
        res.json(Response.NoToken.message);
    }
})
app.use('/API', function (req, res, next) {
    passport.authenticate('jwt', {session : false}, function(err, user, info) {
        if (err) {
            res.status(Response.InternalServerError.code);
            res.json(Response.InternalServerError.message);
        }
        else if (!user) {
            res.json(info);
        } else{
            req.user = user;
            next();
        }
    })(req, res, next);
},privateRouter);

app.use('/',loginAPIs);
const PORT = process.env.PORT || 4000;

app.get("*", function (req, res) {
    res.sendFile('./public/index.html', { root: __dirname });
});

connectDB()
    .on('error' , function () {
        console.log('error while connecting DB');
    })
    .on('disconnect',connectDB)
    .once('open' , function () {
        app.listen(PORT , function () {
            console.log('Server is running on port :' , PORT);
        });
    });


function connectDB() {
    var options = {
        server : {
            socketOptions : {
                keepAlive: 1
            }
        }
    };
    return mongoose.connect(config.db , options).connection;
}