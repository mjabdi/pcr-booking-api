const express = require("express");
const router = express.Router();
const { User } = require("./../models/User");
const { Booking } = require("./../models/Booking");
const { GynaeBooking } = require("./../models/gynae/GynaeBooking");

router.post("/getallpcrbookings", async function (req, res, next) {
  try {
    const { token } = req.body;

    const user = await User.findOne({ authToken: token });
    if (!user) {
      res
        .status(200)
        .send({ status: "FAILED", error: "email-address not registered" });
      return;
    }

    if (!user.isActive) {
      res.status(200).send({ status: "FAILED", error: "user not active" });
      return;
    }

    if (user.isLocked) {
      res.status(200).send({ status: "FAILED", error: "user is locked" });
      return;
    }

    const email = user.email;

    const userBookings = await Booking.find({
      $or: [
        { email: email },
        { email: email.toLowerCase() },
        { email: email.toUpperCase() },
      ],
    })
      .sort({ timeStamp: -1 })
      .exec();

    res.status(200).send({ status: "OK", bookings: [...userBookings] });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.post("/getalluserbookings", async function (req, res, next) {
  try {
    const { token } = req.body;

    const user = await User.findOne({ authToken: token });
    if (!user) {
      res
        .status(200)
        .send({ status: "FAILED", error: "email-address not registered" });
      return;
    }

    if (!user.isActive) {
      res.status(200).send({ status: "FAILED", error: "user not active" });
      return;
    }

    if (user.isLocked) {
      res.status(200).send({ status: "FAILED", error: "user is locked" });
      return;
    }

    const email = user.email;

    const result = await Booking.aggregate([
      {
        $match: {
          $or: [
            { email: email },
            { email: email.toLowerCase() },
            { email: email.toUpperCase() },
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
                $or: [
                  { email: email },
                  { email: email.toLowerCase() },
                  { email: email.toUpperCase() },
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
                $or: [
                  { email: email },
                  { email: email.toLowerCase() },
                  { email: email.toUpperCase() },
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
                $or: [
                  { email: email },
                  { email: email.toLowerCase() },
                  { email: email.toUpperCase() },
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
        $sort: { timeStamp: -1 },
      },
    ]).exec();

    // console.log(result);

    // const userBookingsPCR = await Booking.find({$or: [ {email: email}, {email: email.toLowerCase()}, {email: email.toUpperCase()}]} ).sort({timeStamp:-1}).exec()
    // const userBookingsGynae = await GynaeBooking.find({$or: [ {email: email}, {email: email.toLowerCase()}, {email: email.toUpperCase()}]} ).sort({timeStamp:-1}).exec()

    res.status(200).send({ status: "OK", bookings : result });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.post("/getmostrecentbookingid", async function (req, res, next) {
  try {
    const { token } = req.body;

    const user = await User.findOne({ authToken: token });
    if (!user) {
      res
        .status(200)
        .send({ status: "FAILED", error: "email-address not registered" });
      return;
    }

    if (!user.isActive) {
      res.status(200).send({ status: "FAILED", error: "user not active" });
      return;
    }

    if (user.isLocked) {
      res.status(200).send({ status: "FAILED", error: "user is locked" });
      return;
    }

    const email = user.email;

    const userBooking = await Booking.findOne({
      $or: [
        { email: email },
        { email: email.toLowerCase() },
        { email: email.toUpperCase() },
      ],
    })
      .sort({ timeStamp: -1 })
      .exec();

    res
      .status(200)
      .send({ status: "OK", bookingId: userBooking ? userBooking._id : null });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

module.exports = router;
