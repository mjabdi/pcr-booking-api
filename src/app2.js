const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// const checkReferrer = require('./middleware/check-referrer');
const cors = require('cors');

// const Promise = require('bluebird')
// const fs = Promise.promisifyAll(require('fs'));

// const crypto = require("crypto");


const app = express();

app.use(cors({
  credentials: true,
}));

app.use(logger(':date[clf] ":method :url"'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/', express.static(path.join(__dirname, ".." , "public_medex_landing")));
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, ".." , "public_medex_landing","index.html"));
 });

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
  res.json({
    message: err.message,
    error: err
  });
});

module.exports = app;
