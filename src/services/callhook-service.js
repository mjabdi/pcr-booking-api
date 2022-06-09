
const express = require('express');
const { callended } = require('./callhooks/callended-manager');
const router = express.Router();



router.post('/callended', async function(req, res, next) {

    try{
         const body = req.body
         console.log(body)
         await callended(body)
         res.status(200).send({status:"OK"});
    }
    catch(err)
    {
        console.log(err)
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

module.exports = router;