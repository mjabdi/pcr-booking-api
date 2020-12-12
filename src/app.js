const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const apiRouter = require('./routes/api-router');
const downloadRouter = require('./routes/download-router');

const apiSecurity = require('./middleware/api-security');
const checkReferrer = require('./middleware/check-referrer');
const mongodb = require('./mongodb');
const cors = require('cors');


const app = express();

// connect to Database
mongodb();

app.use(cors({
  credentials: true,
}));

app.use(logger(':date[clf] ":method :url"'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

if (process.env === 'production')
{
  app.use('/api', apiSecurity(), checkReferrer() ,apiRouter);
}
else
{
  app.use('/api', apiSecurity() , apiRouter);
}


app.use('/download', downloadRouter);
// app.use('/api', apiRouter);

app.use('/user/edit/', express.static(path.join(__dirname, ".." , "public_admin")));
app.get('/user/edit/*', function (req, res) {
  res.sendFile(path.join(__dirname, ".." , "public_admin","index.html"));
 });


app.use('/admin', express.static(path.join(__dirname, ".." , "public_admin")));
app.get('/admin/*', function (req, res) {
  res.sendFile(path.join(__dirname, ".." , "public_admin","index.html"));
 });

 app.use('/tr', express.static(path.join(__dirname, ".." , "public_tr")));
app.get('/tr/*', function (req, res) {
  res.sendFile(path.join(__dirname, ".." , "public_tr","index.html"));
 });



 app.use('/', express.static(path.join(__dirname, "..", "public")));
 app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
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
