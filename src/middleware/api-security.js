const express = require('express');

const checkAccessToken = () => {
    return (req, res, next) => {

        console.log(`req.headers.referer : ${req.headers.referer}`);
     
        if (req.headers.authorization !== 'Basic QXp1cmXEaWFtb45kOmh1bnRlcjO=') {
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
