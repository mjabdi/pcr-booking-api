const express = require("express");
const router = express.Router();
const { GynaeBooking } = require("../../models/gynae/GynaeBooking");
const {
  sendConfirmationEmail,
  sendRefundNotificationEmail,
} = require("./email-service");

const { Client, Environment } = require("square");
const { sendGynaeConfirmationTextMessage } = require("./sms-service");

const { sendAdminNotificationEmail, NOTIFY_TYPE } = require('../mail-notification-service');


const SANDBOX = process.env.NODE_ENV !== "production";

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

const paymentsApi = client.paymentsApi;
const refundsApi = client.refundsApi;

const DEPOSIT = 100;

router.post("/dopayment", async function (req, res, next) {
  try {
    const personInfo = req.body.personInfo;

    const payload = {
      sourceId: req.body.nonce,
      verificationToken: req.body.token,
      autocomplete: true,
      locationId: SANDBOX ? SANDBOX_LOCATION_ID : LIVE_LOCATION_ID,
      amountMoney: {
        amount: DEPOSIT * 100,
        currency: "GBP",
      },
      idempotencyKey: personInfo.bookingRef,
    };

    try {
      validateBookAppointment(personInfo);
    } catch (err) {
      console.error(err.message);
      res.status(400).send({ status: "FAILED", error: err.message });
      return;
    }

    const found = await GynaeBooking.findOne({
      email: personInfo.email,
      bookingDate: personInfo.bookingDate,
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

    const { result } = await paymentsApi.createPayment(payload);

    const payment = result.payment;
    console.log(payment);
    if (payment.status === "COMPLETED") {
      const {
        id,
        createdAt,
        cardDetails,
        locationId,
        orderId,
        receiptNumber,
        receiptUrl,
        totalMoney,
      } = payment;

      const paymentInfo = JSON.stringify({
        id,
        createdAt,
        cardDetails,
        locationId,
        orderId,
        receiptNumber,
        receiptUrl,
        totalMoney,
      });

      const booking = new GynaeBooking({
        ...personInfo,
        paymentInfo: paymentInfo,
        deposit: DEPOSIT,
        timeStamp: new Date(),
      });

      await booking.save();

      await sendConfirmationEmail(booking);

      await sendAdminNotificationEmail(NOTIFY_TYPE.NOTIFY_TYPE_GYNAE_BOOKED, booking)


      if (booking.smsPush && booking.phone && booking.phone.length > 3)
      {
          let _phone = booking.phone

          if (_phone.startsWith("07") && _phone.length === 11)
          {
              _phone = `+447${_phone.substr(2,10)}`
          }else if (_phone.startsWith("7") && _phone.length === 10)
          {
              _phone = `+447${_phone.substr(1,10)}`
          }

          if (_phone.length === 13 && _phone.startsWith('+447'))
          {
              await sendGynaeConfirmationTextMessage(booking, _phone)
          }
      }



      res.status(200).send({ status: "OK", person: personInfo });
    } else {
      res.status(500).send({ status: "FAILED" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.post("/refundpayment", async function (req, res, next) {
  try {
    const bookingId = req.body.bookingId;
    const booking = await GynaeBooking.findOne({ _id: bookingId });

    if (!booking) {
      res.status(200).send({ status: "FAILED", result: "Booking Not Found" });
      return;
    }
    if (booking.status !== "booked") {
      res
        .status(200)
        .send({ status: "FAILED", result: "Invalid Booking Status" });
      return;
    }

    if (!booking.paymentInfo) {
      res.status(200).send({ status: "FAILED", result: "Booking Not Paied" });
      return;
    }

    if (booking.refund) {
      res.status(200).send({ status: "FAILED", result: "Already Refunded" });
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

      booking.refund = JSON.stringify(result.refund);
      await booking.save();

      try {
        await sendRefundNotificationEmail(booking);
      } catch (err) {
        console.log(err);
      }

      res.status(200).send({ status: "OK" });
    } else {
      res.status(500).send({ status: "FAILED" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.post("/manualrefundpayment", async function (req, res, next) {
  try {
    const bookingId = req.body.bookingId;
    const booking = await GynaeBooking.findOne({ _id: bookingId });

    if (!booking) {
      res.status(200).send({ status: "FAILED", result: "Booking Not Found" });
      return;
    }
    if (booking.status !== "booked") {
      res
        .status(200)
        .send({ status: "FAILED", result: "Invalid Booking Status" });
      return;
    }

    if (booking.paymentInfo) {
      res.status(200).send({ status: "FAILED", result: "Booking Paid Online" });
      return;
    }

    booking.deposit = 0;
    booking.refund = "manual refund";
    await booking.save();

    try {
      await sendRefundNotificationEmail(booking);
    } catch (err) {
      console.log(err);
    }

    res.status(200).send({ status: "OK" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
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

  if (!body.service) {
    throw new Error("service field not present");
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

module.exports = router;
