const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const { MedexPayment } = require("../../../models/medex/MedexPayment");


const {
  sendPaymentLinkEmail,
  sendRefundNotificationEmail,
  sendThankEmail,
} = require("./email-service");

const config = require("config");
const { sendPaymentLinkTextMessage, sendThankTextMessage, sendRefundTextMessage } = require("./twilio-service");

const { Client, Environment } = require("square");

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

router.post("/sendpaymentlinktext", async function (req, res, next) {
  try {
    const MedexPaymentId = ObjectId(req.body.medexPaymentId)
    const phone = req.body.phone

    const medexPayment = await MedexPayment.findOne({ _id: MedexPaymentId });

    if (!medexPayment) {
      res.status(400).send({ status: "FAILED", result: "Payment_Not_Found" });
      return;
    }

    medexPayment.phone = phone

    /// here we should send the text to the user
    await sendPaymentLinkTextMessage(medexPayment)
    medexPayment.textSent = true
    ///

    await medexPayment.save()

    res.status(200).send({ status: "OK" });

  }

  catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
})



router.post("/sendpaymentlinkemail", async function (req, res, next) {
  try {
    const MedexPaymentId = ObjectId(req.body.medexPaymentId)
    const email = req.body.email

    const medexPayment = await MedexPayment.findOne({ _id: MedexPaymentId });

    if (!medexPayment) {
      res.status(400).send({ status: "FAILED", result: "Payment_Not_Found" });
      return;
    }

    medexPayment.email = email

    /// here we should send the email to the user

    await sendPaymentLinkEmail(medexPayment)

    medexPayment.emailSent = true

    ///

    await medexPayment.save()

    res.status(200).send({ status: "OK" });

  }
  catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
})



