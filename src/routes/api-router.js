const express = require('express');
const router = express.Router();

const timeService = require('./../services/time-service');
const bookingService = require('./../services/booking-service');
const pdfService = require('./../services/pdf-service');
const UserService = require('./../services/user-service');
const UserBookingService = require('./../services/user-booking-service')

const gynaeTimeService =  require('./../services/gynae/time-service');
const gynaeBookService =  require('./../services/gynae/booking-service');
const gynaePaymentService =  require('./../services/gynae/payment-service');

const gpTimeService =  require('./../services/gp/time-service');
const gpBookService =  require('./../services/gp/booking-service');

const stdTimeService =  require('./../services/std/time-service');
const stdBookService =  require('./../services/std/booking-service');

const bloodTimeService =  require('./../services/blood/time-service');
const bloodBookService =  require('./../services/blood/booking-service');

const dermaTimeService =  require('./../services/derma/time-service');
const dermaBookService =  require('./../services/derma/booking-service');


const adminBookService =  require('./../services/admin/booking-service');



const MedexUserService = require('./../services/medex/user/user-service')
const InvoiceService = require('./../services/medex/invoice-service')

const OptimalVisionBookService =  require('./../services/optimalvision/booking-service')
const OptimalVisionUserService =  require('./../services/optimalvision/user-service')
const OptimalVisionPatientService =  require('../services/optimalvision/patient-service');


const dentistTimeService =  require('./../services/dentist/time-service');
const dentistBookService =  require('./../services/dentist/booking-service');
const dentistUserService =  require('./../services/dentist/user-service')
const dentistPaymentService =  require('./../services/dentist/payment-service');



const museumUserService =  require('./../services/museum/user-service')


/* GET Apis listing. */
// router.get('/', function(req, res, next) {
//   res.send('the list of APIS');
// });



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
router.use('/gynae/payment', gynaePaymentService);

/// GP ---------
router.use('/gp/time', gpTimeService);
router.use('/gp/book', gpBookService);


/// STD ---------
router.use('/std/time', stdTimeService);
router.use('/std/book', stdBookService);

/// STD ---------
router.use('/blood/time', bloodTimeService);
router.use('/blood/book', bloodBookService);

/// Derma ---------
router.use('/derma/time', dermaTimeService);
router.use('/derma/book', dermaBookService);



/// Medex -----------------------------
router.use('/medex/user', MedexUserService)
router.use('/medex/invoice', InvoiceService)

/// Admin
router.use('/admin/book', adminBookService)


/// Optimal Vision
router.use('/optimalvision/book', OptimalVisionBookService)
router.use('/optimalvision/user', OptimalVisionUserService)
router.use('/optimalvision/patient', OptimalVisionPatientService)


/// Dentist ---------
router.use('/dentist/time', dentistTimeService);
router.use('/dentist/book', dentistBookService);
router.use('/dentist/user', dentistUserService);
router.use('/dentist/payment', dentistPaymentService);

/// Museum Dental ---------
router.use('/museumdental/user', museumUserService);


module.exports = router;
