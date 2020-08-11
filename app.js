var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var loginRouter = require('./api/login')

var app = express();

var corsOptions = {
  origin: ['http://localhost:19006', 'exp://192.168.86.36:19000'], // localhost for development
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// setup spotify credentials
if(process.env.CLIENT_ID) {
  console.log("Getting credentials from heroku config")
  global.spotifyCredentials = {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    REDIRECT_URI: process.env.REDIRECT_URI,
  }
} else {
  console.log("Getting credentials from secrets.js")
  global.spotifyCredentials = require('./secrets.js')
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors(corsOptions))

app.use('/', indexRouter);
app.use('/api/login', loginRouter);

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
