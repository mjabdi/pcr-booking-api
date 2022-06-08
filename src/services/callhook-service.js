
const express = require('express');
const router = express.Router();



router.post('/callended', async function(req, res, next) {

    try{
         const body = req.body
         console.log(body)
         res.status(200).send({status:"OK", body: body });
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

module.exports = router;