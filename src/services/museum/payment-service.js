const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const { MuseumPayment } = require("../../models/museum/MuseumPayment");


const {
  sendPaymentLinkEmail,
  sendRefundNotificationEmail,
  sendThankEmail,
} = require("./email-service");

const config = require("config");
const { sendPaymentLinkTextMessage, sendThankTextMessage, sendRefundTextMessage } = require("./twilio-service");

const stripe = require("stripe")(process.env.NODE_ENV !== "production" ?
  config.MuseumStripeTestKey
  :
  // config.MuseumStripeLiveKey
  config.MuseumStripeLiveKey
);

router.post("/sendpaymentlinktext", async function (req, res, next) {
  try {
    const museumPaymentId = ObjectId(req.body.museumPaymentId)
    const phone = req.body.phone

    const museumPayment = await MuseumPayment.findOne({ _id: museumPaymentId });

    if (!museumPayment) {
      res.status(400).send({ status: "FAILED", result: "Payment_Not_Found" });
      return;
    }

    museumPayment.phone = phone

    /// here we should send the text to the user
    await sendPaymentLinkTextMessage(museumPayment)
    museumPayment.textSent = true
    ///

    await museumPayment.save()

    res.status(200).send({ status: "OK" });

  }

  catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
})



router.post("/sendpaymentlinkemail", async function (req, res, next) {
  try {
    const museumPaymentId = ObjectId(req.body.museumPaymentId)
    const email = req.body.email

    const museumPayment = await MuseumPayment.findOne({ _id: museumPaymentId });

    if (!museumPayment) {
      res.status(400).send({ status: "FAILED", result: "Payment_Not_Found" });
      return;
    }

    museumPayment.email = email

    /// here we should send the email to the user

    await sendPaymentLinkEmail(museumPayment)

    museumPayment.emailSent = true

    ///

    await museumPayment.save()

    res.status(200).send({ status: "OK" });

  }
  catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
})



