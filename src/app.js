// const createError = require('http-errors');
const express = require("express");
const path = require("path");
// const cookieParser = require('cookie-parser');
const logger = require("morgan");

const apiRouter = require("./routes/api-router");
const downloadRouter = require("./routes/download-router");
const mailRouter = require("./routes/mail-router");
const callHookRouter = require("./routes/callhook-router");

const apiSecurity = require("./middleware/api-security");
// const checkReferrer = require('./middleware/check-referrer');
const mongodb = require("./mongodb");
const cors = require("cors");
const nocache = require('nocache');

// const Promise = require('bluebird')
// const fs = Promise.promisifyAll(require('fs'));

// const crypto = require("crypto");

const app = express();

// connect to Database
mongodb();

app.use(cors({ origin: true }));
app.use(nocache());

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
app.use("/api", apiSecurity(), apiRouter);
// }

app.use("/mail", mailRouter);

app.use("/webhook", callHookRouter);

app.use("/download", downloadRouter);
// app.use('/api', apiRouter);

app.use(
  "/user/edit/",
  express.static(path.join(__dirname, "..", "public_admin"))
);
app.get("/user/edit/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public_admin", "index.html"));
});

app.use(
  "/medicalexpressclinic/user/edit/gynae/",
  express.static(path.join(__dirname, "..", "public_admin"))
);
app.get("/medicalexpressclinic/user/edit/gynae/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public_admin", "index.html"));
});

app.use(
  "/medicalexpressclinic/user/form/gynae/",
  express.static(path.join(__dirname, "..", "public_admin"))
);
app.get("/medicalexpressclinic/user/form/gynae/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public_admin", "index.html"));
});

app.use(
  "/medicalexpressclinic/user/edit/gp/",
  express.static(path.join(__dirname, "..", "public_admin"))
);
app.get("/medicalexpressclinic/user/edit/gp/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public_admin", "index.html"));
});

app.use(
  "/medicalexpressclinic/user/edit/corporate/",
  express.static(path.join(__dirname, "..", "public_admin"))
);
app.get("/medicalexpressclinic/user/edit/corporate/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public_admin", "index.html"));
});

app.use(
  "/medicalexpressclinic/user/form/corporate/",
  express.static(path.join(__dirname, "..", "public_admin"))
);
app.get("/medicalexpressclinic/user/form/corporate/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public_admin", "index.html"));
});


app.use(
  "/medicalexpressclinic/user/edit/std/",
  express.static(path.join(__dirname, "..", "public_admin"))
);
app.get("/medicalexpressclinic/user/edit/std/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public_admin", "index.html"));
});

app.use(
  "/medicalexpressclinic/user/form/std/",
  express.static(path.join(__dirname, "..", "public_admin"))
);
app.get("/medicalexpressclinic/user/form/std/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public_admin", "index.html"));
});

app.use(
  "/medicalexpressclinic/user/edit/blood/",
  express.static(path.join(__dirname, "..", "public_admin"))
);
app.get("/medicalexpressclinic/user/edit/blood/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public_admin", "index.html"));
});

app.use(
  "/medicalexpressclinic/user/form/blood/",
  express.static(path.join(__dirname, "..", "public_admin"))
);
app.get("/medicalexpressclinic/user/form/blood/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public_admin", "index.html"));
});

app.use(
  "/medicalexpressclinic/user/edit/derma/",
  express.static(path.join(__dirname, "..", "public_admin"))
);
app.get("/medicalexpressclinic/user/edit/derma/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public_admin", "index.html"));
});

app.use(
  "/medicalexpressclinic/user/form/derma/",
  express.static(path.join(__dirname, "..", "public_admin"))
);
app.get("/medicalexpressclinic/user/form/derma/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public_admin", "index.html"));
});




app.use(
  "/medicalexpressclinic/user/form/gp/",
  express.static(path.join(__dirname, "..", "public_admin"))
);
app.get("/medicalexpressclinic/user/form/gp/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public_admin", "index.html"));
});

app.use(
  "/medicalexpressclinic/user/form/screening/",
  express.static(path.join(__dirname, "..", "public_admin"))
);
app.get("/medicalexpressclinic/user/form/screening/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public_admin", "index.html"));
});


app.use(
  "/medicalexpressclinic/user/edit/pcr/",
  express.static(path.join(__dirname, "..", "public_admin"))
);
app.get("/medicalexpressclinic/user/edit/pcr/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public_admin", "index.html"));
});

app.use("/admin", express.static(path.join(__dirname, "..", "public_admin")));
app.get("/admin/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public_admin", "index.html"));
});

app.use("/tr", express.static(path.join(__dirname, "..", "public_tr")));
app.get("/tr/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public_tr", "index.html"));
});

app.use("/gynae", express.static(path.join(__dirname, "..", "public_gynae")));
app.get("/gynae/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public_gynae", "index.html"));
});

app.use(
  "/medicalexpressclinic/book/gynae",
  express.static(path.join(__dirname, "..", "public_gynae"))
);
app.get("/medicalexpressclinic/book/gynae/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public_gynae", "index.html"));
});

