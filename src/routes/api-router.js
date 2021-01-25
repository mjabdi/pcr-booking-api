const express = require('express');
const router = express.Router();

const timeService = require('./../services/time-service');
const bookingService = require('./../services/booking-service');
const pdfService = require('./../services/pdf-service');
const UserService = require('./../services/user-service');
const UserBookingService = require('./../services/user-booking-service')

const gynaeTimeService =  require('./../services/gynae/time-service');
const gynaeBookService =  require('./../services/gynae/booking-service');


const MedexUserService = require('./../services/medex/user/user-service')
/* GET Apis listing. */
router.get('/', function(req, res, next) {
  res.send('the list of APIS');
});



///PCR---------

  router.use('/time', timeService);

  router.use('/book', bookingService);

  router.use('/pdf', pdfService);

  router.use('/user', UserService)

  router.use('/userbookings', UserBookingService)
//----------------------------------------------------------

/// Gynaee ---------
router.use('/gynae/time', gynaeTimeService);
router.use('/gynae/book', gynaeBookService);

/// Medex -----------------------------
router.use('/medex/user', MedexUserService)


module.exports = router;
