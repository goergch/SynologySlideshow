var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var rootCas = require('ssl-root-cas/latest').create();
require('https').globalAgent.options.ca = rootCas;

const photos = require('./routes/photos');
const albums = require('./routes/albums');
const thumbs = require('./routes/thumbs');
var app = express();


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

const config = require('./config/config_loader');

var CACHE_MAX_AGE = 60*60*24;

app.use(express.static(path.join(__dirname, 'dist')));

app.use('/api/photos', photos);
app.use('/api/albums', albums);
app.use('/api/thumbs', thumbs);

app.all('/api/*', function (req, res, next) {
  res.sendStatus(404);
});
app.all('*', function (req, res, next) {
  // Just send the index.html for other files to support HTML5Mode
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
} else {
  app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.send('Something broke!')
  });
}

module.exports = app;
