const express = require('express');

const CheckReferrer = () => {
    return (req, res, next) => {

        console.log(`referer : ${req.headers.referer}`);
     
        if (req.headers.referer !== 'https://travelpcrtest.com/') {
            res.status(401).send('Access Denied!');
            return;
          }
          else
          {
              next();
          }
    }
  }


module.exports = CheckReferrer;
