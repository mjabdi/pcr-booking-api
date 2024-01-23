const express = require("express");
const router = express.Router();
const { GPBooking } = require("../../models/gp/GPBooking");
const { GynaeBooking } = require("../../models/gynae/GynaeBooking");
const { STDBooking } = require("../../models/std/STDBooking");
const { BloodBooking } = require("../../models/blood/BloodBooking");
const { ScreeningBooking } = require("../../models/screening/ScreeningBooking");
const { CorporateBooking } = require("../../models/corporate/CorporateBooking");

const { Booking } = require("../../models/Booking");

const dateformat = require("dateformat");
const { sendConfirmationEmail, sendRegFormEmail } = require("./email-service");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { getDefaultTimeSlots, getHolidays } = require("./holidays");
const { Notification } = require("./../../models/Notification");
const {
  sendAdminNotificationEmail,
  NOTIFY_TYPE,
} = require("../mail-notification-service");
const getNewRef = require("../refgenatator-service");
const { DermaBooking } = require("../../models/derma/DermaBooking");

const DEFAULT_LIMIT = 25;

router.post("/sendregformemail", async function (req, res, next) {
  try {
    const { id } = req.query;
    const booking = await GPBooking.findOne({ _id: id });
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
    await GPBooking.updateOne(
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
    await GPBooking.updateOne(
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
    await GPBooking.updateOne(
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
    const count = await GPBooking.countDocuments({
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
    const result = await GPBooking.countDocuments({
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
    const result = await GPBooking.countDocuments({
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
    const gpCount = await GPBooking.countDocuments({
      bookingDate: dateStr,
      deleted: { $ne: true },
    }).exec();

    const pcrCount = await Booking.countDocuments({
      bookingDate: dateStr,
      deleted: { $ne: true },
    }).exec();

    const stdCount = await STDBooking.countDocuments({
      bookingDate: dateStr,
      deleted: { $ne: true },
    }).exec();

    const gynaeCount = await GynaeBooking.countDocuments({
      bookingDate: dateStr,
      deleted: { $ne: true },
    }).exec();

    const bloodCount = await BloodBooking.countDocuments({
      bookingDate: dateStr,
      deleted: { $ne: true },
    }).exec();

    const dermaCount = await DermaBooking.countDocuments({
      bookingDate: dateStr,
      deleted: { $ne: true },
    }).exec();

    const screeningCount = await ScreeningBooking.countDocuments({
      bookingDate: dateStr,
      deleted: { $ne: true },
    }).exec();

    const corporateCount = await CorporateBooking.countDocuments({
      bookingDate: dateStr,
      deleted: { $ne: true },
    }).exec();

    const visaCount = await ScreeningBooking.countDocuments({
      bookingDate: dateStr,
      deleted: { $ne: true },
      service: { $regex: /^VISA MEDICAL/ },
    }).exec();

    const result = [
      { clinic: "pcr", count: pcrCount },
      { clinic: "gynae", count: gynaeCount },
      { clinic: "gp", count: gpCount },
      { clinic: "std", count: stdCount },
      { clinic: "blood", count: bloodCount },
      { clinic: "derma", count: dermaCount },
      { clinic: "screening", count: screeningCount - visaCount },
      { clinic: "corporate", count: corporateCount },
      { clinic: "visa", count: visaCount },
    ];

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
    const result = await GPBooking.aggregate([
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
      const result = await GPBooking.countDocuments({
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
      const gpCount = await GPBooking.countDocuments({
        bookingDate: dateStr,
        bookingTime: timeStr,
        deleted: { $ne: true },
      }).exec();

      const pcrCount = await Booking.countDocuments({
        bookingDate: dateStr,
        bookingTime: timeStr,
        deleted: { $ne: true },
      }).exec();

      const stdCount = await STDBooking.countDocuments({
        bookingDate: dateStr,
        bookingTime: timeStr,
        deleted: { $ne: true },
      }).exec();

      const gynaeCount = await GynaeBooking.countDocuments({
        bookingDate: dateStr,
        bookingTime: timeStr,
        deleted: { $ne: true },
      }).exec();

      const bloodCount = await BloodBooking.countDocuments({
        bookingDate: dateStr,
        bookingTime: timeStr,
        deleted: { $ne: true },
      }).exec();

      const dermaCount = await DermaBooking.countDocuments({
        bookingDate: dateStr,
        bookingTime: timeStr,
        deleted: { $ne: true },
      }).exec();

      const screeningCount = await ScreeningBooking.countDocuments({
        bookingDate: dateStr,
        bookingTime: timeStr,
        deleted: { $ne: true },
      }).exec();

      const corporateCount = await CorporateBooking.countDocuments({
        bookingDate: dateStr,
        bookingTime: timeStr,
        deleted: { $ne: true },
      }).exec();

      const visaCount = await ScreeningBooking.countDocuments({
        bookingDate: dateStr,
        bookingTime: timeStr,
        deleted: { $ne: true },
        service: { $regex: /^VISA MEDICAL/ },
      }).exec();

      const result = [
        { clinic: "pcr", count: pcrCount },
        { clinic: "gynae", count: gynaeCount },
        { clinic: "gp", count: gpCount },
        { clinic: "std", count: stdCount },
        { clinic: "blood", count: bloodCount },
        { clinic: "derma", count: dermaCount },
        { clinic: "screening", count: screeningCount - visaCount },
        { clinic: "corporate", count: corporateCount },
        { clinic: "visa", count: visaCount },
      ];

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
    const result = await GPBooking.find({
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

    const result = await Booking.aggregate([
      {
        $match: {
          $and: [
            { bookingDate: dateStr },
            { bookingTime: timeStr },
            { deleted: { $ne: true } },
          ],
        },
      },
      {
        $addFields: { clinic: "pcr" },
      },
      {
        $unionWith: {
          coll: "gynaebookings",
          pipeline: [
            {
              $match: {
                $and: [
                  { bookingDate: dateStr },
                  { bookingTime: timeStr },
                  { deleted: { $ne: true } },
                ],
              },
            },

            {
              $addFields: { clinic: "gynae" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "gpbookings",
          pipeline: [
            {
              $match: {
                $and: [
                  { bookingDate: dateStr },
                  { bookingTime: timeStr },
                  { deleted: { $ne: true } },
                ],
              },
            },

            {
              $addFields: { clinic: "gp" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "stdbookings",
          pipeline: [
            {
              $match: {
                $and: [
                  { bookingDate: dateStr },
                  { bookingTime: timeStr },
                  { deleted: { $ne: true } },
                ],
              },
            },

            {
              $addFields: { clinic: "std" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "bloodbookings",
          pipeline: [
            {
              $match: {
                $and: [
                  { bookingDate: dateStr },
                  { bookingTime: timeStr },
                  { deleted: { $ne: true } },
                ],
              },
            },

            {
              $addFields: { clinic: "blood" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "dermabookings",
          pipeline: [
            {
              $match: {
                $and: [
                  { bookingDate: dateStr },
                  { bookingTime: timeStr },
                  { deleted: { $ne: true } },
                ],
              },
            },

            {
              $addFields: { clinic: "derma" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "screeningbookings",
          pipeline: [
            {
              $match: {
                $and: [
                  { bookingDate: dateStr },
                  { bookingTime: timeStr },
                  { service: { $regex: /^(?!VISA MEDICAL)\w+/ } },
                  { deleted: { $ne: true } },
                ],
              },
            },

            {
              $addFields: { clinic: "screening" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "screeningbookings",
          pipeline: [
            {
              $match: {
                $and: [
                  { bookingDate: dateStr },
                  { bookingTime: timeStr },
                  { service: { $regex: /^VISA MEDICAL/ } },
                  { deleted: { $ne: true } },
                ],
              },
            },

            {
              $addFields: { clinic: "visa" },
            },
          ],
        },
      },

      {
        $unionWith: {
          coll: "corporatebookings",
          pipeline: [
            {
              $match: {
                $and: [
                  { bookingDate: dateStr },
                  { bookingTime: timeStr },
                  { deleted: { $ne: true } },
                ],
              },
            },

            {
              $addFields: { clinic: "corporate" },
            },
          ],
        },
      },

      {
        $sort: { timeStamp: 1 },
      },
    ]).exec();

    res.status(200).send({ status: "OK", bookings: result });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.get("/getallbookings", async function (req, res, next) {
  try {
    const limit = parseInt(req.query.limit) || DEFAULT_LIMIT;

    const result = await Booking.aggregate([
      {
        $match: {
          $and: [{ deleted: { $ne: true } }],
        },
      },
      {
        $addFields: { clinic: "pcr" },
      },
      {
        $unionWith: {
          coll: "gynaebookings",
          pipeline: [
            {
              $match: {
                $and: [{ deleted: { $ne: true } }],
              },
            },

            {
              $addFields: { clinic: "gynae" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "gpbookings",
          pipeline: [
            {
              $match: {
                $and: [{ deleted: { $ne: true } }],
              },
            },

            {
              $addFields: { clinic: "gp" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "stdbookings",
          pipeline: [
            {
              $match: {
                $and: [{ deleted: { $ne: true } }],
              },
            },

            {
              $addFields: { clinic: "std" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "bloodbookings",
          pipeline: [
            {
              $match: {
                $and: [{ deleted: { $ne: true } }],
              },
            },

            {
              $addFields: { clinic: "blood" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "dermabookings",
          pipeline: [
            {
              $match: {
                $and: [{ deleted: { $ne: true } }],
              },
            },

            {
              $addFields: { clinic: "derma" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "screeningbookings",
          pipeline: [
            {
              $match: {
                $and: [{ deleted: { $ne: true } }],
              },
            },

            {
              $addFields: { clinic: "screening" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "corporatebookings",
          pipeline: [
            {
              $match: {
                $and: [{ deleted: { $ne: true } }],
              },
            },

            {
              $addFields: { clinic: "corporate" },
            },
          ],
        },
      },

      {
        $sort: { bookingDate: -1, bookingTimeNormalized: -1 },
      },
    ])
      .limit(limit)
      .exec();

    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.post("/searchallbookings", async function (req, res, next) {
  try {
    const { filter } = req.body;

    const regexp = new RegExp(filter, "i");

    const condition = { fullname: { $regex: regexp } };

    const result = await Booking.aggregate([
      { $addFields: { fullname: { $concat: ["$forename", " ", "$surname"] } } },
      {
        $match: {
          $and: [{ deleted: { $ne: true } }, condition],
        },
      },
      {
        $addFields: { clinic: "pcr" },
      },
      {
        $unionWith: {
          coll: "gynaebookings",
          pipeline: [
            {
              $match: {
                $and: [{ deleted: { $ne: true } }, condition],
              },
            },

            {
              $addFields: { clinic: "gynae" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "gpbookings",
          pipeline: [
            {
              $match: {
                $and: [{ deleted: { $ne: true } }, condition],
              },
            },

            {
              $addFields: { clinic: "gp" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "stdbookings",
          pipeline: [
            {
              $match: {
                $and: [{ deleted: { $ne: true } }, condition],
              },
            },

            {
              $addFields: { clinic: "std" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "bloodbookings",
          pipeline: [
            {
              $match: {
                $and: [{ deleted: { $ne: true } }, condition],
              },
            },

            {
              $addFields: { clinic: "blood" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "dermabookings",
          pipeline: [
            {
              $match: {
                $and: [{ deleted: { $ne: true } }, condition],
              },
            },

            {
              $addFields: { clinic: "derma" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "screeningbookings",
          pipeline: [
            {
              $match: {
                $and: [{ deleted: { $ne: true } }, condition],
              },
            },

            {
              $addFields: { clinic: "screening" },
            },
          ],
        },
      },

      {
        $unionWith: {
          coll: "corporatebookings",
          pipeline: [
            {
              $match: {
                $and: [{ deleted: { $ne: true } }, condition],
              },
            },

            {
              $addFields: { clinic: "corporate" },
            },
          ],
        },
      },

      {
        $unionWith: {
          coll: "bloodreports",
          pipeline: [
            { $addFields: { fullname: "$name" } },
            {
              $match: {
                $and: [{ deleted: { $ne: true } }, condition],
              },
            },

            {
              $addFields: { clinic: "Blood Result" },
            },
          ],
        },
      },

      {
        $sort: { bookingDate: -1, bookingTimeNormalized: -1 },
      },
    ])
      .limit(100)
      .exec();

    // console.log(result)

    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.get("/getdeletedbookings", async function (req, res, next) {
  try {
    const limit = parseInt(req.query.limit) || DEFAULT_LIMIT;
    const result = await Booking.aggregate([
      {
        $match: {
          $and: [{ deleted: { $eq: true } }],
        },
      },
      {
        $addFields: { clinic: "pcr" },
      },
      {
        $unionWith: {
          coll: "gynaebookings",
          pipeline: [
            {
              $match: {
                $and: [{ deleted: { $eq: true } }],
              },
            },

            {
              $addFields: { clinic: "gynae" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "gpbookings",
          pipeline: [
            {
              $match: {
                $and: [{ deleted: { $eq: true } }],
              },
            },

            {
              $addFields: { clinic: "gp" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "stdbookings",
          pipeline: [
            {
              $match: {
                $and: [{ deleted: { $eq: true } }],
              },
            },

            {
              $addFields: { clinic: "std" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "bloodbookings",
          pipeline: [
            {
              $match: {
                $and: [{ deleted: { $eq: true } }],
              },
            },

            {
              $addFields: { clinic: "blood" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "dermabookings",
          pipeline: [
            {
              $match: {
                $and: [{ deleted: { $eq: true } }],
              },
            },

            {
              $addFields: { clinic: "derma" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "screeningbookings",
          pipeline: [
            {
              $match: {
                $and: [{ deleted: { $eq: true } }],
              },
            },

            {
              $addFields: { clinic: "screening" },
            },
          ],
        },
      },

      {
        $unionWith: {
          coll: "corporatebookings",
          pipeline: [
            {
              $match: {
                $and: [{ deleted: { $eq: true } }],
              },
            },

            {
              $addFields: { clinic: "corporate" },
            },
          ],
        },
      },

      {
        $sort: { bookingDate: -1, bookingTimeNormalized: -1 },
      },
    ])
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

    const result = await Booking.aggregate([
      {
        $match: {
          $and: [{ deleted: { $ne: true } }, { bookingDate: today }],
        },
      },
      {
        $addFields: { clinic: "pcr" },
      },
      {
        $unionWith: {
          coll: "gynaebookings",
          pipeline: [
            {
              $match: {
                $and: [{ deleted: { $ne: true } }, { bookingDate: today }],
              },
            },

            {
              $addFields: { clinic: "gynae" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "gpbookings",
          pipeline: [
            {
              $match: {
                $and: [{ deleted: { $ne: true } }, { bookingDate: today }],
              },
            },

            {
              $addFields: { clinic: "gp" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "stdbookings",
          pipeline: [
            {
              $match: {
                $and: [{ deleted: { $ne: true } }, { bookingDate: today }],
              },
            },

            {
              $addFields: { clinic: "std" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "bloodbookings",
          pipeline: [
            {
              $match: {
                $and: [{ deleted: { $ne: true } }, { bookingDate: today }],
              },
            },

            {
              $addFields: { clinic: "blood" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "dermabookings",
          pipeline: [
            {
              $match: {
                $and: [{ deleted: { $ne: true } }, { bookingDate: today }],
              },
            },

            {
              $addFields: { clinic: "derma" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "screeningbookings",
          pipeline: [
            {
              $match: {
                $and: [{ deleted: { $ne: true } }, { bookingDate: today }],
              },
            },

            {
              $addFields: { clinic: "screening" },
            },
          ],
        },
      },

      {
        $unionWith: {
          coll: "corporatebookings",
          pipeline: [
            {
              $match: {
                $and: [{ deleted: { $ne: true } }, { bookingDate: today }],
              },
            },

            {
              $addFields: { clinic: "corporate" },
            },
          ],
        },
      },

      {
        $sort: { bookingTimeNormalized: 1 },
      },
    ]).exec();

    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.get("/getoldbookings", async function (req, res, next) {
  try {
    const today = dateformat(new Date(), "yyyy-mm-dd");
    const limit = parseInt(req.query.limit) || DEFAULT_LIMIT;
    const result = await Booking.aggregate([
      {
        $match: {
          $and: [{ deleted: { $ne: true } }, { bookingDate: { $lt: today } }],
        },
      },
      {
        $addFields: { clinic: "pcr" },
      },
      {
        $unionWith: {
          coll: "gynaebookings",
          pipeline: [
            {
              $match: {
                $and: [
                  { deleted: { $ne: true } },
                  { bookingDate: { $lt: today } },
                ],
              },
            },

            {
              $addFields: { clinic: "gynae" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "gpbookings",
          pipeline: [
            {
              $match: {
                $and: [
                  { deleted: { $ne: true } },
                  { bookingDate: { $lt: today } },
                ],
              },
            },

            {
              $addFields: { clinic: "gp" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "stdbookings",
          pipeline: [
            {
              $match: {
                $and: [
                  { deleted: { $ne: true } },
                  { bookingDate: { $lt: today } },
                ],
              },
            },

            {
              $addFields: { clinic: "std" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "bloodbookings",
          pipeline: [
            {
              $match: {
                $and: [
                  { deleted: { $ne: true } },
                  { bookingDate: { $lt: today } },
                ],
              },
            },

            {
              $addFields: { clinic: "blood" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "dermabookings",
          pipeline: [
            {
              $match: {
                $and: [
                  { deleted: { $ne: true } },
                  { bookingDate: { $lt: today } },
                ],
              },
            },

            {
              $addFields: { clinic: "derma" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "screeningbookings",
          pipeline: [
            {
              $match: {
                $and: [
                  { deleted: { $ne: true } },
                  { bookingDate: { $lt: today } },
                ],
              },
            },

            {
              $addFields: { clinic: "screening" },
            },
          ],
        },
      },

      {
        $unionWith: {
          coll: "corporatebookings",
          pipeline: [
            {
              $match: {
                $and: [
                  { deleted: { $ne: true } },
                  { bookingDate: { $lt: today } },
                ],
              },
            },

            {
              $addFields: { clinic: "corporate" },
            },
          ],
        },
      },

      {
        $sort: { bookingDate: -1, bookingTimeNormalized: -1 },
      },
    ])
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
    const result = await Booking.aggregate([
      {
        $match: {
          $and: [{ deleted: { $ne: true } }, { bookingDate: { $gt: today } }],
        },
      },
      {
        $addFields: { clinic: "pcr" },
      },
      {
        $unionWith: {
          coll: "gynaebookings",
          pipeline: [
            {
              $match: {
                $and: [
                  { deleted: { $ne: true } },
                  { bookingDate: { $gt: today } },
                ],
              },
            },

            {
              $addFields: { clinic: "gynae" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "gpbookings",
          pipeline: [
            {
              $match: {
                $and: [
                  { deleted: { $ne: true } },
                  { bookingDate: { $gt: today } },
                ],
              },
            },

            {
              $addFields: { clinic: "gp" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "stdbookings",
          pipeline: [
            {
              $match: {
                $and: [
                  { deleted: { $ne: true } },
                  { bookingDate: { $gt: today } },
                ],
              },
            },

            {
              $addFields: { clinic: "std" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "bloodbookings",
          pipeline: [
            {
              $match: {
                $and: [
                  { deleted: { $ne: true } },
                  { bookingDate: { $gt: today } },
                ],
              },
            },

            {
              $addFields: { clinic: "blood" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "dermabookings",
          pipeline: [
            {
              $match: {
                $and: [
                  { deleted: { $ne: true } },
                  { bookingDate: { $gt: today } },
                ],
              },
            },

            {
              $addFields: { clinic: "derma" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "screeningbookings",
          pipeline: [
            {
              $match: {
                $and: [
                  { deleted: { $ne: true } },
                  { bookingDate: { $gt: today } },
                ],
              },
            },

            {
              $addFields: { clinic: "screening" },
            },
          ],
        },
      },

      {
        $unionWith: {
          coll: "corporatebookings",
          pipeline: [
            {
              $match: {
                $and: [
                  { deleted: { $ne: true } },
                  { bookingDate: { $gt: today } },
                ],
              },
            },

            {
              $addFields: { clinic: "corporate" },
            },
          ],
        },
      },

      {
        $sort: { bookingDate: 1, bookingTimeNormalized: 1 },
      },
    ])
      .limit(limit)
      .exec();
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.get("/getrecentbookings", async function (req, res, next) {
  try {
    const result = await GPBooking.find({ deleted: { $ne: true } })
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
    const result = await Booking.aggregate([
      {
        $match: {
          $or: [{ deleted: { $ne: true } }],
        },
      },
      {
        $addFields: { clinic: "pcr" },
      },
      {
        $unionWith: {
          coll: "gynaebookings",
          pipeline: [
            {
              $match: {
                $or: [{ deleted: { $ne: true } }],
              },
            },

            {
              $addFields: { clinic: "gynae" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "gpbookings",
          pipeline: [
            {
              $match: {
                $or: [{ deleted: { $ne: true } }],
              },
            },

            {
              $addFields: { clinic: "gp" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "stdbookings",
          pipeline: [
            {
              $match: {
                $or: [{ deleted: { $ne: true } }],
              },
            },

            {
              $addFields: { clinic: "std" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "bloodbookings",
          pipeline: [
            {
              $match: {
                $or: [{ deleted: { $ne: true } }],
              },
            },

            {
              $addFields: { clinic: "blood" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "dermabookings",
          pipeline: [
            {
              $match: {
                $or: [{ deleted: { $ne: true } }],
              },
            },

            {
              $addFields: { clinic: "derma" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "screeningbookings",
          pipeline: [
            {
              $match: {
                $or: [{ deleted: { $ne: true } }],
              },
            },

            {
              $addFields: { clinic: "screening" },
            },
          ],
        },
      },

      {
        $unionWith: {
          coll: "corporatebookings",
          pipeline: [
            {
              $match: {
                $or: [{ deleted: { $ne: true } }],
              },
            },

            {
              $addFields: { clinic: "corporate" },
            },
          ],
        },
      },

      {
        $sort: { timeStamp: -1 },
      },
    ])
      .limit(limit)
      .exec();

    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.get("/getbookingsbyref", async function (req, res, next) {
  try {
    const ref = req.query.ref;
    const result = await Booking.aggregate([
      {
        $match: {
          $or: [{ bookingRef: ref }],
        },
      },
      {
        $addFields: { clinic: "pcr" },
      },
      {
        $unionWith: {
          coll: "gynaebookings",
          pipeline: [
            {
              $match: {
                $or: [{ bookingRef: ref }],
              },
            },

            {
              $addFields: { clinic: "gynae" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "gpbookings",
          pipeline: [
            {
              $match: {
                $or: [{ bookingRef: ref }],
              },
            },

            {
              $addFields: { clinic: "gp" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "stdbookings",
          pipeline: [
            {
              $match: {
                $or: [{ bookingRef: ref }],
              },
            },

            {
              $addFields: { clinic: "std" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "bloodbookings",
          pipeline: [
            {
              $match: {
                $or: [{ bookingRef: ref }],
              },
            },

            {
              $addFields: { clinic: "blood" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "dermabookings",
          pipeline: [
            {
              $match: {
                $or: [{ bookingRef: ref }],
              },
            },

            {
              $addFields: { clinic: "derma" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "screeningbookings",
          pipeline: [
            {
              $match: {
                $or: [{ bookingRef: ref }],
              },
            },

            {
              $addFields: { clinic: "screening" },
            },
          ],
        },
      },

      {
        $unionWith: {
          coll: "corporatebookings",
          pipeline: [
            {
              $match: {
                $or: [{ bookingRef: ref }],
              },
            },

            {
              $addFields: { clinic: "corporate" },
            },
          ],
        },
      },

      {
        $sort: { timeStamp: -1 },
      },
    ]).exec();

    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.get("/getbookingbyid", async function (req, res, next) {
  try {
    req.query.id = ObjectId(req.query.id);
    const result = await Booking.aggregate([
      {
        $match: {
          $and: [{ _id: req.query.id }],
        },
      },
      {
        $addFields: { clinic: "pcr" },
      },
      {
        $unionWith: {
          coll: "gynaebookings",
          pipeline: [
            {
              $match: {
                $and: [{ _id: req.query.id }],
              },
            },

            {
              $addFields: { clinic: "gynae" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "gpbookings",
          pipeline: [
            {
              $match: {
                $and: [{ _id: req.query.id }],
              },
            },

            {
              $addFields: { clinic: "gp" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "stdbookings",
          pipeline: [
            {
              $match: {
                $and: [{ _id: req.query.id }],
              },
            },

            {
              $addFields: { clinic: "std" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "bloodbookings",
          pipeline: [
            {
              $match: {
                $and: [{ _id: req.query.id }],
              },
            },

            {
              $addFields: { clinic: "blood" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "dermabookings",
          pipeline: [
            {
              $match: {
                $and: [{ _id: req.query.id }],
              },
            },

            {
              $addFields: { clinic: "derma" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "screeningbookings",
          pipeline: [
            {
              $match: {
                $and: [{ _id: req.query.id }],
              },
            },

            {
              $addFields: { clinic: "screening" },
            },
          ],
        },
      },

      {
        $unionWith: {
          coll: "corporatebookings",
          pipeline: [
            {
              $match: {
                $and: [{ _id: req.query.id }],
              },
            },

            {
              $addFields: { clinic: "corporate" },
            },
          ],
        },
      },

      {
        $sort: { timeStamp: 1 },
      },
    ]).exec();

    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ status: "FAILED", error: err.message });
    console.log(err);
  }
});

router.post("/addnewbooking", async function (req, res, next) {
  try {
    const ref = await getNewRef();
    let { fullname, bookingDate, bookingTime, phone, email, notes } = req.body;

    if (!email || email.length < 1) {
      email = "-";
    }

    if (!phone || phone.length < 1) {
      phone = "-";
    }

    const payload = { fullname, bookingDate, bookingTime, phone, email, notes };

    const booking = new GPBooking({
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
    const found = await GPBooking.findOne({
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

    const booking = new GPBooking({
      ...req.body,
      timeStamp: new Date(),
    });

    const isTimeAvailable = await checkBookingTime(booking);
    if (!isTimeAvailable) {
      const alaram = new Notification({
        timeStamp: new Date(),
        type: "InvalidBooking-GP",
        text: `An attempt to book on ${booking.bookingDate} at ${booking.bookingTime} Blocked by the system (Gynae)`,
      });
      await alaram.save();
      res
        .status(200)
        .send({ status: "FAILED", error: "FullTime", person: req.body });
      return;
    }

    await booking.save();

    await sendConfirmationEmail(booking);

    await sendAdminNotificationEmail(
      NOTIFY_TYPE.NOTIFY_TYPE_GP_BOOKED,
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
    const oldBooking = await GPBooking.findOne({ _id: req.body.bookingId });

    await GPBooking.updateOne(
      { _id: req.body.bookingId },
      { ...req.body.person }
    );

    const newBooking = await GPBooking.findOne({ _id: req.body.bookingId });

    await sendConfirmationEmail(newBooking);

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
    await GPBooking.updateOne(
      { _id: req.body.bookingId },
      {
        bookingDate: req.body.bookingDate,
        bookingTime: req.body.bookingTime,
        bookingTimeNormalized: NormalizeTime(req.body.bookingTime),
      }
    );

    const booking = await GPBooking.findOne({ _id: req.body.bookingId });

    await sendConfirmationEmail(booking);

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
    await GPBooking.updateOne({ _id: req.query.id }, { status: "booked" });

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
    await GPBooking.updateOne(
      { _id: req.query.id },
      { status: "patient_attended" }
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
    await GPBooking.updateOne({ _id: req.query.id }, { deleted: true });

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
    await GPBooking.updateOne({ _id: req.query.id }, { deleted: false });

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

  if (!body.email) {
    throw new Error("email field not present");
  }

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
