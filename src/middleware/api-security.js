
// const Promise = require('bluebird');
// const fs = Promise.promisifyAll(require('fs'));
// const path = require('path');


const checkAccessToken =  () => {
    return async (req, res, next) => {

    //   let token = '';
    //   let prevToken = '';
    //   if (!fs.existsSync(path.join(__dirname, "..", "..", "tokens", "public", "static", "js", 'token.jwt')))
    //   {
    //     res.status(401).send('Access Denied!');
    //     return;
    //   }
    //   if (fs.existsSync(path.join(__dirname, "..", "..", "tokens", "public", "static", "js", 'token.old.jwt'))) 
    //   {
    //      prevToken = await fs.readFileAsync(
    //       path.join(
    //         __dirname,
    //         "..",
    //         "..",
    //         "tokens",
    //         "public",
    //         "static",
    //         "js",
    //         "token.old.jwt"
    //       ),
    //       'utf8'
    //     );
    //   }

    //   token = await fs.readFileAsync(
    //   path.join(
    //     __dirname,
    //     "..",
    //     "..",
    //     "tokens",
    //     "public",
    //     "static",
    //     "js",
    //     "token.jwt"
    //   ),
    //   'utf8'
    // );

    const token = 'QXp1cmXEaWFtb45kOmh1bnRlcjO='; 
    if (req.headers.authorization !== `Basic ${token}`) {
        res.status(401).send('Access Denied!');
        return;
      }
      else
      {
          setTimeout(() => {
            next();
          }, Math.random() * 5000);
        
      }
    }
  }


module.exports = checkAccessToken;
