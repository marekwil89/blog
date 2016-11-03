var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var expressValidator = require('express-validator');
var passport = require('passport');
var flash = require('connect-flash');



mongoose.connect('mongodb://localhost/xxx'); 

require('./models/user');
require('./models/article');
var routes = require('./routes/index');
var articles = require('./routes/articles');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(session({
    secret: 'keyboard cat',
    name: 'itsname',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());


app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      var root    = namespace.shift()
      var formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(flash())

app.use(function(req, res, next){
  res.locals.moment = require('moment')
  res.locals.user = req.user;
  res.locals.error_msg = req.flash('error');
  res.locals.errors = req.flash('errors');
  next();
})



app.use('/', routes);
app.use('/users', users);
app.use('/articles', articles);



//DOWN IS ONLY ERRORS

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
