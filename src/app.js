// const createError = require('http-errors');
const express = require('express');
const path = require('path');
// const cookieParser = require('cookie-parser');
const logger = require('morgan');

const apiRouter = require('./routes/api-router');
const downloadRouter = require('./routes/download-router');
const mailRouter = require('./routes/mail-router');

const apiSecurity = require('./middleware/api-security');
// const checkReferrer = require('./middleware/check-referrer');
const mongodb = require('./mongodb');
const cors = require('cors');

// const Promise = require('bluebird')
// const fs = Promise.promisifyAll(require('fs'));

// const crypto = require("crypto");


const app = express();

// connect to Database
mongodb();

app.use(cors({ origin: true }));

app.use(logger(':date[clf] ":method :url"'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

// if (process.env.NODE_ENV === 'production')
// {
//   app.use('/api', apiSecurity(), checkReferrer() ,apiRouter);
// }
// else
// {
  app.use('/api', apiSecurity() , apiRouter);
// }

app.use('/mail', mailRouter);

app.use('/download', downloadRouter);
// app.use('/api', apiRouter);

app.use('/user/edit/', express.static(path.join(__dirname, ".." , "public_admin")));
app.get('/user/edit/*', function (req, res) {
  res.sendFile(path.join(__dirname, ".." , "public_admin","index.html"));
 });

 app.use('/medicalexpressclinic/user/edit/gynae/', express.static(path.join(__dirname, ".." , "public_admin")));
app.get('/medicalexpressclinic/user/edit/gynae/*', function (req, res) {
  res.sendFile(path.join(__dirname, ".." , "public_admin","index.html"));
 });

 app.use('/medicalexpressclinic/user/edit/pcr/', express.static(path.join(__dirname, ".." , "public_admin")));
app.get('/medicalexpressclinic/user/edit/pcr/*', function (req, res) {
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

  app.use('/gynae', express.static(path.join(__dirname, ".." , "public_gynae")));
  app.get('/gynae/*', function (req, res) {
    res.sendFile(path.join(__dirname, ".." , "public_gynae","index.html"));
   });

   app.use('/medicalexpressclinic/book/gynae', express.static(path.join(__dirname, ".." , "public_gynae")));
   app.get('/medicalexpressclinic/book/gynae/*', function (req, res) {
     res.sendFile(path.join(__dirname, ".." , "public_gynae","index.html"));
    });

    

   app.use('/medicalexpressclinic/admin', express.static(path.join(__dirname, ".." , "public_medex")));
   app.get('/medicalexpressclinic/admin/*', function (req, res) {
     res.sendFile(path.join(__dirname, ".." , "public_medex","index.html"));
    });

    app.use('/medicalexpressclinic/patient', express.static(path.join(__dirname, ".." , "public_portal")));
    app.get('/medicalexpressclinic/patient/*', function (req, res) {
      res.sendFile(path.join(__dirname, ".." , "public_portal","index.html"));
     });

     app.use('/medicalexpressclinic/home', express.static(path.join(__dirname, ".." , "public_medex_landing")));
     app.get('/medicalexpressclinic/home/*', function (req, res) {
       res.sendFile(path.join(__dirname, ".." , "public_medex_landing","index.html"));
      });

 app.use('/', express.static(path.join(__dirname, "..", "public")));

 app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
 });


//  const getNewToken = () =>
//  {
//     return crypto.randomBytes(16).toString("hex");
//  }

//  app.use('/static/js/*', async (req,res,next) => {
//    if (
//      req.params[0].indexOf("main") === 0 &&
//      req.params[0].indexOf(".js") > 0
//    ) {
     
//     if (!fs.existsSync(path.join(__dirname, "..", "tokens", "public", "static", "js", 'main.js')))
//      {
//         let contents = await fs.readFileAsync(
//           path.join(
//             __dirname,
//             "..",
//             "public",
//             "static",
//             "js",
//             req.params[0]
//           ),
//           'utf8'
//         );
//         const newToken = getNewToken();
//         let replaced_contents = contents.replace('QXp1cmXEaWFtb45kOmh1bnRlcjO=', newToken);

//         if (fs.existsSync(path.join(__dirname, "..", "tokens", "public", "static", "js", 'token.jwt')))
//         {
//               const prevToken = await fs.readFileAsync(
//                 path.join(
//                   __dirname,
//                   "..",
//                   "tokens",
//                   "public",
//                   "static",
//                   "js",
//                   "token.jwt"
//                 ),
//                 'utf8'
//               );
//               await fs.writeFileAsync(path.join(__dirname, "..", "tokens", "public", "static", "js", "token.old.jwt"), prevToken ,'utf8');
//           }

//         await fs.writeFileAsync(path.join(__dirname, "..", "tokens", "public", "static", "js", "token.jwt"), newToken ,'utf8');
//         await fs.writeFileAsync(path.join(__dirname, "..", "tokens", "public", "static", "js", "main.js"), replaced_contents,'utf8');
//      }
    
//      res.sendFile(
//        path.join(__dirname, "..", "tokens", "public", "static", "js", 'main.js')
//      ); 

//      return;
//    }

//    next();
//  });





// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.json({
//     message: err.message,
//     error: err
//   });
// });

module.exports = app;
