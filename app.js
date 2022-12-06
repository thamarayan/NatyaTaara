require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts');
var favicon = require('serve-favicon');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var mongoStore = require('connect-mongo');

// var Razorpay = require('razorpay');
// var crypto = require('crypto');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var backstageRouter = require('./routes/backstage');

var app = express();

mongoose.connect('mongodb+srv://' + process.env.DB_NAME + ':' + process.env.DB_PASSWORD + '@cluster0.rrtus.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology:true });
const mongoUri = 'mongodb+srv://' + process.env.DB_NAME + ':' + process.env.DB_PASSWORD + '@cluster0.rrtus.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
require('./config/passport');


// view engine setup
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('view options', { layout:'layout.ejs' });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
  secret:'MySuperSecret', 
  resave:false, 
  saveUninitialized:false,
  store: mongoStore.create({ mongoUrl : mongoUri }),
  cookie:{maxAge:180*60*1000},
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));

app.use(favicon(path.join(__dirname,'public','images','favicon.png')));

app.use(function(req,res,next){
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
})

app.use('/user', usersRouter);
app.use('/backstage', backstageRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




module.exports = app;