app.use(
  "/medicalexpressclinic/book/gp",
  express.static(path.join(__dirname, "..", "public_gp"))
);
app.get("/medicalexpressclinic/book/gp/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public_gp", "index.html"));
});

app.use(
  "/medicalexpressclinic/book/gp75",
  express.static(path.join(__dirname, "..", "public_gp_75"))
);
app.get("/medicalexpressclinic/book/gp75/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public_gp_75", "index.html"));
});


app.use(
  "/medicalexpressclinic/book/gp20",
  express.static(path.join(__dirname, "..", "public_gp_20"))
);
app.get("/medicalexpressclinic/book/gp20/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public_gp_20", "index.html"));
});



app.use(
  "/medicalexpressclinic/book/std",
  express.static(path.join(__dirname, "..", "public_std"))
);
app.get("/medicalexpressclinic/book/std/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public_std", "index.html"));
});

app.use(
  "/medicalexpressclinic/book/blood",
  express.static(path.join(__dirname, "..", "public_blood"))
);
app.get("/medicalexpressclinic/book/blood/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public_blood", "index.html"));
});

app.use(
  "/medicalexpressclinic/book/derma",
  express.static(path.join(__dirname, "..", "public_derma"))
);
app.get("/medicalexpressclinic/book/derma/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public_derma", "index.html"));
});

app.use(
  "/medicalexpressclinic/book/screening",
  express.static(path.join(__dirname, "..", "public_screening"))
);
app.get("/medicalexpressclinic/book/screening/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public_screening", "index.html"));
});


app.use(
  "/medicalexpressclinic/book/corporate",
  express.static(path.join(__dirname, "..", "public_corporate"))
);
app.get("/medicalexpressclinic/book/corporate/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public_corporate", "index.html"));
});


app.use(
  "/medicalexpressclinic/book/all",
  express.static(path.join(__dirname, "..", "public_medex_form"))
);
app.get("/medicalexpressclinic/book/all/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public_medex_form", "index.html"));
});


app.use(
  "/medicalexpressclinic/reports",
  express.static(path.join(__dirname, "..", "public_report_download_ui"))
);
app.get("/medicalexpressclinic/reports/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public_report_download_ui", "index.html"));
});



app.use(
  "/medicalexpressclinic/admin",
  express.static(path.join(__dirname, "..", "public_medex"))
);
app.get("/medicalexpressclinic/admin/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public_medex", "index.html"));
});

app.use(
  "/medicalexpressclinic/patient",
  express.static(path.join(__dirname, "..", "public_portal"))
);
app.get("/medicalexpressclinic/patient/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public_portal", "index.html"));
});

app.use("/widgets", express.static(path.join(__dirname, "..", "public_widget")));
app.get("/widgets/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public_widget", "index.html"));
});


app.use(
  "/optimalvision/book",
  express.static(path.join(__dirname, "..", "public_optimalvision"))
);
app.get("/optimalvision/book/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public_optimalvision", "index.html"));
});

app.use(
  "/optimalvision/self-test",
  express.static(path.join(__dirname, "..", "public_optimalvision_selftest"))
);
app.get("/optimalvision/self-test/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public_optimalvision_selftest", "index.html"));
});

app.use(
  "/optimalvision/callback",
  express.static(path.join(__dirname, "..", "public_optimalvision_callback"))
);
app.get("/optimalvision/callback/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public_optimalvision_callback", "index.html"));
});



app.use(
  "/optimalvision/admin",
  express.static(path.join(__dirname, "..", "public_optimalvision_admin"))
);
app.get("/optimalvision/admin/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public_optimalvision_admin", "index.html"));
});


app.use(
  "/drsia/book",
  express.static(path.join(__dirname, "..", "public_dentist"))
);
app.get("/drsia/book/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public_dentist", "index.htm"));
});

app.use(
  "/drsia/pay",
  express.static(path.join(__dirname, "..", "public_dentist"))
);
app.get("/drsia/pay/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public_dentist", "index.html"));
});


app.use(
  "/drsia/admin",
  express.static(path.join(__dirname, "..", "public_dentist_admin"))
);
app.get("/drsia/admin/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public_dentist_admin", "index.html"));
});

app.use(
  "/drsia/user/edit/dentist/",
  express.static(path.join(__dirname, "..", "public_admin"))
);
app.get("/drsia/user/edit/dentist/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public_admin", "index.html"));
});


app.use(
  "/museumdentalpayment/admin",
  express.static(path.join(__dirname, "..", "public_museumdentalpayment_admin"))
);
app.get("/museumdentalpayment/admin/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public_museumdentalpayment_admin", "index.html"));
});

app.use(
  "/museumdentalpayment/pay",
  express.static(path.join(__dirname, "..", "public_museumdentalpayment_ui"))
);
app.get("/museumdentalpayment/pay/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public_museumdentalpayment_ui", "index.html"));
});

app.use(
  "/medicalexpressclinic/pay",
  express.static(path.join(__dirname, "..", "public_medex_payment_ui"))
);
app.get("/medicalexpressclinic/pay/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public_medex_payment_ui", "index.html"));
});



app.use("/", express.static(path.join(__dirname, "..", "public")));

app.get("/*", function (req, res) {
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
