const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const { MuseumPayment } = require("../../models/museum/MuseumPayment");

const {
  sendPaymentLinkEmail,
  sendRefundNotificationEmail,
  sendAdminNotificationEmail,
} = require("./email-service");

const config = require("config")

const stripe = require("stripe")(process.env.NODE_ENV !== "production" ?
  config.MuseumStripeTestKey
  :
  // config.MuseumStripeLiveKey
  config.MuseumStripeLiveKey
);


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
      await museumPayment.save()
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
      await museumPayment.save();
      try {
        await sendRefundNotificationEmail(museumPayment);
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

    res.status(200).send({ status: "OK" , payment: payment});

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

    await MuseumPayment.updateOne({_id : museumPaymentId}, {deleted: true});

    res.status(200).send({ status: "OK" });

  }
  catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
})


router.get("/getallpayments", async function (req, res, next) {
  try {
    const payments = await MuseumPayment.find({deleted : {$ne: true}}).sort({timeStamp:-1}).exec()
    res.status(200).send({ status: "OK", result : payments });
  }
  catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
})

router.get("/getdeletedpayments", async function (req, res, next) {
  try {
    const payments = await MuseumPayment.find({deleted : {$eq: true}}).sort({timeStamp:-1}).exec()
    res.status(200).send({ status: "OK", result : payments });
  }
  catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
})

router.get("/getpaidpayments", async function (req, res, next) {
  try {
    const payments = await MuseumPayment.find({deleted : {$ne: true}, paymentInfo : {$ne : null}, refund: {$eq : null}}).sort({timeStamp:-1}).exec()
    res.status(200).send({ status: "OK", result : payments });
  }
  catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
})

router.get("/getrefundpayments", async function (req, res, next) {
  try {
    const payments = await MuseumPayment.find({deleted : {$ne: true}, paymentInfo : {$ne : null}, refund: {$ne : null}}).sort({timeStamp:-1}).exec()
    res.status(200).send({ status: "OK", result : payments });
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

    res.status(200).send({ status: "OK", result : museumPayment });

  }
  catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
})

module.exports = router;
