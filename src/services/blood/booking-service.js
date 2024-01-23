const express = require("express");
const config = require("config");
const router = express.Router();
const { BloodBooking } = require("../../models/blood/BloodBooking");
const dateformat = require("dateformat");
const {
  sendConfirmationEmail,
  sendRegFormEmail,
  sendBloodResultEmail,
  sendRefundNotificationEmail,
} = require("./email-service");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { getDefaultTimeSlots, getHolidays } = require("./holidays");
const { Notification } = require("../../models/Notification");
const {
  sendAdminNotificationEmail,
  NOTIFY_TYPE,
} = require("../mail-notification-service");
const getNewRef = require("../refgenatator-service");

const { BloodReport } = require("../../models/blood/BloodReport");
const { sendBloodConfirmationTextMessage } = require("./sms-service");

const { Client, Environment } = require("square");
const SANDBOX = process.env.NODE_ENV !== "production";

const axios = require("axios");
const { sendReviewSMS } = require("../screening/sms-service");

const LIVE_ACCESSTOKEN =
  "EAAAEAxDlhTfsK7_QcWlXIS8mpoNsGyWu6GOtROECsno-txpY1bnzlPtyCscFpMt"; // live
const SANDBOX_ACCESSTOKEN =
  "EAAAEHpXroK4v3SCYQTdflulI8A8BlUGdy56BSVPX7-a5nicjp9dyF7ezj8iiFzm"; // sandbox

const LIVE_LOCATION_ID = "L2SBNYPV0XWVJ"; // live
const SANDBOX_LOCATION_ID = "LBR8YPCPR878R"; // sandbox

const client = new Client({
  environment: SANDBOX ? Environment.Sandbox : Environment.Production,
  accessToken: SANDBOX ? SANDBOX_ACCESSTOKEN : LIVE_ACCESSTOKEN,
});

const refundsApi = client.refundsApi;

const DEFAULT_LIMIT = 25;

