const express = require('express');
const router = express.Router();

/* GET Apis listing. */
router.get('/', function(req, res, next) {
  res.send('the list of APIS');
});


/* GET TimeService Endpoint */
router.get('/time', function(req, res, next) {
  res.send([{time:"9:00 AM", available:true},{time:"12:00 AM", available:false} ]);
});



module.exports = router;
