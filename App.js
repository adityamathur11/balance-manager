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


var loginAPIs = require('./APIs/controllers/public/login');
var privateUserAPIs = require('./APIs/controllers/private/User.controller');
var privateCategoryAPIs = require('./APIs/controllers/private/Category.controller');
var privateTagAPIs = require('./APIs/controllers/private/Tag.controller');
var privateTransactionAPIs = require('./APIs/controllers/private/Transaction.controller');

var privateRouter = express.Router();
privateRouter.use('/private', privateUserAPIs);
privateRouter.use('/private', privateCategoryAPIs);
privateRouter.use('/private', privateTagAPIs);
privateRouter.use('/private', privateTransactionAPIs);

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
app.use('/API', function (req, res, next) {
    passport.authenticate('jwt', {session : false}, function(err, user, info) {
        console.log("hahaha");
        if (err) { return next(err); }
        if (!user) { return res.send(info).end(); }
        req.user = user;
        next();
    })(req, res, next);
},privateRouter)

app.use('/',loginAPIs);
const PORT = process.env.PORT || 3000;

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