const express = require("express");
const router = express.Router();
const { CorporateBooking } = require("../../models/corporate/CorporateBooking");
const { Invoice } = require("../../models/medex/Invoice");
const { Corporate } = require("../../models/corporate/Corporate");
const dateformat = require("dateformat");
const { sendConfirmationEmail, sendRegFormEmail } = require("./email-service");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { AllPatients } = require("../../models/medex/AllPatients");

const { getDefaultTimeSlots, getHolidays } = require("./holidays");
const { Notification } = require("./../../models/Notification");
const {
  sendAdminNotificationEmail,
  NOTIFY_TYPE,
} = require("../mail-notification-service");
const getNewRef = require("../refgenatator-service");

const DEFAULT_LIMIT = 25;

router.post("/setclinicnotes", async function (req, res, next) {
  try {
    const { bookingId, notes } = req.body;
    await CorporateBooking.updateOne(
      { _id: bookingId },
      { clinicNotes: notes }
    );
    res.status(200).send({ status: "OK" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.post("/sendregformemail", async function (req, res, next) {
  try {
    const { id } = req.query;
    const booking = await CorporateBooking.findOne({ _id: id });
    sendRegFormEmail(booking);
    res.status(200).send({ status: "OK" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.post("/submitformdata", async function (req, res, next) {
  try {
    const { bookingId, formData } = req.body;
    await CorporateBooking.updateOne(
      { _id: bookingId },
      { formData: JSON.stringify(formData) }
    );
    res.status(200).send({ status: "OK" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.post("/paybooking", async function (req, res, next) {
  try {
    const bookingId = ObjectId(req.query.id);
    const paidBy = req.query.paymentmethod;
    const corporate = req.query.corporate;
    const price = parseFloat(req.query.price);
    await CorporateBooking.updateOne(
      { _id: bookingId },
      {
        paid: true,
        OTCCharges: price,
        paidBy: paidBy,
        corporate: corporate ? corporate : "",
      }
    );
    res.status(200).send({ status: "OK" });
  } catch (err) {
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.post("/unpaybooking", async function (req, res, next) {
  try {
    const bookingId = ObjectId(req.query.id);
    await CorporateBooking.updateOne(
      { _id: bookingId },
      { paid: false, OTCCharges: 0, paidBy: "", corporate: "" }
    );
    res.status(200).send({ status: "OK" });
  } catch (err) {
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.get("/getshouldrefundscount", async function (req, res, next) {
  try {
    const count = await CorporateBooking.countDocuments({
      deleted: { $eq: true },
      deposit: { $gt: 0 },
    });
    res.status(200).send({ status: "OK", count: count });
  } catch (err) {
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.get("/getbookingscountbydatestr", async function (req, res, next) {
  try {
    const dateStr = req.query.date;
    if (!dateStr || dateStr.length <= 0) {
      res
        .status(400)
        .send({ status: "FAILED", error: "datestr query param not present!" });
      return;
    }
    const result = await CorporateBooking.countDocuments({
      bookingDate: dateStr,
      deleted: { $ne: true },
      status: "booked",
    }).exec();
    res.status(200).send({ status: "OK", count: result });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.get("/getallbookingscountall", async function (req, res, next) {
  try {
    const result = await CorporateBooking.countDocuments({
      deleted: { $ne: true },
    }).exec();
    res.status(200).send({ status: "OK", count: result });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.get("/getallbookingscountbydatestr", async function (req, res, next) {
  try {
    const dateStr = req.query.date;
    if (!dateStr || dateStr.length <= 0) {
      res
        .status(400)
        .send({ status: "FAILED", error: "datestr query param not present!" });
      return;
    }
    const result = await CorporateBooking.countDocuments({
      bookingDate: dateStr,
      deleted: { $ne: true },
    }).exec();
    res.status(200).send({ status: "OK", count: result });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.get("/getbookingsstatsbydatestr", async function (req, res, next) {
  try {
    const dateStr = req.query.date;
    if (!dateStr || dateStr.length <= 0) {
      res
        .status(400)
        .send({ status: "FAILED", error: "datestr query param not present!" });
      return;
    }
    const result = await CorporateBooking.aggregate([
      {
        $match: {
          bookingDate: dateStr,
          deleted: { $ne: true },
        },
      },

      {
        $group: {
          _id: "$bookingTimeNormalized",

          count: { $sum: 1 },
        },
      },
    ]);
    res.status(200).send({ status: "OK", result: result });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.get(
  "/getbookingscountbydatestrandtime",
  async function (req, res, next) {
    try {
      const dateStr = req.query.date;
      const timeStr = req.query.time;
      if (!dateStr || dateStr.length <= 0) {
        res.status(400).send({
          status: "FAILED",
          error: "datestr query param not present!",
        });
        return;
      }
      const result = await CorporateBooking.countDocuments({
        bookingDate: dateStr,
        bookingTime: timeStr,
        deleted: { $ne: true },
        status: "booked",
      }).exec();
      res.status(200).send({ status: "OK", count: result });
    } catch (err) {
      console.log(err);
      res.status(500).send({ status: "FAILED", error: err.message });
    }
  }
);

router.get(
  "/getallbookingscountbydatestrandtime",
  async function (req, res, next) {
    try {
      const dateStr = req.query.date;
      const timeStr = req.query.time;
      if (!dateStr || dateStr.length <= 0) {
        res.status(400).send({
          status: "FAILED",
          error: "datestr query param not present!",
        });
        return;
      }
      const result = await CorporateBooking.countDocuments({
        bookingDate: dateStr,
        bookingTime: timeStr,
        deleted: { $ne: true },
      }).exec();
      res.status(200).send({ status: "OK", count: result });
    } catch (err) {
      console.log(err);
      res.status(500).send({ status: "FAILED", error: err.message });
    }
  }
);

router.get("/getbookingsbydatestrandtime", async function (req, res, next) {
  try {
    const dateStr = req.query.date;
    const timeStr = req.query.time;
    if (!dateStr || dateStr.length <= 0) {
      res
        .status(400)
        .send({ status: "FAILED", error: "datestr query param not present!" });
      return;
    }
    const result = await CorporateBooking.find({
      bookingDate: dateStr,
      bookingTime: timeStr,
      deleted: { $ne: true },
      status: "booked",
    })
      .sort({ timeStamp: 1 })
      .exec();
    res.status(200).send({ status: "OK", bookings: result });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.get("/getallbookingsbydatestrandtime", async function (req, res, next) {
  try {
    const dateStr = req.query.date;
    const timeStr = req.query.time;
    if (!dateStr || dateStr.length <= 0) {
      res
        .status(400)
        .send({ status: "FAILED", error: "datestr query param not present!" });
      return;
    }
    const result = await CorporateBooking.find({
      bookingDate: dateStr,
      bookingTime: timeStr,
      deleted: { $ne: true },
    })
      .sort({ timeStamp: 1 })
      .exec();
    res.status(200).send({ status: "OK", bookings: result });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.get("/getallbookings", async function (req, res, next) {
  try {
    const limit = parseInt(req.query.limit) || DEFAULT_LIMIT;
    const result = await CorporateBooking.find({ deleted: { $ne: true } })
      .sort({ bookingDate: -1, bookingTimeNormalized: -1 })
      .limit(limit)
      .exec();
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.get("/getdeletedbookings", async function (req, res, next) {
  try {
    const limit = parseInt(req.query.limit) || DEFAULT_LIMIT;
    const result = await CorporateBooking.find({ deleted: { $eq: true } })
      .sort({ bookingDate: -1, bookingTimeNormalized: -1 })
      .limit(limit)
      .exec();
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.get("/gettodaybookings", async function (req, res, next) {
  try {
    const today = dateformat(new Date(), "yyyy-mm-dd");

    const result = await CorporateBooking.find({
      bookingDate: today,
      deleted: { $ne: true },
    })
      .sort({ bookingTimeNormalized: 1 })
      .exec();
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.get("/getoldbookings", async function (req, res, next) {
  try {
    const today = dateformat(new Date(), "yyyy-mm-dd");
    const limit = parseInt(req.query.limit) || DEFAULT_LIMIT;
    const result = await CorporateBooking.find({
      bookingDate: { $lt: today },
      deleted: { $ne: true },
    })
      .sort({ bookingDate: -1, bookingTimeNormalized: -1 })
      .limit(limit)
      .exec();
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.get("/getfuturebookings", async function (req, res, next) {
  try {
    const today = dateformat(new Date(), "yyyy-mm-dd");
    const limit = parseInt(req.query.limit) || DEFAULT_LIMIT;
    const result = await CorporateBooking.find({
      bookingDate: { $gt: today },
      deleted: { $ne: true },
    })
      .sort({ bookingDate: 1, bookingTimeNormalized: 1 })
      .limit(limit)
      .exec();
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.get("/getrecentbookings", async function (req, res, next) {
  try {
    const result = await CorporateBooking.find({ deleted: { $ne: true } })
      .sort({ timeStamp: -1 })
      .limit(10)
      .exec();
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.get("/getrecentbookingsall", async function (req, res, next) {
  try {
    const limit = parseInt(req.query.limit) || DEFAULT_LIMIT;
    const result = await CorporateBooking.find({ deleted: { $ne: true } })
      .sort({ timeStamp: -1 })
      .limit(limit)
      .exec();
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.get("/getbookingsbyref", async function (req, res, next) {
  try {
    const result = await CorporateBooking.find({ bookingRef: req.query.ref });
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.get("/getbookingbyid", async function (req, res, next) {
  try {
    req.query.id = ObjectId(req.query.id);
    const result = await CorporateBooking.findOne({ _id: req.query.id });
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.post("/addnewbooking", async function (req, res, next) {
  try {
    const ref = await getNewRef();
    let {
      fullname,
      bookingDate,
      bookingTime,
      phone,
      email,
      notes,
      service,
      corporate,
      birthDate,
    } = req.body;

    if (!email || email.length < 1) {
      email = "-";
    }

    if (!phone || phone.length < 1) {
      phone = "-";
    }

    const payload = {
      fullname,
      bookingDate,
      bookingTime,
      phone,
      email,
      notes,
      corporate,
      service,
      birthDate,
    };

    const booking = new CorporateBooking({
      ...payload,
      bookingRef: ref,
      bookingTimeNormalized: NormalizeTime(payload.bookingTime),
      timeStamp: new Date(),
    });

    await booking.save();
    if (email && email.length > 3) {
      await sendConfirmationEmail(booking);
    }

    // await sendAdminNotificationEmail(NOTIFY_TYPE.NOTIFY_TYPE_GYNAE_BOOKED, booking)

    res.status(200).send({ status: "OK", person: req.body });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
    return;
  }
});

router.post("/bookappointment", async function (req, res, next) {
  try {
    validateBookAppointment(req.body);
  } catch (err) {
    console.error(err.message);
    res.status(400).send({ status: "FAILED", error: err.message });
    return;
  }

  try {
    const found = await CorporateBooking.findOne({
      email: req.body.email,
      bookingDate: req.body.bookingDate,
      deleted: { $ne: true },
    });

    if (found) {
      res.status(200).send({
        status: "FAILED",
        error: "Repeated Booking!",
        person: req.body,
      });
      return;
    }

    const booking = new CorporateBooking({
      ...req.body,
      timeStamp: new Date(),
    });

    const isTimeAvailable = await checkBookingTime(booking);
    if (!isTimeAvailable) {
      const alaram = new Notification({
        timeStamp: new Date(),
        type: "InvalidBooking-Corporate",
        text: `An attempt to book on ${booking.bookingDate} at ${booking.bookingTime} Blocked by the system (Corporate)`,
      });
      await alaram.save();
      res
        .status(200)
        .send({ status: "FAILED", error: "FullTime", person: req.body });
      return;
    }

    await booking.save();
    if (booking.email && booking.email.length > 3) {
      await sendConfirmationEmail(booking);
    }

    await sendAdminNotificationEmail(
      NOTIFY_TYPE.NOTIFY_TYPE_CORPORATE_BOOKED,
      booking
    );

    res.status(200).send({ status: "OK", person: req.body });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
    return;
  }
});

router.post("/updatebookappointment", async function (req, res, next) {
  try {
    req.body.bookingId = ObjectId(req.body.bookingId);
    validateBookAppointment(req.body.person);
  } catch (err) {
    console.error(err.message);
    res.status(400).send({ status: "FAILED", error: err.message });
    return;
  }

  try {
    const oldBooking = await CorporateBooking.findOne({
      _id: req.body.bookingId,
    });

    await CorporateBooking.updateOne(
      { _id: req.body.bookingId },
      { ...req.body.person }
    );

    const newBooking = await CorporateBooking.findOne({
      _id: req.body.bookingId,
    });

    const foundedInvoice = await Invoice.findOne({
      bookingId: req.body.bookingId,
    });
    if (foundedInvoice) {
      await foundedInvoice.updateOne({
        corporate: req.body.person.corporate || null,
      });
    }
    if (newBooking.email && newBooking.email.length > 3) {
      await sendConfirmationEmail(newBooking);
    }

    res.status(200).send({ status: "OK" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
    return;
  }
});

router.post("/updatebookappointmenttime", async function (req, res, next) {
  try {
    req.body.bookingId = ObjectId(req.body.bookingId);
  } catch (err) {
    console.error(err.message);
    res.status(400).send({ status: "FAILED", error: err.message });
    return;
  }

  try {
    await CorporateBooking.updateOne(
      { _id: req.body.bookingId },
      {
        bookingDate: req.body.bookingDate,
        bookingTime: req.body.bookingTime,
        bookingTimeNormalized: NormalizeTime(req.body.bookingTime),
      }
    );

    const booking = await CorporateBooking.findOne({ _id: req.body.bookingId });

    if (booking.email && booking.email.length > 3) {
      await sendConfirmationEmail(booking);
    }
    res.status(200).send({ status: "OK" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
    return;
  }
});

router.post("/changebacktobookingmade", async function (req, res, next) {
  try {
    req.query.id = ObjectId(req.query.id);
  } catch (err) {
    console.error(err);
    res.status(400).send({ status: "FAILED", error: err.message });
    return;
  }

  try {
    await CorporateBooking.updateOne(
      { _id: req.query.id },
      { status: "booked" }
    );
    await AllPatients.updateMany(
      { bookings: req.query.id },
      { $pull: { bookings: req.query.id } }
    );
    res.status(200).send({ status: "OK" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
    return;
  }
});

router.post("/changetopatientattended", async function (req, res, next) {
  try {
    req.query.id = ObjectId(req.query.id);
  } catch (err) {
    console.error(err);
    res.status(400).send({ status: "FAILED", error: err.message });
    return;
  }

  try {
    await CorporateBooking.updateOne(
      { _id: req.query.id },
      { status: "patient_attended" }
    );
    if (req.body.patientid) {
      const patient = await AllPatients.findById(ObjectId(req.body.patientid));
      if (!patient.bookings.includes(req.query.id)) {
        patient.bookings.push(req.query.id);
        await patient.save();
      }
    } else {
      if (
        (!(req.body.surname && req.body.forename) && !req.body.fullname) ||
        !req.body.birthDate
      ) {
        throw Error("no patient data or patient id!");
      }
      const uniqueId = await createUniqueId(
        req.body?.fullname,
        req.body?.surname,
        req.body?.forename,
        req.body?.birthDate
      );
      const patient = await AllPatients.create({
        bookings: [req.query.id],
        surname: req.body?.surname,
        forename: req.body?.forename,
        fullname: req.body?.fullname,
        birthDate: req.body?.birthDate,
        gender: req.body?.gender,
        title: req.body?.title,
        email: req.body?.email,
        phone: req.body?.phone,
        corporate: req.body?.corporate,
        postCode: req.body?.postCode,
        passportNumber: req.body?.passportNumber,
        patientId: uniqueId,
      });
      console.log(patient);
    }

    res.status(200).send({ status: "OK" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
    return;
  }
});

router.post("/deletebookappointment", async function (req, res, next) {
  try {
    req.query.id = ObjectId(req.query.id);
  } catch (err) {
    console.error(err);
    res.status(400).send({ status: "FAILED", error: err.message });
    return;
  }

  try {
    await CorporateBooking.updateOne({ _id: req.query.id }, { deleted: true });

    res.status(200).send({ status: "OK" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
    return;
  }
});

router.post("/undeletebookappointment", async function (req, res, next) {
  try {
    req.query.id = ObjectId(req.query.id);
  } catch (err) {
    console.error(err.message);
    res.status(400).send({ status: "FAILED", error: err.message });
    return;
  }

  try {
    await CorporateBooking.updateOne({ _id: req.query.id }, { deleted: false });

    res.status(200).send({ status: "OK" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
    return;
  }
});

router.get("/getcorporates", async function (req, res, next) {
  try {
    const result = await Corporate.find({ deleted: { $ne: true } });
    res.status(200).send({ result: result });
  } catch (err) {
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.post("/addcorporate", async function (req, res, next) {
  try {
    const name = req.body.name?.trim();
    const address = req.body.address?.trim();
    const email = req.body.email?.trim();

    if (!name || !address) {
      return res
        .status(400)
        .send({ status: "FAILED", error: "Name and address are required" });
    }

    await Corporate.create({ name: name, address: address, email: email });
    res.status(200).send({ status: "OK" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.post("/removecorporate", async function (req, res, next) {
  try {
    req.query.id = ObjectId(req.query.id);
  } catch (err) {
    console.error(err);
    res.status(400).send({ status: "FAILED", error: err.message });
    return;
  }

  try {
    await Corporate.updateOne({ _id: req.query.id }, { deleted: true });
    res.status(200).send({ status: "OK" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
    return;
  }
});

async function createUniqueId(fullname, surname, forename, birthDate) {
  let id = "";

  // Step 1: Add first letter of surname, forename, or last word of fullname
  if (surname) {
    id += surname.charAt(0).toLowerCase();
  } else if (fullname) {
    const names = fullname.split(" ");
    const lastWord = names[0];
    id += lastWord.charAt(0).toLowerCase();
  } else {
    // Handle the case where neither surname nor fullname is available
    return null;
  }

  if (forename) {
    id += forename.charAt(0).toLowerCase();
  } else if (fullname) {
    const names = fullname.split(" ");
    const lastWord = names[names.length - 1];
    id += lastWord.charAt(0).toLowerCase();
  } else {
    // Handle the case where neither forename nor fullname is available
    return null;
  }

  // Step 2: Add month of birthDate in 2-digit format
  if (birthDate) {
    const birthMonth = ("0" + (new Date(birthDate).getMonth() + 1)).slice(-2);
    id += birthMonth;
  } else {
    // Handle the case where birthDate is not available
    return null;
  }

  // Step 3: Add last 2 digits of birth year
  if (birthDate) {
    const birthYear = new Date(birthDate).getFullYear().toString().slice(-2);
    id += birthYear;
  } else {
    // Handle the case where birthDate is not available
    return null;
  }

  // Step 4: Add last 2 digits of the current timestamp year
  const currentYear = new Date().getFullYear().toString().slice(-2);
  id += currentYear;
  const similarPatients = await AllPatients.find({ originalPatientId: id });
  let count = 0;
  while (
    (similarPatients.map((el) => el.patientId) || []).includes(`${id}-${count}`)
  ) {
    count++;
  }
  return `${id}-${count}`;
}

const validateBookAppointment = (body) => {
  console.log(body);

  if (!body.fullname) {
    throw new Error("fullname field not present");
  }

  // if (!body.email) {
  //   throw new Error("email field not present");
  // }

  if (!body.phone) {
    throw new Error("phone field not present");
  }

  if (!body.bookingDate) {
    throw new Error("bookingDate field not present");
  }

  if (!body.bookingTime) {
    throw new Error("bookingTime field not present");
  }

  if (!body.bookingRef) {
    throw new Error("bookingRef field not present");
  }

  body.bookingTimeNormalized = NormalizeTime(body.bookingTime);

  return true;
};

function NormalizeTime(str) {
  var hour = parseInt(str.substr(0, 2));
  const minutesStr = str.substr(3, 2);
  const isPM = str.toLowerCase().indexOf("pm") > 0;

  if (isPM && hour < 12) {
    hour += 12;
  }

  if (!isPM && hour === 12) {
    hour = 0;
  }

  var hourStr = `${hour}`;
  if (hourStr.length < 2) hourStr = `0${hourStr}`;

  return `${hourStr}:${minutesStr}`;
}

function timePassed(bookingDate) {
  const today = new Date();
  const todayStr = dateformat(today, "yyyy-mm-dd");
  return bookingDate < todayStr;
}

async function checkBookingTime(booking) {
  const bookingDateStr = booking.bookingDate;
  const bookingTime = booking.bookingTime;

  const bookingDate = new Date(bookingDateStr);
  const todayStr = dateformat(new Date(), "yyyy-mm-dd");

  if (bookingDateStr < todayStr) return false;

  const holidays = await getHolidays();
  if (
    holidays.find(
      (element) => dateformat(element, "yyyy-mm-dd") === bookingDateStr
    )
  ) {
    return false;
  }

  const validTimeSlots = await getDefaultTimeSlots(bookingDate);

  // console.log(validTimeSlots);
  // console.log(bookingTime);

  if (
    !validTimeSlots.find(
      (element) => element.time === bookingTime && element.available === true
    )
  ) {
    return false;
  }

  // console.log(bookingDate);
  // console.log(bookingTime);

  return true;
}

module.exports = router;
