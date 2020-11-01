const express = require('express');
const router = express.Router();

const timeService = require('../services/time-service');
const bookingService = require('../services/booking-service');

/* GET Apis listing. */
router.get('/', function(req, res, next) {
  res.send('the list of APIS');
});



  router.use('/time', timeService);

  router.use('/book', bookingService);




module.exports = router;
