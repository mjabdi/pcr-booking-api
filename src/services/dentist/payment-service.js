const express = require("express");
const router = express.Router();
const { DentistBooking } = require("../../models/dentist/DentistBooking");

const {
  sendConfirmationEmail,
  sendRefundNotificationEmail,
  sendAdminNotificationEmail,
  sendPaymentThanksEmail
} = require("./email-service");

const config = require("config");
const { sendPaymentThanksSMS } = require("./sms-service");

const stripe = require("stripe")(process.env.NODE_ENV !== "production" ?
  config.StripeTestKey
  :
  // config.StripeTestKey
  config.StripeLiveKey
);

const DEPOSIT = 95;

router.post("/dopayment", async function (req, res, next) {
  try {
    const personInfo = req.body.personInfo;

    const { paymentId } = req.body;

    try {
      validateBookAppointment(personInfo);
    } catch (err) {
      console.error(err.message);
      res.status(400).send({ status: "FAILED", error: err.message });
      return;
    }

    const payment = await stripe.paymentIntents.create({
      amount: DEPOSIT * 100,
      currency: "GBP",
      description: "Online Deposit",
      payment_method: paymentId,
      confirm: true,
    });

    if (!payment || payment.status !== "succeeded")
    {
      res.status(500).send({ status: "FAILED" });
      return
    }

    let booking = await DentistBooking.findOne({_id: personInfo._id})

    if (!booking)
    {
      booking = new DentistBooking({
        ...personInfo,
        paymentInfo: JSON.stringify(payment),
        deposit: DEPOSIT,
        timeStamp: new Date(),
      });
  
      await booking.save();
      await sendConfirmationEmail(booking);
      await sendAdminNotificationEmail(booking)
    }else{
      booking.paymentInfo = JSON.stringify(payment)
      booking.deposit = DEPOSIT
      await booking.save()

      if (booking.email && booking.email.length > 3)
      {
        await sendPaymentThanksEmail(booking)
      }
      if (booking.phone && booking.phone.length > 3)
      {
        await sendPaymentThanksSMS(booking)
      }

    } 


    res.status(200).send({ status: "OK", person: personInfo });

  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.post("/refundpayment", async function (req, res, next) {
  try {
    const bookingId = req.body.bookingId;
    const booking = await DentistBooking.findOne({ _id: bookingId });

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
      payment_intent:  paymentInfo.id
    };

    const refund = await stripe.refunds.create(payload)

    if (refund)
    {
      booking.deposit = 0;
      booking.refund = JSON.stringify(refund);
      await booking.save();
      try {
        await sendRefundNotificationEmail(booking);
      } catch (err) {
        console.log(err);
      }
      res.status(200).send({ status: "OK" });
    }else{
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
    const booking = await DentistBooking.findOne({ _id: bookingId });

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
  // console.log(body);

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