router.post("/dopayment", async function (req, res, next) {
  try {
    const MedexPaymentId = ObjectId(req.body.medexPaymentId)

    console.log(MedexPaymentId)

    const medexPayment = await MedexPayment.findOne({_id: MedexPaymentId });

    console.log(medexPayment)

    if (!medexPayment) {
      res.status(400).send({ status: "FAILED", result: "Payment_Not_Found" });
      return;
    }

    const payload = {
      sourceId: req.body.nonce,
      verificationToken: req.body.token,
      autocomplete: true,
      locationId: SANDBOX ? SANDBOX_LOCATION_ID : LIVE_LOCATION_ID,
      amountMoney: {
        amount: medexPayment.amount * 100,
        currency: "GBP",
      },
      idempotencyKey: MedexPaymentId.toString(),
    };

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

      let paymentInfoJson = {
        id,
        createdAt,
        cardDetails,
        locationId,
        orderId,
        receiptNumber,
        receiptUrl,
        totalMoney,
      };

      paymentInfoJson.cardDetails.card.expMonth = parseInt(
        paymentInfoJson.cardDetails.card.expMonth.toString().replace("n", "")
      );
      paymentInfoJson.cardDetails.card.expYear = parseInt(
        paymentInfoJson.cardDetails.card.expYear.toString().replace("n", "")
      );
      paymentInfoJson.totalMoney.amount = parseInt(
        paymentInfoJson.totalMoney.amount.toString().replace("n", "")
      );

      const paymentInfo = JSON.stringify(paymentInfoJson);

      medexPayment.paymentInfo = paymentInfo

      medexPayment.paymentTimeStamp = new Date()
      await medexPayment.save()
      try{
        if (medexPayment.emailSent)
        {
          await sendThankEmail(medexPayment)
        }
        if (medexPayment.textSent)
        {
          await sendThankTextMessage(medexPayment)
        }
     
      }catch(err)
      {

      }

      res.status(200).send({ status: "OK", payment: paymentInfoJson });
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
    const MedexPaymentId = ObjectId(req.body.medexPaymentId)
    const medexPayment = await MedexPayment.findOne({ _id: MedexPaymentId });

    if (!medexPayment) {
      res.status(400).send({ status: "FAILED", result: "Payment_Not_Found" });
      return;
    }

    if (!medexPayment.paymentInfo) {
      res.status(400).send({ status: "FAILED", result: "Payment_Not_Paid" });
      return;
    }

    if (medexPayment.refund) {
      res.status(400).send({ status: "FAILED", result: "Already_Refunded" });
      return;
    }

    const paymentInfo = JSON.parse(medexPayment.paymentInfo);

    const payload = {
      idempotencyKey: MedexPaymentId.toString(),
      amountMoney: paymentInfo.totalMoney,
      paymentId: paymentInfo.id,
      autocomplete: true,
    };

    const { result } = await refundsApi.refundPayment(payload);

    if (result && result.refund && result.refund.id) {

      result.refund.amountMoney.amount = parseInt(result.refund.amountMoney.amount.toString().replace("n", ""))
      result.refund.processingFee = []


      medexPayment.refund = JSON.stringify(result.refund);
      medexPayment.refundTimeStamp = new Date()

      await medexPayment.save();
      try {
        if (medexPayment.emailSent)
        {
          await sendRefundNotificationEmail(medexPayment)
        }
        if (medexPayment.textSent)
        {
          await sendRefundTextMessage(medexPayment)
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

    const medexPayment = new MedexPayment(
      {
        timeStamp: new Date,
        ...paymentRecord
      }
    )

    const payment = await medexPayment.save()

    res.status(200).send({ status: "OK", payment: payment });

  }
  catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
})

router.post("/deletepayment", async function (req, res, next) {
  try {
    const MedexPaymentId = ObjectId(req.body.medexPaymentId)
    const medexPayment = await MedexPayment.findOne({ _id: MedexPaymentId });

    if (!medexPayment) {
      res.status(400).send({ status: "FAILED", result: "Payment_Not_Found" });
      return;
    }

    await MedexPayment.updateOne({ _id: MedexPaymentId }, { deleted: true });

    res.status(200).send({ status: "OK" });

  }
  catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
})


router.get("/getrecentpayments", async function (req, res, next) {
  try {
    const payments = await MedexPayment.find({ deleted: { $ne: true }, paymentInfo: { $ne: null }, refund: { $eq: null } }).sort({ timeStamp: -1 }).limit(10).exec()
    res.status(200).send({ status: "OK", result: payments });
  }
  catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
})


router.get("/getallpayments", async function (req, res, next) {
  try {
    const payments = await MedexPayment.find({ deleted: { $ne: true } }).sort({ timeStamp: -1 }).exec()
    res.status(200).send({ status: "OK", result: payments });
  }
  catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
})

router.get("/getdeletedpayments", async function (req, res, next) {
  try {
    const payments = await MedexPayment.find({ deleted: { $eq: true } }).sort({ timeStamp: -1 }).exec()
    res.status(200).send({ status: "OK", result: payments });
  }
  catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
})

router.get("/getpaidpayments", async function (req, res, next) {
  try {
    const payments = await MedexPayment.find({ deleted: { $ne: true }, paymentInfo: { $ne: null }, refund: { $eq: null } }).sort({ timeStamp: -1 }).exec()
    res.status(200).send({ status: "OK", result: payments });
  }
  catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
})

router.get("/getnotpaidpayments", async function (req, res, next) {
  try {
    // const payments = await MedexPayment.find({ deleted: { $ne: true }, paymentInfo: { $eq: null }, $or: [ {emailSent: true }, {textSent: true}]}).sort({ timeStamp: -1 }).exec()
    const payments = await MedexPayment.find({ deleted: { $ne: true }, paymentInfo: { $eq: null }}).sort({ timeStamp: -1 }).exec()

    res.status(200).send({ status: "OK", result: payments });
  }
  catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
})

router.get("/getlatepayments", async function (req, res, next) {
  try {
    const payments = await MedexPayment.find({ deleted: { $ne: true }, paymentInfo: { $eq: null }, $or: [ {emailSent: true }, {textSent: true}]}).sort({ timeStamp: -1 }).exec()

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
    const payments = await MedexPayment.find({ deleted: { $ne: true }, paymentInfo: { $ne: null }, refund: { $ne: null } }).sort({ timeStamp: -1 }).exec()
    res.status(200).send({ status: "OK", result: payments });
  }
  catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
})

router.get("/getpaymentbyid", async function (req, res, next) {
  try {
    const MedexPaymentId = ObjectId(req.query.id)
    const medexPayment = await MedexPayment.findOne({ _id: MedexPaymentId });

    res.status(200).send({ status: "OK", result: medexPayment });

  }
  catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
})


router.get("/gettotalreceivedamount", async function (req, res, next) {
  try {
    const result = await MedexPayment.aggregate([
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

    const result = await MedexPayment.aggregate([
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
    const result = await MedexPayment.aggregate([
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

    const result = await MedexPayment.aggregate([
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
