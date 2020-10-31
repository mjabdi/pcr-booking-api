const express = require('express');
const router = express.Router();

router.get('/getfirstavaiableday', function(req, res, next) {

    var someDate = new Date();
    var duration = 10; //In Days
    someDate.setTime(someDate.getTime() +  (duration * 24 * 60 * 60 * 1000));
    
    res.send({date: someDate});
});



module.exports = router;