router.post("/dopayment", async function (req, res, next) {
  try {
    const museumPaymentId = ObjectId(req.body.museumPaymentId)



    const { paymentId } = req.body;


    const museumPayment = await MuseumPayment.findOne({ _id: museumPaymentId });


    if (!museumPayment) {
      res.status(400).send({ status: "FAILED", result: "Payment_Not_Found" });
      return;
    }

    const payment = await stripe.paymentIntents.create({
      amount: museumPayment.amount * 100,
      currency: "GBP",
      description: museumPayment.description || "Online Payment",
      payment_method: paymentId,
      confirm: true,
    });


    if (payment.status === "succeeded") {

      museumPayment.paymentInfo = JSON.stringify(payment)
      museumPayment.paymentTimeStamp = new Date()
      await museumPayment.save()
      try{
        if (museumPayment.emailSent)
        {
          await sendThankEmail(museumPayment)
        }
        if (museumPayment.textSent)
        {
          await sendThankTextMessage(museumPayment)
        }
     
      }catch(err)
      {

      }

      res.status(200).send({ status: "OK", payment: payment });
    }
    else {
      res.status(400).send({ status: "FAILED", result: "Payment_Not_Done" });
      return;
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.post("/refundpayment", async function (req, res, next) {
  try {
    const museumPaymentId = ObjectId(req.body.museumPaymentId)
    const museumPayment = await MuseumPayment.findOne({ _id: museumPaymentId });

    if (!museumPayment) {
      res.status(400).send({ status: "FAILED", result: "Payment_Not_Found" });
      return;
    }

    if (!museumPayment.paymentInfo) {
      res.status(400).send({ status: "FAILED", result: "Payment_Not_Paid" });
      return;
    }

    if (museumPayment.refund) {
      res.status(400).send({ status: "FAILED", result: "Already_Refunded" });
      return;
    }

    const paymentInfo = JSON.parse(museumPayment.paymentInfo);

    const payload = {
      payment_intent: paymentInfo.id
    };

    const refund = await stripe.refunds.create(payload)

    if (refund) {
      museumPayment.refund = JSON.stringify(refund);
      museumPayment.refundTimeStamp = new Date()

      await museumPayment.save();
      try {
        if (museumPayment.emailSent)
        {
          await sendRefundNotificationEmail(museumPayment)
        }
        if (museumPayment.textSent)
        {
          await sendRefundTextMessage(museumPayment)
        }
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


router.post("/createpayment", async function (req, res, next) {
  try {
    const { paymentRecord } = req.body

    const museumPayment = new MuseumPayment(
      {
        timeStamp: new Date,
        ...paymentRecord
      }
    )

    const payment = await museumPayment.save()

    res.status(200).send({ status: "OK", payment: payment });

  }
  catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
})

router.post("/deletepayment", async function (req, res, next) {
  try {
    const museumPaymentId = ObjectId(req.body.museumPaymentId)
    const museumPayment = await MuseumPayment.findOne({ _id: museumPaymentId });

    if (!museumPayment) {
      res.status(400).send({ status: "FAILED", result: "Payment_Not_Found" });
      return;
    }

    await MuseumPayment.updateOne({ _id: museumPaymentId }, { deleted: true });

    res.status(200).send({ status: "OK" });

  }
  catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
})


router.get("/getrecentpayments", async function (req, res, next) {
  try {
    const payments = await MuseumPayment.find({ deleted: { $ne: true }, paymentInfo: { $ne: null }, refund: { $eq: null } }).sort({ timeStamp: -1 }).limit(10).exec()
    res.status(200).send({ status: "OK", result: payments });
  }
  catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
})


router.get("/getallpayments", async function (req, res, next) {
  try {
    const payments = await MuseumPayment.find({ deleted: { $ne: true } }).sort({ timeStamp: -1 }).exec()
    res.status(200).send({ status: "OK", result: payments });
  }
  catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
})

router.get("/getdeletedpayments", async function (req, res, next) {
  try {
    const payments = await MuseumPayment.find({ deleted: { $eq: true } }).sort({ timeStamp: -1 }).exec()
    res.status(200).send({ status: "OK", result: payments });
  }
  catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
})

router.get("/getpaidpayments", async function (req, res, next) {
  try {
    const payments = await MuseumPayment.find({ deleted: { $ne: true }, paymentInfo: { $ne: null }, refund: { $eq: null } }).sort({ timeStamp: -1 }).exec()
    res.status(200).send({ status: "OK", result: payments });
  }
  catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
})

router.get("/getnotpaidpayments", async function (req, res, next) {
  try {
    // const payments = await MuseumPayment.find({ deleted: { $ne: true }, paymentInfo: { $eq: null }, $or: [ {emailSent: true }, {textSent: true}]}).sort({ timeStamp: -1 }).exec()
    const payments = await MuseumPayment.find({ deleted: { $ne: true }, paymentInfo: { $eq: null }}).sort({ timeStamp: -1 }).exec()

    res.status(200).send({ status: "OK", result: payments });
  }
  catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
})

router.get("/getlatepayments", async function (req, res, next) {
  try {
    const payments = await MuseumPayment.find({ deleted: { $ne: true }, paymentInfo: { $eq: null }, $or: [ {emailSent: true }, {textSent: true}]}).sort({ timeStamp: -1 }).exec()

    const now = new Date()

    const result = [];

    for (var i = 0; i < payments.length ; i++)
    {
        const payment = payments[i]._doc;

        const delay = parseInt((now - payment.timeStamp) / (3600*1000));

        if (delay >= 4)
        {
            result.push({...payment, delay: delay});
        }
    }

    res.status(200).send({ status: "OK", result: result });
  }
  catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
})



router.get("/getrefundpayments", async function (req, res, next) {
  try {
    const payments = await MuseumPayment.find({ deleted: { $ne: true }, paymentInfo: { $ne: null }, refund: { $ne: null } }).sort({ timeStamp: -1 }).exec()
    res.status(200).send({ status: "OK", result: payments });
  }
  catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
})

router.get("/getpaymentbyid", async function (req, res, next) {
  try {
    const museumPaymentId = ObjectId(req.query.id)
    const museumPayment = await MuseumPayment.findOne({ _id: museumPaymentId });

    res.status(200).send({ status: "OK", result: museumPayment });

  }
  catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
})


router.get("/gettotalreceivedamount", async function (req, res, next) {
  try {
    const result = await MuseumPayment.aggregate([
      {
        $match: {
          $and: [
            { deleted: { $ne: true } },
            { paymentInfo: { $ne: null } },
            { refund: { $eq: null } },
          ]
        }
      }
      ,
      { $group: { _id: null, sum: { $sum: "$amount" } } }
    ]
    ).exec();

    let sum = 0
    if (result && result.length > 0)
    {
      sum = result[0].sum
    }


    res.status(200).send({ status: "OK", result: sum});
  }
  catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
})

router.get("/gettodayreceivedamount", async function (req, res, next) {
  try {
    const today = new Date()
    const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0,0,0,0)
    const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23,59,59,0)

    const result = await MuseumPayment.aggregate([
      {
        $match: {
          $and: [
            { deleted: { $ne: true } },
            { paymentInfo: { $ne: null } },
            { refund: { $eq: null } },
            { paymentTimeStamp: {$gte : startDate}},
            { paymentTimeStamp: {$lte : endDate}},
          ]
        }
      }
      ,
      { $group: { _id: null, sum: { $sum: "$amount" } } }
    ]
    ).exec();

    let sum = 0
    if (result && result.length > 0)
    {
      sum = result[0].sum
    }

    res.status(200).send({ status: "OK", result: sum });
  }
  catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
})

router.get("/gettotallinksent", async function (req, res, next) {
  try {
    const result = await MuseumPayment.aggregate([
      {
        $match: {
          $and: [
            { deleted: { $ne: true } },
            { $or : [ {emailSent: true}, {textSent: true}]},
          ]
        }
      }
      ,
      { $group: { _id: null, sum: { $sum: 1} } }
    ]
    ).exec();

    let sum = 0
    if (result && result.length > 0)
    {
      sum = result[0].sum
    }

    res.status(200).send({ status: "OK", result: sum});
  }
  catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
})

router.get("/gettodaylinksent", async function (req, res, next) {
  try {
    const today = new Date()
    const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0,0,0,0)
    const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23,59,59,0)

    const result = await MuseumPayment.aggregate([
      {
        $match: {
          $and: [
            { deleted: { $ne: true } },
            { $or : [ {emailSent: true}, {textSent: true}]},
            { timeStamp: {$gte : startDate}},
            { timeStamp: {$lte : endDate}},
          ]
        }
      }
      ,
      { $group: { _id: null, sum: { $sum: 1 } } }
    ]
    ).exec();

    let sum = 0
    if (result && result.length > 0)
    {
      sum = result[0].sum
    }

    res.status(200).send({ status: "OK", result: sum });
  }
  catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
})






module.exports = router;
