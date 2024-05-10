const express = require("express");
const router = express.Router();

const timeService = require("./../services/time-service");
const bookingService = require("./../services/booking-service");
const pdfService = require("./../services/pdf-service");
const UserService = require("./../services/user-service");
const UserBookingService = require("./../services/user-booking-service");

const gynaeTimeService = require("./../services/gynae/time-service");
const gynaeBookService = require("./../services/gynae/booking-service");
const gynaePaymentService = require("./../services/gynae/payment-service-new");

const gpTimeService = require("./../services/gp/time-service");
const gpBookService = require("./../services/gp/booking-service");
const gpPaymentService = require("./../services/gp/payment-service-new");

const paediatricianTimeService = require("./../services/paediatrician/time-service");
const paediatricianBookService = require("./../services/paediatrician/booking-service");
const paediatricianPaymentService = require("./../services/paediatrician/payment-service-new");

const stdTimeService = require("./../services/std/time-service");
const stdBookService = require("./../services/std/booking-service");

const bloodTimeService = require("./../services/blood/time-service");
const bloodBookService = require("./../services/blood/booking-service");
const bloodPaymentService = require("./../services/blood/payment-service-new");

const dermaTimeService = require("./../services/derma/time-service");
const dermaBookService = require("./../services/derma/booking-service");

const screeningTimeService = require("./../services/screening/time-service");
const screeningBookService = require("./../services/screening/booking-service");
const screeningPaymentService = require("./../services/screening/payment-service-new");

const corporateTimeService = require("./../services/corporate/time-service");
const corporateBookService = require("./../services/corporate/booking-service");

const adminBookService = require("./../services/admin/booking-service");
const adminAllPatients = require("./../services/admin/all-patients");

const MedexUserService = require("./../services/medex/user/user-service");
const InvoiceService = require("./../services/medex/invoice-service");
const OffDaysService = require("./../services/medex/offdays-service");
const WorkingHoursService = require("./../services/medex/workingHours-service");

const OptimalVisionBookService = require("./../services/optimalvision/booking-service");
const OptimalVisionUserService = require("./../services/optimalvision/user-service");
const OptimalVisionPatientService = require("../services/optimalvision/patient-service");
const OptimalVisionEmailTemplateService = require("../services/optimalvision/email-template-service");
const OptimalVisionSMSTemplateService = require("../services/optimalvision/sms-template-service");

const dentistTimeService = require("./../services/dentist/time-service");
const dentistBookService = require("./../services/dentist/booking-service");
const dentistUserService = require("./../services/dentist/user-service");
const dentistPaymentService = require("./../services/dentist/payment-service");

const museumUserService = require("./../services/museum/user-service");
const museumPaymentService = require("./../services/museum/payment-service");

const medexPaymentService = require("./../services/medex/payment/payment-service");

/* GET Apis listing. */
// router.get('/', function(req, res, next) {
//   res.send('the list of APIS');
// });

///PCR---------

router.use("/time", timeService);

router.use("/book", bookingService);

router.use("/pdf", pdfService);

router.use("/user", UserService);

router.use("/userbookings", UserBookingService);
//----------------------------------------------------------

/// Gynaee ---------
router.use("/gynae/time", gynaeTimeService);
router.use("/gynae/book", gynaeBookService);
router.use("/gynae/payment", gynaePaymentService);

/// GP ---------
router.use("/gp/time", gpTimeService);
router.use("/gp/book", gpBookService);
router.use("/gp/payment", gpPaymentService);

/// Paediatrician ---------
router.use("/paediatrician/time", paediatricianTimeService);
router.use("/paediatrician/book", paediatricianBookService);
router.use("/paediatrician/payment", paediatricianPaymentService);

/// STD ---------
router.use("/std/time", stdTimeService);
router.use("/std/book", stdBookService);

/// Blood ---------
router.use("/blood/time", bloodTimeService);
router.use("/blood/book", bloodBookService);
router.use("/blood/payment", bloodPaymentService);

/// Derma ---------
router.use("/derma/time", dermaTimeService);
router.use("/derma/book", dermaBookService);

/// Health Screening ---------
router.use("/screening/time", screeningTimeService);
router.use("/screening/book", screeningBookService);
router.use("/screening/payment", screeningPaymentService);

/// Corporate ---------
router.use("/corporate/time", corporateTimeService);
router.use("/corporate/book", corporateBookService);

/// Medex -----------------------------
router.use("/medex/user", MedexUserService);
router.use("/medex/invoice", InvoiceService);
router.use("/medex/offdays", OffDaysService);
router.use("/medex/workinghours", WorkingHoursService);
router.use("/medex/payment", medexPaymentService);

/// Admin
router.use("/admin/book", adminBookService);
router.use("/admin/patients", adminAllPatients);

/// Optimal Vision
router.use("/optimalvision/book", OptimalVisionBookService);
router.use("/optimalvision/user", OptimalVisionUserService);
router.use("/optimalvision/patient", OptimalVisionPatientService);
router.use("/optimalvision/emailtemplate", OptimalVisionEmailTemplateService);
router.use("/optimalvision/smstemplate", OptimalVisionSMSTemplateService);

/// Dentist ---------
router.use("/dentist/time", dentistTimeService);
router.use("/dentist/book", dentistBookService);
router.use("/dentist/user", dentistUserService);
router.use("/dentist/payment", dentistPaymentService);

/// Museum Dental ---------
router.use("/museumdental/user", museumUserService);
router.use("/museumdental/payment", museumPaymentService);

module.exports = router;
