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

var privateRouter = express.Router();
privateRouter.use('/private', privateUserAPIs);
privateRouter.use('/private', privateCategoryAPIs);

var publicRouter = express.Router();

var app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(passport.initialize());
require('./APIs/authentication/Passport')(passport);

app.use('/API', publicRouter);
app.use('/API',passport.authenticate('jwt', {session : false} ) ,privateRouter);

app.use('/',loginAPIs);
const PORT = process.env.port || 1000;


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