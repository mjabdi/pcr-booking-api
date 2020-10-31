const express = require('express');

const checkAccessToken = () => {
    return (req, res, next) => {
     
        if (req.headers.authorization !== 'Basic QXp1cmXEaWFtb45kOmh1bnRlcjO=') {
            // res.set('WWW-Authenticate', 'Basic realm="401"')
            res.status(401).send('Access Denied!');
            return;
          }
          else
          {
              next();
          }
    }
  }


module.exports = checkAccessToken;