router.post("/sendreviewsms", async function (req, res, next) {
  try {
    const { id, message } = req.body;
    const booking = await BloodBooking.findOne({ _id: id });
    await sendReviewSMS(booking, message);
    booking.smsSent = true;
    await booking.save();
    res.status(200).send({ status: "OK" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.post("/setclinicnotes", async function (req, res, next) {
  try {
    const { bookingId, notes } = req.body;
    await BloodBooking.updateOne({ _id: bookingId }, { clinicNotes: notes });
    res.status(200).send({ status: "OK" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.get("/getbloodreportsbybookingid", async function (req, res, next) {
  try {
    const id = ObjectId(req.query.id);
    const result = await BloodReport.find({ bookingId: id })
      .sort({ testDate: -1, timeStamp: -1 })
      .exec();

    res.status(200).send({ status: "OK", result: result });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.get("/getbloodreportbyid", async function (req, res, next) {
  try {
    const id = ObjectId(req.query.id);
    const result = await BloodReport.findOne({ _id: id });

    res.status(200).send({ status: "OK", result: result });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.get("/getarchivedbloodreports", async function (req, res, next) {
  try {
    // const result = await BloodReport.find({status: "matched", seen : {$eq : true}}).sort({testDate:-1,timeStamp:-1}).exec();
    const result = await BloodReport.find({
      status: { $ne: "new" },
      seen: { $eq: true },
      emailSent: { $ne: true },
    })
      .sort({ testDate: -1, timeStamp: -1 })
      .exec();

    res.status(200).send({ status: "OK", result: result });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.get("/getnewmatchedbloodreports", async function (req, res, next) {
  try {
    // const result = await BloodReport.find({status: "matched", seen : {$ne : true}}).sort({testDate:-1, timeStamp:-1}).exec();
    const result = await BloodReport.find({
      status: { $ne: "new" },
      email: { $ne: null },
      seen: { $ne: true },
      emailSent: { $ne: true },
    })
      .sort({ testDate: -1, timeStamp: -1 })
      .exec();

    res.status(200).send({ status: "OK", result: result });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.get("/getarchivedmatchedbloodreports", async function (req, res, next) {
  try {
    // const result = await BloodReport.find({status: "matched", seen : {$eq : true}}).sort({testDate:-1,timeStamp:-1}).exec();
    const result = await BloodReport.find({
      status: { $ne: "new" },
      email: { $ne: null },
      seen: { $eq: true },
      emailSent: { $ne: true },
    })
      .sort({ testDate: -1, timeStamp: -1 })
      .exec();

    res.status(200).send({ status: "OK", result: result });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.get("/getnewunmatchedbloodreports", async function (req, res, next) {
  try {
    // const result = await BloodReport.find({status: "unmatched", seen : {$ne : true}}).sort({testDate:-1,timeStamp:-1}).exec();
    const result = await BloodReport.find({
      status: { $ne: "new" },
      email: { $eq: null },
      seen: { $ne: true },
      emailSent: { $ne: true },
    })
      .sort({ testDate: -1, timeStamp: -1 })
      .exec();

    res.status(200).send({ status: "OK", result: result });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.get(
  "/getarchivedunmatchedbloodreports",
  async function (req, res, next) {
    try {
      // const result = await BloodReport.find({status: "unmatched", seen : {$eq : true}}).sort({testDate:-1,timeStamp:-1}).exec();
      const result = await BloodReport.find({
        status: { $ne: "new" },
        email: { $eq: null },
        seen: { $eq: true },
        emailSent: { $ne: true },
      })
        .sort({ testDate: -1, timeStamp: -1 })
        .exec();

      res.status(200).send({ status: "OK", result: result });
    } catch (err) {
      console.log(err);
      res.status(500).send({ status: "FAILED", error: err.message });
    }
  }
);

router.get("/getsentbloodreports", async function (req, res, next) {
  try {
    // const result = await BloodReport.find({status: "unmatched", seen : {$eq : true}}).sort({testDate:-1,timeStamp:-1}).exec();
    const result = await BloodReport.find({
      status: { $ne: "new" },
      emailSent: { $eq: true },
    })
      .sort({ testDate: -1, timeStamp: -1 })
      .exec();

    res.status(200).send({ status: "OK", result: result });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.get("/getnewbloodresultscount", async function (req, res, next) {
  try {
    // const result = await BloodReport.find({status: "unmatched", seen : {$eq : true}}).sort({testDate:-1,timeStamp:-1}).exec();
    const result = await BloodReport.countDocuments({
      status: { $ne: "new" },
      emailSent: { $ne: true },
      seen: { $ne: true },
    });

    res.status(200).send({ status: "OK", result: result });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.post("/archivebloodreport", async function (req, res, next) {
  try {
    const { id } = req.query;
    const bloodreport = await BloodReport.findOne({ _id: id });
    bloodreport.seen = true;
    await bloodreport.save();

    res.status(200).send({ status: "OK" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.post("/unarchivebloodreport", async function (req, res, next) {
  try {
    const { id } = req.query;
    const bloodreport = await BloodReport.findOne({ _id: id });
    bloodreport.seen = false;
    await bloodreport.save();

    res.status(200).send({ status: "OK" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.post("/sendbloodreportemail", async function (req, res, next) {
  try {
    const { id } = req.query;
    const { email, notes } = req.body;

    const bloodreport = await BloodReport.findOne({ _id: id });

    ///* send blood report email

    await sendBloodResultEmail(bloodreport, email, notes);

    /////

    bloodreport.emailSent = true;
    bloodreport.emailSentTimeStamp = new Date();
    bloodreport.notes = notes;
    bloodreport.email = email;

    await bloodreport.save();

    res.status(200).send({ status: "OK" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.post("/updatebloodreport", async function (req, res, next) {
  try {
    const { id } = req.query;
    let { email, notes } = req.body;

    if (!email || email.trim().length === 0) {
      email = null;
    }

    const bloodreport = await BloodReport.findOne({ _id: id });

    bloodreport.notes = notes;
    bloodreport.email = email;

    await bloodreport.save();

    if (bloodreport.name && bloodreport.name.trim().length > 10) {
      await BloodReport.updateMany(
        { name: bloodreport.name, email: { $eq: null } },
        { email: email }
      );
    }

    res.status(200).send({ status: "OK" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.post("/sendregformemail", async function (req, res, next) {
  try {
    const { id } = req.query;
    const booking = await BloodBooking.findOne({ _id: id });
    sendRegFormEmail(booking);
    res.status(200).send({ status: "OK" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.post("/sendforprint", async function (req, res, next) {
  try {
    const { id } = req.query;
    const booking = await BloodBooking.findOne({ _id: id });
    booking.printStatus = "preparing";
    await booking.save();
    res.status(200).send({ status: "OK" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.post("/submitformdata", async function (req, res, next) {
  try {
    const { bookingId, formData } = req.body;
    await BloodBooking.updateOne(
      { _id: bookingId },
      { formData: JSON.stringify(formData) }
    );
    res.status(200).send({ status: "OK" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.post("/changedepositbooking", async function (req, res, next) {
  try {
    const { id, deposit } = req.query;
    const booking = await BloodBooking.findOne({ _id: id });
    booking.deposit = deposit;
    await booking.save();
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
    await BloodBooking.updateOne(
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
    await BloodBooking.updateOne(
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
    const count = await BloodBooking.countDocuments({
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
    const result = await BloodBooking.countDocuments({
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
    const result = await BloodBooking.countDocuments({
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
    const result = await BloodBooking.countDocuments({
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
    const result = await BloodBooking.aggregate([
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
      const result = await BloodBooking.countDocuments({
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
      const result = await BloodBooking.countDocuments({
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
    const result = await BloodBooking.find({
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
    const result = await BloodBooking.find({
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
    const result = await BloodBooking.find({ deleted: { $ne: true } })
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
    const result = await BloodBooking.find({ deleted: { $eq: true } })
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

    const result = await BloodBooking.find({
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

router.get("/getlivebookings", async function (req, res, next) {
  try {
    const result = await BloodBooking.find({
      bookingDate: { $gt: "2022-02-19" },
      status: "patient_attended",
      deleted: { $ne: true },
    })
      .sort({ bookingDate: 1 })
      .exec();
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.get("/getcompletedbookings", async function (req, res, next) {
  try {
    const limit = parseInt(req.query.limit) || DEFAULT_LIMIT;
    const result = await BloodBooking.find({
      status: "report_sent",
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

router.get("/getoldbookings", async function (req, res, next) {
  try {
    const today = dateformat(new Date(), "yyyy-mm-dd");
    const limit = parseInt(req.query.limit) || DEFAULT_LIMIT;
    const result = await BloodBooking.find({
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
    const result = await BloodBooking.find({
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
    const result = await BloodBooking.find({ deleted: { $ne: true } })
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
    const result = await BloodBooking.find({ deleted: { $ne: true } })
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
    const result = await BloodBooking.find({ bookingRef: req.query.ref });
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.get("/getbookingbyid", async function (req, res, next) {
  try {
    req.query.id = ObjectId(req.query.id);
    const result = await BloodBooking.findOne({ _id: req.query.id });
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
      packageName,
      birthDate,
      indivisualTests,
      gender,
      smsPush,
    } = req.body;

    const payload = {
      fullname,
      bookingDate,
      bookingTime,
      phone,
      email,
      notes,
      packageName,
      birthDate,
      indivisualTests,
      gender,
      smsPush,
    };

    const booking = new BloodBooking({
      ...payload,
      bookingRef: ref,
      bookingTimeNormalized: NormalizeTime(payload.bookingTime),
      timeStamp: new Date(),
    });

    await booking.save();
    if (email && email.length > 3) {
      await sendConfirmationEmail(booking);
    }

    if (smsPush && phone && phone.length > 3) {
      let _phone = phone;

      if (_phone.startsWith("07") && _phone.length === 11) {
        _phone = `+447${_phone.substr(2, 10)}`;
      } else if (_phone.startsWith("7") && _phone.length === 10) {
        _phone = `+447${_phone.substr(1, 10)}`;
      }

      if (_phone.length === 13 && _phone.startsWith("+447")) {
        await sendBloodConfirmationTextMessage(booking, _phone);
      }
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
    const found = await BloodBooking.findOne({
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

    const booking = new BloodBooking({
      ...req.body,
      timeStamp: new Date(),
    });

    const isTimeAvailable = await checkBookingTime(booking);
    if (!isTimeAvailable) {
      const alaram = new Notification({
        timeStamp: new Date(),
        type: "InvalidBooking-Blood",
        text: `An attempt to book on ${booking.bookingDate} at ${booking.bookingTime} Blocked by the system (Blood)`,
      });
      await alaram.save();
      res
        .status(200)
        .send({ status: "FAILED", error: "FullTime", person: req.body });
      return;
    }

    await booking.save();

    if (booking.email && booking.email.trim().length > 0) {
      await sendConfirmationEmail(booking);
    }

    await sendAdminNotificationEmail(
      NOTIFY_TYPE.NOTIFY_TYPE_BLOOD_BOOKED,
      booking
    );

    if (booking.smsPush && booking.phone && booking.phone.length > 3) {
      let _phone = booking.phone;

      if (_phone.startsWith("07") && _phone.length === 11) {
        _phone = `+447${_phone.substr(2, 10)}`;
      } else if (_phone.startsWith("7") && _phone.length === 10) {
        _phone = `+447${_phone.substr(1, 10)}`;
      }

      if (_phone.length === 13 && _phone.startsWith("+447")) {
        await sendBloodConfirmationTextMessage(booking, _phone);
      }
    }

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
    const oldBooking = await BloodBooking.findOne({ _id: req.body.bookingId });

    await BloodBooking.updateOne(
      { _id: req.body.bookingId },
      { ...req.body.person }
    );

    const newBooking = await BloodBooking.findOne({ _id: req.body.bookingId });

    if (newBooking.email && newBooking.email.trim().length > 1) {
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
    await BloodBooking.updateOne(
      { _id: req.body.bookingId },
      {
        bookingDate: req.body.bookingDate,
        bookingTime: req.body.bookingTime,
        bookingTimeNormalized: NormalizeTime(req.body.bookingTime),
      }
    );

    const booking = await BloodBooking.findOne({ _id: req.body.bookingId });

    if (booking.email && booking.email.trim().length > 1) {
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
    await BloodBooking.updateOne({ _id: req.query.id }, { status: "booked" });

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
    await BloodBooking.updateOne(
      { _id: req.query.id },
      { status: "patient_attended", samplingTimeStamp: new Date() }
    );

    res.status(200).send({ status: "OK" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
    return;
  }
});

router.post("/changetocompleted", async function (req, res, next) {
  try {
    req.query.id = ObjectId(req.query.id);
  } catch (err) {
    console.error(err);
    res.status(400).send({ status: "FAILED", error: err.message });
    return;
  }

  try {
    await BloodBooking.updateOne(
      { _id: req.query.id },
      { status: "report_sent", samplingTimeStamp: new Date() }
    );

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
    await BloodBooking.updateOne({ _id: req.query.id }, { deleted: true });

    await refundPayment(req.query.id);

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
    await BloodBooking.updateOne({ _id: req.query.id }, { deleted: false });

    res.status(200).send({ status: "OK" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
    return;
  }
});

const validateBookAppointment = (body) => {
  console.log(body);

  if (!body.fullname) {
    throw new Error("fullname field not present");
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

async function refundPayment(bookingId) {
  const booking = await BloodBooking.findOne({ _id: bookingId });

  if (!booking || !booking.paymentInfo) {
    return;
  }

  if (booking.refund) {
    return;
  }

  const paymentInfo = JSON.parse(booking.paymentInfo);

  if (paymentInfo.intent) {
    await refundPaymentPaypal(bookingId);
  } else {
    await refundPaymentSquare(bookingId);
  }
}

async function refundPaymentPaypal(bookingId) {
  const booking = await BloodBooking.findOne({ _id: bookingId });

  if (!booking || !booking.paymentInfo) {
    return;
  }

  if (booking.refund) {
    return;
  }

  const paymentInfo = JSON.parse(booking.paymentInfo);

  const captureId = paymentInfo.purchase_units[0].payments.captures[0].id;

  const baseURL = "https://api-m.paypal.com";

  const tokenAPI = axios.create({
    baseURL: baseURL,
    headers: {
      Authorization: config.PaypalAuth,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const res = await tokenAPI.post(
    "/v1/oauth2/token",
    "grant_type=client_credentials"
  );

  const access_token = res.data.access_token;

  const refundAPI = axios.create({
    baseURL: baseURL,
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
  });

  try {
    const res2 = await refundAPI.post(
      `/v2/payments/captures/${captureId}/refund`,
      {}
    );

    if (res2.data.status === "COMPLETED") {
      booking.deposit = 0;
      booking.refund = "REFUND By PayPal";
      await booking.save();

      try {
        await sendRefundNotificationEmail(booking);
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    console.log(err);
  }
}

async function refundPaymentSquare(bookingId) {
  try {
    const booking = await BloodBooking.findOne({ _id: bookingId });

    if (!booking || !booking.paymentInfo) {
      return;
    }

    if (booking.refund) {
      return;
    }

    const paymentInfo = JSON.parse(booking.paymentInfo);

    const payload = {
      idempotencyKey: booking._id.toString(),
      amountMoney: paymentInfo.totalMoney,
      paymentId: paymentInfo.id,
      autocomplete: true,
    };

    const { result } = await refundsApi.refundPayment(payload);

    if (result && result.refund && result.refund.id) {
      booking.deposit = 0;
      result.refund.amountMoney.amount = parseInt(
        result.refund.amountMoney.amount.toString().replace("n", "")
      );
      result.refund.processingFee = [];

      console.log(result.refund);
      booking.refund = JSON.stringify(result.refund);
      await booking.save();

      try {
        await sendRefundNotificationEmail(booking);
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    console.log(err);
  }
}

module.exports = router;
